import React from 'react';
import { Card } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTrackTitleForDisplay } from '@/utils/trackTitleFormatter';

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
  // Expanded album art collection with beautiful nature imagery
  const albumArtwork = [
    '/lovable-uploads/acoustic-sunset-field.png',
    '/lovable-uploads/classical-meadow-ensemble.png', 
    '/lovable-uploads/european-classical-terrace.png',
    '/lovable-uploads/folk-instruments-meadow.png',
    '/lovable-uploads/string-quartet-studio.png',
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
  ];
  
  // Enhanced seed generation for better distribution
  const createEnhancedSeed = (str: string): number => {
    let hash = 5381;
    let hash2 = 5381;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) + hash) + char; // hash * 33 + char
      hash2 = ((hash2 << 5) + hash2) + char * 17; // Different multiplier for variation
    }
    
    // Combine both hashes for better distribution
    return Math.abs(hash ^ hash2);
  };
  
  // Use enhanced seeding with track ID and frequency band for more variety
  const combinedSeed = trackId + frequencyBand;
  const seed = createEnhancedSeed(combinedSeed);
  const artworkIndex = seed % albumArtwork.length;
  
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
    url: albumArtwork[artworkIndex],
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
  const artwork = getTherapeuticArtwork(frequencyBand, track.id);
  const formattedTitle = formatTrackTitleForDisplay(track.title);

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
          backgroundPosition: artwork.position
        }}
        onError={(e) => {
          console.warn('❌ Failed to load track card artwork:', artwork.url);
          // Fallback to a solid gradient when image fails
          e.currentTarget.style.backgroundImage = 'none';
          e.currentTarget.style.background = 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))';
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
        
        {/* Track info */}
        <div className="text-center">
          <h3 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2 mb-1">
            {formattedTitle}
          </h3>
          <p className="text-xs text-white/70 capitalize">
            {frequencyBand} Frequency
          </p>
        </div>
      </div>
    </Card>
  );
};