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
    gradient: 'from-pink-500/90 via-rose-500/80 to-red-500/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(244,63,94,0.4)]'
  },
  'pain-support': {
    gradient: 'from-blue-900/90 via-blue-800/80 to-slate-900/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(30,58,138,0.4)]'
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
      {/* Deep Blue Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle blue gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_70%_/_0.02),transparent_50%)]" />
        
        {/* Abstract deep blue shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-slate-800/15 to-transparent rounded-full blur-2xl transform translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Compact Header */}
      <div className="relative overflow-hidden">        
        <div className="relative z-10 px-4 py-6 md:px-6 md:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                Home
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Apple Music-inspired Goals Grid */}
      <div className="container px-4 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Compact grid layout that fits in viewport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {THERAPEUTIC_GOALS.map((goal, index) => {
              const IconComponent = goal.icon;
              const theme = goalCardThemes[goal.id as keyof typeof goalCardThemes] || goalCardThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out",
                    "aspect-[5/3] rounded-2xl border-0", // More compact aspect ratio
                    theme.shadow,
                    "hover:scale-[1.02] hover:-translate-y-1", // Reduced hover effects
                    "active:scale-[0.98] active:duration-100",
                    "focus:outline-none focus:ring-4 focus:ring-white/20",
                    "animate-fade-in backdrop-blur-xl",
                    "hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]" // Reduced shadow
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`, // Faster stagger
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

                  {/* Abstract geometric shapes */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Primary abstract shape */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
                    <div className="absolute top-1/3 -left-8 w-24 h-24 rotate-45 bg-white/8 rounded-2xl blur-lg" />
                    <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-white/12 blur-md" />
                    
                    {/* Secondary geometric elements */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/20 rounded-full opacity-30" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/15 rounded-lg rotate-12 blur-sm" />
                  </div>

                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-60" />
                  
                  {/* Compact content layout */}
                  <div className="relative z-10 p-4 h-full flex flex-col">
                    {/* Icon container */}
                    <div className="mb-3">
                      <div className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-xl", // Smaller icon
                        theme.accent,
                        "backdrop-blur-sm border border-white/30",
                        "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      )}>
                        <IconComponent className="w-5 h-5 text-white drop-shadow-sm" />
                      </div>
                    </div>

                    {/* Title - Compact style */}
                    <div className="flex-1 flex flex-col justify-end">
                       <div className="space-y-1">
                         <h3 className={cn(
                           "font-bold text-lg leading-tight tracking-tight",
                           theme.text,
                           "drop-shadow-sm transition-all duration-300",
                           "group-hover:scale-[1.02] group-hover:translate-y-[-1px]"
                         )}>
                           {goal.name}
                         </h3>
                       </div>
                     </div>

                     {/* Hover text overlay */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px] rounded-2xl">
                       <p className="text-white font-medium text-sm tracking-wide">
                         Select a genre
                       </p>
                     </div>

                    {/* Compact play indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 text-white rotate-180 transform transition-transform duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Glass morphism overlay on hover */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl" />
                  </div>

                  {/* Premium shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200 ease-out pointer-events-none rounded-2xl" />
                  
                  {/* Subtle inner border */}
                  <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-background/95 backdrop-blur-sm border-t border-border">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;
