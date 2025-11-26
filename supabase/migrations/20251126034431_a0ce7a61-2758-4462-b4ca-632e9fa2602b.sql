-- Fix ambiguous column reference in validate_user_name
CREATE OR REPLACE FUNCTION public.validate_user_name(full_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  name_parts TEXT[];
  user_last_name TEXT;
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
  user_last_name := name_parts[array_length(name_parts, 1)];
  
  -- Check if last name is in blocked list (case insensitive)
  SELECT EXISTS (
    SELECT 1 
    FROM public.blocked_names 
    WHERE LOWER(blocked_names.last_name) = LOWER(user_last_name)
  ) INTO is_blocked;
  
  IF is_blocked THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;