-- Fix functions missing SET search_path = public
-- This prevents search_path injection vulnerabilities

-- Fix cleanup_expired_playlists
CREATE OR REPLACE FUNCTION public.cleanup_expired_playlists()
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.precomputed_playlists 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

-- Fix generate_unique_filename
CREATE OR REPLACE FUNCTION public.generate_unique_filename(base_name text, bucket_name text, exclude_id uuid DEFAULT NULL::uuid)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    counter INTEGER := 0;
    test_name TEXT;
    name_without_ext TEXT;
    extension TEXT;
BEGIN
    IF base_name LIKE '%.mp3' THEN
        name_without_ext := LEFT(base_name, LENGTH(base_name) - 4);
        extension := '.mp3';
    ELSE
        name_without_ext := base_name;
        extension := '.mp3';
    END IF;
    
    test_name := name_without_ext || extension;
    
    WHILE EXISTS (
        SELECT 1 FROM storage.objects 
        WHERE bucket_id = bucket_name 
        AND name = test_name 
        AND (exclude_id IS NULL OR id != exclude_id)
    ) LOOP
        counter := counter + 1;
        test_name := name_without_ext || '-' || counter || extension;
    END LOOP;
    
    RETURN test_name;
END;
$function$;

-- Fix get_camelot_neighbors
CREATE OR REPLACE FUNCTION public.get_camelot_neighbors(input_camelot text)
 RETURNS text[]
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  camelot_wheel JSONB := '{
    "1A": ["12A", "2A", "1B"],
    "2A": ["1A", "3A", "2B"],
    "3A": ["2A", "4A", "3B"],
    "4A": ["3A", "5A", "4B"],
    "5A": ["4A", "6A", "5B"],
    "6A": ["5A", "7A", "6B"],
    "7A": ["6A", "8A", "7B"],
    "8A": ["7A", "9A", "8B"],
    "9A": ["8A", "10A", "9B"],
    "10A": ["9A", "11A", "10B"],
    "11A": ["10A", "12A", "11B"],
    "12A": ["11A", "1A", "12B"],
    "1B": ["12B", "2B", "1A"],
    "2B": ["1B", "3B", "2A"],
    "3B": ["2B", "4B", "3A"],
    "4B": ["3B", "5B", "4A"],
    "5B": ["4B", "6B", "5A"],
    "6B": ["5B", "7B", "6A"],
    "7B": ["6B", "8B", "7A"],
    "8B": ["7B", "9B", "8A"],
    "9B": ["8B", "10B", "9A"],
    "10B": ["9B", "11B", "10A"],
    "11B": ["10B", "12B", "11A"],
    "12B": ["11B", "1B", "12A"]
  }'::JSONB;
  neighbors JSONB;
BEGIN
  neighbors := camelot_wheel -> input_camelot;
  IF neighbors IS NULL THEN
    RETURN ARRAY[]::TEXT[];
  END IF;
  
  RETURN ARRAY(SELECT jsonb_array_elements_text(neighbors));
END;
$function$;

-- Fix mark_track_as_missing
CREATE OR REPLACE FUNCTION public.mark_track_as_missing(track_uuid uuid, error_message text DEFAULT 'File not accessible'::text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  UPDATE tracks 
  SET 
    audio_status = 'missing',
    last_verified_at = NOW(),
    last_error = error_message
  WHERE id = track_uuid;
END;
$function$;

-- Fix update_has_lyrics
CREATE OR REPLACE FUNCTION public.update_has_lyrics()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.has_lyrics := (NEW.lyrics IS NOT NULL AND LENGTH(TRIM(NEW.lyrics)) > 0);
  RETURN NEW;
END;
$function$;

-- Fix increment_play_count (already has SECURITY DEFINER but missing search_path)
CREATE OR REPLACE FUNCTION public.increment_play_count(track_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tracks' 
        AND column_name = 'play_count' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.tracks ADD COLUMN play_count INTEGER DEFAULT 0;
    END IF;
    
    UPDATE public.tracks 
    SET play_count = COALESCE(play_count, 0) + 1,
        updated_at = NOW()
    WHERE id = track_id;
    
    INSERT INTO public.listening_sessions (
        user_id, 
        track_id, 
        session_type, 
        created_at
    ) VALUES (
        auth.uid(), 
        track_id, 
        'play', 
        NOW()
    ) ON CONFLICT DO NOTHING;
    
EXCEPTION WHEN OTHERS THEN
    NULL;
END;
$function$;