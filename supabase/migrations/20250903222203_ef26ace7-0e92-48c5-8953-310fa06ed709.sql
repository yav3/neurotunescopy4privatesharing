-- Enable RLS on tracks table and set proper policies
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policies if they exist
DROP POLICY IF EXISTS "Allow public read access to tracks" ON public.tracks;
DROP POLICY IF EXISTS "Allow public update to tracks" ON public.tracks;

-- Create proper RLS policies for tracks table
-- Allow public read access to tracks (for music streaming)
CREATE POLICY "Public can read tracks"
  ON public.tracks FOR SELECT
  USING (true);

-- Only service role can modify tracks
CREATE POLICY "Service role can manage tracks"
  ON public.tracks FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);