-- Drop existing public read policy on security_incidents
DROP POLICY IF EXISTS "Public read access to security incidents" ON public.security_incidents;
DROP POLICY IF EXISTS "Anyone can read security incidents" ON public.security_incidents;
DROP POLICY IF EXISTS "Allow public read access" ON public.security_incidents;

-- Create admin-only read policy
CREATE POLICY "Only admins can view security incidents"
ON public.security_incidents
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Ensure service role can still manage (for edge function logging)
DROP POLICY IF EXISTS "Service role can manage security incidents" ON public.security_incidents;
CREATE POLICY "Service role can manage security incidents"
ON public.security_incidents
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);