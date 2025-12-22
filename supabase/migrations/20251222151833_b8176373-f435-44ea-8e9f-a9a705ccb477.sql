-- Create a more restrictive function that checks patient-specific access
-- This requires a patient assignment relationship

-- First, create a table to track which medical personnel are assigned to which patients
CREATE TABLE IF NOT EXISTS public.patient_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  assigned_user_id uuid NOT NULL,
  assigned_at timestamp with time zone DEFAULT now(),
  assignment_type text NOT NULL DEFAULT 'primary',
  UNIQUE (patient_id, assigned_user_id)
);

-- Enable RLS
ALTER TABLE public.patient_assignments ENABLE ROW LEVEL SECURITY;

-- Only admins can manage assignments
CREATE POLICY "Admins can manage patient assignments"
ON public.patient_assignments
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create a stricter function for patient-specific access
CREATE OR REPLACE FUNCTION public.has_patient_access(_patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.patient_assignments
    WHERE patient_id = _patient_id
      AND assigned_user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'super_admin')
$$;

-- Update patients table policies to use patient-specific access
DROP POLICY IF EXISTS "Medical personnel can view patients" ON public.patients;
DROP POLICY IF EXISTS "Authenticated users can view patients" ON public.patients;
DROP POLICY IF EXISTS "Service role can manage patients" ON public.patients;

-- Patients can view their own record (if they have a user account linked)
CREATE POLICY "Patients can view own record"
ON public.patients
FOR SELECT
USING (
  external_patient_id = auth.uid()::text
  OR public.has_patient_access(id)
);

-- Only assigned medical personnel and admins can update patient records
CREATE POLICY "Assigned personnel can update patients"
ON public.patients
FOR UPDATE
USING (public.has_patient_access(id));

-- Only admins can insert new patients
CREATE POLICY "Admins can insert patients"
ON public.patients
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Only admins can delete patients
CREATE POLICY "Admins can delete patients"
ON public.patients
FOR DELETE
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Update cognitive_biomarkers to use patient-specific access
DROP POLICY IF EXISTS "Medical personnel can manage cognitive biomarkers" ON public.cognitive_biomarkers;
DROP POLICY IF EXISTS "Medical personnel can view cognitive biomarkers" ON public.cognitive_biomarkers;

CREATE POLICY "Assigned personnel can view cognitive biomarkers"
ON public.cognitive_biomarkers
FOR SELECT
USING (public.has_patient_access(patient_id));

CREATE POLICY "Assigned personnel can manage cognitive biomarkers"
ON public.cognitive_biomarkers
FOR ALL
USING (public.has_patient_access(patient_id))
WITH CHECK (public.has_patient_access(patient_id));

-- Update dementia_risk_assessments similarly
DROP POLICY IF EXISTS "Medical personnel can view risk assessments" ON public.dementia_risk_assessments;

CREATE POLICY "Assigned personnel can view risk assessments"
ON public.dementia_risk_assessments
FOR SELECT
USING (public.has_patient_access(patient_id));