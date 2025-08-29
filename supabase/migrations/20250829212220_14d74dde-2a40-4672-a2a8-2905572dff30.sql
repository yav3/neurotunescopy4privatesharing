-- A) Add canonical storage_key column and backfill from file_path
ALTER TABLE public.music_tracks ADD COLUMN IF NOT EXISTS storage_key text;
UPDATE public.music_tracks SET storage_key = COALESCE(storage_key, file_path) WHERE storage_key IS NULL;