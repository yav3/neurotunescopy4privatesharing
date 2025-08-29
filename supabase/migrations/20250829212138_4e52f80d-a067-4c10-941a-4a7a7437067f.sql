-- A) Add canonical storage_key column and backfill from file_path
ALTER TABLE public.music_tracks ADD COLUMN IF NOT EXISTS storage_key text;
UPDATE public.music_tracks SET storage_key = COALESCE(storage_key, file_path) WHERE storage_key IS NULL;

-- B) Check for duplicates (case-insensitive) - this will help identify issues
-- Note: We'll handle duplicates after seeing the results

-- C) Create unique constraint to prevent future duplicates (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_music_tracks_storage_key
  ON public.music_tracks (lower(storage_key));

-- D) Add constraint to reject URL-encoded keys for cleaner storage
ALTER TABLE public.music_tracks
  ADD CONSTRAINT storage_key_not_urlencoded CHECK (position('%' in storage_key) = 0);