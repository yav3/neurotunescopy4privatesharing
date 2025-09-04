-- Add camelot_code column to tracks table for harmonic mixing
ALTER TABLE public.tracks 
ADD COLUMN IF NOT EXISTS camelot_code TEXT;