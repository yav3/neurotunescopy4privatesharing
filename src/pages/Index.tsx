import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

// Premium Apple Music-inspired card themes
const goalCardThemes = {
  'focus-enhancement': {
    gradient: 'from-blue-500/90 via-cyan-500/80 to-teal-500/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(59,130,246,0.4)]'
  },
  'stress-anxiety-support': {
    gradient: 'from-emerald-500/90 via-green-500/80 to-teal-600/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(16,185,129,0.4)]'
  },
  'cardio-support': {
    gradient: 'from-cyan-500/90 via-sky-500/80 to-blue-600/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(14,165,233,0.4)]'
  },
  'mood-boost': {
    gradient: 'from-yellow-400/90 via-orange-500/80 to-red-500/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(251,146,60,0.4)]'
  },
  'pain-support': {
    gradient: 'from-purple-500/90 via-indigo-500/80 to-blue-600/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(139,92,246,0.4)]'
  },
  'energy-boost': {
    gradient: 'from-orange-500/90 via-yellow-500/80 to-amber-500/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(245,158,11,0.4)]'
  }
};

const Index = () => {
  const navigate = useNavigate();
  
  const handleGoalSelect = (goal: typeof THERAPEUTIC_GOALS[0]) => {
    navigate(`/goals/${goal.id}/genres`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle blue gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_70%_/_0.02),transparent_50%)]" />
      </div>

      {/* Premium Header */}
      <div className="relative overflow-hidden">        
        <div className="relative z-10 px-4 py-8 md:px-6 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-block">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground tracking-tight">
                  Therapeutic Goals
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Choose your therapeutic goal and discover scientifically-crafted music designed to enhance your mental state and wellbeing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Apple Music-inspired Goals Grid */}
      <div className="container px-4 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Premium grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {THERAPEUTIC_GOALS.map((goal, index) => {
              const IconComponent = goal.icon;
              const theme = goalCardThemes[goal.id as keyof typeof goalCardThemes] || goalCardThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out",
                    "aspect-[4/3] rounded-3xl border-0",
                    theme.shadow,
                    "hover:scale-[1.03] hover:-translate-y-3",
                    "active:scale-[0.98] active:duration-100",
                    "focus:outline-none focus:ring-4 focus:ring-white/20",
                    "animate-fade-in backdrop-blur-xl",
                    "hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  )}
                  style={{ 
                    animationDelay: `${index * 150}ms`, 
                    animationFillMode: 'both' 
                  }}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Premium gradient background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-all duration-700",
                    theme.gradient,
                    "group-hover:scale-105"
                  )} />

                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-60" />
                  
                  {/* Apple Music-style content layout */}
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Icon container */}
                    <div className="mb-4">
                      <div className={cn(
                        "inline-flex items-center justify-center w-12 h-12 rounded-2xl",
                        theme.accent,
                        "backdrop-blur-sm border border-white/30",
                        "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      )}>
                        <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
                      </div>
                    </div>

                    {/* Title - Apple Music style */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="space-y-2">
                        <h3 className={cn(
                          "font-bold text-2xl leading-tight tracking-tight",
                          theme.text,
                          "drop-shadow-sm transition-all duration-300",
                          "group-hover:scale-[1.02] group-hover:translate-y-[-2px]"
                        )}>
                          {goal.name}
                        </h3>
                        
                        {/* Subtle description */}
                        <p className="text-white/80 text-sm font-medium leading-relaxed line-clamp-2 drop-shadow-sm">
                          {goal.description}
                        </p>
                      </div>
                    </div>

                    {/* Premium play indicator */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-white rotate-180 transform transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Glass morphism overlay on hover */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
                  </div>

                  {/* Premium shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500 ease-out pointer-events-none rounded-3xl" />
                  
                  {/* Subtle inner border */}
                  <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-card border-t border-border shadow-card">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;
