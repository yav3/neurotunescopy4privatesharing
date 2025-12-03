-- Fix remaining user functions
DROP FUNCTION IF EXISTS public.fix_track_id_inconsistencies();

CREATE FUNCTION public.fix_track_id_inconsistencies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    track_record RECORD;
BEGIN
    RAISE NOTICE 'Starting track ID consistency fixes...';
    
    FOR track_record IN 
        SELECT id, original_filename 
        FROM curated_tracks 
        WHERE original_filename IS NOT NULL
    LOOP
        RAISE NOTICE 'Found track: % with ID: %', track_record.original_filename, track_record.id;
    END LOOP;
    
    UPDATE curated_tracks 
    SET curated_storage_key = COALESCE(curated_storage_key, original_filename)
    WHERE curated_storage_key IS NULL AND original_filename IS NOT NULL;
    
    RAISE NOTICE 'Track ID consistency fixes completed';
END;
$$;