-- Remove any functions that might be trying to call edge functions
-- This will clean up any problematic SQL that tries to use supabase.functions.invoke

-- Check if there are any functions that might contain problematic calls
-- and remove them if they exist

-- If there's a bulk_normalize_buckets function, drop it
DROP FUNCTION IF EXISTS public.bulk_normalize_buckets(text[], boolean);

-- Make sure our working functions are clean and don't call edge functions
-- The edge functions should only be called from the React frontend