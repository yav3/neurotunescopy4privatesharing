-- Create policy to allow public read access to samba bucket
CREATE POLICY "Public read access to samba music" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'samba');