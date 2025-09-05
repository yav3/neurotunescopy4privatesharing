import React, { useState, useEffect } from 'react'
import { Play, Pause, Brain, TrendingUp, Clock } from 'lucide-react'
import type { Track } from '@/types'
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
}
import { useAudioStore } from '@/stores'

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

// Deterministic artwork selection to give each song a unique image
const getTherapeuticArtwork = (frequencyBand: string, trackId: string): { url: string; position: string; gradient: string } => {
  // Expanded album art collection for individual songs
  const albumArtwork = [
    '/lovable-uploads/19ca5ad8-bc5b-45c7-b13f-f3182585ae23.png', // Garden path with sunlight
    '/lovable-uploads/67cfdc0c-339d-48e8-776-13ce34bf1a4f.png', // White piano with musical notes
    '/lovable-uploads/d8b56c80-98c4-4a08-be13-deb891d9ecee.png', // Guitars in meadow with flowers
    '/lovable-uploads/9e1bc0cb-0051-4860-86be-69529a277181.png', // Field of pink/white flowers
    '/lovable-uploads/0f6c961c-91b2-4686-b3fe-3a6064af4bc7.png', // Field with butterflies and wildflowers
    '/lovable-uploads/dbaf206d-bc29-4f4c-aeed-34b611a6dc64.png', // Colorful flowers (orange, yellow, pink)
    '/lovable-uploads/e9f49ad3-57da-487a-9db7-f3dafba05e56.png', // Colorful electric guitar
    '/lovable-uploads/3c8ddd8c-7d5a-4d6a-a985-e6509d4fdcbf.png', // Starry/cosmic sky scene
    '/lovable-uploads/fb52f9d9-56f9-4dc4-81c4-f06dd182984b.png', // Forest scene with lights and guitar
    '/lovable-uploads/folk-instruments-meadow.png',
    '/lovable-uploads/classical-meadow-ensemble.png', 
    '/lovable-uploads/string-quartet-studio.png',
    '/lovable-uploads/european-classical-terrace.png',
    '/lovable-uploads/acoustic-sunset-field.png',
    '/lovable-uploads/delta-moonlit-lake.png',
    '/lovable-uploads/theta-misty-path.png',
    '/lovable-uploads/alpha-mountain-lake.png',
    '/lovable-uploads/beta-waterfall.png',
    '/lovable-uploads/gamma-sunbeam-forest.png'
  ]
  
  // Create deterministic seed from trackId to prevent race conditions
  const createSeed = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
  
  // Each track gets a unique image based on its ID
  const seed = createSeed(trackId)
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
    url: albumArtwork[artworkIndex],
    position: 'object-cover',
    gradient: gradientMap[frequencyBand as keyof typeof gradientMap] || gradientMap.alpha
  }
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  console.log('🎵 TrackCard rendered for:', track.title)
  const { playTrack } = useAudioStore()
  
  const primaryApp = track.therapeutic_applications?.[0]
  const frequencyBand = primaryApp?.frequency_band_primary || 'alpha'
  const artwork = React.useMemo(() => getTherapeuticArtwork(frequencyBand, track.id), [frequencyBand, track.id])

  const handlePlayClick = async () => {
    console.log('▶️ TrackCard play button clicked for track:', track.title, track.id);
    
    try {
      console.log('🔄 Playing single track via TrackCard');
      await playTrack(track);
    } catch (error) {
      console.error('❌ Error in TrackCard play click:', error);
    }
  };

  return (
    <div className="group bg-card rounded-2xl border border-border transition-all duration-300 hover:shadow-card hover:border-primary/20 overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Album Artwork */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden relative">
            {/* Therapeutic Nature Background */}
            <img 
              src={artwork.url}
              alt={`${frequencyBand} band therapeutic artwork`}
              className={`w-full h-full object-cover ${artwork.position}`}
            />
            {/* Therapeutic Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${artwork.gradient}`} />
            {/* Frequency Band Indicator */}
            <div className="absolute top-1 right-1">
              <div className="w-3 h-3 rounded-full bg-white/80 flex items-center justify-center">
                <span className="text-[8px] font-bold text-gray-800">
                  {frequencyBand.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Play button overlay */}
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
            aria-label="Play track"
          >
            <Play size={24} className="text-white ml-0.5" />
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

        </div>
      </div>
    </div>
  )
}