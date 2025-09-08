-- Fix infinite recursion in user_roles RLS policies
-- Drop the problematic policies that reference user_roles table directly
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;

-- Recreate them using the existing security definer functions to avoid recursion
CREATE POLICY "Admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR 
  public.has_role(auth.uid(), 'super_admin'::app_role) OR
  auth.uid() = user_id
);