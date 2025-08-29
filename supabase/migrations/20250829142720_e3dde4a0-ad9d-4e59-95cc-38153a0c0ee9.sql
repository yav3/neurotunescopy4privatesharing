-- CRITICAL: Fix severe medical data privacy violation
-- Remove the dangerous policy that exposes all patient medical data publicly
DROP POLICY IF EXISTS "Public access to dementia risk assessments" ON public.dementia_risk_assessments;

-- Create secure RLS policies for medical data protection
-- Only authenticated users with proper roles can access medical assessments
CREATE POLICY "Medical personnel can view risk assessments" 
ON public.dementia_risk_assessments 
FOR SELECT 
USING (
  auth.role() = 'authenticated' 
  AND (
    -- Allow service role for system operations
    (auth.jwt() ->> 'role') = 'service_role'
    OR
    -- Allow users to view their own assessments if patient_id matches user_id
    auth.uid() = patient_id
  )
);

CREATE POLICY "Authorized personnel can insert assessments" 
ON public.dementia_risk_assessments 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' 
  AND (auth.jwt() ->> 'role') = 'service_role'
);

CREATE POLICY "Authorized personnel can update assessments" 
ON public.dementia_risk_assessments 
FOR UPDATE 
USING (
  auth.role() = 'authenticated' 
  AND (auth.jwt() ->> 'role') = 'service_role'
)
WITH CHECK (
  auth.role() = 'authenticated' 
  AND (auth.jwt() ->> 'role') = 'service_role'
);

CREATE POLICY "Authorized personnel can delete assessments" 
ON public.dementia_risk_assessments 
FOR DELETE 
USING (
  auth.role() = 'authenticated' 
  AND (auth.jwt() ->> 'role') = 'service_role'
);

-- Ensure RLS remains enabled for this critical medical data
ALTER TABLE public.dementia_risk_assessments ENABLE ROW LEVEL SECURITY;