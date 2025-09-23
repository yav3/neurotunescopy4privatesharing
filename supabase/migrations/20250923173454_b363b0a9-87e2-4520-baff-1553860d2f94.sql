-- Insert sample listening session data for the current user
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
('b0105041-3b1b-4a34-8822-16afcd08de71', NOW(), 25, 5, 0.1, ARRAY['Classical', 'Ambient'], 
 '{"start": 6, "end": 8, "improvement": 2}'::jsonb, 7.2),

-- Yesterday's session  
('b0105041-3b1b-4a34-8822-16afcd08de71', NOW() - INTERVAL '1 day', 20, 4, 0.05, ARRAY['New Age', 'Nature'], 
 '{"start": 5, "end": 7, "improvement": 2}'::jsonb, 6.8),

-- 2 days ago
('b0105041-3b1b-4a34-8822-16afcd08de71', NOW() - INTERVAL '2 days', 30, 6, 0.15, ARRAY['Classical', 'Meditation'], 
 '{"start": 4, "end": 7, "improvement": 3}'::jsonb, 8.1),

-- 3 days ago
('b0105041-3b1b-4a34-8822-16afcd08de71', NOW() - INTERVAL '3 days', 18, 3, 0.0, ARRAY['Ambient', 'Focus'], 
 '{"start": 6, "end": 8, "improvement": 2}'::jsonb, 7.5),

-- 5 days ago
('b0105041-3b1b-4a34-8822-16afcd08de71', NOW() - INTERVAL '5 days', 22, 4, 0.08, ARRAY['Nature', 'Healing'], 
 '{"start": 5, "end": 8, "improvement": 3}'::jsonb, 6.9),

-- Last week
('b0105041-3b1b-4a34-8822-16afcd08de71', NOW() - INTERVAL '7 days', 15, 3, 0.2, ARRAY['World', 'Ethnic'], 
 '{"start": 4, "end": 6, "improvement": 2}'::jsonb, 5.8);