// Unified type definitions for consistent ID handling across the application
export interface Track {
  id: string;                    // Primary UUID identifier (matches database)
  unique_id?: string;           // Legacy field for backward compatibility
  title: string;
  artist?: string;
  file_name?: string;
  file_path?: string;           // Legacy field
  storage_key?: string;         // Actual storage path
  storage_bucket?: string;      // Storage bucket name
  src?: string;                 // Computed stream URL
  duration?: number;
  goal?: string;
  therapeutic_use?: string;
  eeg_targets?: string;
  genre?: string;
  album?: string;
  upload_status?: 'pending' | 'uploading' | 'completed' | 'failed';
  audio_status?: 'working' | 'missing' | 'unknown' | 'bad';
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
  camelot_key?: string;         // Camelot wheel notation
  mode?: string;
  file_type?: string;
  original_title?: string;
  mood?: string;
  
  // Visual properties
  album_art_url?: string;
  album_art_thumbnail?: string;
  album_art_color?: string;
  album_art_credits?: string;
  
  // Related data
  therapeutic_applications?: TherapeuticApplication[];
  spectral_analysis?: SpectralAnalysis[];
}

// VAD (Valence, Arousal, Dominance) model
export interface VAD {
  valence: number;     // 0..1 (negative to positive)
  arousal: number;     // 0..1 (calm to energetic)  
  dominance?: number;  // 0..1 (submissive to dominant)
}

// Therapeutic goals
export type TherapeuticGoal =
  | "anxiety_down"
  | "pain_down"  
  | "focus_up"
  | "sleep"
  | "mood_up";

export interface TherapeuticApplication {
  id: string;
  track_id: string;
  frequency_band_primary: FrequencyBand;
  frequency_band_secondary?: FrequencyBand[];
  condition_targets: string[];
  anxiety_evidence_score?: number;
  depression_evidence_score?: number;
  pain_evidence_score?: number;
  focus_evidence_score?: number;
  sleep_evidence_score?: number;
  ptsd_evidence_score?: number;
  effect_size?: number;
  participant_count?: number;
  confidence_interval?: string;
  supporting_studies?: string[];
  created_at: string;
  updated_at: string;
}

export interface SpectralAnalysis {
  id: string;
  track_id: string;
  delta_band_power: number;
  theta_band_power: number;
  alpha_band_power: number;
  beta_band_power: number;
  gamma_band_power: number;
  therapeutic_delta_score: number;
  therapeutic_theta_score: number;
  therapeutic_alpha_score: number;
  therapeutic_beta_score: number;
  therapeutic_gamma_score: number;
  spectral_centroid?: number;
  spectral_bandwidth?: number;
  fundamental_frequency?: number;
  created_at: string;
}

export type FrequencyBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

// Audio playback state
export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  isBuffering?: boolean;
  error?: string;
}

// API interfaces
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

export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// Aliases for backward compatibility
export type MusicTrack = Track;

// ID normalization utilities
export const normalizeTrackId = (track: any): string => {
  return track.id || track.unique_id || '';
};

export const ensureTrackId = (track: any): Track => {
  return {
    ...track,
    id: normalizeTrackId(track),
    unique_id: track.unique_id || track.id
  };
};