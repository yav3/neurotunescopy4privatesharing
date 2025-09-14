import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sun, Moon, Plus } from 'lucide-react';
import logoImage from "@/assets/logo.png";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';

const Index = () => {
  const navigate = useNavigate();
  const {
    isDark,
    toggle
  } = useDarkMode();
  const handleGoalSelect = (goal: typeof THERAPEUTIC_GOALS[0]) => {
    console.log('🎯 Index: Attempting to navigate to:', `/goals/${goal.id}/genres`, 'from:', window.location.pathname);
    try {
      navigate(`/goals/${goal.id}/genres`);
      console.log('✅ Index: Successfully called navigate()');
    } catch (error) {
      console.error('❌ Index: Error during navigate():', error);
    }
  };
  return <div className={cn("min-h-screen relative overflow-hidden transition-colors duration-500", "bg-background")}>
      {/* Background Elements - theme aware */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDark ? <div className="absolute inset-0 bg-gradient-dark-bg" /> : <div className="absolute inset-0 bg-gradient-hero" />}
      </div>

      {/* Header with Theme Toggle */}
      <div className="relative overflow-hidden">        
        <div className="relative z-10 px-3 sm:px-4 py-3 sm:py-4 md:px-6 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-6 flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-1">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
                NeuroTunes
              </h1>
              <Button variant="ghost" size="sm" onClick={toggle} className={cn("text-foreground hover:text-foreground transition-all duration-200 hover:bg-accent")}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Goals grid optimized for viewport fit with navigation space */}
      <div className="pb-24 sm:pb-20 relative z-10 h-full flex items-center justify-center">
        <div className="w-full max-w-4xl px-4">
          {/* Responsive cards grid with consistent spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 md:gap-6 lg:gap-6 justify-items-center">
            {THERAPEUTIC_GOALS.map((goal, index) => {
            return <Card key={goal.id} className={cn("group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out", "aspect-[16/9] sm:aspect-[4/3] md:aspect-[5/4] rounded-lg border-0", "hover:scale-[1.01] sm:hover:scale-[1.02] hover:-translate-y-0.5 sm:hover:-translate-y-1", "active:scale-[0.99] active:duration-100", "focus:outline-none focus:ring-4 focus:ring-primary/20", "animate-fade-in bg-card backdrop-blur-xl border border-border/20 shadow-glass", "hover:shadow-glass-lg hover:border-border/40", "h-[160px] sm:h-[180px] md:h-[260px] lg:h-[300px] xl:h-[340px]")} style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }} onClick={() => handleGoalSelect(goal)}>
                  {/* Goal artwork backgrounds */}
                  <div className="absolute inset-0">
                    <img 
                      src={goal.artwork} 
                      alt={`${goal.name} therapeutic music`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Subtle glass morphism overlay - theme tokens */}
                  <div className="absolute inset-0">
                    
                    
                    
                  </div>

                  {/* Hover overlay with select genre text */}
                  

                  {/* Goal title only - responsive sizing */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-6">
                    <div className="relative z-10">
                      <h3 className="font-bold text-xs sm:text-base md:text-lg lg:text-xl leading-tight tracking-wide" style={{
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
                </Card>;
          })}
          </div>
        </div>
      </div>

      {/* Clean Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className={cn("backdrop-blur-sm border-t transition-colors duration-500 bg-blue-950/99 border-blue-900/50")}>
          <Navigation />
        </div>
      </div>
    </div>;
};
export default Index;