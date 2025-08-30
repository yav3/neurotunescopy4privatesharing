import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, Wifi, WifiOff, Volume2, VolumeX } from 'lucide-react'
import { usePlay } from '@/hooks/usePlay'

export const MusicDeliveryStatus: React.FC = () => {
  const { isPlaying, currentId } = usePlay()
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online')

  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online')
    const handleOffline = () => setConnectionStatus('offline')

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial check
    setConnectionStatus(navigator.onLine ? 'online' : 'offline')

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!currentTrack) return null

  const getStatusColor = () => {
    if (state.error) return 'text-destructive'
    if (state.isBuffering || state.isLoading) return 'text-music-energy'
    if (state.isPlaying) return 'text-music-mood'
    return 'text-muted-foreground'
  }

  const getStatusIcon = () => {
    if (state.error) return <AlertTriangle size={16} />
    if (connectionStatus === 'offline') return <WifiOff size={16} />
    if (state.isBuffering || state.isLoading) return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    if (state.isPlaying) return <Volume2 size={16} />
    return <Wifi size={16} />
  }

  const getStatusText = () => {
    if (state.error) return 'Playback Error'
    if (connectionStatus === 'offline') return 'Offline'
    if (state.isBuffering) return 'Buffering...'
    if (state.isLoading) return 'Loading...'
    if (state.isPlaying) return 'Playing'
    return 'Ready'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className={getStatusColor()}>
            {getStatusIcon()}
          </div>
          <span className={getStatusColor()}>
            {getStatusText()}
          </span>
          {state.error && (
            <button
              onClick={() => window.location.reload()}
              className="ml-2 text-xs text-muted-foreground hover:text-foreground underline"
            >
              Reload
            </button>
          )}
        </div>
        
        {currentTrack && (
          <div className="text-xs text-muted-foreground mt-1 max-w-48 truncate">
            {currentTrack.title}
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicDeliveryStatus