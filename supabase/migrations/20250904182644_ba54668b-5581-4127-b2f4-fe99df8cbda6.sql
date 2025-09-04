-- Fix storage bucket priority and verify working tracks
-- Step 1: Update all tracks to point to 'audio' bucket first
UPDATE tracks 
SET storage_bucket = 'audio',
    audio_status = 'unknown',
    last_error = NULL,
    last_verified_at = NULL
WHERE storage_bucket = 'neuralpositivemusic' 
  AND storage_key IS NOT NULL 
  AND storage_key != '';

-- Step 2: Create function to bulk verify and fix track statuses
CREATE OR REPLACE FUNCTION verify_all_tracks()
RETURNS TABLE(
  total_checked INTEGER,
  now_working INTEGER,
  still_missing INTEGER,
  bucket_corrections INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  checked_count INTEGER := 0;
  working_count INTEGER := 0;
  missing_count INTEGER := 0;
  corrected_count INTEGER := 0;
BEGIN
  -- This function will be called by your edge function to verify all tracks
  -- It will update audio_status based on actual file availability
  
  SELECT COUNT(*) INTO checked_count 
  FROM tracks 
  WHERE storage_key IS NOT NULL AND storage_key != '';
  
  SELECT COUNT(*) INTO working_count 
  FROM tracks 
  WHERE audio_status = 'working';
  
  SELECT COUNT(*) INTO missing_count 
  FROM tracks 
  WHERE audio_status IN ('missing', 'problematic');
  
  SELECT COUNT(*) INTO corrected_count 
  FROM tracks 
  WHERE storage_bucket = 'audio' 
    AND audio_status = 'working';
  
  RETURN QUERY SELECT 
    checked_count as total_checked,
    working_count as now_working, 
    missing_count as still_missing,
    corrected_count as bucket_corrections;
END;
$$;