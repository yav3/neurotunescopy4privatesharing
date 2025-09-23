-- Fix RLS Disabled security vulnerabilities
-- Enable Row Level Security on all unprotected public tables

-- Enable RLS on staging and backup tables
ALTER TABLE public.staging_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staging_repair ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_name_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks_backup_2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks_id_mapping ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies for staging and backup tables
-- These should only be accessible by service role and authorized administrators

-- Staging files policies
CREATE POLICY "Service role can manage staging files"
ON public.staging_files FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view staging files"
ON public.staging_files FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'super_admin')
));

-- Staging repair policies
CREATE POLICY "Service role can manage staging repair"
ON public.staging_repair FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view staging repair"
ON public.staging_repair FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'super_admin')
));

-- Storage name backup policies
CREATE POLICY "Service role can manage storage backup"
ON public.storage_name_backup FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view storage backup"
ON public.storage_name_backup FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'super_admin')
));

-- Tracks backup policies
CREATE POLICY "Service role can manage tracks backup"
ON public.tracks_backup FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view tracks backup"
ON public.tracks_backup FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'super_admin')
));

-- Tracks backup 2 policies
CREATE POLICY "Service role can manage tracks backup 2"
ON public.tracks_backup_2 FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view tracks backup 2"
ON public.tracks_backup_2 FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'super_admin')
));

-- Tracks ID mapping policies
CREATE POLICY "Service role can manage tracks mapping"
ON public.tracks_id_mapping FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Admins can view tracks mapping"
ON public.tracks_id_mapping FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('admin', 'super_admin')
));