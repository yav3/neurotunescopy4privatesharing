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
  // Album art collection using actual image files from albumart bucket
  const albumArtwork = [
    '0376232F-FE92-48B6-A567-7C41465B4FC9.jpeg',
    '0567F220-7680-45A5-8A8F-2FBECEB7897A.png',
    '060CF7F4-0364-413A-B67C-918425A65E00.png',
    '0952E3E2-B28A-40C3-A8FC-8DF06B1FEE8C.png',
    '1C6EE324-F72C-4A71-B3FF-D95CAA0213AA.png',
    '20250923_1807_Raindrops on Flowers_remix_01k5w9sreqfr09xb2z6weqharz.png',
    '20250923_1807_Raindrops on Flowers_remix_01k5w9sreteg2926newecbemk2.png',
    '23BBBDD8-DEFE-4E5E-ACE8-3AD7236A8DB4.png',
    '2ACA42CF-B561-4B75-9791-6CBCFA027324.png',
    '4908E73D-F244-481F-AF7D-07C2B940A896.png',
    '4FAB6938-003B-495E-8F76-E023ECFE3FED.png',
    '5117186C-B343-411F-B723-7D81AE9CFCFC.png',
    '6B3C9F3D-1E42-4DCB-8842-6A839A0D1522.png',
    '858E4960-5081-4611-B555-AC7A4E368D74.png',
    '8881A6E9-7010-4BFB-8126-3B956FEABDBC.png',
    '906DB39C-81D6-437B-A009-BEC981F73116.png',
    '9578DACE-A5C2-43BF-BAA9-76FAF94C2E1F.png'
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