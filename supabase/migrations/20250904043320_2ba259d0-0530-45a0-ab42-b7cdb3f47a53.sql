-- Function to help identify tracks that might be in the wrong bucket
CREATE OR REPLACE FUNCTION public.find_cross_bucket_candidates()
RETURNS TABLE(
  track_id UUID,
  title TEXT,
  current_bucket TEXT,
  storage_key TEXT,
  suggested_bucket TEXT
)
LANGUAGE sql
AS $$
  -- Find tracks marked as missing that might be in the other bucket
  SELECT 
    t.id as track_id,
    t.title,
    t.storage_bucket as current_bucket,
    t.storage_key,
    CASE 
      WHEN t.storage_bucket = 'neuralpositivemusic' THEN 'audio'
      WHEN t.storage_bucket = 'audio' THEN 'neuralpositivemusic'
      ELSE 'unknown'
    END as suggested_bucket
  FROM tracks t
  WHERE t.audio_status = 'missing'
    AND t.storage_bucket IN ('neuralpositivemusic', 'audio')
    AND t.storage_key IS NOT NULL
    AND t.storage_key != ''
  ORDER BY t.title
  LIMIT 50;
$$;

-- Function to safely update a track's bucket assignment
CREATE OR REPLACE FUNCTION public.update_track_bucket(
  track_id UUID,
  new_bucket TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate bucket name
  IF new_bucket NOT IN ('neuralpositivemusic', 'audio') THEN
    RAISE EXCEPTION 'Invalid bucket name. Must be neuralpositivemusic or audio';
  END IF;
  
  -- Update the track bucket and reset status for re-verification
  UPDATE tracks 
  SET 
    storage_bucket = new_bucket,
    audio_status = 'unknown',
    last_verified_at = NULL,
    last_error = 'Bucket updated - needs verification'
  WHERE id = track_id;
  
  RETURN FOUND;
END;
$$;