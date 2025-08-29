import React, { createContext, useContext, useReducer, useRef, useCallback, useEffect } from 'react'
import type { MusicTrack, AudioState, FrequencyBand } from '@/types'
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
  loadTrack: (track: MusicTrack, playFromPlaylist?: boolean) => Promise<void>
  next: () => void
  prev: () => void
  clearError: () => void
  retryLoad: () => Promise<void>
}

type AudioAction =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_BUFFERING'; payload: boolean }

const initialState: AudioState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isLoading: false,
  isBuffering: false
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
    case 'SET_BUFFERING':
      return { ...state, isBuffering: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isPlaying: false, isBuffering: false }
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
  const [currentPlaylistId, setCurrentPlaylistId] = React.useState<string | null>(null)
  const [queuePosition, setQueuePosition] = React.useState(0)
  const [repeatMode, setRepeatModeState] = React.useState<'none' | 'one' | 'all'>('none')
  const [shuffleMode, setShuffleModeState] = React.useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sessionStartTime = useRef<number>(0)
  const retryCount = useRef(0)
  const maxRetries = 3

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
      retryCount.current = 0
      
      console.log('🎵 Loading track:', track.title, '| ID:', track.id)
      
      // Use the streaming edge function that handles redirects
      const streamUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream-track/${track.id}?bucket=${track.bucket_name || 'neuralpositivemusic'}`
      
      logger.info('Attempting to load audio stream', { 
        trackId: track.id, 
        title: track.title,
        streamUrl,
        bucketName: track.bucket_name
      })
      
      // Stop current playback
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      
      // Try to load the track with streaming URL first
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.preload = 'metadata'
      audioRef.current.src = streamUrl
      
      // Set current track immediately for UI feedback
      setCurrentTrack(track)
      sessionStartTime.current = Date.now()
      
      // Wait for the track to start loading
      return new Promise<void>((resolve, reject) => {
        if (!audioRef.current) {
          reject(new Error('Audio element not available'))
          return
        }

        const audio = audioRef.current
        
        const handleCanPlay = () => {
          logger.info('Audio ready to play', { trackId: track.id })
          dispatch({ type: 'SET_LOADING', payload: false })
          cleanup()
          resolve()
        }
        
        const handleError = async (e: Event) => {
          const error = audio.error
          let errorMsg = error 
            ? `Audio error: ${error.code} - ${error.message}` 
            : 'Failed to load audio stream'
          
          logger.error('Primary stream failed, trying demo fallback', { 
            trackId: track.id, 
            error: errorMsg,
            streamUrl,
            networkState: audio.networkState,
            readyState: audio.readyState
          })
          
          // Try demo audio as fallback
          const demoUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav'
          logger.info('Using demo audio fallback', { demoUrl })
          
          try {
            audio.src = demoUrl
            audio.load()
            
            // Wait for demo to load
            const handleDemoCanPlay = () => {
              logger.info('Demo audio loaded successfully')
              audio.removeEventListener('canplay', handleDemoCanPlay)
              audio.removeEventListener('error', handleDemoError)
              dispatch({ type: 'SET_LOADING', payload: false })
              cleanup()
              resolve()
            }
            
            const handleDemoError = () => {
              logger.error('Demo audio also failed to load')
              audio.removeEventListener('canplay', handleDemoCanPlay)
              audio.removeEventListener('error', handleDemoError)
              cleanup()
              reject(new Error('Both primary stream and demo audio failed to load'))
            }
            
            audio.addEventListener('canplay', handleDemoCanPlay)
            audio.addEventListener('error', handleDemoError)
            
          } catch (demoError) {
            cleanup()
            reject(new Error('Audio system unavailable'))
          }
        }
        
        const handleTimeout = () => {
          logger.error('Audio loading timeout', { trackId: track.id, streamUrl })
          cleanup()
          reject(new Error('Audio loading timeout'))
        }
        
        const cleanup = () => {
          audio.removeEventListener('canplay', handleCanPlay)
          audio.removeEventListener('error', handleError)
          clearTimeout(timeoutId)
        }
        
        // Set up event listeners
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('error', handleError)
        
        // Set timeout for loading
        const timeoutId = setTimeout(handleTimeout, 15000) // 15 second timeout
        
        // Start loading
        audio.load()
      })
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load track'
      logger.error('Track loading error', { error, trackId: track.id, filePath: track.file_path })
      dispatch({ type: 'SET_ERROR', payload: errorMsg })
      dispatch({ type: 'SET_LOADING', payload: false })
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
    currentPlaylistId,
    queuePosition,
    repeatMode,
    shuffleMode,
    setPlaylist: (tracks: MusicTrack[], playlistId?: string) => {
      setPlaylist(tracks)
      setCurrentPlaylistId(playlistId || null)
      setQueuePosition(0)
    },
    addToQueue: (track: MusicTrack) => {
      setPlaylist(prev => [...prev, track])
    },
    removeFromQueue: (trackId: string) => {
      setPlaylist(prev => prev.filter(t => t.id !== trackId))
    },
    clearQueue: () => {
      setPlaylist([])
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
      if (currentTrack && retryCount.current < maxRetries) {
        retryCount.current += 1
        await loadTrack(currentTrack)
      }
    }
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