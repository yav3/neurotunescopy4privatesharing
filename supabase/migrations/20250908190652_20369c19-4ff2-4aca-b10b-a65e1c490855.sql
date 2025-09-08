-- Add personalization fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS therapeutic_preferences jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"email": true, "push": false}',
ADD COLUMN IF NOT EXISTS default_session_duration integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS favorite_goals text[] DEFAULT '{}';

-- Add some helpful indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_favorite_goals ON public.profiles USING GIN(favorite_goals);