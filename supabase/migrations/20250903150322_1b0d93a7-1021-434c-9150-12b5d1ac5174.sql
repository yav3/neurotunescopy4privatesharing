-- Fix CRITICAL security issue: Enable RLS on tracks table
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Create public read policy for tracks (similar to music_tracks)
CREATE POLICY "Allow public read access to tracks" 
ON tracks FOR SELECT 
USING (true);

-- Create service role management policy
CREATE POLICY "Service role can manage tracks" 
ON tracks FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Note: The tracks table now has proper RLS enabled for security