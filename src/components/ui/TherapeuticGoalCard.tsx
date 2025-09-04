import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { type TherapeuticGoal } from '@/config/therapeuticGoals';

interface TherapeuticGoalCardProps {
  goal: TherapeuticGoal;
  trackCount?: number;
  isSelected?: boolean;
  showProgress?: boolean;
  showBpmRange?: boolean;
  showEffectiveness?: boolean;
  effectiveness?: number;
  onClick?: () => void;
  className?: string;
}

export function TherapeuticGoalCard({
  goal,
  trackCount,
  isSelected = false,
  showProgress = false,
  showBpmRange = true,
  showEffectiveness = false,
  effectiveness,
  onClick,
  className
}: TherapeuticGoalCardProps) {
  const Icon = goal.icon;
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg",
        isSelected && `ring-2 ring-${goal.color}-500 shadow-lg`,
        `hover:shadow-${goal.color}-500/20`,
        className
      )}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 opacity-10 bg-gradient-to-br",
        goal.gradient
      )} />
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg bg-gradient-to-br",
              goal.gradient,
              "text-white shadow-md"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {goal.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            </div>
          </div>
          
          {isSelected && (
            <Badge variant="default" className={`bg-${goal.color}-500`}>
              Active
            </Badge>
          )}
        </div>
        
        {/* Metrics Row */}
        <div className="flex items-center justify-between mb-3">
          {trackCount !== undefined && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                {trackCount}
              </span>
              <span className="text-sm text-muted-foreground">
                tracks available
              </span>
            </div>
          )}
          
          {showEffectiveness && effectiveness !== undefined && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">
                Effectiveness:
              </span>
              <Badge 
                variant={effectiveness >= 80 ? "default" : effectiveness >= 60 ? "secondary" : "outline"}
                className={effectiveness >= 80 ? `bg-${goal.color}-500` : ''}
              >
                {effectiveness}%
              </Badge>
            </div>
          )}
        </div>
        
        {/* BPM Range */}
        {showBpmRange && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Therapeutic BPM Range</span>
              <span className="font-mono text-foreground">
                {goal.bpmRange.min}-{goal.bpmRange.max} 
                <span className="text-muted-foreground ml-1">
                  (optimal: {goal.bpmRange.optimal})
                </span>
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full bg-gradient-to-r", goal.gradient)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
        
        {/* Progress */}
        {showProgress && goal.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{goal.progress}%</span>
            </div>
            <Progress 
              value={goal.progress} 
              className="h-2"
            />
          </div>
        )}
        
        {/* VAD Profile (for advanced users) */}
        <div className="text-xs text-muted-foreground">
          <span>VAD Profile: </span>
          <span className="font-mono">
            V:{goal.vadProfile.valence.toFixed(1)} 
            A:{goal.vadProfile.arousal.toFixed(1)} 
            D:{goal.vadProfile.dominance.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}