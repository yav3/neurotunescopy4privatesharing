-- Create efficient track stats function for admin dashboard
CREATE OR REPLACE FUNCTION get_track_stats()
RETURNS TABLE(
  total_tracks bigint,
  working_tracks bigint,
  missing_tracks bigint,
  unknown_tracks bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_tracks,
    COUNT(*) FILTER (WHERE audio_status = 'working') as working_tracks,
    COUNT(*) FILTER (WHERE audio_status = 'missing') as missing_tracks,
    COUNT(*) FILTER (WHERE audio_status = 'unknown') as unknown_tracks
  FROM tracks;
$$;