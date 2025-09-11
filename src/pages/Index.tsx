import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

// Enhanced color themes for each goal
const goalThemes = {
  'focus-enhancement': {
    gradient: 'from-cyan-600 via-teal-500 to-blue-400',
    bg: 'from-cyan-900/80 via-teal-900/60 to-blue-800/40',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20 hover:border-cyan-400/40'
  },
  'stress-anxiety-support': {
    gradient: 'from-green-600 via-emerald-500 to-teal-400',
    bg: 'from-green-900/80 via-emerald-900/60 to-teal-800/40',
    accent: 'text-green-400',
    border: 'border-green-500/20 hover:border-green-400/40'
  },
  'cardio-support': {
    gradient: 'from-teal-600 via-cyan-500 to-blue-400',
    bg: 'from-teal-900/80 via-cyan-900/60 to-blue-800/40',
    accent: 'text-teal-400',
    border: 'border-teal-500/20 hover:border-teal-400/40'
  },
  'mood-boost': {
    gradient: 'from-cyan-500 via-teal-500 to-green-400',
    bg: 'from-cyan-900/80 via-teal-900/60 to-green-800/40',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20 hover:border-cyan-400/40'
  },
  'pain-support': {
    gradient: 'from-blue-600 via-indigo-500 to-cyan-400',
    bg: 'from-blue-900/80 via-indigo-900/60 to-cyan-800/40',
    accent: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-400/40'
  },
  'energy-boost': {
    gradient: 'from-teal-600 via-cyan-500 to-blue-400',
    bg: 'from-teal-900/80 via-cyan-900/60 to-blue-800/40',
    accent: 'text-teal-400',
    border: 'border-teal-500/20 hover:border-teal-400/40'
  }
};

const Index = () => {
  const navigate = useNavigate();
  
  const handleGoalSelect = (goal: typeof THERAPEUTIC_GOALS[0]) => {
    navigate(`/goals/${goal.id}/genres`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating glass orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 backdrop-blur-md rounded-full shadow-glass animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 backdrop-blur-md rounded-full shadow-glass animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/4 backdrop-blur-md rounded-full shadow-glass animate-pulse delay-500" />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/6 backdrop-blur-md rounded-full shadow-glass animate-pulse delay-1500" />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_70%_/_0.06),transparent_50%)]" />
      </div>

      {/* Glassmorphism Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-secondary/10 to-transparent backdrop-blur-xl" />
        
        <div className="relative z-10 px-4 py-2 md:px-6 md:py-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-2 md:mb-4">
              {/* Glassmorphism title container */}
              <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 shadow-glass-lg">
                <h1 className="text-lg md:text-2xl font-bold mb-1 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-sf">
                  Therapeutic Goals
                </h1>
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Glassmorphism Goals Grid */}
      <div className="px-4 -mt-2 pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
            {THERAPEUTIC_GOALS.map((goal, index) => {
              const IconComponent = goal.icon;
              const theme = goalThemes[goal.id as keyof typeof goalThemes] || goalThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-700 aspect-[5/4]",
                    "bg-white/5 backdrop-blur-md border border-white/10",
                    "shadow-glass hover:shadow-glass-lg",
                    "hover:scale-[1.02] hover:-translate-y-1 hover:bg-white/8",
                    "hover:border-white/20",
                    "animate-fade-in"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`, 
                    animationFillMode: 'both' 
                  }}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Background Image with Glassmorphism Overlay */}
                  <div className="absolute inset-0">
                    <img 
                      src={goal.artwork} 
                      alt={goal.name}
                      className="w-full h-full object-cover object-center transition-all duration-1000 group-hover:scale-110"
                    />
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] group-hover:backdrop-blur-[4px] transition-all duration-700" />
                  </div>

                  {/* Glassmorphism border effect */}
                  <div className="absolute inset-0 rounded-lg border border-white/10 group-hover:border-white/20 transition-all duration-300" />
                  
                  {/* Content with enhanced glassmorphism */}
                  <div className="relative z-10 p-2 md:p-3 h-full flex flex-col justify-between items-center text-center">
                    <div className="flex flex-col items-center space-y-1 flex-1 justify-center">
                      {/* Glassmorphism text background */}
                      <div className="bg-black/20 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
                        <h3 className="text-xs md:text-sm font-bold text-white group-hover:text-white transition-colors leading-tight font-sf">
                          {goal.name}
                        </h3>
                      </div>
                    </div>

                    {/* Enhanced Glassmorphism Button */}
                    <div className="mt-auto pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "transition-all duration-500",
                          "bg-white/10 backdrop-blur-md border border-white/20",
                          "text-white hover:text-white",
                          "hover:bg-white/20 hover:border-white/30",
                          "px-2 py-1 text-xs font-medium font-sf",
                          "shadow-glass-inset hover:shadow-glass",
                          "group-hover:scale-105"
                        )}
                      >
                        Explore Genres
                        <ArrowLeft className="w-3 h-3 ml-1 rotate-180 transition-all duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                  
                  {/* Glassmorphism glow */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Glassmorphism Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 shadow-glass-lg">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;
