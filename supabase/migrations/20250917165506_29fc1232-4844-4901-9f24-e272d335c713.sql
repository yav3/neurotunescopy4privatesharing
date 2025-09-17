-- Create function to normalize file names for a specific bucket
CREATE OR REPLACE FUNCTION public.populate_bucket_repair_map(_bucket_name text)
RETURNS TABLE(total_unsafe_keys integer, sample_mappings jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  unsafe_count integer;
  sample_data jsonb;
BEGIN
  -- Clear existing repair map for this bucket
  DELETE FROM public.repair_map WHERE storage_bucket = _bucket_name;
  
  -- Get storage objects that need renaming from the specified bucket
  INSERT INTO public.repair_map (id, storage_bucket, old_key, new_key)
  SELECT 
    gen_random_uuid(),
    _bucket_name,
    so.name,
    public.safe_key(so.name) || 
    CASE 
      WHEN so.name LIKE '%.mp3' THEN ''
      ELSE '.mp3'
    END as new_key
  FROM storage.objects so
  WHERE so.bucket_id = _bucket_name
    AND so.name IS NOT NULL
    AND so.name != ''
    AND (
      -- Contains unsafe characters (not lowercase alphanumeric, dots, underscores, hyphens)
      so.name ~ '[^a-z0-9._/-]'
      -- Too long (over 80 characters)
      OR length(so.name) > 80
      -- Contains uppercase letters
      OR so.name ~ '[A-Z]'
      -- Contains spaces
      OR so.name LIKE '% %'
      -- Contains problematic characters
      OR so.name ~ '[;,()&+=\[\]{}|\\:";''<>?*]'
    );
  
  -- Get count and sample data
  SELECT COUNT(*) INTO unsafe_count FROM public.repair_map WHERE storage_bucket = _bucket_name;
  
  -- Get sample mappings for review
  SELECT jsonb_agg(
    jsonb_build_object(
      'old_name', old_key,
      'new_name', new_key
    )
  ) INTO sample_data
  FROM (
    SELECT old_key, new_key 
    FROM public.repair_map 
    WHERE storage_bucket = _bucket_name
    LIMIT 10
  ) sample;
  
  RETURN QUERY SELECT unsafe_count, COALESCE(sample_data, '[]'::jsonb);
END;
$$;

-- Create function to get repair status for a bucket
CREATE OR REPLACE FUNCTION public.get_bucket_repair_status(_bucket_name text)
RETURNS TABLE(
  total_files integer,
  files_needing_repair integer, 
  files_repaired integer,
  sample_repairs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  total_count integer;
  repair_needed integer;
  repaired_count integer;
  sample_data jsonb;
BEGIN
  -- Count total files in bucket
  SELECT COUNT(*) INTO total_count 
  FROM storage.objects 
  WHERE bucket_id = _bucket_name;
  
  -- Count files needing repair
  SELECT COUNT(*) INTO repair_needed 
  FROM public.repair_map 
  WHERE storage_bucket = _bucket_name AND status = 'pending';
  
  -- Count files already repaired
  SELECT COUNT(*) INTO repaired_count 
  FROM public.repair_map 
  WHERE storage_bucket = _bucket_name AND status = 'completed';
  
  -- Get sample repairs
  SELECT jsonb_agg(
    jsonb_build_object(
      'old_name', old_key,
      'new_name', new_key,
      'status', status
    )
  ) INTO sample_data
  FROM (
    SELECT old_key, new_key, status
    FROM public.repair_map 
    WHERE storage_bucket = _bucket_name
    ORDER BY created_at DESC
    LIMIT 5
  ) sample;
  
  RETURN QUERY SELECT 
    total_count, 
    repair_needed, 
    repaired_count, 
    COALESCE(sample_data, '[]'::jsonb);
END;
$$;