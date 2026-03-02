
-- Fix mutable search_path using ALTER only (preserving existing signatures)
ALTER FUNCTION public.add_favorite(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.add_favorite_by_file(uuid, text, text, text) SET search_path = public;
ALTER FUNCTION public.get_user_favorites(uuid) SET search_path = public;
ALTER FUNCTION public.is_favorited_by_file(uuid, text) SET search_path = public;
ALTER FUNCTION public.remove_favorite_by_file(uuid, text) SET search_path = public;
