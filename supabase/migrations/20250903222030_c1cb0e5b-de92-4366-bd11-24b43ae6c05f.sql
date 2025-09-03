-- Add durability columns for self-healing audio verification
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS audio_status text
    CHECK (audio_status IN ('working','missing','unknown')) DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_error text;

-- Ensure storage columns exist
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS storage_bucket text,
  ADD COLUMN IF NOT EXISTS storage_key text;

-- Unique guard on the object mapping (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_track_storage
  ON public.tracks (lower(coalesce(storage_bucket,'')), lower(storage_key))
  WHERE storage_key IS NOT NULL;

-- Function to reset verification when storage path changes
CREATE OR REPLACE FUNCTION mark_unknown_on_key_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (coalesce(NEW.storage_key,'') IS DISTINCT FROM coalesce(OLD.storage_key,'')
      OR coalesce(NEW.storage_bucket,'') IS DISTINCT FROM coalesce(OLD.storage_bucket,'')) THEN
    NEW.audio_status := 'unknown';
    NEW.last_verified_at := NULL;
    NEW.last_error := NULL;
  END IF;
  RETURN NEW;
END $$;

-- Create trigger for automatic status reset on path changes
DROP TRIGGER IF EXISTS trg_tracks_key_change ON public.tracks;
CREATE TRIGGER trg_tracks_key_change
BEFORE UPDATE OF storage_key, storage_bucket ON public.tracks
FOR EACH ROW EXECUTE FUNCTION mark_unknown_on_key_change();