-- Clean up duplicate storage_keys by making them unique
-- Strategy: Keep the first occurrence, append track ID to duplicates
WITH duplicate_groups AS (
  SELECT 
    lower(storage_key) as key_lower,
    array_agg(id ORDER BY created_at) as track_ids
  FROM public.music_tracks 
  WHERE storage_key IS NOT NULL
  GROUP BY lower(storage_key)
  HAVING count(*) > 1
),
tracks_to_update AS (
  SELECT 
    unnest(track_ids[2:]) as track_id,  -- Skip first element (keep original)
    key_lower
  FROM duplicate_groups
)
UPDATE public.music_tracks 
SET storage_key = CASE 
  WHEN position('.' in storage_key) > 0 THEN
    -- Has extension: insert ID before extension
    substring(storage_key from 1 for position('.' in reverse(storage_key)) - 1) || '_' || id || substring(storage_key from length(storage_key) - position('.' in reverse(storage_key)) + 2)
  ELSE
    -- No extension: append ID
    storage_key || '_' || id
END
WHERE id IN (SELECT track_id FROM tracks_to_update);