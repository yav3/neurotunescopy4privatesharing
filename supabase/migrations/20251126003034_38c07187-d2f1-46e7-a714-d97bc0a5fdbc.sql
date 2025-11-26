-- Create user blocking rules tables
CREATE TABLE IF NOT EXISTS public.blocked_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blocked_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blocked_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert initial blocking rules
INSERT INTO public.blocked_companies (company_name) VALUES 
  ('Endel'),
  ('Lucid'),
  ('HealthTunes')
ON CONFLICT (company_name) DO NOTHING;

INSERT INTO public.blocked_names (last_name) VALUES 
  ('Werzowa')
ON CONFLICT (last_name) DO NOTHING;

INSERT INTO public.blocked_countries (country_code, country_name) VALUES 
  ('CN', 'China'),
  ('AT', 'Austria'),
  ('BE', 'Belgium')
ON CONFLICT (country_code) DO NOTHING;

-- Enable RLS
ALTER TABLE public.blocked_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_countries ENABLE ROW LEVEL SECURITY;

-- Create policies for admin-only access to blocking rules
CREATE POLICY "Only admins can view blocked companies"
  ON public.blocked_companies FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can view blocked names"
  ON public.blocked_names FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Only admins can view blocked countries"
  ON public.blocked_countries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'super_admin'::app_role));

-- Create validation function for name checking
CREATE OR REPLACE FUNCTION public.validate_user_name(full_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  name_parts TEXT[];
  last_name TEXT;
  fake_patterns TEXT[] := ARRAY['test', 'fake', 'admin', 'user', 'demo', 'sample', 'null', 'undefined', 'none', 'asdf', 'qwerty'];
  pattern TEXT;
BEGIN
  -- Check if name has at least 2 words (First Last)
  name_parts := regexp_split_to_array(trim(full_name), '\s+');
  
  IF array_length(name_parts, 1) < 2 THEN
    RETURN FALSE;
  END IF;
  
  -- Get last name
  last_name := lower(name_parts[array_length(name_parts, 1)]);
  
  -- Check against blocked last names
  IF EXISTS (
    SELECT 1 FROM public.blocked_names 
    WHERE lower(last_name) = lower(blocked_names.last_name)
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Check for fake name patterns
  FOREACH pattern IN ARRAY fake_patterns LOOP
    IF lower(full_name) LIKE '%' || pattern || '%' THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  -- Check if each part has at least 2 characters
  FOR i IN 1..array_length(name_parts, 1) LOOP
    IF length(name_parts[i]) < 2 THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$;

-- Create function to check if email domain is blocked
CREATE OR REPLACE FUNCTION public.is_blocked_company_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  email_domain TEXT;
BEGIN
  -- Extract domain from email
  email_domain := split_part(email, '@', 2);
  
  -- Check if domain contains any blocked company name
  RETURN EXISTS (
    SELECT 1 FROM public.blocked_companies
    WHERE lower(email_domain) LIKE '%' || lower(company_name) || '%'
  );
END;
$$;