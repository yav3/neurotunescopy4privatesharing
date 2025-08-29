import React, { useState, useEffect } from 'react'
import { Play, Pause, Brain, TrendingUp, Clock } from 'lucide-react'
import type { MusicTrack } from '@/types'
import { useAudio } from '@/context/AudioContext'

interface TrackCardProps {
  track: MusicTrack
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Resolve track URLs using the edge function
const resolveTrackUrl = async (track: MusicTrack, type: 'audio' | 'artwork'): Promise<string | null> => {
  try {
    const response = await fetch(`https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/resolve-track-url?trackId=${track.id}&type=${type}&bucket=${track.bucket_name || 'neuralpositivemusic'}`)
    
    if (!response.ok) {
      console.warn(`Failed to resolve ${type} URL for track ${track.id}:`, response.status)
      return null
    }
    
    const data = await response.json()
    return data.url || null
  } catch (error) {
    console.error(`Error resolving ${type} URL for track ${track.id}:`, error)
    return null
  }
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  console.log('🎵 TrackCard rendered for:', track.title)
  const { currentTrack, state, loadTrack, toggle } = useAudio()
  const [albumArtworkUrl, setAlbumArtworkUrl] = useState<string | null>(null)
  const [isLoadingArtwork, setIsLoadingArtwork] = useState(false)
  
  const isCurrentTrack = currentTrack?.id === track.id
  const isPlaying = isCurrentTrack && state.isPlaying
  const isLoading = isCurrentTrack && state.isLoading
  
  const primaryApp = track.therapeutic_applications?.[0]

  // Load artwork URL when component mounts
  useEffect(() => {
    const loadArtwork = async () => {
      setIsLoadingArtwork(true)
      try {
        const artworkUrl = await resolveTrackUrl(track, 'artwork')
        setAlbumArtworkUrl(artworkUrl)
      } catch (error) {
        console.warn('Failed to load artwork for track:', track.title)
      } finally {
        setIsLoadingArtwork(false)
      }
    }

    loadArtwork()
  }, [track.id])

  const handlePlayClick = async () => {
    console.log('▶️ Play button clicked for track:', track.title)
    if (isCurrentTrack) {
      toggle()
    } else {
      await loadTrack(track)
      // Auto-play after loading
      setTimeout(() => {
        toggle()
      }, 500)
    }
  }

  return (
    <div className="group bg-card rounded-2xl border border-border transition-all duration-300 hover:shadow-card hover:border-primary/20 overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Album Artwork */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden flex items-center justify-center">
            {albumArtworkUrl ? (
              <img 
                src={albumArtworkUrl} 
                alt={`${track.title} artwork`}
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => {
                  // Hide the image on load error, showing the gradient fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            {/* Fallback design - only shows when no image or image fails to load */}
            <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center relative z-10">
              <span className="text-xs font-medium text-primary">
                {track.title.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Play button overlay */}
          <button
            onClick={handlePlayClick}
            disabled={isLoading}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
            {track.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="capitalize bg-secondary px-2 py-1 rounded-full text-xs">
              {track.genre}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {track.bpm || 'N/A'} BPM
            </span>
          </div>

          {/* Therapeutic info inline */}
          {primaryApp && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-primary" />
                <span className="text-xs text-foreground capitalize">
                  {primaryApp.frequency_band_primary} Band
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {primaryApp.condition_targets?.slice(0, 2).map((condition) => (
                  <span 
                    key={condition} 
                    className="px-2 py-0.5 bg-secondary text-xs rounded-full text-secondary-foreground"
                  >
                    {condition.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Energy and Valence bars - more compact */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Energy</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-secondary rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full" 
                    style={{ width: `${track.energy * 100}%` }}
                  />
                </div>
                <span className="text-foreground text-xs w-8">
                  {Math.round(track.energy * 100)}%
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-muted-foreground">Valence</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-secondary rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-1 rounded-full" 
                    style={{ width: `${track.valence * 100}%` }}
                  />
                </div>
                <span className="text-foreground text-xs w-8">
                  {Math.round(track.valence * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}