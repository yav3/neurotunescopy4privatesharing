import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sun, Moon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

// Import generated nature images
import focusImage from '@/assets/focus-nature-piano.jpg';
import stressImage from '@/assets/stress-nature-music.jpg';
import moodImage from '@/assets/mood-nature-guitar.jpg';
import painImage from '@/assets/pain-nature-harp.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Apply theme on mount and when changed
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const handleGoalSelect = (goal: typeof THERAPEUTIC_GOALS[0]) => {
    console.log('🎯 Index: Attempting to navigate to:', `/goals/${goal.id}/genres`, 'from:', window.location.pathname);
    try {
      navigate(`/goals/${goal.id}/genres`);
      console.log('✅ Index: Successfully called navigate()');
    } catch (error) {
      console.error('❌ Index: Error during navigate():', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-colors duration-500",
      isDarkMode 
        ? "bg-blue-950/95" 
        : "bg-white"
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            {/* Dark mode - deep blue gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-slate-800/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_70%_/_0.05),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/30 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-slate-800/25 to-transparent rounded-full blur-2xl transform translate-x-1/3 translate-y-1/3" />
          </>
        ) : (
          <>
            {/* Light mode - clean white background only */}
          </>
        )}
      </div>

      {/* Header with Theme Toggle */}
      <div className="relative overflow-hidden">        
        <div className="relative z-10 px-3 sm:px-4 py-3 sm:py-4 md:px-6 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-6 flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                NeuroTunes
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              className={cn(
                "text-foreground hover:text-foreground transition-all duration-200",
                isDarkMode 
                  ? "hover:bg-white/10" 
                  : "hover:bg-gray-100"
              )}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Goals grid optimized for viewport fit */}
      <div className="px-3 sm:px-4 pb-20 sm:pb-16 relative z-10 h-full flex items-center">
        <div className="max-w-5xl mx-auto w-full">
          {/* Responsive cards grid - compact mobile, generous desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
            {THERAPEUTIC_GOALS.map((goal, index) => {
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out",
                    "aspect-[16/9] sm:aspect-[4/3] md:aspect-[5/4] rounded-lg border-0",
                    "hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-0.5 sm:hover:-translate-y-1",
                    "active:scale-[0.99] active:duration-100",
                    "focus:outline-none focus:ring-4 focus:ring-white/20",
                    "animate-fade-in backdrop-blur-xl",
                    "hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] md:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
                    "h-[140px] sm:h-[180px] md:h-[220px] lg:h-[240px]"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both' 
                  }}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Consistent nature with instruments backgrounds */}
                  <div className="absolute inset-0">
                    {goal.id === 'focus-enhancement' && (
                      <img 
                        src={focusImage}
                        alt="Piano in peaceful meadow for focus"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'stress-anxiety-support' && (
                      <img 
                        src={stressImage}
                        alt="Musical notes over calm lake for stress relief"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'mood-boost' && (
                      <img 
                        src={moodImage}
                        alt="Guitar in sunny flower meadow for mood boost"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'pain-support' && (
                      <img 
                        src={painImage}
                        alt="Harp in peaceful garden for pain relief"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Subtle glass morphism overlay - light touch */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-[0.5px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.08]" />
                    <div className="absolute inset-0 border border-white/10 rounded-xl" />
                  </div>

                  {/* Hover overlay with select genre text */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg sm:rounded-xl">
                    <span className="text-white font-semibold text-sm sm:text-lg md:text-xl tracking-wide">
                      Select Genre
                    </span>
                  </div>

                  {/* Goal title only - responsive sizing */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6">
                    <div className="relative z-10">
                      <h3 className="font-bold text-xs sm:text-base md:text-lg lg:text-xl leading-tight tracking-wide uppercase"
                          style={{ 
                            color: '#ffffff',
                            WebkitTextFillColor: '#ffffff',
                            textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)',
                            fontWeight: '700'
                          }}>
                        {goal.name}
                      </h3>
                    </div>
                  </div>

                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className={cn(
          "backdrop-blur-sm border-t transition-colors duration-500",
          isDarkMode 
            ? "bg-blue-950/99 border-blue-900/50" 
            : "bg-white/95 border-gray-200/50"
        )}>
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;
