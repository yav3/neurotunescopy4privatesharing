-- Create a function to get or create a patient record for a regular user
CREATE OR REPLACE FUNCTION public.get_or_create_patient_for_user(user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  patient_record_id uuid;
  user_profile profiles%ROWTYPE;
BEGIN
  -- First, try to find existing patient record by external_patient_id = user_id
  SELECT id INTO patient_record_id 
  FROM patients 
  WHERE external_patient_id = user_id::text
  LIMIT 1;
  
  -- If found, return it
  IF patient_record_id IS NOT NULL THEN
    RETURN patient_record_id;
  END IF;
  
  -- If not found, get user profile info
  SELECT * INTO user_profile 
  FROM profiles 
  WHERE profiles.user_id = get_or_create_patient_for_user.user_id;
  
  -- Create new patient record for this user
  INSERT INTO patients (
    external_patient_id,
    consent_status,
    created_at,
    updated_at
  ) VALUES (
    user_id::text,
    'consented',
    now(),
    now()
  ) RETURNING id INTO patient_record_id;
  
  RETURN patient_record_id;
END;
$$;

-- Update the listening_sessions table to make patient_id nullable but ensure we have either patient_id or user_id
ALTER TABLE listening_sessions ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create an index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_listening_sessions_user_id ON listening_sessions(user_id);

-- Add a constraint to ensure we have either patient_id or user_id
ALTER TABLE listening_sessions ADD CONSTRAINT listening_sessions_patient_or_user_check 
CHECK (patient_id IS NOT NULL OR user_id IS NOT NULL);