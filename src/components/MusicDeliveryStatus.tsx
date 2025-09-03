import React, { useEffect, useState } from 'react'
import { AlertTriangle, Wifi, WifiOff, Volume2 } from 'lucide-react'
import { useAudioStore } from '@/stores/audioStore'

export const MusicDeliveryStatus: React.FC = () => {
  const { isPlaying, error, currentTrack: track } = useAudioStore()
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

  if (!track) return null

  const getStatusColor = () => {
    if (error) return 'text-destructive'
    if (isPlaying) return 'text-music-mood'
    return 'text-muted-foreground'
  }

  const getStatusIcon = () => {
    if (error) return <AlertTriangle size={16} />
    if (connectionStatus === 'offline') return <WifiOff size={16} />
    if (isPlaying) return <Volume2 size={16} />
    return <Wifi size={16} />
  }

  const getStatusText = () => {
    if (error) return 'Playback Error'
    if (connectionStatus === 'offline') return 'Offline'
    if (isPlaying) return 'Playing'
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
          {error && (
            <button
              onClick={() => window.location.reload()}
              className="ml-2 text-xs text-muted-foreground hover:text-foreground underline"
            >
              Reload
            </button>
          )}
        </div>
        
        {track && (
          <div className="text-xs text-muted-foreground mt-1 max-w-48 truncate">
            {track.title}
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicDeliveryStatus