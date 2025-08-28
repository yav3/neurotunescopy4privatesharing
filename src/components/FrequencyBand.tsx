import React from 'react';
import { cn } from '@/lib/utils';

interface FrequencyBandProps {
  band: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  power: number;
  therapeuticScore?: number;
  className?: string;
}

const bandInfo = {
  delta: {
    name: 'Delta',
    range: '0.5-4 Hz',
    color: 'bg-purple-500',
    description: 'Deep sleep, healing'
  },
  theta: {
    name: 'Theta', 
    range: '4-8 Hz',
    color: 'bg-blue-500',
    description: 'Meditation, creativity'
  },
  alpha: {
    name: 'Alpha',
    range: '8-13 Hz', 
    color: 'bg-green-500',
    description: 'Relaxation, focus'
  },
  beta: {
    name: 'Beta',
    range: '13-30 Hz',
    color: 'bg-yellow-500', 
    description: 'Active thinking, alertness'
  },
  gamma: {
    name: 'Gamma',
    range: '30-100 Hz',
    color: 'bg-red-500',
    description: 'High-level cognition'
  }
};

export const FrequencyBand: React.FC<FrequencyBandProps> = ({ 
  band, 
  power, 
  therapeuticScore,
  className 
}) => {
  const info = bandInfo[band];
  
  return (
    <div className={cn('p-3 rounded-lg bg-card border', className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn('w-3 h-3 rounded-full', info.color)} />
          <span className="font-medium text-sm">{info.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">{info.range}</span>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Power</span>
            <span>{(power * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn('h-2 rounded-full transition-all', info.color)}
              style={{ width: `${Math.min(power * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {therapeuticScore !== undefined && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Therapeutic</span>
              <span>{(therapeuticScore * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(therapeuticScore * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">{info.description}</p>
    </div>
  );
};