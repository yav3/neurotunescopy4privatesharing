-- Update the safe_key function to be much more conservative
-- Only normalize files with genuinely problematic characters
CREATE OR REPLACE FUNCTION public.safe_key(raw text)
RETURNS text
LANGUAGE sql
AS $function$
  -- Only replace genuinely problematic characters that cause URL/filesystem issues
  -- Keep spaces, capitalization, hyphens, underscores, dots, and slashes
  SELECT regexp_replace(raw, '[&+=\[\]{}|\\:";''<>?*%#]', '_', 'g');
$function$;

-- Update populate_bucket_repair_map to be much more conservative
CREATE OR REPLACE FUNCTION public.populate_bucket_repair_map(_bucket_name text)
RETURNS TABLE(total_unsafe_keys integer, sample_mappings jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  unsafe_count integer;
  sample_data jsonb;
BEGIN
  -- Clear existing repair map for this bucket
  DELETE FROM public.repair_map WHERE storage_bucket = _bucket_name;
  
  -- Only target files with genuinely problematic characters
  -- Keep spaces, capitals, hyphens, underscores, dots - these work fine with URL encoding
  INSERT INTO public.repair_map (id, storage_bucket, old_key, new_key)
  SELECT 
    gen_random_uuid(),
    _bucket_name,
    so.name,
    public.safe_key(so.name) as new_key
  FROM storage.objects so
  WHERE so.bucket_id = _bucket_name
    AND so.name IS NOT NULL
    AND so.name != ''
    AND (
      -- Only files with genuinely problematic characters that break URLs
      so.name ~ '[&+=\[\]{}|\\:";''<>?*%#]'
      -- Or files that are extremely long (over 100 characters)
      OR length(so.name) > 100
    )
    -- Only add to repair map if the safe version is actually different
    AND public.safe_key(so.name) != so.name;
  
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
$function$;