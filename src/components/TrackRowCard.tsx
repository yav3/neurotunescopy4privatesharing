import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartTitleParser } from '@/utils/smartTitleParser';
import { ArtworkService } from '@/services/artworkService';
import { handleImageError, getAlbumArtworkUrl } from '@/utils/imageUtils';

interface TrackRowCardProps {
  track: {
    id: string;
    title: string;
    storage_bucket?: string;
    storage_key?: string;
  };
  isPlaying?: boolean;
  onPlay: () => void;
  className?: string;
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
  ];
  
  // Simple but effective unique selection based on track ID
  let hash = 0;
  for (let i = 0; i < trackId.length; i++) {
    hash = ((hash << 5) - hash + trackId.charCodeAt(i)) & 0xffffffff;
  }
  hash = Math.abs(hash);
  
  const artworkIndex = hash % albumArtwork.length;
  
  // Gradient based on frequency band for therapeutic visual cues
  const gradients = {
    delta: 'from-indigo-500/20 via-purple-500/20 to-blue-500/20',
    theta: 'from-purple-500/20 via-pink-500/20 to-violet-500/20', 
    alpha: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    beta: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
    gamma: 'from-red-500/20 via-rose-500/20 to-pink-500/20',
    default: 'from-slate-500/20 via-gray-500/20 to-zinc-500/20'
  };
  
  const gradient = gradients[frequencyBand as keyof typeof gradients] || gradients.default;
  
  return {
    url: getAlbumArtworkUrl(albumArtwork[artworkIndex]),
    position: 'center',
    gradient
  };
};

export const TrackRowCard: React.FC<TrackRowCardProps> = ({ 
  track, 
  isPlaying = false, 
  onPlay, 
  className 
}) => {
  // Generate frequency band from track properties for artwork selection
  const getFrequencyBand = (track: any): string => {
    const bands = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    const hash = track.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return bands[hash % bands.length];
  };

  const frequencyBand = getFrequencyBand(track);
  const artwork = ArtworkService.getTherapeuticArtwork(frequencyBand, track.id);
  const formattedTitle = SmartTitleParser.getDisplayTitle(track.title, { maxLength: 30, context: 'list' });

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "hover:scale-105 hover:shadow-xl",
        "w-full h-full",
        className
      )}
      onClick={onPlay}
    >
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundImage: `url(${artwork.url})`,
          backgroundPosition: 'center'
        }}
        onError={(e) => {
          console.warn('❌ Failed to load track card artwork:', artwork.url);
          handleImageError(e as any);
        }}
      />
      
      {/* Gradient overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-t", artwork.gradient)} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4 text-white">
        {/* Play/Pause button */}
        <div className="flex justify-center">
          <button className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            "bg-white/20 backdrop-blur-sm hover:bg-white/30",
            "opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          )}>
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </button>
        </div>
        
        {/* Track info - Only visible on hover */}
        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-normal text-xs sm:text-sm leading-tight line-clamp-2 mb-1">
            {formattedTitle}
          </h3>
          {/* Removed frequency band text to reduce clutter */}
        </div>
      </div>
    </Card>
  );
};