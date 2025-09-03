-- Add comprehensive audio analysis columns to tracks table
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS 
  key TEXT,
  camelot TEXT,
  tempo_bpm REAL,
  scale TEXT,
  key_strength REAL,
  danceability_score REAL,
  mood_scores JSONB,
  spectral_features JSONB,
  harmonic_features JSONB,
  rhythmic_features JSONB,
  psychoacoustic_features JSONB,
  tonal_features JSONB,
  dynamic_features JSONB,
  structural_features JSONB,
  comprehensive_analysis JSONB,
  analysis_version TEXT DEFAULT 'v1.0',
  analyzed_at TIMESTAMP WITH TIME ZONE;

-- Create index for key-based searches
CREATE INDEX IF NOT EXISTS idx_tracks_camelot ON tracks(camelot);
CREATE INDEX IF NOT EXISTS idx_tracks_key ON tracks(key);
CREATE INDEX IF NOT EXISTS idx_tracks_tempo ON tracks(tempo_bpm);
CREATE INDEX IF NOT EXISTS idx_tracks_danceability ON tracks(danceability_score);

-- Create function to get harmonic neighbors for Camelot wheel
CREATE OR REPLACE FUNCTION get_camelot_neighbors(input_camelot TEXT)
RETURNS TEXT[] AS $$
DECLARE
  camelot_wheel JSONB := '{
    "1A": ["12A", "2A", "1B"],
    "2A": ["1A", "3A", "2B"],
    "3A": ["2A", "4A", "3B"],
    "4A": ["3A", "5A", "4B"],
    "5A": ["4A", "6A", "5B"],
    "6A": ["5A", "7A", "6B"],
    "7A": ["6A", "8A", "7B"],
    "8A": ["7A", "9A", "8B"],
    "9A": ["8A", "10A", "9B"],
    "10A": ["9A", "11A", "10B"],
    "11A": ["10A", "12A", "11B"],
    "12A": ["11A", "1A", "12B"],
    "1B": ["12B", "2B", "1A"],
    "2B": ["1B", "3B", "2A"],
    "3B": ["2B", "4B", "3A"],
    "4B": ["3B", "5B", "4A"],
    "5B": ["4B", "6B", "5A"],
    "6B": ["5B", "7B", "6A"],
    "7B": ["6B", "8B", "7A"],
    "8B": ["7B", "9B", "8A"],
    "9B": ["8B", "10B", "9A"],
    "10B": ["9B", "11B", "10A"],
    "11B": ["10B", "12B", "11A"],
    "12B": ["11B", "1B", "12A"]
  }'::JSONB;
  neighbors JSONB;
BEGIN
  neighbors := camelot_wheel -> input_camelot;
  IF neighbors IS NULL THEN
    RETURN ARRAY[]::TEXT[];
  END IF;
  
  RETURN ARRAY(SELECT jsonb_array_elements_text(neighbors));
END;
$$ LANGUAGE plpgsql;