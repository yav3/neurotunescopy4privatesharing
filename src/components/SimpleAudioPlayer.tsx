import React, { useState, useRef } from 'react'
import { Play, Pause, AlertTriangle } from 'lucide-react'
import { SupabaseService } from '@/services/supabase'
import { logger } from '@/services/logger'

interface SimpleAudioPlayerProps {
  track: {
    id: string
    title: string
    file_path: string
    bucket_name?: string
  }
}

export const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const initializeAudio = async () => {
    if (audioRef.current) return audioRef.current

    try {
      setError(null)
      setIsLoading(true)

      const url = await SupabaseService.getTrackUrl(
        track.file_path, 
        track.bucket_name || 'neuralpositivemusic'
      )

      logger.info('Initializing simple audio player', { 
        trackId: track.id, 
        title: track.title, 
        url 
      })

      const audio = new Audio()
      audio.crossOrigin = 'anonymous'
      audio.preload = 'metadata'
      audio.src = url

      // Set up event listeners
      audio.addEventListener('loadeddata', () => {
        setIsLoading(false)
        logger.info('Audio loaded successfully', { trackId: track.id })
      })

      audio.addEventListener('play', () => {
        setIsPlaying(true)
        logger.info('Audio started playing', { trackId: track.id })
      })

      audio.addEventListener('pause', () => {
        setIsPlaying(false)
        logger.info('Audio paused', { trackId: track.id })
      })

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        logger.info('Audio playback ended', { trackId: track.id })
      })

      audio.addEventListener('error', (e) => {
        const errorMsg = audio.error ? 
          `Audio error: ${audio.error.code} - ${audio.error.message}` : 
          'Unknown audio error'
        
        logger.error('Audio playback error', { trackId: track.id, error: errorMsg })
        setError(errorMsg)
        setIsLoading(false)
        setIsPlaying(false)
      })

      audioRef.current = audio
      return audio

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load audio'
      logger.error('Audio initialization failed', { trackId: track.id, error: errorMsg })
      setError(errorMsg)
      setIsLoading(false)
      return null
    }
  }

  const handlePlayPause = async () => {
    try {
      const audio = audioRef.current || await initializeAudio()
      if (!audio) return

      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Playback failed'
      logger.error('Play/pause failed', { trackId: track.id, error: errorMsg })
      setError(errorMsg)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
      <button
        onClick={handlePlayPause}
        disabled={isLoading}
        className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={20} />
        ) : (
          <Play size={20} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{track.title}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {track.file_path}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-destructive">
          <AlertTriangle size={16} />
          <span className="text-xs">Error</span>
        </div>
      )}
    </div>
  )
}

export default SimpleAudioPlayer