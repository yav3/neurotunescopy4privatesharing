-- Make ENERGYBOOST bucket public for app access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'ENERGYBOOST';

-- Create RLS policies for ENERGYBOOST bucket
CREATE POLICY "Public read access to energy boost music" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ENERGYBOOST');

CREATE POLICY "Authenticated users can upload energy boost music" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ENERGYBOOST' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their energy boost music" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'ENERGYBOOST' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their energy boost music" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'ENERGYBOOST' AND auth.role() = 'authenticated');