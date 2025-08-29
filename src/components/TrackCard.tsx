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
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/resolve-track-url?trackId=${track.id}&type=${type}&bucket=${track.bucket_name || 'neuralpositivemusic'}`)
    
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

// Deterministic artwork selection to prevent race conditions
const getTherapeuticArtwork = (frequencyBand: string, trackId: string): { url: string; position: string; gradient: string } => {
  // Musical instrument variations for different genres/moods
  const musicalArtwork = [
    '/lovable-uploads/folk-instruments-meadow.png',
    '/lovable-uploads/classical-meadow-ensemble.png', 
    '/lovable-uploads/string-quartet-studio.png',
    '/lovable-uploads/european-classical-terrace.png',
    '/lovable-uploads/acoustic-sunset-field.png'
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
  
  const seed = createSeed(trackId)
  const usePrimary = (seed % 2) === 0
  const musicalIndex = seed % musicalArtwork.length
  
  const artworkMap = {
    delta: { 
      url: usePrimary ? '/lovable-uploads/delta-moonlit-lake.png' : musicalArtwork[musicalIndex],
      position: 'object-cover', // Moonlit scenes for deep sleep & healing
      gradient: 'from-blue-900/80 via-slate-800/60 to-blue-800/80'
    },
    theta: { 
      url: usePrimary ? '/lovable-uploads/theta-misty-path.png' : musicalArtwork[musicalIndex],
      position: 'object-cover', // Misty forest paths for meditation
      gradient: 'from-amber-700/80 via-yellow-600/60 to-orange-700/80'
    },
    alpha: { 
      url: usePrimary ? '/lovable-uploads/alpha-mountain-lake.png' : musicalArtwork[musicalIndex],
      position: 'object-cover', // Serene mountain lakes for focus
      gradient: 'from-blue-800/80 via-cyan-600/60 to-teal-700/80'
    },
    beta: { 
      url: usePrimary ? '/lovable-uploads/beta-waterfall.png' : musicalArtwork[musicalIndex],
      position: 'object-cover', // Energetic waterfalls for concentration
      gradient: 'from-green-700/80 via-emerald-600/60 to-teal-700/80'
    },
    gamma: { 
      url: usePrimary ? '/lovable-uploads/gamma-sunbeam-forest.png' : musicalArtwork[musicalIndex],
      position: 'object-cover', // Golden sunbeam forests for peak performance
      gradient: 'from-yellow-600/80 via-orange-500/60 to-red-600/80'
    }
  }
  
  return artworkMap[frequencyBand as keyof typeof artworkMap] || artworkMap.alpha
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  console.log('🎵 TrackCard rendered for:', track.title)
  const { currentTrack, state, loadTrack, toggle } = useAudio()
  
  const isCurrentTrack = currentTrack?.id === track.id
  const isPlaying = isCurrentTrack && state.isPlaying
  const isLoading = isCurrentTrack && state.isLoading
  
  const primaryApp = track.therapeutic_applications?.[0]
  const frequencyBand = primaryApp?.frequency_band_primary || 'alpha'
  const artwork = React.useMemo(() => getTherapeuticArtwork(frequencyBand, track.id), [frequencyBand, track.id])

  const handlePlayClick = async () => {
    console.log('▶️ TrackCard play button clicked for track:', track.title, track.id);
    
    try {
      if (isCurrentTrack && state.isPlaying) {
        console.log('⏸️ Pausing current track');
        toggle();
      } else if (isCurrentTrack && !state.isPlaying) {
        console.log('▶️ Resuming current track');
        toggle();
      } else {
        console.log('🔄 Loading new track:', track.title);
        await loadTrack(track);
        
        // Wait a moment for loading to complete, then play
        setTimeout(() => {
          console.log('▶️ Auto-playing after load');
          if (!state.isPlaying) {
            toggle();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error in play click:', error);
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