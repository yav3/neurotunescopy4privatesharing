-- Create RLS policies for storage buckets to allow public read access
-- This will fix the issue where clients can't see available buckets

CREATE POLICY "Public can view storage buckets" 
ON storage.buckets 
FOR SELECT 
USING (true);

-- Also ensure authenticated users can see the buckets
CREATE POLICY "Authenticated users can view storage buckets" 
ON storage.buckets 
FOR SELECT 
TO authenticated
USING (true);