-- Create RLS policies for classicalfocus bucket to allow public read access
-- This will allow the app to read files from the classicalfocus storage bucket

-- Policy to allow public read access to classicalfocus bucket files
CREATE POLICY "Public read access for classicalfocus" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'classicalfocus');

-- Policy to allow authenticated users to read classicalfocus bucket files
CREATE POLICY "Authenticated read access for classicalfocus" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'classicalfocus');

-- Policy to allow anonymous users to read classicalfocus bucket files
CREATE POLICY "Anonymous read access for classicalfocus" 
ON storage.objects 
FOR SELECT 
TO anon
USING (bucket_id = 'classicalfocus');