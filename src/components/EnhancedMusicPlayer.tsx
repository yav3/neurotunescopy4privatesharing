import React, { useState, useCallback, useEffect } from 'react'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Shuffle, 
  Clock, Signal, Wifi, WifiOff, AlertTriangle, RotateCcw
} from 'lucide-react'
import { useAudio } from '@/context/AudioContext'
import type { MusicTrack } from '@/types'

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
  const {
    state,
    currentTrack,
    playlist,
    queuePosition,
    repeatMode,
    shuffleMode,
    toggle,
    seek,
    setVolume,
    next,
    prev,
    setRepeatMode,
    toggleShuffle,
    clearError,
    retryLoad
  } = useAudio()

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
      setSeekPosition(state.currentTime)
    }
  }, [state.currentTime, isDraggingSeek])

  const handleSeekStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percentage = (e.clientX - rect.left) / rect.width
    const newTime = percentage * state.duration
    setSeekPosition(newTime)
    setIsDraggingSeek(true)
  }, [state.duration])

  const handleSeekMove = useCallback((e: MouseEvent) => {
    if (!isDraggingSeek) return
    
    const progressBar = document.querySelector('[data-seek-bar]') as HTMLDivElement
    if (!progressBar) return
    
    const rect = progressBar.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newTime = percentage * state.duration
    setSeekPosition(newTime)
  }, [isDraggingSeek, state.duration])

  const handleSeekEnd = useCallback(() => {
    if (isDraggingSeek) {
      seek(seekPosition)
      setIsDraggingSeek(false)
    }
  }, [isDraggingSeek, seekPosition, seek])

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
    switch (repeatMode) {
      case 'one': return <Repeat className="text-purple-400" size={18} />
      case 'all': return <Repeat className="text-blue-400" size={18} />
      default: return <Repeat className="text-gray-400" size={18} />
    }
  }

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'offline': return <WifiOff className="text-red-400" size={16} />
      case 'slow': return <Signal className="text-yellow-400" size={16} />
      default: return <Wifi className="text-green-400" size={16} />
    }
  }

  const progressPercentage = state.duration > 0 
    ? (isDraggingSeek ? seekPosition : state.currentTime) / state.duration * 100 
    : 0

  if (!currentTrack) {
    return (
      <div className={`bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 ${className}`}>
        <div className="text-center text-gray-400">
          <Play size={48} className="mx-auto mb-4 opacity-50" />
          <p>No track selected</p>
          <p className="text-sm mt-1">Choose a track from your library or playlists</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl ${className}`}>
      {/* Connection Status & Error Handling */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-xs text-gray-400 capitalize">{connectionStatus}</span>
          {state.isBuffering && (
            <div className="flex items-center gap-1 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-xs">Buffering...</span>
            </div>
          )}
        </div>

        {state.error && (
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-red-400" size={16} />
            <button
              onClick={retryLoad}
              className="text-xs text-red-300 hover:text-red-200 underline"
            >
              Retry
            </button>
            <button
              onClick={clearError}
              className="text-xs text-gray-400 hover:text-gray-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {currentTrack.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="capitalize">{currentTrack.genre}</span>
          <span>{currentTrack.bpm} BPM</span>
          {playlist.length > 0 && (
            <span>
              {queuePosition + 1} of {playlist.length}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          data-seek-bar
          className="w-full bg-gray-700 rounded-full h-2 cursor-pointer relative overflow-hidden"
          onMouseDown={handleSeekStart}
        >
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
          {isDraggingSeek && (
            <div 
              className="absolute top-0 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1 -translate-x-2"
              style={{ left: `${progressPercentage}%` }}
            />
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{formatTime(isDraggingSeek ? seekPosition : state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* Shuffle */}
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-full transition-colors ${
            shuffleMode ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
          title="Toggle Shuffle"
        >
          <Shuffle size={18} />
        </button>

        {/* Previous */}
        <button
          onClick={prev}
          className="p-3 text-white hover:bg-gray-700 rounded-full transition-colors"
          title="Previous Track"
        >
          <SkipBack size={20} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={toggle}
          disabled={state.isLoading}
          className={`
            p-4 rounded-full transition-all duration-300 
            ${state.isPlaying 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          title={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : state.isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={next}
          className="p-3 text-white hover:bg-gray-700 rounded-full transition-colors"
          title="Next Track"
        >
          <SkipForward size={20} />
        </button>

        {/* Repeat */}
        <button
          onClick={() => {
            const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
            const currentIndex = modes.indexOf(repeatMode)
            const nextMode = modes[(currentIndex + 1) % modes.length]
            setRepeatMode(nextMode)
          }}
          className="p-2 rounded-full transition-colors hover:bg-gray-700"
          title={`Repeat: ${repeatMode}`}
        >
          {getRepeatIcon()}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-gray-400" size={16} />
          <span className="text-xs text-gray-400">
            {formatTime(state.duration - state.currentTime)} remaining
          </span>
        </div>

        <div 
          className="flex items-center gap-2 relative"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            onClick={() => setVolume(state.volume > 0 ? 0 : 0.8)}
            className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
          >
            {state.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          {showVolumeSlider && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 p-3 rounded-lg shadow-xl">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 slider"
              />
            </div>
          )}
          
          <span className="text-xs text-gray-400 w-8 text-right">
            {Math.round(state.volume * 100)}%
          </span>
        </div>
      </div>

      {/* Error State */}
      {state.error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-400 text-sm flex-1">{state.error}</p>
            <button
              onClick={retryLoad}
              className="ml-2 p-1 text-red-300 hover:text-red-200 rounded"
              title="Retry Loading"
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