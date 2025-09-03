-- Add audio_status column to track which files actually work
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS audio_status text
  CHECK (audio_status IN ('working','missing','unknown')) DEFAULT 'unknown';

-- Index for fast filtering
CREATE INDEX IF NOT EXISTS idx_tracks_audio_status ON public.tracks(audio_status);