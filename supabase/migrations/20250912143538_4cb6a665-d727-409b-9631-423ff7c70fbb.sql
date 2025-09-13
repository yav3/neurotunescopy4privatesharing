-- Fix security issues with the new functions by setting search_path
CREATE OR REPLACE FUNCTION public.generate_magic_link_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate a secure random token (32 bytes = 64 hex characters)
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

CREATE OR REPLACE FUNCTION public.create_magic_link_for_vip(
  target_user_id UUID,
  expires_in_hours INTEGER DEFAULT 24,
  link_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(
  link_id UUID,
  token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token TEXT;
  new_expires_at TIMESTAMP WITH TIME ZONE;
  new_link_id UUID;
BEGIN
  -- Check if the current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Only admins can create magic links';
  END IF;

  -- Check if target user is VIP (has premium_user role or higher)
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id 
    AND role IN ('premium_user', 'admin', 'super_admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Magic links can only be created for VIP users';
  END IF;

  -- Generate token and expiry
  new_token := public.generate_magic_link_token();
  new_expires_at := now() + (expires_in_hours || ' hours')::INTERVAL;

  -- Insert the magic link
  INSERT INTO public.magic_links (user_id, token, expires_at, created_by, metadata)
  VALUES (target_user_id, new_token, new_expires_at, auth.uid(), link_metadata)
  RETURNING id INTO new_link_id;

  -- Return the created link details
  RETURN QUERY SELECT new_link_id, new_token, new_expires_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_magic_link(link_token TEXT)
RETURNS TABLE(
  user_id UUID,
  valid BOOLEAN,
  reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  link_record RECORD;
BEGIN
  -- Find the magic link
  SELECT * INTO link_record 
  FROM public.magic_links 
  WHERE token = link_token;

  -- Check if link exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid magic link token';
    RETURN;
  END IF;

  -- Check if already used
  IF link_record.used_at IS NOT NULL THEN
    RETURN QUERY SELECT link_record.user_id, FALSE, 'Magic link has already been used';
    RETURN;
  END IF;

  -- Check if expired
  IF link_record.expires_at < now() THEN
    RETURN QUERY SELECT link_record.user_id, FALSE, 'Magic link has expired';
    RETURN;
  END IF;

  -- Mark as used
  UPDATE public.magic_links 
  SET used_at = now() 
  WHERE token = link_token;

  -- Return success
  RETURN QUERY SELECT link_record.user_id, TRUE, 'Magic link is valid';
END;
$$;