-- Add comprehensive analysis columns to tracks table for detailed audio analysis
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS key_confidence NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS onset_rate NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS spectral_centroid NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS spectral_rolloff NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS spectral_bandwidth NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS zero_crossing_rate NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS loudness_lufs NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS dynamic_complexity NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS roughness NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS mood_happy NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS mood_sad NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS mood_aggressive NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS mood_relaxed NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS mood_acoustic NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS mood_electronic NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS pitch_mean NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS tuning_frequency NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS inharmonicity NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS rms_energy NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS dynamic_range NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS crest_factor NUMERIC;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS comprehensive_analysis JSONB;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS analysis_timestamp TIMESTAMP;
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS analysis_version TEXT;

-- Create indexes for performance on the new analysis fields
CREATE INDEX IF NOT EXISTS idx_tracks_camelot ON tracks(camelot) WHERE camelot IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracks_bpm ON tracks(bpm) WHERE bpm IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracks_key ON tracks(key) WHERE key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracks_mood_analysis ON tracks(mood_happy, mood_sad, mood_relaxed, mood_aggressive);
CREATE INDEX IF NOT EXISTS idx_tracks_comprehensive ON tracks USING gin(comprehensive_analysis);
CREATE INDEX IF NOT EXISTS idx_tracks_spectral ON tracks(spectral_centroid, spectral_rolloff) WHERE spectral_centroid IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracks_psychoacoustic ON tracks(loudness_lufs, dynamic_complexity, roughness) WHERE loudness_lufs IS NOT NULL;