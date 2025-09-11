import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

// Enhanced card themes for each goal with different blue shades
const goalCardThemes = {
  'focus-enhancement': {
    bg: 'bg-card-light',
    gradient: 'bg-gradient-card',
    text: 'text-foreground',
    accent: 'text-primary'
  },
  'stress-anxiety-support': {
    bg: 'bg-card-medium',
    gradient: 'bg-gradient-card-blue',
    text: 'text-foreground',
    accent: 'text-primary'
  },
  'cardio-support': {
    bg: 'bg-card-medium',
    gradient: 'bg-gradient-card-blue',
    text: 'text-foreground',
    accent: 'text-primary'
  },
  'mood-boost': {
    bg: 'bg-music-mood',
    gradient: 'bg-gradient-card-blue',
    text: 'text-foreground',
    accent: 'text-primary'
  },
  'pain-support': {
    bg: 'bg-card-darkest',
    gradient: 'bg-gradient-card-dark',
    text: 'text-card-foreground',
    accent: 'text-accent-foreground'
  },
  'energy-boost': {
    bg: 'bg-music-energy',
    gradient: 'bg-gradient-card-medium',
    text: 'text-foreground',
    accent: 'text-primary'
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

      {/* Clean Header */}
      <div className="relative overflow-hidden">        
        <div className="relative z-10 px-4 py-6 md:px-6 md:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4 md:mb-6">
              <div className="inline-block bg-card border border-border rounded-2xl px-6 py-4 shadow-card">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground font-sf">
                  Therapeutic Goals
                </h1>
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Responsive Goals Grid */}
      <div className="container px-4 pb-20 relative z-10">
        <div className="responsive-grid">
          {/* Mobile-first responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {THERAPEUTIC_GOALS.map((goal, index) => {
              const IconComponent = goal.icon;
              const theme = goalCardThemes[goal.id as keyof typeof goalCardThemes] || goalCardThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-500",
                    // Responsive aspect ratios: square on mobile, wider on larger screens
                    "aspect-square sm:aspect-[4/3] lg:aspect-[5/4]",
                    theme.bg,
                    "border border-border hover:border-primary/30",
                    "shadow-card hover:shadow-player",
                    // Enhanced mobile touch interactions
                    "hover:scale-[1.02] hover:-translate-y-2",
                    "active:scale-[0.98] active:duration-75",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "animate-fade-in"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`, 
                    animationFillMode: 'both' 
                  }}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Background Image with Clean Overlay */}
                  <div className="absolute inset-0">
                    <img 
                      src={goal.artwork} 
                      alt={goal.name}
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110"
                    />
                    {/* Clean gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className={cn("absolute inset-0 transition-all duration-500", theme.gradient, "opacity-20 group-hover:opacity-30")} />
                  </div>

                  {/* Clean border effect */}
                  <div className="absolute inset-0 rounded-lg border border-border group-hover:border-primary/40 transition-all duration-300" />
                  
                  {/* Responsive content */}
                  <div className="relative z-10 p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between items-center text-center">
                    <div className="flex flex-col items-center space-y-2 flex-1 justify-center">
                      {/* Clean text background */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 shadow-sm">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight font-sf text-sm sm:text-base lg:text-lg">
                          {goal.name}
                        </h3>
                      </div>
                    </div>

                    {/* Enhanced Clean Button */}
                    <div className="mt-auto pt-3">
                      <Button
                        variant="secondary"
                        className={cn(
                          "transition-all duration-500",
                          "hover:bg-primary hover:text-primary-foreground",
                          "px-4 py-2 sm:px-6 sm:py-3 font-medium font-sf",
                          "shadow-sm hover:shadow-md",
                          "group-hover:scale-105 active:scale-95",
                          // Responsive text sizing
                          "text-xs sm:text-sm lg:text-base",
                          // Touch-friendly sizing on mobile
                          "min-h-[44px] sm:min-h-auto"
                        )}
                      >
                        <span className="hidden sm:inline">Explore Genres</span>
                        <span className="sm:hidden">Explore</span>
                        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 ml-2 rotate-180 transition-all duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
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
