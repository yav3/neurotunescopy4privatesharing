import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react'
import type { MusicTrack, AudioState, FrequencyBand } from '@/types'
import { SupabaseService } from '@/services/supabase'
import { logger } from '@/services/logger'

interface AudioContextType {
  state: AudioState
  currentTrack: MusicTrack | null
  playlist: MusicTrack[]
  setPlaylist: (tracks: MusicTrack[]) => void
  toggle: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  loadTrack: (track: MusicTrack) => Promise<void>
  next: () => void
  prev: () => void
  clearError: () => void
}

type AudioAction =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }

const initialState: AudioState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isLoading: false
}

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'SET_TIME':
      return { ...state, currentTime: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isPlaying: false }
    case 'CLEAR_ERROR':
      return { ...state, error: undefined }
    default:
      return state
  }
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState)
  const [currentTrack, setCurrentTrack] = React.useState<MusicTrack | null>(null)
  const [playlist, setPlaylist] = React.useState<MusicTrack[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sessionStartTime = useRef<number>(0)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    
    // Set initial volume
    audio.volume = state.volume

    // Audio event listeners
    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration })
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime })
    }

    const handleEnded = () => {
      dispatch({ type: 'SET_PLAYING', payload: false })
      
      // Track therapeutic session
      if (currentTrack && sessionStartTime.current) {
        const duration = Date.now() - sessionStartTime.current
        SupabaseService.trackTherapeuticSession(
          currentTrack.id,
          Math.floor(duration / 1000),
          currentTrack.therapeutic_applications?.[0]?.frequency_band_primary || 'alpha'
        )
      }
      
      // Auto-play next track
      next()
    }

    const handleLoadStart = () => {
      dispatch({ type: 'SET_LOADING', payload: true })
    }

    const handleCanPlay = () => {
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    const handleError = (e: any) => {
      const errorMsg = 'Failed to load audio track'
      logger.error(errorMsg, { error: e, currentTrack: currentTrack?.id })
      dispatch({ type: 'SET_ERROR', payload: errorMsg })
    }

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      
      audio.pause()
      audio.src = ''
    }
  }, [])

  const loadTrack = useCallback(async (track: MusicTrack) => {
    if (!audioRef.current) return

    try {
      dispatch({ type: 'CLEAR_ERROR' })
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // For demo purposes, use a placeholder audio URL if no file_path
      let url = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Demo audio
      
      if (track.file_path && track.bucket_name) {
        url = await SupabaseService.getTrackUrl(track.file_path, track.bucket_name)
      }
      
      // Stop current playback
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      
      // Load new track
      audioRef.current.src = url
      audioRef.current.load()
      
      setCurrentTrack(track)
      sessionStartTime.current = Date.now()
      
      logger.info('Track loaded successfully', { 
        trackId: track.id, 
        title: track.title 
      })
    } catch (error) {
      const errorMsg = 'Failed to load track'
      logger.error(errorMsg, { error, trackId: track.id })
      dispatch({ type: 'SET_ERROR', payload: errorMsg })
    }
  }, [])

  const toggle = useCallback(async () => {
    if (!audioRef.current || !currentTrack) return

    try {
      if (state.isPlaying) {
        audioRef.current.pause()
        dispatch({ type: 'SET_PLAYING', payload: false })
      } else {
        await audioRef.current.play()
        dispatch({ type: 'SET_PLAYING', payload: true })
        sessionStartTime.current = Date.now()
      }
    } catch (error) {
      const errorMsg = 'Failed to play audio'
      logger.error(errorMsg, { error, trackId: currentTrack?.id })
      dispatch({ type: 'SET_ERROR', payload: errorMsg })
    }
  }, [state.isPlaying, currentTrack])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration || 0))
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
      dispatch({ type: 'SET_VOLUME', payload: clampedVolume })
      
      // Save to localStorage
      localStorage.setItem('neurotunes-volume', clampedVolume.toString())
    }
  }, [])

  const next = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    loadTrack(playlist[nextIndex])
  }, [currentTrack, playlist, loadTrack])

  const prev = useCallback(() => {
    if (!currentTrack || playlist.length === 0) return
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    loadTrack(playlist[prevIndex])
  }, [currentTrack, playlist, loadTrack])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  // Load saved volume on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('neurotunes-volume')
    if (savedVolume) {
      const volume = parseFloat(savedVolume)
      if (!isNaN(volume)) {
        setVolume(volume)
      }
    }
  }, [setVolume])

  const value: AudioContextType = {
    state,
    currentTrack,
    playlist,
    setPlaylist,
    toggle,
    seek,
    setVolume,
    loadTrack,
    next,
    prev,
    clearError
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}