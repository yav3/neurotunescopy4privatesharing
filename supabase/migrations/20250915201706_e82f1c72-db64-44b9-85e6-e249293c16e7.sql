-- Create RLS policy for classicalfocus bucket
CREATE POLICY "Public read access to classicalfocus bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'classicalfocus');

-- Create RLS policy for NewAgeandWorldFocus bucket
CREATE POLICY "Public read access to NewAgeandWorldFocus bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'NewAgeandWorldFocus');

-- Create RLS policy for newageworldstressanxietyreduction bucket
CREATE POLICY "Public read access to newageworldstressanxietyreduction bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'newageworldstressanxietyreduction');