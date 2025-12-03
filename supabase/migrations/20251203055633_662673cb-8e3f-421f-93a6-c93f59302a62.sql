-- Drop and recreate user functions with search_path
DROP FUNCTION IF EXISTS public.add_user_favorite_unified(uuid, uuid, text, text, text, text);
DROP FUNCTION IF EXISTS public.remove_user_favorite_unified(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_track_favorited_unified(uuid, uuid);
DROP FUNCTION IF EXISTS public.resolve_track_info_unified(uuid);
DROP FUNCTION IF EXISTS public.get_all_animated_artworks();
DROP FUNCTION IF EXISTS public.get_random_animated_artwork();

-- Recreate with search_path
CREATE FUNCTION public.add_user_favorite_unified(p_user_id uuid, p_track_id uuid, p_track_name text DEFAULT NULL, p_artist text DEFAULT NULL, p_storage_bucket text DEFAULT NULL, p_storage_path text DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id uuid;
BEGIN
    INSERT INTO user_favorites (user_id, track_id, track_name, artist, storage_bucket, storage_path)
    VALUES (p_user_id, p_track_id, p_track_name, p_artist, p_storage_bucket, p_storage_path)
    ON CONFLICT (user_id, track_id) DO UPDATE SET updated_at = now()
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

CREATE FUNCTION public.remove_user_favorite_unified(p_user_id uuid, p_track_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM user_favorites WHERE user_id = p_user_id AND track_id = p_track_id;
    RETURN FOUND;
END;
$$;

CREATE FUNCTION public.is_track_favorited_unified(p_user_id uuid, p_track_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM user_favorites WHERE user_id = p_user_id AND track_id = p_track_id);
$$;

CREATE FUNCTION public.resolve_track_info_unified(p_track_id uuid)
RETURNS TABLE(track_id uuid, title text, artist text, storage_bucket text, storage_path text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT t.id, COALESCE(t.title, 'Unknown'), COALESCE(t.artist, 'Unknown'), t.storage_bucket, COALESCE(t.storage_key, t.file_path)
    FROM tracks t WHERE t.id = p_track_id
    UNION ALL
    SELECT mt.id, COALESCE(mt.title, 'Unknown'), COALESCE(mt.artist, 'Unknown'), mt.storage_bucket, COALESCE(mt.storage_path, mt.file_path)
    FROM music_tracks mt WHERE mt.id = p_track_id
    LIMIT 1;
$$;

CREATE FUNCTION public.get_all_animated_artworks()
RETURNS TABLE(id uuid, artwork_url text, artwork_type text, artwork_semantic_label text, display_order integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT aa.id, aa.artwork_url, aa.artwork_type, aa.artwork_semantic_label, aa.display_order
    FROM animated_artworks aa WHERE aa.is_active = true ORDER BY aa.display_order;
$$;

CREATE FUNCTION public.get_random_animated_artwork()
RETURNS TABLE(id uuid, artwork_url text, artwork_type text, artwork_semantic_label text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT aa.id, aa.artwork_url, aa.artwork_type, aa.artwork_semantic_label
    FROM animated_artworks aa WHERE aa.is_active = true ORDER BY random() LIMIT 1;
$$;