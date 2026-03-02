
-- ============================================================
-- Fix all remaining permissive RLS policies
-- ============================================================

-- api_key_usage
DROP POLICY IF EXISTS "Service role inserts usage" ON public.api_key_usage;
CREATE POLICY "Admins can insert api_key_usage" ON public.api_key_usage
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- diagnostic_devices
DROP POLICY IF EXISTS "Service insert diagnostic_devices" ON public.diagnostic_devices;
DROP POLICY IF EXISTS "Service update diagnostic_devices" ON public.diagnostic_devices;
CREATE POLICY "Admins can insert diagnostic_devices" ON public.diagnostic_devices
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update diagnostic_devices" ON public.diagnostic_devices
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- diagnostic_market_segments
DROP POLICY IF EXISTS "Service insert diagnostic_market_segments" ON public.diagnostic_market_segments;
DROP POLICY IF EXISTS "Service update diagnostic_market_segments" ON public.diagnostic_market_segments;
CREATE POLICY "Admins can insert diagnostic_market_segments" ON public.diagnostic_market_segments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update diagnostic_market_segments" ON public.diagnostic_market_segments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- diagnostic_protocols
DROP POLICY IF EXISTS "Service insert diagnostic_protocols" ON public.diagnostic_protocols;
DROP POLICY IF EXISTS "Service update diagnostic_protocols" ON public.diagnostic_protocols;
CREATE POLICY "Admins can insert diagnostic_protocols" ON public.diagnostic_protocols
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update diagnostic_protocols" ON public.diagnostic_protocols
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- diagnostic_test_disease_mapping
DROP POLICY IF EXISTS "Service insert diagnostic_test_disease_mapping" ON public.diagnostic_test_disease_mapping;
CREATE POLICY "Admins can insert diagnostic_test_disease_mapping" ON public.diagnostic_test_disease_mapping
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- diagnostic_tests
DROP POLICY IF EXISTS "Service insert diagnostic_tests" ON public.diagnostic_tests;
DROP POLICY IF EXISTS "Service update diagnostic_tests" ON public.diagnostic_tests;
CREATE POLICY "Admins can insert diagnostic_tests" ON public.diagnostic_tests
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update diagnostic_tests" ON public.diagnostic_tests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- disease_biomarker_endpoints
DROP POLICY IF EXISTS "Authenticated insert for disease_biomarker_endpoints" ON public.disease_biomarker_endpoints;
DROP POLICY IF EXISTS "Authenticated update for disease_biomarker_endpoints" ON public.disease_biomarker_endpoints;
CREATE POLICY "Admins can insert disease_biomarker_endpoints" ON public.disease_biomarker_endpoints
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update disease_biomarker_endpoints" ON public.disease_biomarker_endpoints
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- fda_approved_drugs
DROP POLICY IF EXISTS "Authenticated users can insert FDA drugs" ON public.fda_approved_drugs;
DROP POLICY IF EXISTS "Authenticated users can update FDA drugs" ON public.fda_approved_drugs;
CREATE POLICY "Admins can insert fda_approved_drugs" ON public.fda_approved_drugs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update fda_approved_drugs" ON public.fda_approved_drugs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- disease_ontology
DROP POLICY IF EXISTS "Auth users can insert diseases" ON public.disease_ontology;
DROP POLICY IF EXISTS "Auth users can update diseases" ON public.disease_ontology;
CREATE POLICY "Admins can insert disease_ontology" ON public.disease_ontology
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update disease_ontology" ON public.disease_ontology
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- pipeline_drugs
DROP POLICY IF EXISTS "Auth users can insert pipeline" ON public.pipeline_drugs;
DROP POLICY IF EXISTS "Auth users can update pipeline" ON public.pipeline_drugs;
CREATE POLICY "Admins can insert pipeline_drugs" ON public.pipeline_drugs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update pipeline_drugs" ON public.pipeline_drugs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- therapeutic_sessions
DROP POLICY IF EXISTS "Allow public insert on therapeutic_sessions" ON public.therapeutic_sessions;
CREATE POLICY "Authenticated insert therapeutic_sessions" ON public.therapeutic_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- track_analytics
DROP POLICY IF EXISTS "Allow public insert on track_analytics" ON public.track_analytics;
CREATE POLICY "Authenticated insert track_analytics" ON public.track_analytics
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- tracks
DROP POLICY IF EXISTS "Allow public insert to tracks" ON public.tracks;
CREATE POLICY "Admins can insert tracks" ON public.tracks
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- dataset_worker_jobs
DROP POLICY IF EXISTS "Service role full access" ON public.dataset_worker_jobs;
CREATE POLICY "Admins can manage dataset_worker_jobs" ON public.dataset_worker_jobs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- email_rate_limits: remove blocking policy
DROP POLICY IF EXISTS "Only service role can access email_rate_limits" ON public.email_rate_limits;

-- npiq_conversations
DROP POLICY IF EXISTS "Authenticated users can insert conversations" ON public.npiq_conversations;
CREATE POLICY "Users can insert own conversations" ON public.npiq_conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- streaming_analytics
DROP POLICY IF EXISTS "Authenticated users can insert streaming_analytics" ON public.streaming_analytics;
CREATE POLICY "Authenticated insert streaming_analytics" ON public.streaming_analytics
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- trial_requests: intentionally public for enrollment, but narrow to anon+authenticated
DROP POLICY IF EXISTS "Anyone can create trial requests" ON public.trial_requests;
CREATE POLICY "Public can create trial requests" ON public.trial_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
