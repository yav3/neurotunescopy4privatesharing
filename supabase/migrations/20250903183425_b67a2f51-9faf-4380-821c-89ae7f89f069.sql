-- Update database function to use tracks table instead of music_tracks
CREATE OR REPLACE FUNCTION public.get_therapeutic_recommendations(target_condition text, min_evidence_score numeric DEFAULT 0.7)
 RETURNS TABLE(track_id uuid, evidence_score numeric, frequency_band text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as track_id,
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
  ORDER BY evidence_score DESC
  LIMIT 50;
END;
$function$;