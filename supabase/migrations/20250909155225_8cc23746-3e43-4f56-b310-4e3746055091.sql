-- Make the Focus Music bucket public so it can be accessed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'Focus Music';