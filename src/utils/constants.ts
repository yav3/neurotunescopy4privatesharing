export const FREQUENCY_BANDS = {
  delta: {
    range: '0.5-4Hz',
    name: 'Delta',
    purpose: 'Deep Sleep & Healing',
    color: 'hsl(var(--primary))',
    description: 'Promotes deep sleep, healing, and regeneration',
    icon: '🌙'
  },
  theta: {
    range: '4-8Hz',
    name: 'Theta',
    purpose: 'Meditation & Creativity',
    color: 'hsl(var(--secondary))',
    description: 'Enhances meditation, creativity, and intuition',
    icon: '🧘'
  },
  alpha: {
    range: '8-13Hz',
    name: 'Alpha',
    purpose: 'Relaxed Focus',
    color: 'hsl(var(--accent))',
    description: 'Calms the mind while maintaining alertness',
    icon: '🌊'
  },
  beta: {
    range: '13-30Hz',
    name: 'Beta',
    purpose: 'Active Concentration',
    color: 'hsl(var(--muted))',
    description: 'Supports focused thinking and problem-solving',
    icon: '⚡'
  },
  gamma: {
    range: '30-100Hz',
    name: 'Gamma',
    purpose: 'Peak Performance',
    color: 'hsl(var(--destructive))',
    description: 'Enhances cognitive function and peak performance',
    icon: '🚀'
  }
} as const

export const THERAPEUTIC_CONDITIONS = [
  'anxiety',
  'depression',
  'pain_relief',
  'focus_enhancement',
  'sleep_improvement',
  'stress_reduction',
  'ptsd',
  'adhd',
  'autism_support',
  'meditation_support',
  'cognitive_enhancement',
  'memory_improvement'
] as const

export const EVIDENCE_SCORE_THRESHOLDS = {
  high: 0.8,
  medium: 0.6,
  low: 0.4
} as const

export const AUDIO_CONFIG = {
  defaultVolume: 0.8,
  maxFileSize: 50 * 1024 * 1024, // 50MB
  supportedFormats: ['mp3', 'wav', 'flac', 'ogg', 'm4a'],
  sampleRates: [44100, 48000, 96000]
} as const

export const UI_CONFIG = {
  animationDuration: 300,
  debounceDelay: 500,
  pageSize: 20,
  maxSearchResults: 100
} as const

export const API_ENDPOINTS = {
  tracks: '/api/tracks',
  upload: '/api/upload',
  analyze: '/api/analyze',
  recommendations: '/api/recommendations',
  sessions: '/api/sessions'
} as const

export const STORAGE_KEYS = {
  volume: 'neurotunes-volume',
  theme: 'neurotunes-theme',
  preferences: 'neurotunes-preferences',
  recentTracks: 'neurotunes-recent-tracks'
} as const