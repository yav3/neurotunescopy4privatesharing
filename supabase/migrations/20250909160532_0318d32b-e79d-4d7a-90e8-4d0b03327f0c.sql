-- Create a new focus music bucket without spaces
INSERT INTO storage.buckets (id, name, public) 
VALUES ('focus-music', 'focus-music', true);

-- Create RLS policies for the new bucket
CREATE POLICY "Public read access to focus music" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'focus-music');

CREATE POLICY "Authenticated users can upload focus music" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'focus-music' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their focus music" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'focus-music' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete their focus music" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'focus-music' AND auth.role() = 'authenticated');