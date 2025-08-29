-- Remove any existing permissive policies that might allow anonymous access
DROP POLICY IF EXISTS "Allow all operations on user_favorites" ON public.user_favorites;