import React from 'react';
import { Play, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GenreCardProps {
  genre: {
    id: string;
    name: string;
    description: string;
    trackCount?: string;
    image: string;
  };
  onSelect: (genreId: string) => void;
  index: number;
}

export const GenreCard: React.FC<GenreCardProps> = ({
  genre,
  onSelect,
  index
}) => {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer aspect-square",
          "bg-gradient-to-br from-card/80 to-card backdrop-blur-sm",
          "border border-border/50 shadow-card",
          "transition-all duration-700 ease-out",
          "hover:shadow-[0_32px_80px_hsl(217_91%_60%_/_0.25),_0_16px_40px_hsl(217_91%_5%_/_0.4)]",
          "hover:border-primary/40 hover:-translate-y-3 hover:scale-[1.02]"
        )}
        onClick={() => onSelect(genre.id)}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={genre.image}
            alt={genre.name}
            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Gradient overlays matching therapeutic goals cards */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
        </div>
        
        {/* Floating badge */}
        <div className="absolute top-3 right-3 p-2.5 rounded-2xl bg-card/20 backdrop-blur-md border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-card/30">
          <Headphones className="w-4 h-4 text-primary" />
        </div>
        
        {/* Track count badge */}
        {genre.trackCount && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-card/90 backdrop-blur-md rounded-full text-xs font-medium text-foreground border border-border/30">
            {genre.trackCount}
          </div>
        )}
        
        {/* Content - positioned like therapeutic goals */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="relative z-10">
            <h3 
              className="font-bold text-base md:text-lg leading-tight tracking-wide uppercase mb-2 text-white"
              style={{ 
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                fontWeight: '700'
              }}
            >
              {genre.name}
            </h3>
            <p 
              className="text-sm mb-3 leading-relaxed text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300"
              style={{ 
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
              }}
            >
              {genre.description}
            </p>
            
            {/* Begin session button */}
            <Button
              className={cn(
                "w-full h-10 rounded-xl font-semibold text-sm",
                "bg-primary/90 hover:bg-primary text-primary-foreground",
                "border-2 border-primary/20 hover:border-primary",
                "transition-all duration-300 group-hover:shadow-lg",
                "backdrop-blur-sm"
              )}
            >
              <Play className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Begin Session
            </Button>
          </div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200 pointer-events-none" />
        
        {/* Glow animation */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-glow-pulse" />
      </Card>
    </div>
  );
};