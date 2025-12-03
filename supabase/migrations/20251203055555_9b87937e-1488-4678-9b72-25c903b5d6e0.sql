-- Drop all functions that need search_path fix
DROP FUNCTION IF EXISTS public.sync_hiit_storage();
DROP FUNCTION IF EXISTS public.handle_hiit_file_upload();

-- Recreate with search_path
CREATE FUNCTION public.handle_hiit_file_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN NEW;
END;
$$;

CREATE FUNCTION public.sync_hiit_storage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RAISE NOTICE 'HIIT storage sync placeholder';
END;
$$;