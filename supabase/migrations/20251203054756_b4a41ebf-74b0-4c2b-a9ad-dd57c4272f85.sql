-- Drop the enhanced_user_favorites view which bypasses RLS due to postgres ownership
DROP VIEW IF EXISTS public.enhanced_user_favorites;