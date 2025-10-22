-- Remove public access to favorites table
DROP POLICY IF EXISTS "Public can view all favorites" ON public.favorites;

-- Ensure users can only see their own favorites
-- (keeping existing policies for user self-management and VIP access)

-- Add comment for clarity
COMMENT ON TABLE public.favorites IS 'User favorites - private by default, users can only see their own';
COMMENT ON TABLE public.blocked_tracks IS 'Blocked tracks - users can only see their own';
COMMENT ON TABLE public.listening_sessions IS 'Listening sessions - users can only see their own';