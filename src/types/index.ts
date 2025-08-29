export interface MusicTrack {
  id: string
  title: string
  original_title?: string
  genre: string
  energy: number
  valence: number
  acousticness: number
  danceability: number
  loudness: number
  bpm: number
  file_path?: string
  bucket_name?: string
  file_size?: number
  file_type?: string
  upload_status?: 'pending' | 'uploading' | 'completed' | 'failed'
  created_at?: string
  updated_at?: string
  therapeutic_applications?: TherapeuticApplication[]
  spectral_analysis?: SpectralAnalysis[]
  // Additional fields for compatibility
  artist?: string
  duration?: number
  mood?: string
}

export interface TherapeuticApplication {
  id?: string
  track_id?: string
  frequency_band_primary: FrequencyBand
  frequency_band_secondary?: FrequencyBand[]
  condition_targets: string[]
  anxiety_evidence_score?: number
  depression_evidence_score?: number
  pain_evidence_score?: number
  focus_evidence_score?: number
  sleep_evidence_score?: number
  ptsd_evidence_score?: number
  effect_size?: number
  participant_count?: number
  confidence_interval?: string
  supporting_studies?: string[]
}

export interface SpectralAnalysis {
  id?: string
  track_id?: string
  delta_band_power: number
  theta_band_power: number
  alpha_band_power: number
  beta_band_power: number
  gamma_band_power: number
  therapeutic_delta_score: number
  therapeutic_theta_score: number
  therapeutic_alpha_score: number
  therapeutic_beta_score: number
  therapeutic_gamma_score: number
  spectral_centroid?: number
  spectral_bandwidth?: number
  fundamental_frequency?: number
}

export type FrequencyBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'

export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  error?: string
}

export interface AppError {
  message: string
  code?: string
  details?: any
  timestamp: string
}

// Legacy interface for compatibility
export interface Track extends MusicTrack {}