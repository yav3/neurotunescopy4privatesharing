import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartTitleParser } from '@/utils/smartTitleParser';
import { ArtworkService } from '@/services/artworkService';
import { ArtworkMedia } from '@/components/ui/ArtworkMedia';

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
      {/* Background media with gradient overlay (supports images, GIFs, and videos) */}
      <ArtworkMedia 
        src={artwork.url}
        alt={formattedTitle}
        className="transition-transform duration-300 group-hover:scale-110"
        containerClassName="absolute inset-0 w-full h-full"
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