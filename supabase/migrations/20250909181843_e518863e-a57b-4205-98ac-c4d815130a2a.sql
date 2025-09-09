-- Create RLS policy to allow public read access to trendingnow bucket
CREATE POLICY "Public read access to trending music" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'trendingnow');