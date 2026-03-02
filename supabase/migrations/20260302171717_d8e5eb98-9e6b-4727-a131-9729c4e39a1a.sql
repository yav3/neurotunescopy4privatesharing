
-- 1. Fix profiles: change roles from {public} to {authenticated}
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid()::text = user_id::text);

-- 2. Fix user_profiles: remove public/anon access, keep only authenticated
DROP POLICY IF EXISTS "anonymous_users_read_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

CREATE POLICY "Users can view own user_profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own user_profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own user_profile" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all user_profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 3. Fix streaming_analytics: restrict to authenticated users
DROP POLICY IF EXISTS "Allow public insert on streaming_analytics" ON public.streaming_analytics;
DROP POLICY IF EXISTS "Allow public read access on streaming_analytics" ON public.streaming_analytics;

CREATE POLICY "Authenticated users can insert streaming_analytics" ON public.streaming_analytics
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read streaming_analytics" ON public.streaming_analytics
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 4. Fix working_edge_collection: remove overly permissive SELECT
DROP POLICY IF EXISTS "Working edge collection is readable by authenticated users" ON public.working_edge_collection;
CREATE POLICY "Admins can read working edge collection" ON public.working_edge_collection
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- 5. Create email rate limiting table
CREATE TABLE IF NOT EXISTS public.email_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  email_type text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  ip_address text
);

ALTER TABLE public.email_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access email_rate_limits" ON public.email_rate_limits
  FOR ALL USING (false);

CREATE INDEX IF NOT EXISTS idx_email_rate_recipient ON public.email_rate_limits (recipient_email, sent_at);
CREATE INDEX IF NOT EXISTS idx_email_rate_ip ON public.email_rate_limits (ip_address, sent_at);

-- 6. Create rate limiting check function
CREATE OR REPLACE FUNCTION public.check_email_rate_limit(
  p_email text,
  p_ip text DEFAULT NULL,
  p_max_per_recipient integer DEFAULT 3,
  p_max_per_ip integer DEFAULT 5,
  p_window_hours integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recipient_count integer;
  ip_count integer;
BEGIN
  -- Check recipient rate limit
  SELECT COUNT(*) INTO recipient_count
  FROM public.email_rate_limits
  WHERE recipient_email = p_email
    AND sent_at > now() - (p_window_hours || ' hours')::interval;

  IF recipient_count >= p_max_per_recipient THEN
    RETURN false;
  END IF;

  -- Check IP rate limit if provided
  IF p_ip IS NOT NULL THEN
    SELECT COUNT(*) INTO ip_count
    FROM public.email_rate_limits
    WHERE ip_address = p_ip
      AND sent_at > now() - (p_window_hours || ' hours')::interval;

    IF ip_count >= p_max_per_ip THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$$;

-- 7. Function to record email send
CREATE OR REPLACE FUNCTION public.record_email_send(
  p_email text,
  p_type text,
  p_ip text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.email_rate_limits (recipient_email, email_type, ip_address)
  VALUES (p_email, p_type, p_ip);

  -- Cleanup old records (older than 24h)
  DELETE FROM public.email_rate_limits WHERE sent_at < now() - interval '24 hours';
END;
$$;
