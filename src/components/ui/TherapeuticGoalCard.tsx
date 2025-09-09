import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TherapeuticGoal } from '@/config/therapeuticGoals';

// Import the artwork images
import acousticArtwork from '@/assets/acoustic-artwork.jpg';
import focusArtwork from '@/assets/focus-artwork.jpg';
import moodBoostArtwork from '@/assets/mood-boost-artwork.jpg';
import sleepArtwork from '@/assets/sleep-artwork.jpg';

// Map therapeutic goals to their artwork
const getGoalArtwork = (goalId: string): string => {
  const artworkMap: Record<string, string> = {
    'focus-enhancement': focusArtwork,
    'anxiety-relief': '/lovable-uploads/alpha-mountain-lake.png',
    'stress-reduction': '/lovable-uploads/beta-waterfall.png',
    'sleep-preparation': sleepArtwork,
    'mood-boost': moodBoostArtwork,
    'meditation-support': '/lovable-uploads/gamma-sunbeam-forest.png',
  };
  
  return artworkMap[goalId] || acousticArtwork;
};

interface TherapeuticGoalCardProps {
  goal: TherapeuticGoal;
  isSelected?: boolean;
  showBpmRange?: boolean;
  trackCount?: number;
  effectiveness?: number;
  onClick?: () => void;
  className?: string;
}

export const TherapeuticGoalCard: React.FC<TherapeuticGoalCardProps> = ({
  goal,
  isSelected = false,
  showBpmRange = true,
  trackCount,
  effectiveness,
  onClick,
  className
}) => {
  const artwork = getGoalArtwork(goal.id);
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group",
        "bg-gradient-card shadow-card",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_20px_60px_hsl(217_91%_60%_/_0.3),_0_8px_24px_hsl(217_91%_5%_/_0.6)]",
        "hover:border-primary/40 hover:-translate-y-2 hover:scale-[1.02]",
        "animate-fade-in",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[0_0_30px_hsl(217_91%_60%_/_0.4)]",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative">
        {/* Background Image */}
        <img 
          src={artwork} 
          alt={goal.name}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 group-hover:from-black/70 transition-all duration-500" />
        
        {/* Animated glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t from-primary/60 to-transparent" />
        
        {/* Content - Fixed positioning for perfect alignment */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg mb-1">
              {goal.name}
            </h3>
            <div className="space-y-1.5 mt-1">
              <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                Curated music designed to enhance your {goal.name.toLowerCase()} experience
              </p>
              
              {/* BPM Range and Effectiveness */}
              <div className="flex items-center gap-2 flex-wrap opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {showBpmRange && (
                  <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-xs backdrop-blur-sm hover:bg-white/20 transition-colors duration-200">
                    {goal.bpmRange.min}-{goal.bpmRange.max} BPM
                  </Badge>
                )}
                
                {effectiveness !== undefined && (
                  <Badge variant="outline" className="bg-primary/20 text-white border-primary/30 text-xs backdrop-blur-sm hover:bg-primary/30 transition-colors duration-200">
                    {effectiveness}% effective
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};