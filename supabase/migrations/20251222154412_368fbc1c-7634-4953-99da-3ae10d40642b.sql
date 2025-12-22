-- Create audit log table if not exists
CREATE TABLE IF NOT EXISTS public.patient_access_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  accessed_by uuid NOT NULL,
  access_type text NOT NULL,
  table_accessed text NOT NULL,
  accessed_at timestamp with time zone DEFAULT now(),
  ip_address text,
  user_agent text,
  access_granted boolean NOT NULL DEFAULT true
);

-- Enable RLS on audit log
ALTER TABLE public.patient_access_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Only super admins can view audit logs" ON public.patient_access_audit_log;
DROP POLICY IF EXISTS "No direct modifications to audit logs" ON public.patient_access_audit_log;

-- Only super_admins can view audit logs
CREATE POLICY "Only super admins can view audit logs"
ON public.patient_access_audit_log
FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));

-- Create function to log patient access
CREATE OR REPLACE FUNCTION public.log_patient_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.patient_access_audit_log (
    patient_id,
    accessed_by,
    access_type,
    table_accessed,
    access_granted
  ) VALUES (
    COALESCE(NEW.id, OLD.id, NEW.patient_id, OLD.patient_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    true
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for patient table write operations
DROP TRIGGER IF EXISTS audit_patient_access ON public.patients;
CREATE TRIGGER audit_patient_access
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.log_patient_access();

-- Strengthen patient_assignments policies
DROP POLICY IF EXISTS "Admins can manage patient assignments" ON public.patient_assignments;
DROP POLICY IF EXISTS "Only admins can view assignments" ON public.patient_assignments;
DROP POLICY IF EXISTS "Only super admins can create assignments" ON public.patient_assignments;
DROP POLICY IF EXISTS "Only super admins can update assignments" ON public.patient_assignments;
DROP POLICY IF EXISTS "Only super admins can delete assignments" ON public.patient_assignments;

CREATE POLICY "Authorized users can view their assignments"
ON public.patient_assignments
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin') 
  OR public.has_role(auth.uid(), 'super_admin')
  OR assigned_user_id = auth.uid()
);

CREATE POLICY "Only super admins can create assignments"
ON public.patient_assignments
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only super admins can update assignments"
ON public.patient_assignments
FOR UPDATE
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Only super admins can delete assignments"
ON public.patient_assignments
FOR DELETE
USING (public.has_role(auth.uid(), 'super_admin'));

-- Log assignment changes
DROP TRIGGER IF EXISTS audit_assignment_changes ON public.patient_assignments;
CREATE TRIGGER audit_assignment_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.patient_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.log_patient_access();

-- Create indexes for faster audit queries
CREATE INDEX IF NOT EXISTS idx_patient_audit_patient_id ON public.patient_access_audit_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_audit_accessed_by ON public.patient_access_audit_log(accessed_by);
CREATE INDEX IF NOT EXISTS idx_patient_audit_accessed_at ON public.patient_access_audit_log(accessed_at DESC);