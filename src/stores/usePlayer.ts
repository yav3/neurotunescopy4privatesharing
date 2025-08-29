import { create } from 'zustand'
import { API, streamUrl } from '@/lib/api'

type Track = { 
  id: string
  title?: string
  file_path?: string
  file_name?: string
  src?: string
  genre?: string
  bpm?: number
  energy?: number
  valence?: number
}

interface PlayerState {
  queue: Track[]
  index: number
  sessionId?: string
  isPlaying: boolean
  isLoading: boolean
  error?: string
  
  // Actions
  setQueue: (tracks: Track[], startAt?: number) => void
  playAt: (i: number) => void
  playSingle: (t: Track) => void
  next: () => void
  prev: () => void
  loadGoal: (goal: string) => Promise<void>
  buildAndStart: (p: {goal:string; durationMin:number; intensity:number}) => Promise<void>
  setPlaying: (playing: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error?: string) => void
  clearError: () => void
}

export const usePlayer = create<PlayerState>((set, get) => ({
  queue: [],
  index: 0,
  isPlaying: false,
  isLoading: false,
  
  setQueue: (tracks, startAt = 0) => {
    console.log('🎵 Setting queue:', tracks.length, 'tracks, starting at index:', startAt)
    set({ 
      queue: tracks, 
      index: Math.max(0, Math.min(startAt, tracks.length - 1)),
      error: undefined 
    })
  },
  
  playAt: (i) => {
    const { queue } = get()
    const newIndex = Math.max(0, Math.min(i, queue.length - 1))
    console.log('🎵 Playing at index:', newIndex, 'track:', queue[newIndex]?.title)
    set({ index: newIndex, error: undefined })
  },
  
  playSingle: (t) => {
    console.log('🎵 Playing single track:', t.title)
    set({ queue: [t], index: 0, error: undefined })
  },

  next: () => {
    const { index, queue } = get()
    const newIndex = Math.min(index + 1, queue.length - 1)
    console.log('⏭️ Next track, index:', newIndex)
    set({ index: newIndex })
  },
  
  prev: () => {
    const { index } = get()
    const newIndex = Math.max(index - 1, 0)
    console.log('⏮️ Previous track, index:', newIndex)
    set({ index: newIndex })
  },

  loadGoal: async (goal) => {
    console.log('🎯 Loading playlist for goal:', goal)
    set({ isLoading: true, error: undefined })
    
    try {
      const response = await API.playlistByGoal(goal)
      const tracks = response.tracks || []
      
      if (!tracks.length) {
        throw new Error(`No tracks found for ${goal}`)
      }
      
      console.log('✅ Loaded', tracks.length, 'tracks for goal:', goal)
      set({ 
        queue: tracks, 
        index: 0, 
        isLoading: false,
        error: undefined
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tracks'
      console.error('❌ Failed to load goal playlist:', errorMessage)
      set({ 
        error: errorMessage, 
        isLoading: false,
        queue: [],
        index: 0
      })
      throw error
    }
  },

  buildAndStart: async ({goal, durationMin, intensity}) => {
    console.log('🏗️ Building session:', { goal, durationMin, intensity })
    set({ isLoading: true, error: undefined })
    
    try {
      const response = await API.buildSession({ goal, durationMin, intensity })
      const tracks = response.tracks || []
      
      if (!tracks.length) {
        throw new Error(`No suitable tracks found for ${goal}`)
      }
      
      console.log('✅ Built session with', tracks.length, 'tracks, sessionId:', response.sessionId)
      set({ 
        queue: tracks, 
        index: 0, 
        sessionId: response.sessionId,
        isLoading: false,
        error: undefined
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Session build failed'
      console.error('❌ Session build failed:', errorMessage)
      set({ 
        error: errorMessage, 
        isLoading: false,
        queue: [],
        index: 0
      })
      throw error
    }
  },

  setPlaying: (playing) => set({ isPlaying: playing }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: undefined })
}))

// Helper for getting current track's stream URL
export const currentSrc = () => {
  const { queue, index } = usePlayer.getState()
  const t = queue[index]
  if (!t) return ''
  return streamUrl(t)
}

// Helper to get current track
export const currentTrack = () => {
  const { queue, index } = usePlayer.getState()
  return queue[index] || null
}