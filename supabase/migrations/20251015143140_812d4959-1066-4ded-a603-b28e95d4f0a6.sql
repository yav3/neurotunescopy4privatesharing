-- Create a function to get detailed diagnostics for unplayable tracks
CREATE OR REPLACE FUNCTION public.get_unplayable_tracks_diagnostic()
RETURNS TABLE(
  track_id uuid,
  title text,
  storage_bucket text,
  storage_key text,
  audio_status text,
  last_error text,
  last_verified_at timestamptz,
  created_at timestamptz,
  issue_category text,
  issue_description text,
  suggested_fix text,
  days_broken integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as track_id,
    t.title,
    t.storage_bucket,
    t.storage_key,
    t.audio_status,
    t.last_error,
    t.last_verified_at,
    t.created_at,
    -- Categorize the issue
    CASE 
      WHEN t.storage_key IS NULL OR t.storage_key = '' THEN 'missing_metadata'
      WHEN t.storage_bucket IS NULL THEN 'missing_bucket'
      WHEN t.audio_status = 'missing' THEN 'file_not_found'
      WHEN t.audio_status = 'problematic' THEN 'file_corrupted'
      WHEN t.audio_status = 'unknown' AND t.last_verified_at IS NULL THEN 'never_verified'
      WHEN t.audio_status = 'unknown' THEN 'needs_reverification'
      ELSE 'other'
    END as issue_category,
    -- Provide detailed description
    CASE 
      WHEN t.storage_key IS NULL OR t.storage_key = '' THEN 'Track record missing storage_key field'
      WHEN t.storage_bucket IS NULL THEN 'Track record missing storage_bucket field'
      WHEN t.audio_status = 'missing' AND t.last_error LIKE '%404%' THEN 'File not found in storage (404 error)'
      WHEN t.audio_status = 'missing' THEN 'File not accessible in storage'
      WHEN t.audio_status = 'problematic' THEN 'File exists but cannot be played (corrupted or wrong format)'
      WHEN t.audio_status = 'unknown' AND t.last_verified_at IS NULL THEN 'Track has never been verified since creation'
      WHEN t.audio_status = 'unknown' THEN 'Track status uncertain, needs verification'
      ELSE COALESCE(t.last_error, 'Unknown issue')
    END as issue_description,
    -- Suggest fixes
    CASE 
      WHEN t.storage_key IS NULL OR t.storage_key = '' THEN 'Update track record with correct storage_key'
      WHEN t.storage_bucket IS NULL THEN 'Update track record with correct storage_bucket'
      WHEN t.audio_status = 'missing' THEN 'Check if file exists in alternate bucket or re-upload file'
      WHEN t.audio_status = 'problematic' THEN 'Re-encode audio file or replace with working version'
      WHEN t.audio_status = 'unknown' THEN 'Run verification to determine actual status'
      ELSE 'Manual investigation required'
    END as suggested_fix,
    -- Calculate days broken
    CASE 
      WHEN t.last_verified_at IS NOT NULL THEN 
        EXTRACT(days FROM NOW() - t.last_verified_at)::integer
      ELSE
        EXTRACT(days FROM NOW() - t.created_at)::integer
    END as days_broken
  FROM tracks t
  WHERE t.audio_status != 'working'
    OR t.storage_key IS NULL 
    OR t.storage_key = ''
    OR t.storage_bucket IS NULL
  ORDER BY 
    -- Prioritize by severity and age
    CASE 
      WHEN t.storage_key IS NULL OR t.storage_key = '' THEN 1
      WHEN t.storage_bucket IS NULL THEN 2
      WHEN t.audio_status = 'missing' THEN 3
      WHEN t.audio_status = 'problematic' THEN 4
      ELSE 5
    END,
    t.last_verified_at DESC NULLS FIRST;
END;
$$;

-- Create a summary statistics function
CREATE OR REPLACE FUNCTION public.get_unplayable_tracks_summary()
RETURNS TABLE(
  total_unplayable integer,
  missing_metadata integer,
  missing_bucket integer,
  file_not_found integer,
  file_corrupted integer,
  never_verified integer,
  needs_reverification integer,
  oldest_issue_days integer,
  by_bucket jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  bucket_stats jsonb;
BEGIN
  -- Get bucket-level statistics
  SELECT jsonb_object_agg(
    COALESCE(storage_bucket, 'no_bucket'),
    count
  ) INTO bucket_stats
  FROM (
    SELECT 
      storage_bucket,
      COUNT(*)::integer as count
    FROM tracks
    WHERE audio_status != 'working'
      OR storage_key IS NULL 
      OR storage_key = ''
      OR storage_bucket IS NULL
    GROUP BY storage_bucket
  ) bucket_counts;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE audio_status != 'working' 
       OR storage_key IS NULL 
       OR storage_key = ''
       OR storage_bucket IS NULL) as total_unplayable,
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE storage_key IS NULL OR storage_key = '') as missing_metadata,
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE storage_bucket IS NULL) as missing_bucket,
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE audio_status = 'missing') as file_not_found,
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE audio_status = 'problematic') as file_corrupted,
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE audio_status = 'unknown' AND last_verified_at IS NULL) as never_verified,
    (SELECT COUNT(*)::integer FROM tracks 
     WHERE audio_status = 'unknown' AND last_verified_at IS NOT NULL) as needs_reverification,
    (SELECT MAX(EXTRACT(days FROM NOW() - COALESCE(last_verified_at, created_at)))::integer
     FROM tracks 
     WHERE audio_status != 'working') as oldest_issue_days,
    COALESCE(bucket_stats, '{}'::jsonb) as by_bucket;
END;
$$;