-- Revert back to correct storage bucket where files actually exist
UPDATE tracks 
SET storage_bucket = 'neuralpositivemusic' 
WHERE storage_bucket = 'audio';