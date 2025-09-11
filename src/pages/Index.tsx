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
    gradient: 'from-blue-600/90 via-indigo-500/85 to-purple-600/90',
    accent: 'bg-white/25',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(79,70,229,0.5)]'
  },
  'pain-support': {
    gradient: 'from-teal-600/90 via-cyan-600/80 to-blue-500/90',
    accent: 'bg-white/20',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(20,184,166,0.4)]'
  },
  'energy-boost': {
    gradient: 'from-blue-700/90 via-blue-500/85 to-cyan-500/90',
    accent: 'bg-white/25',
    text: 'text-white',
    shadow: 'shadow-[0_8px_32px_rgba(29,78,216,0.5)]'
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
              const IconComponent = goal.icon;
              const theme = goalCardThemes[goal.id as keyof typeof goalCardThemes] || goalCardThemes['focus-enhancement'];
              
              return (
                <Card
                  key={goal.id}
                  className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-700 ease-out",
                    "aspect-square rounded-2xl border-0",
                    theme.shadow,
                    "hover:scale-[1.02] hover:-translate-y-1",
                    "active:scale-[0.98] active:duration-100",
                    "focus:outline-none focus:ring-4 focus:ring-white/20",
                    "animate-fade-in backdrop-blur-xl",
                    "hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
                  )}
                  style={{ 
                    animationDelay: `${index * 100}ms`, // Faster stagger
                    animationFillMode: 'both' 
                  }}
                  onClick={() => handleGoalSelect(goal)}
                >
                  {/* Enhanced glass morphism background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-all duration-700",
                    theme.gradient,
                    "group-hover:scale-105 contrast-125 saturate-110"
                  )} />

                  {/* Brighter multi-layered glass morphism effects */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Photo-realistic liquid glass base layers */}
                    <div className="absolute inset-0 bg-white/15 backdrop-blur-[8px] border border-white/25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-white/10 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent" />
                    
                    {/* Liquid glass bubbles with realistic refraction */}
                    <div className="absolute top-4 right-6 w-20 h-20 bg-gradient-radial from-white/40 via-white/25 to-white/10 rounded-full backdrop-blur-xl border-2 border-white/50 shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.2)]" />
                    <div className="absolute top-12 left-8 w-14 h-14 bg-gradient-radial from-white/35 via-white/20 to-white/8 rounded-full backdrop-blur-lg border border-white/40 shadow-[inset_0_1px_4px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.15)]" />
                    <div className="absolute bottom-8 right-4 w-16 h-16 bg-gradient-radial from-white/30 via-white/18 to-white/6 rounded-full backdrop-blur-lg border border-white/45 shadow-[inset_0_2px_6px_rgba(255,255,255,0.35),0_3px_12px_rgba(0,0,0,0.18)]" />
                    
                    {/* Floating water droplets */}
                    <div className="absolute top-8 left-12 w-6 h-8 bg-gradient-to-b from-white/50 via-white/30 to-white/15 rounded-full backdrop-blur-md border-2 border-white/60 shadow-[inset_0_1px_3px_rgba(255,255,255,0.5),0_1px_4px_rgba(0,0,0,0.2)]" />
                    <div className="absolute bottom-12 left-6 w-8 h-10 bg-gradient-to-b from-white/45 via-white/25 to-white/10 rounded-full backdrop-blur-md border border-white/55 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15)]" />
                    
                    {/* Crystalline geometric shapes */}
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-gradient-to-br from-white/25 via-white/15 to-white/5 backdrop-blur-lg border-2 border-white/50 rounded-xl rotate-45 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.2)]" />
                    <div className="absolute bottom-1/3 right-1/4 w-10 h-18 bg-gradient-to-t from-white/30 via-white/18 to-white/8 backdrop-blur-md border border-white/45 rounded-2xl transform rotate-12 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15)]" />
                    
                    {/* Liquid glass streams */}
                    <div className="absolute top-2 right-1/3 w-3 h-24 bg-gradient-to-b from-white/40 via-white/20 to-transparent rounded-full backdrop-blur-sm border border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
                    <div className="absolute bottom-6 left-1/3 w-2 h-20 bg-gradient-to-t from-white/35 via-white/15 to-transparent rounded-full backdrop-blur-sm border border-white/40 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.4)]" />
                    
                    {/* Prismatic light effects */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-conic from-white/25 via-blue-200/15 via-purple-200/10 to-transparent rounded-full opacity-70 blur-sm" />
                    <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-radial from-cyan-200/20 via-white/10 to-transparent opacity-60 blur-xs" />
                    
                    {/* Caustic patterns like underwater light */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-1/4 left-1/3 w-8 h-2 bg-white/40 rounded-full transform rotate-12 blur-[1px]" />
                      <div className="absolute top-1/3 right-1/4 w-6 h-3 bg-white/30 rounded-full transform -rotate-6 blur-[1px]" />
                      <div className="absolute bottom-1/3 left-1/4 w-10 h-1.5 bg-white/35 rounded-full transform rotate-8 blur-[1px]" />
                      <div className="absolute bottom-1/4 right-1/3 w-7 h-2.5 bg-white/25 rounded-full transform -rotate-15 blur-[1px]" />
                    </div>
                  </div>

                  {/* Musical instrument-inspired abstract patterns */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Focus Enhancement - Piano keys and sheet music */}
                    {goal.id === 'focus-enhancement' && (
                      <>
                        {/* Piano key patterns */}
                        <div className="absolute top-3 right-6 w-16 h-2 bg-white/30 rounded-sm" />
                        <div className="absolute top-6 right-6 w-16 h-2 bg-white/25 rounded-sm" />
                        <div className="absolute top-9 right-6 w-16 h-2 bg-white/35 rounded-sm" />
                        {/* Black keys */}
                        <div className="absolute top-3 right-8 w-8 h-4 bg-white/40 rounded-sm" />
                        <div className="absolute top-3 right-12 w-8 h-4 bg-white/40 rounded-sm" />
                        {/* Musical notes scattered */}
                        <div className="absolute bottom-8 left-4 w-4 h-4 bg-white/35 rounded-full" />
                        <div className="absolute bottom-12 left-8 w-1 h-8 bg-white/30 transform rotate-12" />
                        <div className="absolute top-1/2 left-6 w-3 h-3 bg-white/25 rounded-full" />
                        <div className="absolute top-1/3 right-1/4 w-2 h-6 bg-white/20 transform -rotate-6" />
                      </>
                    )}

                    {/* Stress/Anxiety Support - Harp strings and wind chimes */}
                    {goal.id === 'stress-anxiety-support' && (
                      <>
                        {/* Flowing harp strings */}
                        <div className="absolute top-2 left-8 w-0.5 h-20 bg-gradient-to-b from-white/40 to-white/10 transform rotate-12" />
                        <div className="absolute top-4 left-12 w-0.5 h-18 bg-gradient-to-b from-white/35 to-white/8 transform rotate-6" />
                        <div className="absolute top-6 left-16 w-0.5 h-16 bg-gradient-to-b from-white/30 to-white/5 transform rotate-3" />
                        <div className="absolute top-8 left-20 w-0.5 h-14 bg-gradient-to-b from-white/25 to-transparent" />
                        {/* Wind chime elements */}
                        <div className="absolute bottom-6 right-8 w-1 h-12 bg-white/20 rounded-full" />
                        <div className="absolute bottom-4 right-12 w-1 h-10 bg-white/25 rounded-full" />
                        <div className="absolute bottom-8 right-16 w-1 h-8 bg-white/15 rounded-full" />
                        {/* Connecting threads */}
                        <div className="absolute bottom-16 right-6 w-12 h-0.5 bg-white/15 transform rotate-45" />
                      </>
                    )}

                    {/* Cardio Support - Drum patterns and percussion */}
                    {goal.id === 'cardio-support' && (
                      <>
                        {/* Drum circles */}
                        <div className="absolute top-6 right-8 w-14 h-14 border-2 border-white/40 rounded-full" />
                        <div className="absolute top-8 right-10 w-10 h-10 border border-white/30 rounded-full" />
                        <div className="absolute bottom-12 left-6 w-12 h-12 border-2 border-white/35 rounded-full" />
                        {/* Drumstick shapes */}
                        <div className="absolute top-1/2 left-1/3 w-1 h-16 bg-white/40 rounded-full transform rotate-45" />
                        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/50 rounded-full transform translate-x-4 -translate-y-6" />
                        <div className="absolute bottom-1/4 right-1/3 w-1 h-14 bg-white/35 rounded-full transform -rotate-30" />
                        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/45 rounded-full transform translate-x-2 translate-y-4" />
                        {/* Rhythmic dots */}
                        <div className="absolute top-4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
                        <div className="absolute top-4 left-1/3 w-2 h-2 bg-white/25 rounded-full" />
                      </>
                    )}

                    {/* Mood Boost - Guitar strings and cheerful notes in deep blues */}
                    {goal.id === 'mood-boost' && (
                      <>
                        {/* Guitar strings with blue tones */}
                        <div className="absolute left-4 top-6 h-0.5 w-24 bg-gradient-to-r from-blue-300/60 to-blue-200/30 transform rotate-12 shadow-sm" />
                        <div className="absolute left-4 top-10 h-0.5 w-24 bg-gradient-to-r from-indigo-400/55 to-blue-300/25 transform rotate-12 shadow-sm" />
                        <div className="absolute left-4 top-14 h-0.5 w-24 bg-gradient-to-r from-blue-200/50 to-indigo-100/20 transform rotate-12 shadow-sm" />
                        <div className="absolute left-4 top-18 h-0.5 w-24 bg-gradient-to-r from-purple-300/45 to-blue-200/18 transform rotate-12 shadow-sm" />
                        {/* Sound hole with crystalline effect */}
                        <div className="absolute right-6 top-1/3 w-12 h-12 border-2 border-blue-300/50 rounded-full shadow-[inset_0_2px_4px_rgba(59,130,246,0.3)]" />
                        <div className="absolute right-8 top-1/3 w-8 h-8 border border-indigo-400/40 rounded-full transform translate-x-2 translate-y-2 shadow-[inset_0_1px_2px_rgba(99,102,241,0.2)]" />
                        {/* Musical notes floating with glass effect */}
                        <div className="absolute bottom-8 left-8 w-3 h-3 bg-blue-400/50 rounded-full shadow-[inset_0_1px_2px_rgba(59,130,246,0.4)]" />
                        <div className="absolute bottom-6 left-12 w-1 h-6 bg-indigo-300/45 transform rotate-15 shadow-sm" />
                        <div className="absolute bottom-12 right-1/4 w-2 h-2 bg-purple-300/40 rounded-full shadow-[inset_0_0.5px_1px_rgba(147,51,234,0.3)]" />
                      </>
                    )}

                    {/* Pain Support - Violin curves and cello strings */}
                    {goal.id === 'pain-support' && (
                      <>
                        {/* Violin f-holes */}
                        <div className="absolute top-1/4 right-8 w-1 h-12 bg-cyan-300/40 rounded-full" />
                        <div className="absolute top-1/4 right-8 w-3 h-2 bg-cyan-400/35 rounded-full transform translate-y-2" />
                        <div className="absolute top-1/4 right-8 w-3 h-2 bg-cyan-300/30 rounded-full transform translate-y-8" />
                        <div className="absolute top-1/4 left-6 w-1 h-12 bg-cyan-200/35 rounded-full" />
                        <div className="absolute top-1/4 left-6 w-3 h-2 bg-cyan-300/30 rounded-full transform translate-y-2" />
                        <div className="absolute top-1/4 left-6 w-3 h-2 bg-cyan-400/25 rounded-full transform translate-y-8" />
                        {/* Cello strings */}
                        <div className="absolute bottom-4 left-1/4 w-0.5 h-16 bg-gradient-to-t from-cyan-400/40 to-cyan-200/10" />
                        <div className="absolute bottom-4 left-1/3 w-0.5 h-16 bg-gradient-to-t from-cyan-300/35 to-cyan-100/8" />
                        <div className="absolute bottom-4 left-2/5 w-0.5 h-16 bg-gradient-to-t from-cyan-500/30 to-transparent" />
                        {/* Bow shape */}
                        <div className="absolute top-6 right-1/4 w-16 h-1 bg-cyan-200/25 rounded-full transform rotate-30" />
                      </>
                    )}

                    {/* Energy Boost - Electric guitar and dynamic elements in deep blues */}
                    {goal.id === 'energy-boost' && (
                      <>
                        {/* Electric guitar body outline with blue energy */}
                        <div className="absolute top-8 right-4 w-16 h-20 border-2 border-blue-300/50 rounded-2xl transform rotate-15 shadow-[inset_0_2px_4px_rgba(59,130,246,0.3)]" />
                        <div className="absolute top-12 right-8 w-8 h-12 border border-cyan-400/45 rounded-xl transform rotate-15 shadow-[inset_0_1px_2px_rgba(34,211,238,0.2)]" />
                        {/* Guitar pickups with crystalline effect */}
                        <div className="absolute top-16 right-6 w-6 h-2 bg-blue-400/55 rounded-full transform rotate-15 shadow-[inset_0_1px_2px_rgba(59,130,246,0.4)]" />
                        <div className="absolute top-20 right-6 w-6 h-2 bg-cyan-300/50 rounded-full transform rotate-15 shadow-[inset_0_1px_2px_rgba(103,232,249,0.3)]" />
                        {/* Electric strings with blue energy */}
                        <div className="absolute left-6 bottom-12 w-20 h-0.5 bg-gradient-to-r from-blue-400/60 to-cyan-300/30 transform -rotate-12 animate-pulse shadow-sm" />
                        <div className="absolute left-6 bottom-10 w-20 h-0.5 bg-gradient-to-r from-cyan-500/55 to-blue-200/25 transform -rotate-12 shadow-sm" />
                        <div className="absolute left-6 bottom-8 w-20 h-0.5 bg-gradient-to-r from-blue-300/50 to-cyan-400/20 transform -rotate-12 shadow-sm" />
                        {/* Electric energy bolts from strings */}
                        <div className="absolute bottom-6 left-1/3 w-1 h-8 bg-cyan-400/60 transform rotate-75 shadow-[0_0_4px_rgba(34,211,238,0.4)]" />
                        <div className="absolute bottom-4 left-2/5 w-1 h-6 bg-blue-500/55 transform -rotate-45 shadow-[0_0_3px_rgba(59,130,246,0.4)]" />
                        {/* Amplifier knobs with glass effect */}
                        <div className="absolute top-4 left-4 w-3 h-3 border border-blue-300/45 rounded-full shadow-[inset_0_1px_2px_rgba(59,130,246,0.3)]" />
                        <div className="absolute top-8 left-4 w-3 h-3 border border-cyan-400/40 rounded-full shadow-[inset_0_1px_2px_rgba(34,211,238,0.2)]" />
                      </>
                    )}
                  </div>

                  {/* Enhanced pattern overlays */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15)_0%,transparent_50%)] opacity-60" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1)_0%,transparent_60%)] opacity-40" />
                  
                  {/* Mesh gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-80" />
                  
                  {/* Compact content layout without icons */}
                  <div className="relative z-10 p-4 h-full flex flex-col">
                     {/* Title and arrow below it */}
                     <div className="flex-1 flex flex-col justify-end">
                       <div className="space-y-2 text-center">
                         <h3 className={cn(
                           "font-bold text-lg leading-tight tracking-tight drop-shadow-lg filter brightness-110",
                           theme.text,
                           "transition-all duration-300",
                           "group-hover:scale-[1.02] group-hover:translate-y-[-1px]"
                         )}>
                           {goal.name}
                         </h3>
                         
                         {/* Arrow below the genre name */}
                         <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                           <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md border-2 border-white/50 flex items-center justify-center shadow-lg">
                             <ArrowLeft className="w-4 h-4 text-white rotate-180 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Enhanced hover text overlay */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20">
                       <p className="text-white font-semibold text-sm tracking-wide drop-shadow-lg">
                         Select a genre
                       </p>
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
