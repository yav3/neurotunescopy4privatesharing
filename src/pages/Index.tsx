import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

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
        <div className="relative z-10 px-4 py-4 md:px-6 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 md:mb-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {THERAPEUTIC_GOALS.map((goal, index) => {
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out",
                    "aspect-square rounded-2xl border-0",
                    "hover:scale-[1.02] hover:-translate-y-1",
                    "active:scale-[0.98] active:duration-100",
                    "focus:outline-none focus:ring-4 focus:ring-white/20",
                    "animate-fade-in backdrop-blur-xl",
                    "hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both' 
                  }}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Beautiful nature scene backgrounds */}
                  <div className="absolute inset-0">
                    {goal.id === 'focus-enhancement' && (
                      <img 
                        src="/lovable-uploads/cc589adb-e66f-4820-9daa-c6ff765f0373.png"
                        alt="Piano with floating musical notes for focus"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'stress-anxiety-support' && (
                      <img 
                        src="/lovable-uploads/9e1efaf1-aa12-47f4-9370-f898226802f1.png"
                        alt="Peaceful sunset over calm water"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'cardio-support' && (
                      <img 
                        src="/lovable-uploads/3e3d1eea-129c-46ad-9052-38849c266b2b.png"
                        alt="Palm trees on tropical beach"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'mood-boost' && (
                      <img 
                        src="/lovable-uploads/d48fb587-98c5-4e7a-a4fa-a461ef7db8b8.png"
                        alt="Bright flower field under starry sky"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'pain-support' && (
                      <img 
                        src="/lovable-uploads/e5c54bcd-f1d9-4fff-b4ef-9c458544a31c.png"
                        alt="Soft pink clouds for pain relief"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {goal.id === 'energy-boost' && (
                      <img 
                        src="/lovable-uploads/623bc7fd-5a27-48c0-b677-1ad647aed2e6.png"
                        alt="Vibrant tropical beach with palm trees"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Subtle glass morphism overlay - light touch */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-[0.5px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.08]" />
                    <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                  </div>

                  {/* Goal name at bottom left with white text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="relative z-10">
                      <h3 className="text-white font-bold text-base md:text-lg leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide">
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
        <div className="bg-background/95 backdrop-blur-sm border-t border-border">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;
