-- Enable RLS on tracks table
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tracks table
CREATE POLICY "Public can read tracks" ON public.tracks
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage tracks" ON public.tracks
  FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);