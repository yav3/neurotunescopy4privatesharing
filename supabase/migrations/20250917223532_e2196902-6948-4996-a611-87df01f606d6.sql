-- Create user favorites table for personalized music preferences
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  track_title TEXT,
  track_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Enable Row Level Security for favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for user favorites - only users can access their own favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.user_favorites;
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own favorites" ON public.user_favorites;
CREATE POLICY "Users can create their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.user_favorites;
CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user listening history table for personalized recommendations
CREATE TABLE IF NOT EXISTS public.user_listening_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  track_title TEXT,
  track_data JSONB,
  listened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false
);

-- Enable Row Level Security for listening history
ALTER TABLE public.user_listening_history ENABLE ROW LEVEL SECURITY;

-- Create policies for listening history - only users can access their own history
DROP POLICY IF EXISTS "Users can view their own listening history" ON public.user_listening_history;
CREATE POLICY "Users can view their own listening history" 
ON public.user_listening_history 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own listening history" ON public.user_listening_history;
CREATE POLICY "Users can create their own listening history" 
ON public.user_listening_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update existing blocked tracks table to ensure proper RLS
ALTER TABLE public.blocked_tracks ENABLE ROW LEVEL SECURITY;

-- Ensure blocked tracks policies exist and are correct
DROP POLICY IF EXISTS "Users can view their own blocked tracks" ON public.blocked_tracks;
CREATE POLICY "Users can view their own blocked tracks" 
ON public.blocked_tracks 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own blocked tracks" ON public.blocked_tracks;
CREATE POLICY "Users can create their own blocked tracks" 
ON public.blocked_tracks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own blocked tracks" ON public.blocked_tracks;
CREATE POLICY "Users can delete their own blocked tracks" 
ON public.blocked_tracks 
FOR DELETE 
USING (auth.uid() = user_id);