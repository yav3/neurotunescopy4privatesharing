-- Create function to validate user name (checks for first + last name minimum and blocked names)
CREATE OR REPLACE FUNCTION public.validate_user_name(full_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  name_parts TEXT[];
  last_name TEXT;
  is_blocked BOOLEAN;
BEGIN
  -- Trim and normalize the name
  full_name := TRIM(full_name);
  
  -- Split name into parts
  name_parts := string_to_array(full_name, ' ');
  
  -- Must have at least 2 parts (first and last name)
  IF array_length(name_parts, 1) < 2 THEN
    RETURN FALSE;
  END IF;
  
  -- Each part must be at least 2 characters
  FOR i IN 1..array_length(name_parts, 1) LOOP
    IF length(name_parts[i]) < 2 THEN
      RETURN FALSE;
    END IF;
  END LOOP;
  
  -- Get the last name (last part of the name)
  last_name := name_parts[array_length(name_parts, 1)];
  
  -- Check if last name is in blocked list (case insensitive)
  SELECT EXISTS (
    SELECT 1 
    FROM public.blocked_names 
    WHERE LOWER(last_name) = LOWER(blocked_names.last_name)
  ) INTO is_blocked;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Create function to check if email is from blocked company
CREATE OR REPLACE FUNCTION public.is_blocked_company_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_domain TEXT;
  is_blocked BOOLEAN;
BEGIN
  -- Extract domain from email
  email_domain := LOWER(split_part(email, '@', 2));
  
  -- Check if domain matches any blocked company
  SELECT EXISTS (
    SELECT 1 
    FROM public.blocked_companies 
    WHERE LOWER(email_domain) LIKE '%' || LOWER(company_name) || '%'
       OR LOWER(company_name) LIKE '%' || LOWER(email_domain) || '%'
  ) INTO is_blocked;
  
  RETURN is_blocked;
END;
$$;