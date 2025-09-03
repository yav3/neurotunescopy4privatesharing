-- Add performance indexes for faster playlist queries
CREATE INDEX IF NOT EXISTS idx_tracks_mood_lower ON tracks (LOWER(mood));
CREATE INDEX IF NOT EXISTS idx_tracks_genre_lower ON tracks (LOWER(genre));