-- Security Hardening: Fix Anonymous Access Policies

-- 1. Fix Anonymous Access Policies for working_edge_collection
-- Drop the overly permissive read policy that allows anonymous users
DROP POLICY IF EXISTS "Working edge collection is readable by everyone" ON public.working_edge_collection;

-- Create a more restrictive read policy (authenticated users only)
CREATE POLICY "Working edge collection is readable by authenticated users"
  ON public.working_edge_collection
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure admin-only write policy is correct
DROP POLICY IF EXISTS "Only admins can manage working edge collection" ON public.working_edge_collection;

CREATE POLICY "Only admins can manage working edge collection"
  ON public.working_edge_collection
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- 2. Fix safe_key function with proper search_path
DROP FUNCTION IF EXISTS public.safe_key(text);

CREATE OR REPLACE FUNCTION public.safe_key(raw text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $func$
BEGIN
  RETURN regexp_replace(
    regexp_replace(lower(raw), '[^a-z0-9._-]', '_', 'g'),
    '_{2,}', '_', 'g'
  );
END;
$func$;

-- 3. Create extensions schema for better organization
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

COMMENT ON SCHEMA extensions IS 'Schema for PostgreSQL extensions (when possible to move from public)';
COMMENT ON SCHEMA public IS 'Public schema - Some Supabase-managed extensions remain here for compatibility';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE '✅ Security improvements applied:';
  RAISE NOTICE '  - Anonymous access removed from working_edge_collection (now requires authentication)';
  RAISE NOTICE '  - safe_key function now has SET search_path = public';
  RAISE NOTICE '  - Extensions schema created for future organization';
END $$;