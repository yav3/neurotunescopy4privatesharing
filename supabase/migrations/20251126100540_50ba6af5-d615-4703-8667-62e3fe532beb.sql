-- Create trial_requests table to store free business trial signups
CREATE TABLE IF NOT EXISTS public.trial_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  employee_count TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- Add index for faster lookups by email and status
CREATE INDEX IF NOT EXISTS idx_trial_requests_email ON public.trial_requests(email);
CREATE INDEX IF NOT EXISTS idx_trial_requests_status ON public.trial_requests(status);
CREATE INDEX IF NOT EXISTS idx_trial_requests_created_at ON public.trial_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all trial requests
CREATE POLICY "Admins can view all trial requests"
  ON public.trial_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Allow public inserts for trial signups
CREATE POLICY "Anyone can create trial requests"
  ON public.trial_requests
  FOR INSERT
  WITH CHECK (true);

-- Allow admins to update trial requests
CREATE POLICY "Admins can update trial requests"
  ON public.trial_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );