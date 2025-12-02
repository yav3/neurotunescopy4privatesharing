-- Drop the overly permissive public access policy on cognitive_biomarkers
DROP POLICY IF EXISTS "Public access to cognitive biomarkers" ON public.cognitive_biomarkers;