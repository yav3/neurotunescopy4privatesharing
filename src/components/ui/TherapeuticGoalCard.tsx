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
        "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "bg-gradient-to-br from-card to-card/80 border-border/50",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative">
        {/* Background Image */}
        <img 
          src={artwork} 
          alt={goal.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          {/* Bottom Section - Title and Details */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg leading-tight">
              {goal.name}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {goal.description}
            </p>
            
            {/* VAD Profile removed */}
            
            {/* BPM Range and Effectiveness */}
            <div className="flex items-center gap-2 flex-wrap">
              {showBpmRange && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                  {goal.bpmRange.min}-{goal.bpmRange.max} BPM
                </Badge>
              )}
              
              {effectiveness !== undefined && (
                <Badge variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                  {effectiveness}% effective
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};