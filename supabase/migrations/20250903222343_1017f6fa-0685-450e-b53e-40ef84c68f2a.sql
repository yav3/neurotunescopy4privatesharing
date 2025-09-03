-- Add missing columns and trigger for auto-reset when storage paths change
ALTER TABLE public.tracks 
  ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_error text;

-- Create function to reset status when storage paths change
CREATE OR REPLACE FUNCTION mark_unknown_on_key_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (coalesce(NEW.storage_key,'') IS DISTINCT FROM coalesce(OLD.storage_key,'')
      OR coalesce(NEW.storage_bucket,'') IS DISTINCT FROM coalesce(OLD.storage_bucket,'')) THEN
    NEW.audio_status := 'unknown';
    NEW.last_verified_at := NULL;
    NEW.last_error := NULL;
  END IF;
  RETURN NEW;
END $$;

-- Create trigger to auto-reset status on path changes
DROP TRIGGER IF EXISTS trg_tracks_key_change ON public.tracks;
CREATE TRIGGER trg_tracks_key_change
  BEFORE UPDATE OF storage_key, storage_bucket ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION mark_unknown_on_key_change();