import React, { createContext, useContext, useReducer, useRef, useCallback } from 'react'
import { MusicTrack, AudioState } from '@/types'
import { supabase } from '@/integrations/supabase/client'

interface AudioContextType {
  state: AudioState
  currentTrack: MusicTrack | null
  playlist: MusicTrack[]
  toggle: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  loadTrack: (track: MusicTrack) => Promise<void>
  next: () => void
  prev: () => void
  setPlaylist: (tracks: MusicTrack[]) => void
}

type AudioAction =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AudioState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
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

  // Initialize audio element
  React.useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration })
    })

    audio.addEventListener('timeupdate', () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime })
    })

    audio.addEventListener('ended', () => {
      dispatch({ type: 'SET_PLAYING', payload: false })
      // Auto-play next track
      next()
    })

    audio.addEventListener('loadstart', () => {
      dispatch({ type: 'SET_LOADING', payload: true })
    })

    audio.addEventListener('canplay', () => {
      dispatch({ type: 'SET_LOADING', payload: false })
    })

    return () => {
      audio.pause()
      audio.removeAttribute('src')
    }
  }, [])

  const getTrackUrl = useCallback(async (filePath: string, bucketName: string = 'audio'): Promise<string> => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
    return data.publicUrl
  }, [])

  const loadTrack = useCallback(async (track: MusicTrack) => {
    if (!audioRef.current) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // For demo purposes, use a placeholder audio URL if no file_path
      let url = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Demo audio
      
      if (track.file_path && track.bucket_name) {
        url = await getTrackUrl(track.file_path, track.bucket_name)
      }
      
      audioRef.current.src = url
      audioRef.current.load()
      setCurrentTrack(track)
    } catch (error) {
      console.error('Failed to load track:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [getTrackUrl])

  const toggle = useCallback(() => {
    if (!audioRef.current) return

    if (state.isPlaying) {
      audioRef.current.pause()
      dispatch({ type: 'SET_PLAYING', payload: false })
    } else {
      audioRef.current.play()
      dispatch({ type: 'SET_PLAYING', payload: true })
    }
  }, [state.isPlaying])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      dispatch({ type: 'SET_VOLUME', payload: volume })
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

  const value: AudioContextType = {
    state,
    currentTrack,
    playlist,
    toggle,
    seek,
    setVolume,
    loadTrack,
    next,
    prev,
    setPlaylist
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