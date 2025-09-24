import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FrequencyBand } from '@/types'

interface UserPreferences {
  preferredBands: FrequencyBand[]
  volume: number
  autoplay: boolean
  sessionReminders: boolean
  analytics: boolean
}

interface AppState {
  // User preferences
  preferences: UserPreferences
  
  // App state
  isLoading: boolean
  error: string | null
  lastPlayed: string | null
  sessionHistory: TherapeuticSessionData[]
  
  // Actions
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  addSession: (session: TherapeuticSessionData) => void
  clearSessionHistory: () => void
}

interface TherapeuticSessionData {
  id: string
  trackId: string
  trackTitle: string
  duration: number
  frequencyBand: FrequencyBand
  timestamp: string
  moodBefore?: number
  moodAfter?: number
}

const defaultPreferences: UserPreferences = {
  preferredBands: ['alpha'],
  volume: 0.8,
  autoplay: true, // Enable continuous play by default for better user experience
  sessionReminders: true,
  analytics: true
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      isLoading: false,
      error: null,
      lastPlayed: null,
      sessionHistory: [],
      
      setPreference: (key, value) => 
        set(state => ({
          preferences: { ...state.preferences, [key]: value }
        })),
      
      clearError: () => set({ error: null }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      addSession: (session) => 
        set(state => ({
          sessionHistory: [...state.sessionHistory.slice(-99), session], // Keep last 100 sessions
          lastPlayed: session.trackId
        })),
      
      clearSessionHistory: () => set({ sessionHistory: [] })
    }),
    {
      name: 'neurotunes-app-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        lastPlayed: state.lastPlayed,
        sessionHistory: state.sessionHistory.slice(-20) // Only persist last 20 sessions
      })
    }
  )
)