-- Add indexes for better playlist query performance on existing columns only
CREATE INDEX IF NOT EXISTS idx_tracks_genre_lower ON tracks (LOWER(genre));
CREATE INDEX IF NOT EXISTS idx_tracks_mood_lower ON tracks (LOWER(mood));

-- Index for storage_key filtering (frequently used in queries)
CREATE INDEX IF NOT EXISTS idx_tracks_storage_key ON tracks (storage_key) WHERE storage_key IS NOT NULL AND storage_key != '';