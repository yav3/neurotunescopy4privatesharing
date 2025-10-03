-- Fix RLS policy for listening_sessions to allow inserts by authenticated users
-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can insert own listening sessions" ON listening_sessions;

-- Create a more permissive policy that allows authenticated users to insert their own sessions
CREATE POLICY "Authenticated users can insert listening sessions"
ON listening_sessions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  OR auth.uid()::text = patient_id::text
  OR user_id = '00000000-0000-0000-0000-000000000001'::uuid
);