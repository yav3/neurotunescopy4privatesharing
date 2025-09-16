import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { handleImageError } from '@/utils/imageUtils';
import type { TherapeuticGoal } from '@/config/therapeuticGoals';

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
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group",
        // Enhanced glass morphism base
        "bg-white/[0.02] backdrop-blur-md border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.1),0_4px_16px_rgba(255,255,255,0.05)_inset]",
        "transition-all duration-700 ease-out",
        // Enhanced hover effects with more shine
        "hover:bg-white/[0.05] hover:backdrop-blur-lg hover:border-white/20",
        "hover:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_32px_rgba(255,255,255,0.1)_inset]",
        "hover:-translate-y-3 hover:scale-[1.03]",
        "animate-fade-in",
        "w-full h-full",
        // Selected state with enhanced glow
        isSelected && [
          "ring-2 ring-primary/50 ring-offset-2 ring-offset-background/50",
          "shadow-[0_0_40px_hsl(217_91%_60%_/_0.3),0_0_20px_hsl(217_91%_60%_/_0.2)]",
          "bg-white/[0.08] border-primary/30"
        ],
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-[4/3] relative">
        {/* Background Image with enhanced shine */}
        <img 
          src={goal.artwork} 
          alt={goal.name}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-125"
          onError={handleImageError}
        />
        
        {/* Enhanced Gradient Overlay with glass effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] via-transparent to-white/[0.08] opacity-60 group-hover:opacity-80 transition-all duration-500" />
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        
        {/* Moving light reflection */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        {/* Content - Enhanced with glass morphism backdrop */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
          <div className="backdrop-blur-sm bg-black/20 rounded-xl p-3 border border-white/10 transform transition-all duration-300 group-hover:translate-y-[-4px] group-hover:bg-black/30 group-hover:border-white/20">
            <h3 className="text-white font-semibold text-base sm:text-lg leading-tight drop-shadow-lg mb-1 line-clamp-2">
              {goal.name}
            </h3>
            <div className="space-y-1.5 mt-1">
              
              {/* BPM Range and Effectiveness with glass morphism */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                {showBpmRange && (
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/30 text-xs hover:bg-white/20 hover:border-white/40 transition-all duration-200">
                    {goal.bpmRange.min}-{goal.bpmRange.max} BPM
                  </Badge>
                )}
                
                {effectiveness !== undefined && (
                  <Badge variant="outline" className="bg-primary/20 backdrop-blur-sm text-white border-primary/30 text-xs hover:bg-primary/30 hover:border-primary/40 transition-all duration-200">
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