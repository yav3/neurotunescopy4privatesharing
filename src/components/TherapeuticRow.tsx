import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, Heart, Brain, Moon, Plus, Headphones } from 'lucide-react';
import { TherapeuticGoal } from '@/config/therapeuticGoals';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TherapeuticRowProps {
  goal: TherapeuticGoal;
  className?: string;
}

// Icon mapping for each therapeutic goal
const goalIcons = {
  'focus-enhancement': Brain,
  'stress-anxiety-support': Heart,
  'sleep-support': Moon,
  'mood-boost': Plus,
  'pain-support': Target,
  'energy-boost': Headphones,
  'default': Brain
};

// Theme colors for each goal
const goalThemes = {
  'focus-enhancement': {
    gradient: 'from-blue-600 to-cyan-400',
    bg: 'from-blue-900/20 to-cyan-900/10',
    accent: 'text-blue-500',
    border: 'border-blue-500/20 hover:border-blue-400/40'
  },
  'stress-anxiety-support': {
    gradient: 'from-green-600 to-emerald-400',
    bg: 'from-green-900/20 to-emerald-900/10',
    accent: 'text-green-500',
    border: 'border-green-500/20 hover:border-green-400/40'
  },
  'sleep-support': {
    gradient: 'from-indigo-600 to-purple-400',
    bg: 'from-indigo-900/20 to-purple-900/10',
    accent: 'text-indigo-500',
    border: 'border-indigo-500/20 hover:border-indigo-400/40'
  },
  'mood-boost': {
    gradient: 'from-yellow-500 to-orange-400',
    bg: 'from-yellow-900/20 to-orange-900/10',
    accent: 'text-yellow-600',
    border: 'border-yellow-500/20 hover:border-yellow-400/40'
  },
  'pain-support': {
    gradient: 'from-purple-600 to-pink-400',
    bg: 'from-purple-900/20 to-pink-900/10',
    accent: 'text-purple-500',
    border: 'border-purple-500/20 hover:border-purple-400/40'
  },
  'energy-boost': {
    gradient: 'from-red-600 to-orange-400',
    bg: 'from-red-900/20 to-orange-900/10',
    accent: 'text-red-500',
    border: 'border-red-500/20 hover:border-red-400/40'
  }
};

export const TherapeuticRow: React.FC<TherapeuticRowProps> = ({ goal, className }) => {
  const navigate = useNavigate();
  
  const handleGoalClick = () => {
    navigate(`/goals/${goal.id}/genres`);
  };

  const IconComponent = goalIcons[goal.id as keyof typeof goalIcons] || goalIcons.default;
  const theme = goalThemes[goal.id as keyof typeof goalThemes] || goalThemes['focus-enhancement'];

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden",
        "bg-card/90 backdrop-blur-sm",
        theme.border,
        className
      )}
      onClick={handleGoalClick}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
        <img 
          src={goal.artwork} 
          alt={goal.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Background gradient overlay */}
      <div className={cn("absolute inset-0 opacity-90 group-hover:opacity-95 transition-opacity duration-500 bg-gradient-to-br", theme.bg)} />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon */}
            <div className={cn(
              "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110",
              "bg-gradient-to-br", theme.gradient,
              "shadow-lg group-hover:shadow-xl"
            )}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 
                className="text-lg font-semibold mb-2 text-foreground group-hover:text-foreground transition-colors"
                style={{ 
                  color: 'hsl(var(--foreground)) !important'
                }}
              >
                {goal.name}
              </h3>
              <p 
                className="text-sm text-muted-foreground group-hover:text-muted-foreground/90 transition-colors leading-relaxed mb-4"
                style={{ 
                  color: 'hsl(var(--muted-foreground)) !important'
                }}
              >
                {goal.description}
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded-full">
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", theme.accent.replace('text-', 'bg-'))} />
                  Science-backed
                </div>
                <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded-full">
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", theme.accent.replace('text-', 'bg-'))} />
                  Multiple genres
                </div>
                <div className="inline-flex items-center text-xs bg-secondary/50 px-2 py-1 rounded-full">
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", theme.accent.replace('text-', 'bg-'))} />
                  Personalized
                </div>
              </div>
              
              {/* Action text */}
              <div 
                className="text-sm text-muted-foreground group-hover:text-primary transition-colors"
                style={{ 
                  color: 'hsl(var(--muted-foreground)) !important'
                }}
              >
                Explore music genres →
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex items-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
    </Card>
  );
};
