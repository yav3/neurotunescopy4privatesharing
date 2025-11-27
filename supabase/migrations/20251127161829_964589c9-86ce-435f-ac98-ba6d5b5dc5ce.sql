-- Fix remaining functions missing SET search_path = public
-- This prevents search_path injection vulnerabilities
-- Excludes pg_stat_monitor extension functions (system-managed)

-- 1. add_user_favorite_unified (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.add_user_favorite_unified(p_user_id uuid, p_track_identifier text)
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
      AND (
          (safe_track_id IS NOT NULL AND track_id = safe_track_id) 
          OR 
          (track_name = p_track_identifier)
      )
    LIMIT 1;
    
    IF existing_favorite_id IS NOT NULL THEN
        UPDATE public.user_favorites
        SET play_count = COALESCE(play_count, 0) + 1,
            last_played_at = NOW(),
            updated_at = NOW()
        WHERE id = existing_favorite_id;
        RETURN existing_favorite_id;
    END IF;
    
    SELECT * INTO track_info 
    FROM public.resolve_track_info_unified(p_track_identifier) 
    LIMIT 1;
    
    INSERT INTO public.user_favorites (
        user_id, track_id, track_name, artist, storage_bucket, storage_path, added_at, play_count, updated_at
    )
    VALUES (
        p_user_id, track_info.track_id,
        COALESCE(track_info.track_title, p_track_identifier),
        COALESCE(track_info.artist, 'Unknown Artist'),
        COALESCE(track_info.storage_bucket, 'regaeton'),
        COALESCE(track_info.storage_path, p_track_identifier),
        NOW(), 0, NOW()
    )
    RETURNING id INTO new_favorite_id;
    
    RETURN new_favorite_id;
    
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO public.user_favorites (
            user_id, track_id, track_name, artist, added_at, play_count, storage_bucket, storage_path, updated_at
        )
        VALUES (
            p_user_id, safe_track_id, p_track_identifier, 'Unknown Artist', NOW(), 0, 'regaeton', p_track_identifier, NOW()
        )
        RETURNING id INTO new_favorite_id;
        
        RETURN new_favorite_id;
END;
$function$;

-- 2. clean_track_title_from_filename
CREATE OR REPLACE FUNCTION public.clean_track_title_from_filename(storage_key text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    filename text;
    cleaned_title text;
BEGIN
    filename := SPLIT_PART(storage_key, '/', -1);
    filename := SPLIT_PART(filename, '.', 1);
    cleaned_title := REPLACE(REPLACE(filename, '_', ' '), '-', ' ');
    cleaned_title := REGEXP_REPLACE(cleaned_title, '\s+', ' ', 'g');
    cleaned_title := INITCAP(TRIM(cleaned_title));
    RETURN cleaned_title;
END;
$function$;

-- 3. cleanup_expired_sessions (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.user_sessions 
  WHERE expires_at < NOW() OR NOT is_active;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

-- 4. clear_relaxing_sambas_artwork_conflicts
CREATE OR REPLACE FUNCTION public.clear_relaxing_sambas_artwork_conflicts()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  UPDATE playlists 
  SET artwork_url = NULL,
      updated_at = now()
  WHERE LOWER(title) LIKE '%relaxing%sambas%';
  RAISE NOTICE 'Cleared artwork conflicts for Relaxing Sambas playlist to allow local asset override';
END;
$function$;

-- 5. find_broken_tracks (SQL)
CREATE OR REPLACE FUNCTION public.find_broken_tracks()
 RETURNS TABLE(id uuid, title text, storage_bucket text, storage_key text, issue text)
 LANGUAGE sql
 SET search_path = public
AS $function$
  select 
    t.id, t.title, t.storage_bucket, t.storage_key,
    case 
      when t.storage_key is null or t.storage_key = '' then 'missing_storage_key'
      when t.storage_bucket is null then 'missing_bucket'
      else 'unknown'
    end as issue
  from public.tracks t
  where t.storage_key is null or t.storage_key = '' or t.storage_bucket is null;
$function$;

-- 6. find_cross_bucket_candidates (SQL)
CREATE OR REPLACE FUNCTION public.find_cross_bucket_candidates()
 RETURNS TABLE(track_id uuid, title text, current_bucket text, storage_key text, suggested_bucket text)
 LANGUAGE sql
 SET search_path = public
AS $function$
  SELECT t.id as track_id, t.title, t.storage_bucket as current_bucket, t.storage_key,
    CASE 
      WHEN t.storage_bucket = 'neuralpositivemusic' THEN 'audio'
      WHEN t.storage_bucket = 'audio' THEN 'neuralpositivemusic'
      ELSE 'unknown'
    END as suggested_bucket
  FROM tracks t
  WHERE t.audio_status = 'missing'
    AND t.storage_bucket IN ('neuralpositivemusic', 'audio')
    AND t.storage_key IS NOT NULL AND t.storage_key != ''
  ORDER BY t.title LIMIT 50;
$function$;

-- 7. fix_invalid_uuids (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.fix_invalid_uuids()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    UPDATE public.curated_tracks 
    SET id = gen_random_uuid() 
    WHERE id IS NULL OR id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
    RAISE NOTICE 'Invalid UUIDs have been fixed';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error fixing UUIDs: %', SQLERRM;
END;
$function$;

-- 8. get_album_cover_url (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_album_cover_url(bucket_name_param text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF bucket_name_param IS NOT NULL THEN
        RETURN format('%s/storage/v1/object/public/album-covers/%s/cover.jpg', 
                     current_setting('app.settings.supabase_url', true), 
                     bucket_name_param);
    ELSE
        RETURN 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center';
    END IF;
END;
$function$;

-- 9. get_all_display_groups (SECURITY DEFINER SQL)
CREATE OR REPLACE FUNCTION public.get_all_display_groups()
 RETURNS TABLE(display_group text, genre_count integer, avg_duration integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
SELECT gm.display_group, COUNT(gm.id)::INTEGER as genre_count, AVG(gm.recommended_duration)::INTEGER as avg_duration
FROM public.genre_metadata gm GROUP BY gm.display_group ORDER BY gm.display_group;
$function$;

-- 10. get_curated_tracks_safe (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_curated_tracks_safe(track_ids text[] DEFAULT NULL::text[])
 RETURNS TABLE(id uuid, original_filename text, curated_storage_key text, title text, artist text, duration_seconds integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF track_ids IS NULL OR array_length(track_ids, 1) IS NULL THEN
        RETURN QUERY
        SELECT ct.id, ct.original_filename, ct.curated_storage_key,
            COALESCE(ct.original_filename, 'Unknown Track') as title,
            'Unknown Artist' as artist, 210 as duration_seconds
        FROM public.curated_tracks ct ORDER BY ct.original_filename LIMIT 100;
    ELSE
        RETURN QUERY
        SELECT ct.id, ct.original_filename, ct.curated_storage_key,
            COALESCE(ct.original_filename, 'Unknown Track') as title,
            'Unknown Artist' as artist, 210 as duration_seconds
        FROM public.curated_tracks ct
        WHERE ct.id = ANY(ARRAY(SELECT public.safe_cast_to_uuid(unnest(track_ids))))
        ORDER BY ct.original_filename;
    END IF;
END;
$function$;

-- 11. get_genres_by_display_group (SECURITY DEFINER SQL)
CREATE OR REPLACE FUNCTION public.get_genres_by_display_group(group_name text)
 RETURNS TABLE(id uuid, category text, bucket text, art_file text, description text, benefit text, display_group text, intensity text, recommended_duration integer, color_hex text, therapeutic_category text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
SELECT gm.id, gm.category, gm.bucket, gm.art_file, gm.description, gm.benefit, gm.display_group, gm.intensity, gm.recommended_duration, gm.color_hex, gm.therapeutic_category
FROM public.genre_metadata gm WHERE gm.display_group = group_name ORDER BY gm.category;
$function$;

-- 12. get_genres_by_therapeutic_category (SECURITY DEFINER SQL)
CREATE OR REPLACE FUNCTION public.get_genres_by_therapeutic_category(category_name text)
 RETURNS TABLE(id uuid, category text, bucket text, art_file text, description text, benefit text, display_group text, intensity text, recommended_duration integer, color_hex text, therapeutic_category text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
SELECT gm.id, gm.category, gm.bucket, gm.art_file, gm.description, gm.benefit, gm.display_group, gm.intensity, gm.recommended_duration, gm.color_hex, gm.therapeutic_category
FROM public.genre_metadata gm WHERE gm.therapeutic_category = category_name ORDER BY gm.category;
$function$;

-- 13. get_playlist_tracks_enhanced (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_playlist_tracks_enhanced(p_bucket_name text)
 RETURNS TABLE(track_id uuid, title text, artist text, duration_seconds integer, storage_path text, artwork_url text, therapeutic_tags text[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN QUERY
    SELECT COALESCE(mt.id, ct.id, gen_random_uuid()) as track_id,
        COALESCE(mt.title, ct.original_filename, 'Unknown Track') as title,
        COALESCE(mt.artist, 'Unknown Artist') as artist,
        COALESCE(mt.duration_seconds, 210) as duration_seconds,
        COALESCE(mt.storage_path, ct.curated_storage_key, ct.original_filename) as storage_path,
        mt.artwork_url,
        COALESCE(mt.therapeutic_tags, ARRAY[]::TEXT[]) as therapeutic_tags
    FROM public.curated_tracks ct
    LEFT JOIN public.music_tracks mt ON ct.id = mt.id
    ORDER BY COALESCE(mt.title, ct.original_filename) LIMIT 50;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT gen_random_uuid() as track_id, 'Sample Track' as title,
            'Sample Artist' as artist, 180 as duration_seconds, 'sample/track.mp3' as storage_path,
            NULL::TEXT as artwork_url, ARRAY['relaxing']::TEXT[] as therapeutic_tags LIMIT 0;
    END IF;
END;
$function$;

-- 14. get_sambajazznocturnes_url (SQL)
CREATE OR REPLACE FUNCTION public.get_sambajazznocturnes_url(file_path text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path = public
AS $function$
    SELECT '/storage/v1/object/public/sambajazznocturnes/' || file_path;
$function$;

-- 15. get_therapeutic_recommendations
CREATE OR REPLACE FUNCTION public.get_therapeutic_recommendations(target_condition text, min_evidence_score numeric DEFAULT 0.7)
 RETURNS TABLE(track_id uuid, evidence_score numeric, frequency_band text)
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT t.id as track_id,
    COALESCE(
      CASE 
        WHEN target_condition = 'anxiety' AND t.valence > 0.6 AND t.energy_level < 4 THEN 0.85
        WHEN target_condition = 'depression' AND t.valence > 0.7 AND t.energy_level > 5 THEN 0.80
        WHEN target_condition = 'insomnia' AND t.energy_level < 3 AND t.danceability < 0.4 THEN 0.75
        WHEN target_condition = 'focus' AND t.instrumentalness > 0.7 AND t.energy_level BETWEEN 4 AND 7 THEN 0.80
        ELSE 0.5
      END, 0.5
    )::DECIMAL as evidence_score,
    CASE 
      WHEN t.bpm < 60 THEN 'delta'
      WHEN t.bpm BETWEEN 60 AND 90 THEN 'theta'
      WHEN t.bpm BETWEEN 90 AND 120 THEN 'alpha'
      WHEN t.bpm BETWEEN 120 AND 150 THEN 'beta'
      ELSE 'gamma'
    END as frequency_band
  FROM tracks t
  WHERE t.audio_status = 'working'
    AND COALESCE(
      CASE 
        WHEN target_condition = 'anxiety' AND t.valence > 0.6 AND t.energy_level < 4 THEN 0.85
        WHEN target_condition = 'depression' AND t.valence > 0.7 AND t.energy_level > 5 THEN 0.80
        WHEN target_condition = 'insomnia' AND t.energy_level < 3 AND t.danceability < 0.4 THEN 0.75
        WHEN target_condition = 'focus' AND t.instrumentalness > 0.7 AND t.energy_level BETWEEN 4 AND 7 THEN 0.80
        ELSE 0.5
      END, 0.5
    ) >= min_evidence_score
  ORDER BY evidence_score DESC LIMIT 50;
END;
$function$;

-- 16. get_track_public_url (SQL)
CREATE OR REPLACE FUNCTION public.get_track_public_url(bucket_name text, file_path text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path = public
AS $function$
    SELECT '/storage/v1/object/public/' || bucket_name || '/' || file_path;
$function$;

-- 17. get_tracks_by_bpm_range (SQL)
CREATE OR REPLACE FUNCTION public.get_tracks_by_bpm_range(min_bpm integer, max_bpm integer)
 RETURNS SETOF sambajazznocturnes_tracks
 LANGUAGE sql
 STABLE
 SET search_path = public
AS $function$
    SELECT * FROM public.sambajazznocturnes_tracks
    WHERE bpm >= min_bpm AND bpm <= max_bpm AND is_active = true
    ORDER BY bpm, display_order;
$function$;

-- 18. get_tracks_by_category (SQL)
CREATE OR REPLACE FUNCTION public.get_tracks_by_category(category text)
 RETURNS SETOF sambajazznocturnes_tracks
 LANGUAGE sql
 STABLE
 SET search_path = public
AS $function$
    SELECT * FROM public.sambajazznocturnes_tracks
    WHERE therapeutic_category @> ARRAY[category] AND is_active = true
    ORDER BY display_order;
$function$;

-- 19. get_user_genre_recommendations (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_genre_recommendations(target_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(bucket_name text, display_name text, therapeutic_category text, description text, benefits text[], recommendation_score integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN QUERY
    SELECT gc.bucket_name, gc.display_name, gc.therapeutic_category::TEXT, gc.description, gc.benefits,
        COALESCE(ugp.preference_score, 3)::INTEGER as recommendation_score
    FROM public.genre_classifications gc
    LEFT JOIN public.user_genre_preferences ugp 
        ON gc.therapeutic_category = ugp.therapeutic_category AND ugp.user_id = target_user_id
    ORDER BY COALESCE(ugp.preference_score, 3) DESC, gc.display_name ASC;
END;
$function$;

-- 20. handle_new_user (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  IF NEW.email IS NOT NULL AND NOT NEW.is_anonymous THEN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- 21. increment_track_play_count
CREATE OR REPLACE FUNCTION public.increment_track_play_count(track_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    UPDATE public.sambajazznocturnes_tracks
    SET play_count = play_count + 1
    WHERE id = track_id;
END;
$function$;

-- 22. is_track_favorited_unified (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_track_favorited_unified(p_user_id uuid, p_track_identifier text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    safe_track_id UUID;
BEGIN
    IF p_user_id IS NULL THEN RETURN FALSE; END IF;
    safe_track_id := public.safe_uuid_cast(p_track_identifier);
    RETURN EXISTS (
        SELECT 1 FROM public.user_favorites
        WHERE user_id = p_user_id 
          AND ((safe_track_id IS NOT NULL AND track_id = safe_track_id) OR (track_name = p_track_identifier))
    );
EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$function$;

-- 23. is_valid_uuid (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_valid_uuid(input_text text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF input_text IS NULL OR input_text = '' THEN RETURN FALSE; END IF;
    PERFORM input_text::UUID;
    RETURN TRUE;
EXCEPTION WHEN invalid_text_representation THEN RETURN FALSE;
END;
$function$;

-- 24. mark_likely_missing_tracks
CREATE OR REPLACE FUNCTION public.mark_likely_missing_tracks()
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE tracks 
    SET audio_status = 'unknown', last_verified_at = NULL, last_error = 'Needs verification - bulk update'
    WHERE audio_status = 'working' AND storage_key IS NOT NULL AND storage_key != ''
      AND (storage_key LIKE '%remix%' OR storage_key LIKE '%1970s%' OR storage_key LIKE '%classical%' OR last_verified_at IS NULL OR last_verified_at < NOW() - INTERVAL '30 days');
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RAISE NOTICE 'Marked % tracks for re-verification', affected_count;
    RETURN affected_count;
END;
$function$;

-- 25. mark_messages_as_read (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(p_ticket_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    UPDATE public.support_messages SET is_read = true
    WHERE ticket_id = p_ticket_id AND message_type != 'user'::public.message_type AND is_read = false;
END;
$function$;

-- 26. mark_unknown_on_key_change (trigger)
CREATE OR REPLACE FUNCTION public.mark_unknown_on_key_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  IF (coalesce(NEW.storage_key,'') IS DISTINCT FROM coalesce(OLD.storage_key,'')
   OR coalesce(NEW.storage_bucket,'') IS DISTINCT FROM coalesce(OLD.storage_bucket,'')) THEN
    NEW.audio_status := 'unknown';
    NEW.last_verified_at := NULL;
    NEW.last_error := NULL;
    NEW.analysis_status := 'pending';
    NEW.last_analyzed_at := NULL;
  END IF;
  RETURN NEW;
END;
$function$;

-- 27. prevent_relaxing_sambas_artwork_override (trigger)
CREATE OR REPLACE FUNCTION public.prevent_relaxing_sambas_artwork_override()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  IF LOWER(NEW.title) LIKE '%relaxing%sambas%' AND NEW.artwork_url IS NOT NULL THEN
    NEW.artwork_url := NULL;
    RAISE NOTICE 'Prevented artwork_url override for Relaxing Sambas - using local Flutter asset';
  END IF;
  RETURN NEW;
END;
$function$;

-- 28. remove_user_favorite_unified (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.remove_user_favorite_unified(p_user_id uuid, p_track_identifier text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    deleted_count INTEGER;
    safe_track_id UUID;
BEGIN
    IF p_user_id IS NULL THEN RETURN FALSE; END IF;
    safe_track_id := public.safe_uuid_cast(p_track_identifier);
    DELETE FROM public.user_favorites
    WHERE user_id = p_user_id AND ((safe_track_id IS NOT NULL AND track_id = safe_track_id) OR (track_name = p_track_identifier));
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$function$;

-- 29. resolve_track_info_unified (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.resolve_track_info_unified(p_track_identifier text)
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
        SELECT t.id, t.title, t.artist, COALESCE(t.album, t.album_id::TEXT),
               COALESCE(t.storage_bucket, 'regaeton'), COALESCE(t.storage_path, t.file_path, t.title),
               COALESCE(t.genre::TEXT, t.therapeutic_category, 'Music'), COALESCE(t.duration_seconds, t.duration, 210)
        INTO track_id, track_title, artist, album, storage_bucket, storage_path, genre, duration_seconds
        FROM public.tracks t WHERE t.id = uuid_id LIMIT 1;
        IF FOUND THEN track_found := TRUE;
        ELSE
            SELECT mt.id, mt.title, mt.artist, mt.album, COALESCE(mt.storage_bucket, 'regaeton'),
                   COALESCE(mt.storage_path, mt.file_path, mt.title), COALESCE(mt.genre::TEXT, 'Music'),
                   COALESCE(mt.duration_seconds, mt.duration, 210)
            INTO track_id, track_title, artist, album, storage_bucket, storage_path, genre, duration_seconds
            FROM public.music_tracks mt WHERE mt.id = uuid_id LIMIT 1;
            IF FOUND THEN track_found := TRUE; END IF;
        END IF;
    END IF;
    IF NOT track_found THEN
        SELECT t.id, t.title, t.artist, COALESCE(t.album, t.album_id::TEXT),
               COALESCE(t.storage_bucket, 'regaeton'), COALESCE(t.storage_path, t.file_path, t.title),
               COALESCE(t.genre::TEXT, t.therapeutic_category, 'Music'), COALESCE(t.duration_seconds, t.duration, 210)
        INTO track_id, track_title, artist, album, storage_bucket, storage_path, genre, duration_seconds
        FROM public.tracks t WHERE t.title ILIKE '%' || p_track_identifier || '%' LIMIT 1;
        IF FOUND THEN track_found := TRUE; END IF;
    END IF;
    IF NOT track_found THEN
        track_id := NULL; track_title := p_track_identifier; artist := 'Unknown Artist'; album := NULL;
        storage_bucket := 'regaeton'; storage_path := p_track_identifier; genre := 'Unknown'; duration_seconds := 210;
    END IF;
    RETURN NEXT;
END;
$function$;

-- 30. safe_cast_to_music_genre
CREATE OR REPLACE FUNCTION public.safe_cast_to_music_genre(text_value text)
 RETURNS music_genre
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    result public.music_genre;
    enum_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public' AND t.typname = 'music_genre') INTO enum_exists;
    IF NOT enum_exists THEN RAISE EXCEPTION 'music_genre enum does not exist'; END IF;
    BEGIN
        result := text_value::public.music_genre;
        RETURN result;
    EXCEPTION WHEN invalid_text_representation THEN
        CASE 
            WHEN LOWER(text_value) LIKE '%edm%' OR LOWER(text_value) LIKE '%electronic%' THEN
                BEGIN result := 'EDM'::public.music_genre; RETURN result;
                EXCEPTION WHEN invalid_text_representation THEN result := 'Electronic'::public.music_genre; RETURN result; END;
            WHEN LOWER(text_value) LIKE '%house%' THEN
                BEGIN result := 'House EDM'::public.music_genre; RETURN result;
                EXCEPTION WHEN invalid_text_representation THEN result := 'EDM'::public.music_genre; RETURN result; END;
            ELSE
                SELECT e.enumlabel::public.music_genre INTO result FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'music_genre' ORDER BY e.enumsortorder LIMIT 1;
                RETURN COALESCE(result, 'Electronic'::public.music_genre);
        END CASE;
    END;
END;
$function$;

-- 31. safe_cast_to_uuid (IMMUTABLE)
CREATE OR REPLACE FUNCTION public.safe_cast_to_uuid(input_value text)
 RETURNS uuid
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path = public
AS $function$
BEGIN
    IF input_value ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
        RETURN input_value::UUID;
    END IF;
    IF input_value ~ '^\d+$' THEN
        RETURN ('00000000-0000-4000-8000-' || LPAD(input_value, 12, '0'))::UUID;
    END IF;
    RETURN md5(input_value)::UUID;
EXCEPTION WHEN OTHERS THEN RETURN gen_random_uuid();
END;
$function$;

-- 32. safe_key (SQL)
CREATE OR REPLACE FUNCTION public.safe_key(raw text)
 RETURNS text
 LANGUAGE sql
 SET search_path = public
AS $function$
  SELECT regexp_replace(raw, '[&+=\[\]{}|\\:";''<>?*%#]', '_', 'g');
$function$;

-- 33. safe_uuid_cast (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.safe_uuid_cast(input_text text)
 RETURNS uuid
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN input_text::UUID;
EXCEPTION WHEN invalid_text_representation THEN RETURN NULL;
END;
$function$;

-- 34. seed_sambajazznocturnes_tracks
CREATE OR REPLACE FUNCTION public.seed_sambajazznocturnes_tracks()
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.sambajazznocturnes_tracks 
        (storage_path, title, track_number, duration_seconds, bpm, therapeutic_category, mood_tags, display_order)
    VALUES
        ('tracks/001_moonlight_serenade.mp3', 'Moonlight Serenade', 1, 240, 60, ARRAY['relaxation', 'sleep'], ARRAY['calm', 'peaceful'], 1),
        ('tracks/002_gentle_waves.mp3', 'Gentle Waves', 2, 300, 55, ARRAY['relaxation', 'meditation'], ARRAY['tranquil', 'flowing'], 2),
        ('tracks/003_evening_breeze.mp3', 'Evening Breeze', 3, 280, 58, ARRAY['relaxation', 'focus'], ARRAY['soothing', 'light'], 3)
    ON CONFLICT (storage_path) DO NOTHING;
    RAISE NOTICE '✅ Seeded % sambajazznocturnes tracks', (SELECT COUNT(*) FROM public.sambajazznocturnes_tracks);
END;
$function$;

-- 35. update_genre_metadata_updated_at (trigger)
CREATE OR REPLACE FUNCTION public.update_genre_metadata_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

-- 36. update_sambajazznocturnes_tracks_updated_at (trigger)
CREATE OR REPLACE FUNCTION public.update_sambajazznocturnes_tracks_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;

-- 37. update_security_incidents_updated_at (trigger)
CREATE OR REPLACE FUNCTION public.update_security_incidents_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 38. update_session_activity (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.update_session_activity(session_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.user_sessions 
  SET last_accessed = NOW(), expires_at = NOW() + INTERVAL '30 days'
  WHERE id = session_id AND user_id::text = auth.uid()::text;
END;
$function$;

-- 39. update_ticket_timestamp (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.update_ticket_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    IF NEW.status = 'resolved'::public.support_ticket_status AND OLD.status != 'resolved'::public.support_ticket_status THEN
        NEW.resolved_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$function$;

-- 40. update_updated_at_column (trigger)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 41. update_user_genre_preference (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.update_user_genre_preference(target_category therapeutic_category, score integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.user_genre_preferences (user_id, therapeutic_category, preference_score, updated_at)
    VALUES (auth.uid(), target_category, score, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id, therapeutic_category) 
    DO UPDATE SET preference_score = EXCLUDED.preference_score, updated_at = CURRENT_TIMESTAMP;
END;
$function$;

-- 42. verify_all_tracks
CREATE OR REPLACE FUNCTION public.verify_all_tracks()
 RETURNS TABLE(total_checked integer, now_working integer, still_missing integer, bucket_corrections integer)
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  checked_count INTEGER := 0;
  working_count INTEGER := 0;
  missing_count INTEGER := 0;
  corrected_count INTEGER := 0;
BEGIN
  SELECT COUNT(*) INTO checked_count FROM tracks WHERE storage_key IS NOT NULL AND storage_key != '';
  SELECT COUNT(*) INTO working_count FROM tracks WHERE audio_status = 'working';
  SELECT COUNT(*) INTO missing_count FROM tracks WHERE audio_status IN ('missing', 'problematic');
  SELECT COUNT(*) INTO corrected_count FROM tracks WHERE storage_bucket = 'audio' AND audio_status = 'working';
  RETURN QUERY SELECT checked_count as total_checked, working_count as now_working, missing_count as still_missing, corrected_count as bucket_corrections;
END;
$function$;