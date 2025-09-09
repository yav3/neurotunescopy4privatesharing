-- Create function to clean up track titles based on filenames
CREATE OR REPLACE FUNCTION clean_track_title_from_filename(storage_key text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    filename text;
    cleaned_title text;
BEGIN
    -- Extract filename from storage path
    filename := SPLIT_PART(storage_key, '/', -1);
    -- Remove file extension
    filename := SPLIT_PART(filename, '.', 1);
    -- Replace underscores and hyphens with spaces
    cleaned_title := REPLACE(REPLACE(filename, '_', ' '), '-', ' ');
    -- Clean up multiple spaces
    cleaned_title := REGEXP_REPLACE(cleaned_title, '\s+', ' ', 'g');
    -- Capitalize first letter of each word
    cleaned_title := INITCAP(TRIM(cleaned_title));
    
    RETURN cleaned_title;
END;
$$;

-- Update tracks with generic titles to use filename-based titles
UPDATE tracks 
SET title = clean_track_title_from_filename(storage_key),
    updated_at = NOW()
WHERE (title LIKE 'Contemplations of the Universe%' 
   OR title IS NULL 
   OR title = '')
   AND storage_key IS NOT NULL;

-- Create index for better title search performance
CREATE INDEX IF NOT EXISTS idx_tracks_title_search ON tracks USING gin(to_tsvector('english', title));

-- Add comment explaining the cleanup
COMMENT ON FUNCTION clean_track_title_from_filename IS 'Generates human-readable track titles from storage filenames by removing file extensions, replacing separators with spaces, and applying proper capitalization.';