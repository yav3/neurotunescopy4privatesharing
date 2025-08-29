import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react'
import type { MusicTrack, AudioState } from '@/types'
import { SupabaseService } from '@/services/supabase'
import { logger } from '@/services/logger'

interface AudioContextType {
  state: AudioState
  currentTrack: MusicTrack | null
  playlist: MusicTrack[]
  currentPlaylistId: string | null
  queuePosition: number
  repeatMode: 'none' | 'one' | 'all'
  shuffleMode: boolean
  setPlaylist: (tracks: MusicTrack[], playlistId?: string) => void
  addToQueue: (track: MusicTrack) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void
  toggleShuffle: () => void
  toggle: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  loadTrack: (track: MusicTrack) => Promise<void>
  next: () => void
  prev: () => void
  clearError: () => void
  retryLoad: () => Promise<void>
  formatTime: (time: number) => string
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
  const [playlist, setPlaylistState] = React.useState<MusicTrack[]>([])
  const [currentPlaylistId, setCurrentPlaylistId] = React.useState<string | null>(null)
  const [queuePosition, setQueuePosition] = React.useState(0)
  const [repeatMode, setRepeatModeState] = React.useState<'none' | 'one' | 'all'>('none')
  const [shuffleMode, setShuffleModeState] = React.useState(false)
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

    const handleError = () => {
      const error = audio.error
      const errorTypes = {
        1: 'ABORTED', 2: 'NETWORK', 3: 'DECODE', 4: 'NOT_SUPPORTED'
      }
      
      const errorDetails = {
        errorCode: error?.code,
        errorType: errorTypes[error?.code] || 'UNKNOWN',
        message: error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState,
        currentSrc: audio.currentSrc,
        duration: audio.duration,
        currentTime: audio.currentTime
      }
      
      console.log('[AUDIO ERROR]', errorDetails)
      logger.error('Audio element error', { errorDetails, currentTrack: currentTrack?.id })
      
      const errorMsg = `Audio ${errorDetails.errorType}: ${error?.message || 'Unknown error'}`
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
  }, [currentTrack])

  const loadTrack = useCallback(async (track: MusicTrack) => {
    if (!audioRef.current) return

    try {
      dispatch({ type: 'CLEAR_ERROR' })
      dispatch({ type: 'SET_LOADING', payload: true })
      
      console.log('Loading track:', track.title, 'File path:', track.file_path)
      const url = await SupabaseService.getTrackUrl(track.file_path, track.bucket_name)
      console.log('Generated audio URL:', url)
      
      // Stop current playback
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      
      // Test the URL first
      try {
        const testResponse = await fetch(url, { method: 'HEAD' })
        console.log('URL test response:', testResponse.status, testResponse.statusText)
        if (!testResponse.ok) {
          throw new Error(`URL not accessible: ${testResponse.status} ${testResponse.statusText}`)
        }
      } catch (urlError) {
        console.error('URL test failed:', urlError)
        throw new Error(`Audio URL not accessible: ${urlError.message}`)
      }
      
      // Create a promise that resolves when audio is ready to play
      await new Promise<void>((resolve, reject) => {
        const audio = audioRef.current!
        
        const cleanup = () => {
          clearTimeout(timeoutId)
          audio.removeEventListener('canplaythrough', handleCanPlay)
          audio.removeEventListener('error', handleError)
        }

        const handleCanPlay = () => {
          console.log('Audio can play through')
          cleanup()
          resolve()
        }

        const handleError = () => {
          console.error('Audio element error:', audio.error)
          cleanup()
          reject(new Error(`Audio load failed: ${audio.error?.code} - ${audio.error?.message}`))
        }

        const handleTimeout = () => {
          console.error('Audio loading timeout')
          cleanup()
          reject(new Error('Audio loading timeout'))
        }

        // Set up event listeners
        audio.addEventListener('canplaythrough', handleCanPlay, { once: true })
        audio.addEventListener('error', handleError, { once: true })
        
        // Set timeout for loading
        const timeoutId = setTimeout(handleTimeout, 15000) // 15 second timeout
        
        // Load new track
        console.log('Setting audio src to:', url)
        audio.src = url
        audio.load()
      })
      
      setCurrentTrack(track)
      
      logger.info('Track loaded successfully', { 
        trackId: track.id, 
        title: track.title 
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load track'
      logger.error('Track loading error', { error, trackId: track.id, filePath: track.file_path })
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

  const formatTime = useCallback((time: number) => {
    if (!isFinite(time)) return '0:00'
    
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
    currentPlaylistId,
    queuePosition,
    repeatMode,
    shuffleMode,
    setPlaylist: (tracks: MusicTrack[], playlistId?: string) => {
      setPlaylistState(tracks)
      setCurrentPlaylistId(playlistId || null)
      setQueuePosition(0)
    },
    addToQueue: (track: MusicTrack) => {
      setPlaylistState(prev => [...prev, track])
    },
    removeFromQueue: (trackId: string) => {
      setPlaylistState(prev => prev.filter(t => t.id !== trackId))
    },
    clearQueue: () => {
      setPlaylistState([])
      setCurrentPlaylistId(null)
      setQueuePosition(0)
    },
    setRepeatMode: (mode: 'none' | 'one' | 'all') => {
      setRepeatModeState(mode)
      localStorage.setItem('neurotunes-repeat', mode)
    },
    toggleShuffle: () => {
      const newShuffleMode = !shuffleMode
      setShuffleModeState(newShuffleMode)
      localStorage.setItem('neurotunes-shuffle', newShuffleMode.toString())
    },
    toggle,
    seek,
    setVolume,
    loadTrack,
    next,
    prev,
    clearError,
    retryLoad: async () => {
      if (currentTrack) {
        await loadTrack(currentTrack)
      }
    },
    formatTime
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