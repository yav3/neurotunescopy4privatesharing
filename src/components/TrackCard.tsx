import React from 'react'
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

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  console.log('🎵 TrackCard rendered for:', track.title)
  const { currentTrack, state, loadTrack, toggle } = useAudio()
  
  const isCurrentTrack = currentTrack?.id === track.id
  const isPlaying = isCurrentTrack && state.isPlaying
  const isLoading = isCurrentTrack && state.isLoading
  
  const primaryApp = track.therapeutic_applications?.[0]

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
    <div className="group bg-card/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl border-border hover:border-border/80">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {track.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="capitalize">{track.genre}</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {track.bpm} BPM
            </span>
          </div>
        </div>
        
        <button
          onClick={handlePlayClick}
          disabled={isLoading}
          className="relative p-4 rounded-full transition-all duration-300 group-hover:scale-110 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} className="ml-1" />
          )}
        </button>
      </div>

      {primaryApp && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-primary" />
            <span className="text-sm text-foreground capitalize">
              {primaryApp.frequency_band_primary} Band
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {primaryApp.condition_targets?.slice(0, 3).map((condition) => (
              <span 
                key={condition} 
                className="px-2 py-1 bg-secondary text-xs rounded-full text-secondary-foreground"
              >
                {condition.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Energy</span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-secondary rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" 
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
            <div className="flex-1 bg-secondary rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-1.5 rounded-full" 
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
  )
}