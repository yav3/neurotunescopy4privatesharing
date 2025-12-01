-- Drop unused enhanced_user_favorites view
-- This view is owned by the postgres superuser which bypasses RLS policies
-- It's not used anywhere in the application code, so it's safe to remove

DROP VIEW IF EXISTS public.enhanced_user_favorites CASCADE;