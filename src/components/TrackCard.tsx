import React, { useState, useEffect } from 'react'
import { Play, Pause, Brain, TrendingUp, Clock } from 'lucide-react'
import { useAuthContext } from '@/components/auth/AuthProvider'
import type { Track } from '@/types'
import { SmartTitle } from '@/components/ui/SmartTitle'
import { ArtworkService } from '@/services/artworkService'
import { useAudioStore } from '@/stores'
import { handleImageError } from '@/utils/imageUtils'
// For backward compatibility with MusicTrack
type MusicTrack = Track & {
  therapeutic_applications?: Array<{
    frequency_band_primary?: string;
    condition_targets?: string[];
  }>;
  energy?: number;
  valence?: number;
  bpm?: number;
  genre?: string;
};

interface TrackCardProps {
  track: MusicTrack;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Resolve track URLs using the edge function
const resolveTrackUrl = async (track: MusicTrack, type: 'audio' | 'artwork'): Promise<string | null> => {
  try {
    const response = await fetch(`https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/resolve-track-url?trackId=${track.id}&type=${type}&bucket=${track.storage_bucket || 'audio'}`)
    
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

// Artwork is now handled centrally by ArtworkService
// No hardcoded artwork filenames - pulls dynamically from albumart bucket

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  console.log('🎵 TrackCard rendered for:', track.title)
  const { playTrack } = useAudioStore()
  const { isAdmin } = useAuthContext()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isPlayLoading, setIsPlayLoading] = useState(false)
  
  const primaryApp = track.therapeutic_applications?.[0]
  const frequencyBand = primaryApp?.frequency_band_primary || 'alpha'
  const artwork = React.useMemo(() => {
    console.log('🎨 Getting artwork for track:', track.id, 'frequency:', frequencyBand);
    const result = ArtworkService.getTherapeuticArtwork(frequencyBand, track.id);
    console.log('🖼️ Artwork result:', result);
    return result;
  }, [frequencyBand, track.id])

  const handlePlayClick = async () => {
    console.log('▶️ TrackCard play button clicked for track:', track.title, track.id);
    setIsPlayLoading(true);
    
    try {
      console.log('🔄 Playing single track via TrackCard');
      await playTrack(track);
    } catch (error) {
      console.error('❌ Error in TrackCard play click:', error);
    } finally {
      setIsPlayLoading(false);
    }
  };

  return (
    <div className="group bg-card rounded-2xl border border-border transition-all duration-300 hover:shadow-card hover:border-primary/20 overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Album Artwork */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden relative">
            {/* Loading State */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-card/50 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
              </div>
            )}
            
            {/* Therapeutic Nature Background */}
            <img 
              src={artwork.url}
              alt={`${frequencyBand} band therapeutic artwork`}
              className="w-full h-full object-cover"
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                setIsImageLoading(false);
                handleImageError(e);
              }}
            />
            {/* Therapeutic Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${artwork.gradient}`} />
          </div>
          
          {/* Play button overlay */}
          <button
            onClick={handlePlayClick}
            disabled={isPlayLoading}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center disabled:cursor-not-allowed"
            aria-label="Play track"
          >
            {isPlayLoading ? (
              <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={24} className="text-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <SmartTitle 
              title={track.title}
              context="card"
              maxLength={40}
              showMetadata={true}
              className="group-hover:text-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="capitalize bg-secondary px-2 py-1 rounded-full text-xs">
              {track.genre}
            </span>
            {isAdmin() && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {track.bpm || 'N/A'} BPM
              </span>
            )}
          </div>

          {/* Removed VAD profile information */}

        </div>
      </div>
    </div>
  )
}