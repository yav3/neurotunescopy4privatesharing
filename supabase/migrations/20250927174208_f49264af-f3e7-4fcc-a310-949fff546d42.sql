-- Create a function to analyze session tracking coverage and identify users without sessions
CREATE OR REPLACE FUNCTION public.analyze_session_coverage()
RETURNS TABLE(
  analysis_type text,
  count_value integer,
  percentage numeric,
  details text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_users integer;
  users_with_sessions integer;
  recent_users integer;
  recent_users_with_sessions integer;
BEGIN
  -- Get total user counts
  SELECT COUNT(*) INTO total_users FROM auth.users;
  
  SELECT COUNT(DISTINCT user_id) INTO users_with_sessions 
  FROM listening_sessions 
  WHERE user_id IS NOT NULL;
  
  -- Get recent activity (last 7 days)
  SELECT COUNT(DISTINCT u.id) INTO recent_users 
  FROM auth.users u 
  WHERE u.last_sign_in_at >= NOW() - INTERVAL '7 days';
  
  SELECT COUNT(DISTINCT ls.user_id) INTO recent_users_with_sessions 
  FROM listening_sessions ls
  JOIN auth.users u ON u.id = ls.user_id
  WHERE ls.created_at >= NOW() - INTERVAL '7 days'
    AND u.last_sign_in_at >= NOW() - INTERVAL '7 days';
  
  -- Return analysis results
  RETURN QUERY VALUES
    ('total_users', total_users, 100.0, 'Total registered users'),
    ('users_with_sessions', users_with_sessions, 
     CASE WHEN total_users > 0 THEN ROUND((users_with_sessions::numeric / total_users * 100), 2) ELSE 0 END,
     'Users who have at least one listening session'),
    ('users_without_sessions', total_users - users_with_sessions,
     CASE WHEN total_users > 0 THEN ROUND(((total_users - users_with_sessions)::numeric / total_users * 100), 2) ELSE 0 END,
     'Users who have never had a listening session recorded'),
    ('recent_active_users', recent_users, 
     CASE WHEN total_users > 0 THEN ROUND((recent_users::numeric / total_users * 100), 2) ELSE 0 END,
     'Users who signed in within the last 7 days'),
    ('recent_users_with_sessions', recent_users_with_sessions,
     CASE WHEN recent_users > 0 THEN ROUND((recent_users_with_sessions::numeric / recent_users * 100), 2) ELSE 0 END,
     'Recent active users who have listening sessions');
END;
$$;

-- Create a function to identify users who should have sessions but don't
CREATE OR REPLACE FUNCTION public.find_users_without_sessions()
RETURNS TABLE(
  user_id uuid,
  email text,
  last_sign_in_at timestamp with time zone,
  created_at timestamp with time zone,
  days_since_signup integer,
  has_profile boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id as user_id,
    u.email,
    u.last_sign_in_at,
    u.created_at,
    EXTRACT(days FROM NOW() - u.created_at)::integer as days_since_signup,
    (p.user_id IS NOT NULL) as has_profile
  FROM auth.users u
  LEFT JOIN profiles p ON p.user_id = u.id
  LEFT JOIN listening_sessions ls ON ls.user_id = u.id
  WHERE ls.user_id IS NULL  -- No listening sessions
    AND u.last_sign_in_at IS NOT NULL  -- Has signed in at least once
    AND u.created_at <= NOW() - INTERVAL '1 day'  -- Account older than 1 day
  ORDER BY u.last_sign_in_at DESC NULLS LAST;
$$;

-- Create a monitoring function for session data quality
CREATE OR REPLACE FUNCTION public.session_data_quality_check()
RETURNS TABLE(
  check_type text,
  issue_count integer,
  total_sessions integer,
  percentage numeric,
  description text
)
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
DECLARE
  total_count integer;
BEGIN
  -- Get total session count
  SELECT COUNT(*) INTO total_count FROM listening_sessions;
  
  -- Check for various data quality issues
  RETURN QUERY VALUES
    ('null_user_id', 
     (SELECT COUNT(*)::integer FROM listening_sessions WHERE user_id IS NULL),
     total_count,
     CASE WHEN total_count > 0 THEN ROUND(((SELECT COUNT(*) FROM listening_sessions WHERE user_id IS NULL)::numeric / total_count * 100), 2) ELSE 0 END,
     'Sessions without user_id'),
     
    ('null_patient_id',
     (SELECT COUNT(*)::integer FROM listening_sessions WHERE patient_id IS NULL),
     total_count, 
     CASE WHEN total_count > 0 THEN ROUND(((SELECT COUNT(*) FROM listening_sessions WHERE patient_id IS NULL)::numeric / total_count * 100), 2) ELSE 0 END,
     'Sessions without patient_id (using fallback mode)'),
     
    ('zero_duration',
     (SELECT COUNT(*)::integer FROM listening_sessions WHERE session_duration_minutes = 0 OR session_duration_minutes IS NULL),
     total_count,
     CASE WHEN total_count > 0 THEN ROUND(((SELECT COUNT(*) FROM listening_sessions WHERE session_duration_minutes = 0 OR session_duration_minutes IS NULL)::numeric / total_count * 100), 2) ELSE 0 END,
     'Sessions with zero or null duration'),
     
    ('no_tracks_played',
     (SELECT COUNT(*)::integer FROM listening_sessions WHERE tracks_played = 0 OR tracks_played IS NULL),
     total_count,
     CASE WHEN total_count > 0 THEN ROUND(((SELECT COUNT(*) FROM listening_sessions WHERE tracks_played = 0 OR tracks_played IS NULL)::numeric / total_count * 100), 2) ELSE 0 END,
     'Sessions with no tracks recorded'),
     
    ('high_skip_rate',
     (SELECT COUNT(*)::integer FROM listening_sessions WHERE skip_rate > 0.8),
     total_count,
     CASE WHEN total_count > 0 THEN ROUND(((SELECT COUNT(*) FROM listening_sessions WHERE skip_rate > 0.8)::numeric / total_count * 100), 2) ELSE 0 END,
     'Sessions with very high skip rate (>80%)');
END;
$$;