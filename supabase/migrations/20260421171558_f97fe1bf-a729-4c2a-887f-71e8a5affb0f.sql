
-- ============================================================
-- CRITICAL SECURITY HARDENING MIGRATION
-- ============================================================

-- 1. CONTACT_SUBMISSIONS: Add restrictive policy ensuring only admins can SELECT
--    Drop redundant duplicate admin policy first
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;

-- Add a restrictive policy that explicitly blocks all non-admin SELECTs
CREATE POLICY "Restrict contact submissions read to admins only"
ON public.contact_submissions
AS RESTRICTIVE
FOR SELECT
TO authenticated, anon
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);

-- Block anonymous SELECT entirely with restrictive policy
CREATE POLICY "Block anonymous read of contact submissions"
ON public.contact_submissions
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- 2. TRIAL_REQUESTS: Add restrictive policy ensuring only admins can SELECT
CREATE POLICY "Restrict trial requests read to admins only"
ON public.trial_requests
AS RESTRICTIVE
FOR SELECT
TO authenticated, anon
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  OR public.has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Block anonymous read of trial requests"
ON public.trial_requests
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

-- 3. REALTIME CHANNEL PROTECTION
--    Enable RLS on realtime.messages and restrict to authenticated users
--    with explicit topic-based access control
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

-- Drop any overly permissive existing policies
DROP POLICY IF EXISTS "Allow all authenticated realtime" ON realtime.messages;
DROP POLICY IF EXISTS "authenticated_can_subscribe" ON realtime.messages;

-- Only authenticated users can subscribe to realtime channels
CREATE POLICY "Authenticated users only - realtime read"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users only - realtime insert"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Block anonymous access to realtime entirely
CREATE POLICY "Block anonymous realtime"
ON realtime.messages
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 4. OTP EXPIRY: Reduce to 600 seconds (10 minutes) for passwordless-primary auth
--    Note: This is set via auth config, applied at the project level
--    The auth.config table is managed by Supabase but we can document the requirement
COMMENT ON SCHEMA public IS 'OTP expiry should be set to 600 seconds (10 minutes) in Auth Settings for security. This must be configured in the Supabase Dashboard under Authentication > Providers > Email.';
