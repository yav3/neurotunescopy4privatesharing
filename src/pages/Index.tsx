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
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
        
        <div className="relative z-10 px-4 py-2 md:px-6 md:py-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-2 md:mb-4">
              <h1 className="text-lg md:text-2xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Therapeutic Goals
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="px-4 -mt-2 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {THERAPEUTIC_GOALS.map((goal) => {
              const IconComponent = goal.icon;
              const theme = goalThemes[goal.id as keyof typeof goalThemes] || goalThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-500 aspect-[4/5]",
                    "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
                    "bg-card/90 backdrop-blur-sm",
                    theme.border
                  )}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={goal.artwork} 
                      alt={goal.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-500" />
                  
                   {/* Content */}
                   <div className="relative z-10 p-3 md:p-4 h-full flex flex-col justify-between items-center text-center">
                     <div className="flex flex-col items-center space-y-2 flex-1 justify-center">
                       <h3 className="text-sm md:text-base font-bold text-white group-hover:text-white transition-colors leading-tight">
                         {goal.name}
                       </h3>
                     </div>

                     {/* Action Button - Always visible */}
                     <div className="mt-auto pt-2">
                       <Button
                         variant="outline"
                         size="sm"
                         className={cn(
                           "transition-all duration-300 group-hover:border-white group-hover:text-black group-hover:bg-white",
                           "border-white/60 hover:border-white text-white bg-black/20 hover:bg-white px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                         )}
                       >
                         Explore Genres
                         <ArrowLeft className="w-3 h-3 ml-1 rotate-180 transition-transform group-hover:translate-x-1" />
                       </Button>
                     </div>
                   </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
};

export default Index;
