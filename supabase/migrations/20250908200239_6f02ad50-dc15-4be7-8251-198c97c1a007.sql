-- Update user role to admin
UPDATE user_roles 
SET role = 'admin', updated_at = NOW()
WHERE user_id = '780e05e6-28fa-41a6-a473-b881cad9c113';

-- Create RLS policies for admin access to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create RLS policies for admin access to view all user roles
CREATE POLICY "Admins can view all user roles" 
ON user_roles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur2
    WHERE ur2.user_id = auth.uid() 
    AND ur2.role IN ('admin', 'super_admin')
  )
);

-- Create RLS policies for admin access to manage user roles
CREATE POLICY "Admins can update user roles" 
ON user_roles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur2
    WHERE ur2.user_id = auth.uid() 
    AND ur2.role IN ('admin', 'super_admin')
  )
);

-- Create RLS policies for admin access to tracks
CREATE POLICY "Admins can view all tracks" 
ON tracks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create RLS policies for admin access to playlists
CREATE POLICY "Admins can view all playlists" 
ON playlists 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);