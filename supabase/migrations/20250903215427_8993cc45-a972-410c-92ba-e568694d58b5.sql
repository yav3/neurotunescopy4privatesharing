-- Update all tracks to use the correct storage bucket where files actually exist
UPDATE tracks 
SET storage_bucket = 'audio' 
WHERE storage_bucket = 'neuralpositivemusic' OR storage_bucket IS NULL;