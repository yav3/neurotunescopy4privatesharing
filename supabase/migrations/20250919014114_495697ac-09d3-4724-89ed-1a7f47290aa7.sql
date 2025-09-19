-- Fix security definer view issues

-- 1. Drop the problematic my_favorites view that uses custom user settings
DROP VIEW IF EXISTS public.my_favorites;

-- 2. Drop the storage_related_columns view as it's not essential and queries system catalogs
DROP VIEW IF EXISTS public.storage_related_columns;

-- The my_favorites table exists as "favorites" with proper RLS policies
-- Users should query the favorites table directly instead of the view

-- Note: pg_stat_monitor view is from an extension and shouldn't be modified