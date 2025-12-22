-- Remove overly permissive VIP access policies

-- Drop the permissive VIP policies on profiles
DROP POLICY IF EXISTS "VIP members can view all profiles" ON public.profiles;

-- Drop the permissive VIP policies on listening_sessions  
DROP POLICY IF EXISTS "VIP members can view all listening sessions" ON public.listening_sessions;

-- Drop the permissive VIP policies on favorites
DROP POLICY IF EXISTS "VIP members can view all favorites" ON public.favorites;

-- Drop the permissive VIP policies on user_sessions (if exists)
DROP POLICY IF EXISTS "VIP members can view all user_sessions" ON public.user_sessions;