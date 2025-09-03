-- Add storage mapping columns for deterministic streaming
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS storage_bucket TEXT;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS storage_key TEXT;

-- Backfill storage_key from existing data
UPDATE public.tracks
SET storage_key = COALESCE(storage_key, file_path, file_name)
WHERE storage_key IS NULL;

-- Set storage_bucket for existing tracks to neuralpositivemusic (main bucket)
UPDATE public.tracks 
SET storage_bucket = 'neuralpositivemusic'
WHERE storage_bucket IS NULL AND storage_key IS NOT NULL;

-- Prevent duplicates (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_track_storage
ON public.tracks (LOWER(COALESCE(storage_bucket,'')), LOWER(storage_key))
WHERE storage_key IS NOT NULL;