-- Fix search_path for functions with text parameters (security hardening)

-- 1. safe_uuid_cast (text) - Drop and recreate
DROP FUNCTION IF EXISTS public.safe_uuid_cast(text);

CREATE FUNCTION public.safe_uuid_cast(input_text text)
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RETURN input_text::UUID;
EXCEPTION
    WHEN invalid_text_representation THEN
        RETURN NULL;
END;
$function$;

-- 2. is_valid_uuid (text) - Drop and recreate
DROP FUNCTION IF EXISTS public.is_valid_uuid(text);

CREATE FUNCTION public.is_valid_uuid(input_text text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF input_text IS NULL OR input_text = '' THEN
        RETURN FALSE;
    END IF;
    
    PERFORM input_text::UUID;
    RETURN TRUE;
EXCEPTION
    WHEN invalid_text_representation THEN
        RETURN FALSE;
END;
$function$;

-- 3. add_user_favorite_unified (uuid, text) - Drop and recreate
DROP FUNCTION IF EXISTS public.add_user_favorite_unified(uuid, text);

CREATE FUNCTION public.add_user_favorite_unified(p_user_id uuid, p_track_identifier text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    new_favorite_id UUID;
    track_info RECORD;
    existing_favorite_id UUID;
    safe_track_id UUID;
BEGIN
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;
    
    safe_track_id := public.safe_uuid_cast(p_track_identifier);
    
    SELECT id INTO existing_favorite_id
    FROM public.user_favorites
    WHERE user_id = p_user_id 
      AND ((safe_track_id IS NOT NULL AND track_id = safe_track_id) OR (track_name = p_track_identifier))
    LIMIT 1;
    
    IF existing_favorite_id IS NOT NULL THEN
        UPDATE public.user_favorites
        SET play_count = COALESCE(play_count, 0) + 1,
            last_played_at = NOW()
        WHERE id = existing_favorite_id;
        RETURN existing_favorite_id;
    END IF;
    
    SELECT * INTO track_info FROM public.resolve_track_info_unified(p_track_identifier) LIMIT 1;
    
    INSERT INTO public.user_favorites (
        user_id, track_id, track_name, artist, storage_bucket, storage_path, added_at, play_count
    )
    VALUES (
        p_user_id, track_info.track_id,
        COALESCE(track_info.track_title, p_track_identifier),
        COALESCE(track_info.artist, 'Unknown Artist'),
        COALESCE(track_info.storage_bucket, 'regaeton'),
        COALESCE(track_info.storage_path, p_track_identifier),
        NOW(), 0
    )
    RETURNING id INTO new_favorite_id;
    
    RETURN new_favorite_id;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO public.user_favorites (user_id, track_name, artist, added_at, play_count)
        VALUES (p_user_id, p_track_identifier, 'Unknown Artist', NOW(), 0)
        RETURNING id INTO new_favorite_id;
        RETURN new_favorite_id;
END;
$function$;

-- 4. is_track_favorited_unified (uuid, text) - Drop and recreate
DROP FUNCTION IF EXISTS public.is_track_favorited_unified(uuid, text);

CREATE FUNCTION public.is_track_favorited_unified(p_user_id uuid, p_track_identifier text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    safe_track_id UUID;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    safe_track_id := public.safe_uuid_cast(p_track_identifier);
    
    RETURN EXISTS (
        SELECT 1 FROM public.user_favorites
        WHERE user_id = p_user_id 
          AND ((safe_track_id IS NOT NULL AND track_id = safe_track_id) OR (track_name = p_track_identifier))
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$function$;

-- 5. remove_user_favorite_unified (uuid, text) - Drop and recreate
DROP FUNCTION IF EXISTS public.remove_user_favorite_unified(uuid, text);

CREATE FUNCTION public.remove_user_favorite_unified(p_user_id uuid, p_track_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    deleted_count INTEGER;
    safe_track_id UUID;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    safe_track_id := public.safe_uuid_cast(p_track_identifier);
    
    DELETE FROM public.user_favorites
    WHERE user_id = p_user_id 
      AND ((safe_track_id IS NOT NULL AND track_id = safe_track_id) OR (track_name = p_track_identifier));
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$function$;

-- 6. resolve_track_info_unified (text) - Drop and recreate
DROP FUNCTION IF EXISTS public.resolve_track_info_unified(text);

CREATE FUNCTION public.resolve_track_info_unified(p_track_identifier text)
RETURNS TABLE(track_id uuid, track_title text, artist text, album text, storage_bucket text, storage_path text, genre text, duration_seconds integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    uuid_id UUID;
    track_found BOOLEAN := FALSE;
BEGIN
    uuid_id := public.safe_uuid_cast(p_track_identifier);
    
    IF uuid_id IS NOT NULL THEN
        SELECT t.id, t.title, t.artist, 
               COALESCE(t.album, t.album_id::TEXT),
               COALESCE(t.storage_bucket, 'regaeton'),
               COALESCE(t.storage_path, t.file_path, t.title),
               COALESCE(t.genre::TEXT, t.therapeutic_category, 'Music'),
               COALESCE(t.duration_seconds, t.duration, 210)
        INTO track_id, track_title, resolve_track_info_unified.artist, album, storage_bucket, storage_path, genre, duration_seconds
        FROM public.tracks t WHERE t.id = uuid_id LIMIT 1;
        
        IF FOUND THEN
            track_found := TRUE;
        ELSE
            SELECT mt.id, mt.title, mt.artist, mt.album,
                   COALESCE(mt.storage_bucket, 'regaeton'),
                   COALESCE(mt.storage_path, mt.file_path, mt.title),
                   COALESCE(mt.genre::TEXT, 'Music'),
                   COALESCE(mt.duration_seconds, mt.duration, 210)
            INTO track_id, track_title, resolve_track_info_unified.artist, album, storage_bucket, storage_path, genre, duration_seconds
            FROM public.music_tracks mt WHERE mt.id = uuid_id LIMIT 1;
            
            IF FOUND THEN
                track_found := TRUE;
            END IF;
        END IF;
    END IF;
    
    IF NOT track_found THEN
        SELECT t.id, t.title, t.artist,
               COALESCE(t.album, t.album_id::TEXT),
               COALESCE(t.storage_bucket, 'regaeton'),
               COALESCE(t.storage_path, t.file_path, t.title),
               COALESCE(t.genre::TEXT, t.therapeutic_category, 'Music'),
               COALESCE(t.duration_seconds, t.duration, 210)
        INTO track_id, track_title, resolve_track_info_unified.artist, album, storage_bucket, storage_path, genre, duration_seconds
        FROM public.tracks t 
        WHERE t.title ILIKE '%' || p_track_identifier || '%'
        LIMIT 1;
        
        IF FOUND THEN
            track_found := TRUE;
        END IF;
    END IF;
    
    IF NOT track_found THEN
        track_id := NULL;
        track_title := p_track_identifier;
        resolve_track_info_unified.artist := 'Unknown Artist';
        album := NULL;
        storage_bucket := 'regaeton';
        storage_path := p_track_identifier;
        genre := 'Unknown';
        duration_seconds := 210;
    END IF;
    
    RETURN NEXT;
END;
$function$;