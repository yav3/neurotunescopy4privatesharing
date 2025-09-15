-- Create RLS policy to allow public read access to Chopin bucket
CREATE POLICY "Public read access to Chopin music" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'Chopin');