-- First, let's create an index to speed up the audit process
CREATE INDEX IF NOT EXISTS idx_tracks_audio_status_storage ON tracks (audio_status, storage_key) 
WHERE storage_key IS NOT NULL AND storage_key != '';

-- Function to find tracks that likely don't exist based on common patterns
CREATE OR REPLACE FUNCTION public.mark_likely_missing_tracks()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- Mark tracks as "unknown" (needs verification) if they follow patterns of missing files
    -- This will trigger re-verification next time they're accessed
    UPDATE tracks 
    SET audio_status = 'unknown',
        last_verified_at = NULL,
        last_error = 'Needs verification - bulk update'
    WHERE audio_status = 'working'
      AND storage_key IS NOT NULL 
      AND storage_key != ''
      AND (
        -- Files that typically had issues based on the logs
        storage_key LIKE '%remix%' OR 
        storage_key LIKE '%1970s%' OR
        storage_key LIKE '%classical%' OR  
        -- Files that haven't been verified recently (if you have that column)
        last_verified_at IS NULL OR 
        last_verified_at < NOW() - INTERVAL '30 days'
      );
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    RAISE NOTICE 'Marked % tracks for re-verification', affected_count;
    RETURN affected_count;
END;
$$;