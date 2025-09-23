-- Fix critical security vulnerability: Restrict patient medical data access
-- Drop the overly permissive existing policy that allows any authenticated user to view patient data
DROP POLICY IF EXISTS "Authenticated users can view patients" ON public.patients;

-- Create a function to check if user has medical access permissions
CREATE OR REPLACE FUNCTION public.has_medical_access()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'moderator')
  )
$$;

-- Create restrictive RLS policies for patient data access
-- Only allow authorized medical personnel to view patient data
CREATE POLICY "Medical personnel can view patients"
ON public.patients
FOR SELECT
USING (public.has_medical_access());

-- Only allow authorized medical personnel to insert patient data
CREATE POLICY "Medical personnel can insert patients"
ON public.patients
FOR INSERT
WITH CHECK (public.has_medical_access());

-- Only allow authorized medical personnel to update patient data
CREATE POLICY "Medical personnel can update patients"
ON public.patients
FOR UPDATE
USING (public.has_medical_access())
WITH CHECK (public.has_medical_access());

-- Only allow authorized medical personnel to delete patient data
CREATE POLICY "Medical personnel can delete patients"
ON public.patients
FOR DELETE
USING (public.has_medical_access());

-- Keep service role access for system operations (already exists but ensuring it's maintained)
-- The existing "Service role can manage patients" policy should remain unchanged

-- Also secure related medical tables that might contain sensitive patient data
-- Update cognitive_biomarkers table policies
DROP POLICY IF EXISTS "Authenticated users can view cognitive biomarkers" ON public.cognitive_biomarkers;
CREATE POLICY "Medical personnel can view cognitive biomarkers"
ON public.cognitive_biomarkers
FOR SELECT
USING (public.has_medical_access());

CREATE POLICY "Medical personnel can manage cognitive biomarkers"
ON public.cognitive_biomarkers
FOR ALL
USING (public.has_medical_access())
WITH CHECK (public.has_medical_access());

-- Update pattern_changes table (currently has public access - security risk)
DROP POLICY IF EXISTS "Public access to pattern changes" ON public.pattern_changes;
CREATE POLICY "Medical personnel can view pattern changes"
ON public.pattern_changes
FOR SELECT
USING (public.has_medical_access());

CREATE POLICY "Medical personnel can manage pattern changes"
ON public.pattern_changes
FOR ALL
USING (public.has_medical_access())
WITH CHECK (public.has_medical_access());

-- Update listening_sessions table (currently has public access - security risk)
DROP POLICY IF EXISTS "Public access to listening sessions" ON public.listening_sessions;
CREATE POLICY "Medical personnel can view listening sessions"
ON public.listening_sessions
FOR SELECT
USING (public.has_medical_access());

CREATE POLICY "Medical personnel can manage listening sessions"
ON public.listening_sessions
FOR ALL
USING (public.has_medical_access())
WITH CHECK (public.has_medical_access());