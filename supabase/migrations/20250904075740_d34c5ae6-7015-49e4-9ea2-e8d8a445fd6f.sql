-- Add missing columns for audio analysis to tracks table
ALTER TABLE public.tracks 
ADD COLUMN IF NOT EXISTS mode TEXT,
ADD COLUMN IF NOT EXISTS tempo_stability REAL,
ADD COLUMN IF NOT EXISTS rhythmic_complexity REAL,
ADD COLUMN IF NOT EXISTS harmonic_complexity REAL,
ADD COLUMN IF NOT EXISTS dynamic_range REAL,
ADD COLUMN IF NOT EXISTS spectral_complexity REAL,
ADD COLUMN IF NOT EXISTS therapeutic_effectiveness REAL,
ADD COLUMN IF NOT EXISTS mood_valence_mapped REAL,
ADD COLUMN IF NOT EXISTS arousal_energy_mapped REAL,
ADD COLUMN IF NOT EXISTS cognitive_load REAL,
ADD COLUMN IF NOT EXISTS emotional_stability REAL,
ADD COLUMN IF NOT EXISTS neural_entrainment_potential REAL;