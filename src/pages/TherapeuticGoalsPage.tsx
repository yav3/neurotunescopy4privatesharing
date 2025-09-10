import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Target, Zap, Moon, Heart, Focus, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';

// Enhanced icons for each therapeutic goal
const goalIcons = {
  'focus-enhancement': Focus,
  'stress-anxiety-support': Heart,
  'sleep-support': Moon,
  'mood-boost': Zap,
  'pain-support': Target,
  'energy-boost': Headphones,
  'default': Brain
};

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
  'sleep-support': {
    gradient: 'from-indigo-600 via-purple-500 to-blue-400',
    bg: 'from-indigo-900/80 via-purple-900/60 to-blue-800/40',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/20 hover:border-indigo-400/40'
  },
  'mood-boost': {
    gradient: 'from-yellow-500 via-orange-500 to-red-400',
    bg: 'from-yellow-900/80 via-orange-900/60 to-red-800/40',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/20 hover:border-yellow-400/40'
  },
  'pain-support': {
    gradient: 'from-purple-600 via-pink-500 to-rose-400',
    bg: 'from-purple-900/80 via-pink-900/60 to-rose-800/40',
    accent: 'text-purple-400',
    border: 'border-purple-500/20 hover:border-purple-400/40'
  },
  'energy-boost': {
    gradient: 'from-red-600 via-orange-500 to-amber-400',
    bg: 'from-red-900/80 via-orange-900/60 to-amber-800/40',
    accent: 'text-red-400',
    border: 'border-red-500/20 hover:border-red-400/40'
  }
};

export default function TherapeuticGoalsPage() {
  const navigate = useNavigate();
  
  const handleGoalSelect = (goal: typeof THERAPEUTIC_GOALS[0]) => {
    navigate(`/goals/${goal.id}/genres`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
        
        <div className="relative z-10 px-4 py-6 md:px-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="text-center mb-8 md:mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Therapeutic Music Goals
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Choose your therapeutic goal and discover scientifically-crafted music designed to enhance your mental state and wellbeing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="px-4 py-8 md:px-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {THERAPEUTIC_GOALS.map((goal) => {
              const IconComponent = goalIcons[goal.id as keyof typeof goalIcons] || goalIcons.default;
              const theme = goalThemes[goal.id as keyof typeof goalThemes] || goalThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-500",
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Background gradient overlay */}
                  <div className={cn("absolute inset-0 opacity-80 group-hover:opacity-90 transition-opacity duration-500 bg-gradient-to-br", theme.bg)} />
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={cn(
                        "p-3 rounded-2xl transition-all duration-300 group-hover:scale-110",
                        "bg-gradient-to-br", theme.gradient,
                        "shadow-lg group-hover:shadow-xl"
                      )}>
                        <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-foreground transition-colors">
                          {goal.name}
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground group-hover:text-muted-foreground/90 transition-colors leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", theme.accent.replace('text-', 'bg-'))} />
                        Science-backed frequencies
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", theme.accent.replace('text-', 'bg-'))} />
                        Multiple music genres
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", theme.accent.replace('text-', 'bg-'))} />
                        Personalized experience
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full transition-all duration-300 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5",
                        "border-border hover:border-primary"
                      )}
                    >
                      Explore Music Genres
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
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
}