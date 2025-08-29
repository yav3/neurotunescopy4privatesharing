// Unified Track interface for the entire application
export interface Track {
  id: string;
  title: string;
  file_name?: string;
  file_path?: string;
  storage_key?: string;
  src?: string;
  duration?: number;
  goal?: string;
  therapeutic_use?: string;
  eeg_targets?: string;
  genre?: string;
  artist?: string;
  album?: string;
  bucket_name?: string;
  upload_status?: 'pending' | 'uploading' | 'completed' | 'failed';
  file_size?: number;
  created_at?: string;
  updated_at?: string;
  // Audio analysis properties
  energy?: number;
  valence?: number;
  bpm?: number;
  acousticness?: number;
  danceability?: number;
  instrumentalness?: number;
  loudness?: number;
  speechiness?: number;
  key_signature?: string;
  mode?: string;
  file_type?: string;
  original_title?: string;
  mood?: string;
  album_art_url?: string;
  album_art_thumbnail?: string;
  album_art_color?: string;
  album_art_credits?: string;
  therapeutic_applications?: TherapeuticApplication[];
  spectral_analysis?: SpectralAnalysis[];
}

// Alias for backward compatibility
export type MusicTrack = Track;

export interface TherapeuticApplication {
  id: string
  track_id: string
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
  created_at: string
  updated_at: string
}

export interface SpectralAnalysis {
  id: string
  track_id: string
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
  created_at: string
}

export type FrequencyBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'

export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  isBuffering?: boolean
  error?: string
}

export interface AppError {
  message: string
  code?: string
  details?: any
  timestamp: string
}

export interface PlaylistRequest {
  goal: string;
  limit?: number;
}

export interface SessionRequest {
  goal: string;
  durationMin: number;
  intensity: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}