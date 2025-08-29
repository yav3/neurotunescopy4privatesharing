-- Create therapeutic applications table if not exists
CREATE TABLE IF NOT EXISTS therapeutic_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES music_tracks(id) ON DELETE CASCADE,
  frequency_band_primary TEXT NOT NULL CHECK (frequency_band_primary IN ('delta', 'theta', 'alpha', 'beta', 'gamma')),
  frequency_band_secondary TEXT[] DEFAULT '{}',
  condition_targets TEXT[] DEFAULT '{}',
  anxiety_evidence_score REAL,
  depression_evidence_score REAL,
  pain_evidence_score REAL,
  focus_evidence_score REAL,
  sleep_evidence_score REAL,
  ptsd_evidence_score REAL,
  effect_size REAL,
  participant_count INTEGER,
  confidence_interval TEXT,
  supporting_studies TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on therapeutic_applications
ALTER TABLE therapeutic_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for therapeutic_applications
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'therapeutic_applications' AND policyname = 'Public read access to therapeutic applications') THEN
    CREATE POLICY "Public read access to therapeutic applications" 
    ON therapeutic_applications FOR SELECT 
    USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'therapeutic_applications' AND policyname = 'Service role can manage therapeutic applications') THEN
    CREATE POLICY "Service role can manage therapeutic applications" 
    ON therapeutic_applications FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Create spectral analysis table if not exists
CREATE TABLE IF NOT EXISTS spectral_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES music_tracks(id) ON DELETE CASCADE,
  delta_band_power REAL DEFAULT 0,
  theta_band_power REAL DEFAULT 0,
  alpha_band_power REAL DEFAULT 0,
  beta_band_power REAL DEFAULT 0,
  gamma_band_power REAL DEFAULT 0,
  therapeutic_delta_score REAL DEFAULT 0,
  therapeutic_theta_score REAL DEFAULT 0,
  therapeutic_alpha_score REAL DEFAULT 0,
  therapeutic_beta_score REAL DEFAULT 0,
  therapeutic_gamma_score REAL DEFAULT 0,
  spectral_centroid REAL,
  spectral_bandwidth REAL,
  fundamental_frequency REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on spectral_analysis
ALTER TABLE spectral_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for spectral_analysis
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'spectral_analysis' AND policyname = 'Public read access to spectral analysis') THEN
    CREATE POLICY "Public read access to spectral analysis" 
    ON spectral_analysis FOR SELECT 
    USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'spectral_analysis' AND policyname = 'Service role can manage spectral analysis') THEN
    CREATE POLICY "Service role can manage spectral analysis" 
    ON spectral_analysis FOR ALL 
    USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- Update existing tracks with sample file paths based on their titles
UPDATE music_tracks SET 
  file_path = CASE 
    WHEN title ILIKE '%phyrgian%' THEN 'phyrgian_contemplations.mp3'
    WHEN title ILIKE '%verso%' THEN 'verso_cover.mp3'
    WHEN title ILIKE '%duet%jazz%' THEN 'bluegrass_jazz_duet.mp3'
    WHEN title ILIKE '%citar%' THEN 'citar_duet_classical.mp3'
    WHEN title ILIKE '%pass me up%' THEN 'british_rock_jam.mp3'
    ELSE LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '_', 'g')) || '.mp3'
  END,
  file_type = 'audio/mpeg',
  upload_status = 'completed'
WHERE file_path IS NULL;

-- Insert sample therapeutic applications for existing tracks
INSERT INTO therapeutic_applications (track_id, frequency_band_primary, condition_targets, anxiety_evidence_score, focus_evidence_score, sleep_evidence_score)
SELECT 
  id,
  CASE 
    WHEN genre = 'classical' THEN 'alpha'
    WHEN genre = 'jazz' THEN 'theta'
    WHEN genre = 'dance' THEN 'beta'
    WHEN genre = 'rock' THEN 'gamma'
    ELSE 'alpha'
  END,
  CASE 
    WHEN title ILIKE '%sleep%' THEN ARRAY['sleep', 'relaxation']
    WHEN title ILIKE '%relaxation%' THEN ARRAY['anxiety', 'relaxation']
    WHEN title ILIKE '%meditation%' THEN ARRAY['meditation', 'focus']
    WHEN genre = 'classical' THEN ARRAY['focus', 'concentration']
    WHEN genre = 'jazz' THEN ARRAY['creativity', 'relaxation']
    ELSE ARRAY['general_wellness']
  END,
  RANDOM() * 0.3 + 0.7, -- Anxiety evidence (0.7-1.0)
  RANDOM() * 0.4 + 0.6, -- Focus evidence (0.6-1.0)
  CASE WHEN title ILIKE '%sleep%' THEN RANDOM() * 0.2 + 0.8 ELSE RANDOM() * 0.5 + 0.5 END -- Sleep evidence
FROM music_tracks
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_applications WHERE track_id = music_tracks.id);

-- Insert sample spectral analysis data
INSERT INTO spectral_analysis (track_id, delta_band_power, theta_band_power, alpha_band_power, beta_band_power, gamma_band_power,
                              therapeutic_delta_score, therapeutic_theta_score, therapeutic_alpha_score, therapeutic_beta_score, therapeutic_gamma_score)
SELECT 
  id,
  RANDOM() * 0.5 + 0.3, -- Delta power
  RANDOM() * 0.6 + 0.4, -- Theta power  
  RANDOM() * 0.7 + 0.5, -- Alpha power
  RANDOM() * 0.5 + 0.3, -- Beta power
  RANDOM() * 0.4 + 0.2, -- Gamma power
  CASE WHEN title ILIKE '%sleep%' THEN RANDOM() * 0.3 + 0.7 ELSE RANDOM() * 0.4 + 0.4 END, -- Delta therapeutic
  CASE WHEN genre = 'jazz' THEN RANDOM() * 0.3 + 0.7 ELSE RANDOM() * 0.4 + 0.5 END, -- Theta therapeutic
  CASE WHEN genre = 'classical' THEN RANDOM() * 0.3 + 0.7 ELSE RANDOM() * 0.4 + 0.5 END, -- Alpha therapeutic
  CASE WHEN genre = 'dance' THEN RANDOM() * 0.3 + 0.7 ELSE RANDOM() * 0.4 + 0.4 END, -- Beta therapeutic
  CASE WHEN genre = 'rock' THEN RANDOM() * 0.3 + 0.7 ELSE RANDOM() * 0.4 + 0.3 END -- Gamma therapeutic
FROM music_tracks
WHERE NOT EXISTS (SELECT 1 FROM spectral_analysis WHERE track_id = music_tracks.id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_music_tracks_bucket_path ON music_tracks(bucket_name, file_path);
CREATE INDEX IF NOT EXISTS idx_therapeutic_applications_track_band ON therapeutic_applications(track_id, frequency_band_primary);
CREATE INDEX IF NOT EXISTS idx_spectral_analysis_track ON spectral_analysis(track_id);