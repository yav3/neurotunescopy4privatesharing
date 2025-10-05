-- Make HIIT bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'HIIT';

-- Add RLS policy for public SELECT access to HIIT bucket
CREATE POLICY "Public Access to HIIT bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'HIIT');