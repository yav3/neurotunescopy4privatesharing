-- Add missing profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS default_session_duration INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS favorite_goals TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": false}';