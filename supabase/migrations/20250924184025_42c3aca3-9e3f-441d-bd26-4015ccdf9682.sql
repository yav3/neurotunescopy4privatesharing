-- Update RLS policies to allow VIP members (premium_user and above) to view all user data

-- Allow VIP members to view all profiles
CREATE POLICY "VIP members can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('premium_user', 'moderator', 'admin', 'super_admin')
  )
);

-- Allow VIP members to view all listening sessions
CREATE POLICY "VIP members can view all listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('premium_user', 'moderator', 'admin', 'super_admin')
  )
);

-- Allow VIP members to view all user sessions
CREATE POLICY "VIP members can view all user sessions" 
ON public.user_sessions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('premium_user', 'moderator', 'admin', 'super_admin')
  )
);

-- Allow VIP members to view all favorites
CREATE POLICY "VIP members can view all favorites" 
ON public.favorites 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('premium_user', 'moderator', 'admin', 'super_admin')
  )
);

-- Create function to check VIP status
CREATE OR REPLACE FUNCTION public.is_vip_member(_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('premium_user', 'moderator', 'admin', 'super_admin')
  )
$$;