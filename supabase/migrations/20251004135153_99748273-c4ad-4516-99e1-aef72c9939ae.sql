-- Make reggaeton bucket public for audio streaming
UPDATE storage.buckets 
SET public = true 
WHERE id = 'reggaeton';

-- Add RLS policy to allow public SELECT access to reggaeton files
CREATE POLICY "Public Access to Reggaeton Music"
ON storage.objects FOR SELECT
USING (bucket_id = 'reggaeton');