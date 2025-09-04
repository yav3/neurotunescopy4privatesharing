-- Create materialized view of working tracks for instant therapeutic recommendations
CREATE MATERIALIZED VIEW working_therapeutic_tracks AS
SELECT 
  id, title, artist, storage_key, storage_bucket, 
  bpm, camelot_key, valence, arousal, dominance, energy, energy_level,
  -- Assign therapeutic goals based on BPM and VAD values
  CASE 
    WHEN bpm BETWEEN 40 AND 80 AND valence > 0.6 THEN 'anxiety-relief'
    WHEN bpm BETWEEN 40 AND 60 AND arousal < 0.4 THEN 'sleep-preparation'  
    WHEN bpm BETWEEN 78 AND 100 AND valence BETWEEN 0.5 AND 0.7 THEN 'focus-enhancement'
    WHEN bpm BETWEEN 90 AND 140 AND valence > 0.7 THEN 'mood-boost'
    WHEN bmp BETWEEN 120 AND 160 AND arousal > 0.7 THEN 'energy-boost'
    ELSE 'general'
  END as therapeutic_goal,
  -- Pre-calculate VAD scores for common goals
  CASE WHEN bmp BETWEEN 40 AND 80 THEN 
    (valence * 0.4 + (1.0 - arousal) * 0.4 + dominance * 0.2)
  ELSE 
    (valence * 0.3 + arousal * 0.4 + dominance * 0.3) 
  END as vad_score
FROM tracks
WHERE audio_status = 'working'
  AND storage_key IS NOT NULL 
  AND storage_key != ''
  AND last_error IS NULL
  AND bpm IS NOT NULL
  AND bpm > 0;

-- Create indexes for fast lookups
CREATE INDEX idx_working_tracks_therapeutic_goal ON working_therapeutic_tracks(therapeutic_goal, vad_score DESC);
CREATE INDEX idx_working_tracks_bpm ON working_therapeutic_tracks(bpm, valence, arousal);
CREATE INDEX idx_working_tracks_vad ON working_therapeutic_tracks(valence, arousal, dominance);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_working_tracks_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW working_therapeutic_tracks;
  RAISE NOTICE 'Working tracks cache refreshed at %', now();
END;
$$;