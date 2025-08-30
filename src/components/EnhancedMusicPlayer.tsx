import React, { useState, useCallback, useEffect } from 'react'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, 
  Clock, Signal, Wifi, WifiOff, AlertTriangle, RotateCcw
} from 'lucide-react'
import { usePlay } from '@/hooks/usePlay'
import { useAudioStore } from '@/stores/audioStore'
import type { Track } from '@/types'

interface EnhancedMusicPlayerProps {
  className?: string
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getConnectionStatus = (): 'online' | 'offline' | 'slow' => {
  if (!navigator.onLine) return 'offline'
  
  // Check connection speed if available
  const connection = (navigator as any).connection
  if (connection) {
    const effectiveType = connection.effectiveType
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'slow'
    }
  }
  
  return 'online'
}

export const EnhancedMusicPlayer: React.FC<EnhancedMusicPlayerProps> = ({ className = '' }) => {
  const { safePlay, pause, isPlaying } = usePlay()
  const { queue, index, isLoading, error, next, prev, currentTrack: track, setError } = useAudioStore()
  const clearError = () => setError(undefined)

  const [connectionStatus, setConnectionStatus] = useState(getConnectionStatus())
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isDraggingSeek, setIsDraggingSeek] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)

  // Monitor connection status
  useEffect(() => {
    const updateConnectionStatus = () => setConnectionStatus(getConnectionStatus())
    
    window.addEventListener('online', updateConnectionStatus)
    window.addEventListener('offline', updateConnectionStatus)
    
    return () => {
      window.removeEventListener('online', updateConnectionStatus)
      window.removeEventListener('offline', updateConnectionStatus)
    }
  }, [])

  // Update seek position when not dragging
  useEffect(() => {
    if (!isDraggingSeek) {
      setSeekPosition(0) // Simplified for now
    }
  }, [isDraggingSeek])

  const handleSeekStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Simplified - no seeking for now
    setIsDraggingSeek(true)
  }, [])

  const handleSeekMove = useCallback((e: MouseEvent) => {
    // Simplified - no seeking for now
  }, [isDraggingSeek])

  const handleSeekEnd = useCallback(() => {
    if (isDraggingSeek) {
      setIsDraggingSeek(false)
    }
  }, [isDraggingSeek])

  useEffect(() => {
    if (isDraggingSeek) {
      document.addEventListener('mousemove', handleSeekMove)
      document.addEventListener('mouseup', handleSeekEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleSeekMove)
        document.removeEventListener('mouseup', handleSeekEnd)
      }
    }
  }, [isDraggingSeek, handleSeekMove, handleSeekEnd])

  const getRepeatIcon = () => {
    return <Repeat className="text-muted-foreground" size={18} />
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'offline': return <WifiOff className="text-destructive" size={16} />
      case 'slow': return <Signal className="text-music-energy" size={16} />
      default: return <Wifi className="text-music-mood" size={16} />
    }
  }

  const progressPercentage = 0 // Simplified for now

  if (!track) {
    return (
      <div className={`bg-card backdrop-blur-sm rounded-xl p-6 border border-border shadow-card ${className}`}>
        <div className="text-center text-muted-foreground">
          <Play size={48} className="mx-auto mb-4 opacity-50" />
          <p>No track selected</p>
          <p className="text-sm mt-1">Choose a track from your library or playlists</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-card backdrop-blur-sm rounded-xl p-6 border border-border shadow-player ${className}`}>
      {/* Connection Status & Error Handling */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-xs text-muted-foreground capitalize">{connectionStatus}</span>
          {isLoading && (
            <div className="flex items-center gap-1 text-music-energy">
              <div className="w-2 h-2 bg-music-energy rounded-full animate-pulse" />
              <span className="text-xs">Loading...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" size={16} />
            <button
              onClick={clearError}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
          {track.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">{track.genre}</span>
          <span>{track.bpm} BPM</span>
          {queue.length > 0 && (
            <span>
              {index + 1} of {queue.length}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          data-seek-bar
          className="w-full bg-secondary rounded-full h-2 cursor-pointer relative overflow-hidden"
          onMouseDown={handleSeekStart}
        >
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
          {isDraggingSeek && (
            <div 
              className="absolute top-0 w-4 h-4 bg-foreground rounded-full shadow-lg transform -translate-y-1 -translate-x-2"
              style={{ left: `${progressPercentage}%` }}
            />
          )}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(0)}</span>
          <span>{formatTime(0)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* Shuffle */}
        <button
          className="p-2 rounded-full transition-colors text-muted-foreground hover:text-foreground"
          title="Shuffle (disabled)"
          disabled
        >
          <Shuffle size={18} />
        </button>

        {/* Previous */}
        <button
          onClick={prev}
          className="p-3 text-foreground hover:bg-secondary rounded-full transition-colors"
          title="Previous Track"
        >
          <SkipBack size={20} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => isPlaying ? pause() : track && safePlay(track.id)}
          disabled={isLoading}
          className={`
            p-4 rounded-full transition-all duration-300 
            ${isPlaying 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
              : 'bg-music-mood hover:bg-music-mood/90 text-foreground'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={next}
          className="p-3 text-foreground hover:bg-secondary rounded-full transition-colors"
          title="Next Track"
        >
          <SkipForward size={20} />
        </button>

        {/* Repeat */}
        <button
          className="p-2 rounded-full transition-colors hover:bg-secondary"
          title="Repeat (disabled)"
          disabled
        >
          {getRepeatIcon()}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground" size={16} />
          <span className="text-xs text-muted-foreground">
            Playing...
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="text-muted-foreground" size={18} />
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-destructive text-sm flex-1">{error}</p>
            <button
              onClick={clearError}
              className="ml-2 p-1 text-destructive/80 hover:text-destructive rounded"
              title="Dismiss Error"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedMusicPlayer