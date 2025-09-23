-- Drop all existing policies on listening_sessions table first
DROP POLICY IF EXISTS "Users can view their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can insert their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Medical personnel can manage all listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Service role can manage all listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Medical personnel can manage listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Medical personnel can view listening sessions" ON public.listening_sessions;

-- Create new policies that allow users to see their own data
CREATE POLICY "Users can view own listening sessions"
ON public.listening_sessions FOR SELECT
USING (
  auth.uid() = user_id OR 
  auth.uid()::text = patient_id::text
);

CREATE POLICY "Users can insert own listening sessions"
ON public.listening_sessions FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid()::text = patient_id::text
);

-- Medical personnel can still manage all listening sessions
CREATE POLICY "Medical access to all listening sessions"
ON public.listening_sessions FOR ALL
USING (has_medical_access())
WITH CHECK (has_medical_access());

-- Service role maintains full access
CREATE POLICY "Service role full access to listening sessions"
ON public.listening_sessions FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');