-- Hardening script for neuralpositivemusic bucket
-- Run this to improve security and performance

-- 1. Make bucket private for production (comment out if you want public access)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'neuralpositivemusic';

-- 2. Create RLS policies for secure access
-- Allow authenticated users to read audio files
CREATE POLICY "Authenticated users can download audio files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'neuralpositivemusic' 
  AND auth.role() = 'authenticated'
);

-- Allow service role to manage all files (for ingestion/repair)
CREATE POLICY "Service role can manage audio files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'neuralpositivemusic' 
  AND auth.jwt() ->> 'role' = 'service_role'
);

-- 3. Add storage metadata tracking (optional)
CREATE TABLE IF NOT EXISTS public.storage_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket_name text NOT NULL,
  total_files integer DEFAULT 0,
  total_size_bytes bigint DEFAULT 0,
  last_indexed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on storage metrics
ALTER TABLE public.storage_metrics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to storage metrics
CREATE POLICY "Public can view storage metrics"
ON public.storage_metrics FOR SELECT
USING (true);

-- Allow service role to manage storage metrics
CREATE POLICY "Service role can manage storage metrics"
ON public.storage_metrics FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');