import React, { useState, useEffect } from 'react'
import { Play, Pause, Brain, TrendingUp, Clock } from 'lucide-react'
import { useAuthContext } from '@/components/auth/AuthProvider'
import type { Track } from '@/types'
import { SmartTitle } from '@/components/ui/SmartTitle'
import { ArtworkService } from '@/services/artworkService'
import { useAudioStore } from '@/stores'
import { getAlbumArtworkUrl, handleImageError } from '@/utils/imageUtils'
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

// Enhanced artwork selection with better distribution for each track
const getTherapeuticArtwork = (frequencyBand: string, trackId: string): { url: string; position: string; gradient: string } => {
  // Album art collection using actual files from albumart bucket
  const albumArtwork = [
    'Barcelona Part Three Tropical House  (1).mp3',
    'Tropical House Focus 2.mp3',
    'Oud and strings tropcial house focus 5.mp3',
    'Tropical House Focus 2 (2).mp3',
    'Oud Tropical House 2 (1).mp3',
    'Tropical House Focus 2 (3).mp3',
    'Tropical House Focus (Cover) (2).mp3',
    'Tropical House Focus (4).mp3',
    'Oud Classical World House Focus.mp3',
    'Barcelona Tropical House (1).mp3',
    'Tropical House Focus (1).mp3',
    'Meditations on Intonation .mp3',
    'Barcelona Part Two Tropical House  (1).mp3',
    'Oud and mandolin tropical house focus.mp3',
    'Malaga Tropical House Focus 2.mp3',
    'Malaga Tropical House Focus (1).mp3',
    'Malaga Tropical House Focus.mp3',
    'Oud and mandolin tropical house focus 3.mp3',
    'Malaga Tropical House (2).mp3',
    'Malaga Tropical House.mp3',
    'Oud house.mp3',
    'Tropical House Focus (Cover) (1).mp3',
    'Oud Tropical House .mp3',
    'Barcelona Part Three Tropical House .mp3',
    'Malaga Tropical House (1).mp3'
  ]
  
  // Enhanced seed generation for better distribution
  const createEnhancedSeed = (str: string): number => {
    let hash = 5381
    let hash2 = 5381
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) + hash) + char // hash * 33 + char
      hash2 = ((hash2 << 5) + hash2) + char * 17 // Different multiplier for variation
    }
    
    // Combine both hashes for better distribution
    return Math.abs(hash ^ hash2)
  }
  
  // Use enhanced seeding with track ID and frequency band for more variety
  const combinedSeed = trackId + frequencyBand
  const seed = createEnhancedSeed(combinedSeed)
  const artworkIndex = seed % albumArtwork.length
  
  // Gradient based on frequency band for therapeutic visual cues
  const gradientMap = {
    delta: 'from-blue-900/70 via-slate-800/50 to-blue-800/70', // Deep sleep & healing
    theta: 'from-amber-700/70 via-yellow-600/50 to-orange-700/70', // Meditation
    alpha: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70', // Focus
    beta: 'from-green-700/70 via-emerald-600/50 to-teal-700/70', // Concentration
    gamma: 'from-yellow-600/70 via-orange-500/50 to-red-600/70' // Peak performance
  }
  
  return {
    url: getAlbumArtworkUrl(albumArtwork[artworkIndex]),
    position: 'object-cover',
    gradient: gradientMap[frequencyBand as keyof typeof gradientMap] || gradientMap.alpha
  }
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  console.log('🎵 TrackCard rendered for:', track.title)
  const { playTrack } = useAudioStore()
  const { isAdmin } = useAuthContext()
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isPlayLoading, setIsPlayLoading] = useState(false)
  
  const primaryApp = track.therapeutic_applications?.[0]
  const frequencyBand = primaryApp?.frequency_band_primary || 'alpha'
  const artwork = React.useMemo(() => 
    ArtworkService.getTherapeuticArtwork(frequencyBand, track.id), 
    [frequencyBand, track.id]
  )

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