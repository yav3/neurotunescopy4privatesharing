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
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    bg: 'from-blue-900/80 via-cyan-900/60 to-teal-800/40',
    accent: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-400/40'
  },
  'stress-anxiety-support': {
    gradient: 'from-green-600 via-emerald-500 to-teal-400',
    bg: 'from-green-900/80 via-emerald-900/60 to-teal-800/40',
    accent: 'text-green-400',
    border: 'border-green-500/20 hover:border-green-400/40'
  },
  'cardio-support': {
    gradient: 'from-indigo-600 via-blue-500 to-cyan-400',
    bg: 'from-indigo-900/80 via-blue-900/60 to-cyan-800/40',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/20 hover:border-indigo-400/40'
  },
  'mood-boost': {
    gradient: 'from-cyan-500 via-teal-500 to-green-400',
    bg: 'from-cyan-900/80 via-teal-900/60 to-green-800/40',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20 hover:border-cyan-400/40'
  },
  'pain-support': {
    gradient: 'from-slate-600 via-gray-500 to-blue-400',
    bg: 'from-slate-900/80 via-gray-900/60 to-blue-800/40',
    accent: 'text-slate-400',
    border: 'border-slate-500/20 hover:border-slate-400/40'
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
        
        <div className="relative z-10 px-4 py-3 md:px-6 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4 md:mb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <h1 className="text-lg md:text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Therapeutic Goals
              </h1>
              
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Choose your therapeutic goal and discover scientifically-crafted music designed to enhance your mental state and wellbeing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {THERAPEUTIC_GOALS.map((goal) => {
              const IconComponent = goal.icon;
              const theme = goalThemes[goal.id as keyof typeof goalThemes] || goalThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-500 h-40 md:h-48",
                    "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
                    "bg-card/90 backdrop-blur-sm",
                    theme.border
                  )}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <img 
                      src={goal.artwork} 
                      alt={goal.name}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                  
                  {/* Background gradient overlay */}
                  <div className={cn("absolute inset-0 opacity-80 group-hover:opacity-90 transition-opacity duration-500 bg-gradient-to-br", theme.bg)} />
                  
                   {/* Content */}
                   <div className="relative z-10 p-3 md:p-4 h-full flex flex-col justify-between items-center text-center">
                     <div className="flex flex-col items-center space-y-2">
                       <div className={cn(
                         "p-2 md:p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                         "bg-gradient-to-br", theme.gradient,
                         "shadow-lg group-hover:shadow-xl"
                       )}>
                         <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                       </div>
                       
                       <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                         {goal.name}
                       </h3>
                       
                       {/* Description - hidden by default, visible on hover */}
                       <p className="text-xs md:text-sm text-foreground/80 transition-all duration-300 leading-tight line-clamp-2 max-w-xs opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 absolute">
                         {goal.description}
                       </p>
                     </div>

                     {/* Action */}
                     <Button
                       variant="outline"
                       size="sm"
                       className={cn(
                         "transition-all duration-300 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/10",
                         "border-foreground/30 hover:border-primary text-foreground bg-background/80 hover:bg-primary/5 px-4 py-1.5 text-sm font-semibold mt-auto"
                       )}
                     >
                       Explore Genres
                       <ArrowLeft className="w-3 h-3 ml-1 rotate-180 transition-transform group-hover:translate-x-1" />
                     </Button>
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
