-- Quick fix: Mark unknown tracks as working
-- This assumes if they're in the database, they should be attempted for streaming

UPDATE tracks 
SET audio_status = 'working'
WHERE audio_status = 'unknown' 
  AND storage_key IS NOT NULL 
  AND storage_bucket IS NOT NULL;

-- Show the results
SELECT 
  audio_status,
  COUNT(*) as count
FROM tracks 
GROUP BY audio_status
ORDER BY count DESC;