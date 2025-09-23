-- Fix RLS policies to allow users to see their own listening sessions
-- while maintaining medical data security

-- Drop the overly restrictive policies on listening_sessions
DROP POLICY IF EXISTS "Medical personnel can manage listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Medical personnel can view listening sessions" ON public.listening_sessions;

-- Create new policies that allow users to see their own data
CREATE POLICY "Users can view their own listening sessions"
ON public.listening_sessions FOR SELECT
USING (
  auth.uid() = user_id OR 
  auth.uid()::text = patient_id::text OR
  auth.uid()::text = (
    SELECT user_id::text FROM public.patients 
    WHERE external_patient_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert their own listening sessions"
ON public.listening_sessions FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  auth.uid()::text = patient_id::text OR
  auth.uid()::text = (
    SELECT user_id::text FROM public.patients 
    WHERE external_patient_id = auth.uid()::text
  )
);

-- Medical personnel can still manage all listening sessions
CREATE POLICY "Medical personnel can manage all listening sessions"
ON public.listening_sessions FOR ALL
USING (has_medical_access())
WITH CHECK (has_medical_access());

-- Service role maintains full access
CREATE POLICY "Service role can manage all listening sessions"
ON public.listening_sessions FOR ALL
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Insert some sample listening session data for the current user to demonstrate the profile functionality
DO $$
DECLARE
    current_user_id uuid := 'b0105041-3b1b-4a34-8822-16afcd08de71';
BEGIN
    -- Insert sample listening sessions for the past week
    INSERT INTO public.listening_sessions (
        user_id,
        session_date,
        session_duration_minutes,
        tracks_played,
        skip_rate,
        dominant_genres,
        mood_progression,
        average_complexity_score
    ) VALUES
    -- Today's session
    (current_user_id, NOW(), 25, 5, 0.1, ARRAY['Classical', 'Ambient'], 
     '{"start": 6, "end": 8, "improvement": 2}'::jsonb, 7.2),
    
    -- Yesterday's session  
    (current_user_id, NOW() - INTERVAL '1 day', 20, 4, 0.05, ARRAY['New Age', 'Nature'], 
     '{"start": 5, "end": 7, "improvement": 2}'::jsonb, 6.8),
    
    -- 2 days ago
    (current_user_id, NOW() - INTERVAL '2 days', 30, 6, 0.15, ARRAY['Classical', 'Meditation'], 
     '{"start": 4, "end": 7, "improvement": 3}'::jsonb, 8.1),
    
    -- 3 days ago
    (current_user_id, NOW() - INTERVAL '3 days', 18, 3, 0.0, ARRAY['Ambient', 'Focus'], 
     '{"start": 6, "end": 8, "improvement": 2}'::jsonb, 7.5),
    
    -- 5 days ago
    (current_user_id, NOW() - INTERVAL '5 days', 22, 4, 0.08, ARRAY['Nature', 'Healing'], 
     '{"start": 5, "end": 8, "improvement": 3}'::jsonb, 6.9);
END $$;