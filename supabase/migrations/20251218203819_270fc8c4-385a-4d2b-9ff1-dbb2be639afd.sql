-- Drop and recreate the generic_titled_tracks view with security_invoker = true
-- This ensures the view respects the RLS policies of the querying user, not the view creator

DROP VIEW IF EXISTS public.generic_titled_tracks;

CREATE VIEW public.generic_titled_tracks
WITH (security_invoker = true)
AS
SELECT 
    id,
    title,
    artist,
    file_path,
    bucket_name,
    created_at,
    CASE
        WHEN (title ~* 'audio[_\s]*\d+') THEN 'Contains "Audio" + number pattern'
        WHEN (title ~* 'track[_\s]*\d+') THEN 'Contains "Track" + number pattern'
        WHEN (title ~* '^[a-z]{1,3}\d+$') THEN 'Short code + number pattern'
        WHEN (title ~* 'untitled') THEN 'Contains "Untitled"'
        WHEN (title ~* '^file[_\s]*\d+') THEN 'Contains "File" + number pattern'
        WHEN ((length(title) < 10) AND (title ~ '^\d+')) THEN 'Very short title starting with numbers'
        ELSE 'Potentially generic title'
    END AS issue_type
FROM music_tracks
WHERE 
    (title ~* 'audio[_\s]*\d+') OR 
    (title ~* 'track[_\s]*\d+') OR 
    (title ~* '^[a-z]{1,3}\d+$') OR 
    (title ~* 'untitled') OR 
    (title ~* '^file[_\s]*\d+') OR 
    ((length(title) < 10) AND (title ~ '^\d+'));