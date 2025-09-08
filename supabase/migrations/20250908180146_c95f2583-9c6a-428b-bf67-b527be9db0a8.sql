-- Create profiles and roles for existing users who don't have them
-- This handles users created before the trigger was set up

INSERT INTO public.profiles (user_id, display_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'display_name', u.email) as display_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id,
  'user'::app_role as role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;