import React, { useState, useEffect } from 'react'
import { Play, Pause, Brain, TrendingUp, Clock } from 'lucide-react'
import { useAuthContext } from '@/components/auth/AuthProvider'
import type { Track } from '@/types'
import { TitleFormatter } from '@/utils/titleFormatter'
import { ArtworkService } from '@/services/artworkService'
import { useAudioStore } from '@/stores'
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
  // Expanded album art collection with beautiful nature imagery
  const albumArtwork = [
    '/lovable-uploads/d37bdb73-8ea1-4150-a35d-e08dbd929ff2.png', // Pink cosmos flowers in field
    '/lovable-uploads/4d20a0a1-857e-4d94-b1cb-6a9d68ae6910.png', // Field with butterflies and yellow flowers
    '/lovable-uploads/2526e614-65b3-4f38-8875-49396cbf8334.png', // Colorful daisies (yellow, orange, pink)
    '/lovable-uploads/d1dc4c39-c585-469c-b524-10ff6f1e6818.png', // Tropical beach with palm trees
    '/lovable-uploads/c17d43a8-c471-41ec-95d5-1131804b5181.png', // Mountain landscape with river
    '/lovable-uploads/71121ed8-7b8f-4d60-97d4-282e33ca08b2.png', // Yellow flowers under starry sky
    '/lovable-uploads/19a2f398-e797-4f64-b18b-ac2e3b736d30.png', // Vintage piano in flowering field
    '/lovable-uploads/5734dabc-389d-4cdc-9163-5494ea1da3ae.png', // Garden path through flower meadow
    '/lovable-uploads/19ca5ad8-bc5b-45c7-b13f-f3182585ae23.png', // Garden path with sunlight
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
    '/lovable-uploads/gamma-sunbeam-forest.png',
    '/lovable-uploads/262b2035-e633-446a-a217-97d2ec10d8a1.png',
    '/lovable-uploads/4e6f957d-a660-4a2e-9019-364f45cebb99.png',
    '/lovable-uploads/6fa80e74-6c84-4add-bc17-db4cb527a0a2.png',
    '/lovable-uploads/703143dc-8c8a-499e-bd2c-8e526bbe62d5.png',
    '/lovable-uploads/81d914ac-e118-4490-b539-e4dfa81be820.png',
    '/lovable-uploads/bd9f321d-961d-4c98-b4ba-32de014d6a9b.png',
    '/lovable-uploads/f252233e-2545-4bdc-ae4f-7aee7b58db7f.png'
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
    url: albumArtwork[artworkIndex],
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
              onError={() => setIsImageLoading(false)}
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
          <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
            {TitleFormatter.formatTrackTitle(track.title)}
          </h3>
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