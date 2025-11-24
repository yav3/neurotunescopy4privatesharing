-- Enable public read access for landingpage bucket
CREATE POLICY "Public read access for landingpage videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'landingpage');

-- Enable public read access for landingpagemusicexcerpts bucket
CREATE POLICY "Public read access for landingpagemusicexcerpts audio"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'landingpagemusicexcerpts');