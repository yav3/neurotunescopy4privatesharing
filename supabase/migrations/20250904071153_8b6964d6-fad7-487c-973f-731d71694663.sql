-- Canonical mapping + durability columns
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS storage_bucket text,
  ADD COLUMN IF NOT EXISTS storage_key text,
  ADD COLUMN IF NOT EXISTS audio_status text
    CHECK (audio_status IN ('working','missing','unknown')) DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_error text,

  -- Analysis outputs
  ADD COLUMN IF NOT EXISTS analysis_status text,                      -- 'pending'|'complete'|'error'
  ADD COLUMN IF NOT EXISTS last_analyzed_at timestamptz,
  ADD COLUMN IF NOT EXISTS format text,
  ADD COLUMN IF NOT EXISTS duration_sec numeric,
  ADD COLUMN IF NOT EXISTS sample_rate_hz int,
  ADD COLUMN IF NOT EXISTS channels int,
  ADD COLUMN IF NOT EXISTS bitrate_kbps int,
  ADD COLUMN IF NOT EXISTS loudness_lufs numeric,
  ADD COLUMN IF NOT EXISTS md5_hex text,
  ADD COLUMN IF NOT EXISTS bpm_est numeric,
  ADD COLUMN IF NOT EXISTS musical_key_est text;

-- Prevent future collisions by object path (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_track_storage
  ON public.tracks (lower(coalesce(storage_bucket,'')), lower(storage_key))
  WHERE storage_key IS NOT NULL;

-- Reset status when path changes (forces re-verify/re-analyze)
CREATE OR REPLACE FUNCTION mark_unknown_on_key_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (coalesce(NEW.storage_key,'') IS DISTINCT FROM coalesce(OLD.storage_key,'')
   OR coalesce(NEW.storage_bucket,'') IS DISTINCT FROM coalesce(OLD.storage_bucket,'')) THEN
    NEW.audio_status := 'unknown';
    NEW.last_verified_at := NULL;
    NEW.last_error := NULL;
    NEW.analysis_status := 'pending';
    NEW.last_analyzed_at := NULL;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_tracks_key_change ON public.tracks;
CREATE TRIGGER trg_tracks_key_change
BEFORE UPDATE OF storage_key, storage_bucket ON public.tracks
FOR EACH ROW EXECUTE FUNCTION mark_unknown_on_key_change();