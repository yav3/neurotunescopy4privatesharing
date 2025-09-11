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
                  {/* Rich atmospheric nature background inspired by the forest path */}
                  <div className="absolute inset-0">
                    {goal.id === 'focus-enhancement' && (
                      <>
                        {/* Golden forest clearing with sunbeams */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/60 via-yellow-400/70 to-orange-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-yellow-600/20 to-amber-200/10" />
                        {/* Sunbeam effects */}
                        <div className="absolute top-0 right-1/4 w-24 h-full bg-gradient-to-b from-yellow-200/30 via-amber-100/20 to-transparent rotate-12 blur-xl" />
                        <div className="absolute top-0 left-1/3 w-16 h-full bg-gradient-to-b from-white/20 via-yellow-100/15 to-transparent rotate-6 blur-lg" />
                        {/* Tree shadows and foliage */}
                        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-green-800/60 via-amber-700/30 to-transparent" />
                        <div className="absolute top-1/4 right-4 w-12 h-20 bg-gradient-to-b from-green-700/40 to-amber-800/30 rounded-t-full blur-sm" />
                        <div className="absolute top-1/3 left-6 w-8 h-16 bg-gradient-to-b from-amber-600/50 to-green-800/40 rounded-t-full blur-sm" />
                        {/* Floating golden particles */}
                        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-yellow-300/60 rounded-full blur-xs animate-pulse" />
                        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-200/70 rounded-full blur-xs" />
                      </>
                    )}
                    
                    {goal.id === 'stress-anxiety-support' && (
                      <>
                        {/* Peaceful misty lake with morning light */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/50 via-blue-300/60 to-teal-400/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-cyan-600/15 to-sky-200/10" />
                        {/* Misty effects */}
                        <div className="absolute bottom-1/4 left-0 w-full h-1/3 bg-gradient-to-t from-white/20 via-cyan-100/15 to-transparent blur-md" />
                        <div className="absolute top-1/3 right-1/4 w-20 h-8 bg-white/15 rounded-full blur-lg" />
                        {/* Mountain silhouettes */}
                        <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-slate-600/40 to-transparent" />
                        <div className="absolute bottom-0 right-8 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[20px] border-b-slate-500/30" />
                        <div className="absolute bottom-0 left-12 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-slate-600/35" />
                        {/* Gentle light rays */}
                        <div className="absolute top-0 left-1/4 w-16 h-full bg-gradient-to-b from-white/15 via-cyan-100/10 to-transparent rotate-3 blur-lg" />
                      </>
                    )}
                    
                    {goal.id === 'cardio-support' && (
                      <>
                        {/* Dynamic sunrise beach with energy */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/60 via-red-400/70 to-pink-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-orange-600/20 to-yellow-300/10" />
                        {/* Dynamic sun rays */}
                        <div className="absolute top-0 right-1/3 w-32 h-full bg-gradient-to-b from-yellow-200/40 via-orange-200/25 to-transparent rotate-15 blur-xl animate-pulse" />
                        <div className="absolute top-0 left-1/4 w-20 h-full bg-gradient-to-b from-white/25 via-yellow-100/15 to-transparent rotate-8 blur-lg" />
                        {/* Beach waves and energy */}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-orange-800/50 via-red-600/30 to-transparent" />
                        <div className="absolute bottom-4 left-1/4 w-16 h-2 bg-white/30 rounded-full blur-sm" />
                        <div className="absolute bottom-6 right-1/3 w-12 h-1 bg-yellow-200/40 rounded-full blur-sm" />
                        {/* Energy particles */}
                        <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-orange-300/70 rounded-full animate-pulse" />
                        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-red-300/60 rounded-full" />
                      </>
                    )}
                    
                    {goal.id === 'mood-boost' && (
                      <>
                        {/* Vibrant flower meadow with butterfly effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-300/60 via-green-400/70 to-emerald-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-800/40 via-lime-600/20 to-yellow-200/15" />
                        {/* Cheerful sunbeams */}
                        <div className="absolute top-0 right-1/3 w-28 h-full bg-gradient-to-b from-yellow-200/35 via-lime-100/20 to-transparent rotate-10 blur-xl" />
                        <div className="absolute top-0 left-1/4 w-20 h-full bg-gradient-to-b from-white/20 via-yellow-100/12 to-transparent rotate-5 blur-lg" />
                        {/* Flower field */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-700/50 via-lime-600/25 to-transparent" />
                        {/* Scattered flowers */}
                        <div className="absolute bottom-8 left-6 w-3 h-3 bg-pink-300/60 rounded-full blur-xs" />
                        <div className="absolute bottom-12 right-8 w-2 h-2 bg-yellow-300/70 rounded-full blur-xs" />
                        <div className="absolute bottom-6 right-1/3 w-2.5 h-2.5 bg-purple-300/50 rounded-full blur-xs" />
                        {/* Floating petals */}
                        <div className="absolute top-1/3 right-1/4 w-2 h-1 bg-pink-200/40 rounded-full rotate-45 blur-xs animate-pulse" />
                        <div className="absolute top-1/2 left-1/3 w-1.5 h-0.5 bg-white/50 rounded-full rotate-12 blur-xs" />
                      </>
                    )}
                    
                    {goal.id === 'pain-support' && (
                      <>
                        {/* Tranquil waterfall scene with healing mist */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/50 via-blue-400/60 to-indigo-500/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/35 via-blue-700/20 to-cyan-200/10" />
                        {/* Waterfall mist */}
                        <div className="absolute top-0 right-8 w-4 h-full bg-gradient-to-b from-white/40 via-cyan-100/25 to-transparent blur-md" />
                        <div className="absolute top-1/4 right-6 w-8 h-1/2 bg-gradient-to-b from-white/20 via-blue-100/15 to-transparent blur-lg opacity-70" />
                        {/* Healing pool */}
                        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-blue-800/40 via-cyan-600/20 to-transparent" />
                        {/* Gentle ripples */}
                        <div className="absolute bottom-6 left-1/4 w-12 h-1 bg-white/20 rounded-full blur-sm opacity-60" />
                        <div className="absolute bottom-8 right-1/3 w-8 h-0.5 bg-cyan-200/30 rounded-full blur-sm opacity-50" />
                        {/* Soft light reflections */}
                        <div className="absolute top-1/3 left-1/4 w-16 h-full bg-gradient-to-b from-white/10 via-cyan-100/8 to-transparent rotate-2 blur-xl" />
                        {/* Healing particles */}
                        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-200/60 rounded-full animate-pulse blur-xs" />
                      </>
                    )}
                    
                    {goal.id === 'energy-boost' && (
                      <>
                        {/* Powerful mountain summit with aurora effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/60 via-blue-500/70 to-indigo-600/70" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-purple-700/20 to-blue-300/12" />
                        {/* Aurora-like energy streams */}
                        <div className="absolute top-0 left-1/3 w-24 h-full bg-gradient-to-b from-purple-200/30 via-blue-200/20 to-transparent rotate-8 blur-xl animate-pulse" />
                        <div className="absolute top-0 right-1/4 w-16 h-full bg-gradient-to-b from-cyan-200/25 via-purple-100/15 to-transparent rotate-12 blur-lg" />
                        {/* Mountain peaks */}
                        <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-slate-800/50 via-indigo-800/25 to-transparent" />
                        <div className="absolute bottom-0 left-6 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[18px] border-b-slate-700/40" />
                        <div className="absolute bottom-0 right-8 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[22px] border-b-slate-600/45" />
                        {/* Energy sparkles */}
                        <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 bg-purple-300/70 rounded-full animate-pulse blur-xs" />
                        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-300/60 rounded-full blur-xs" />
                        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-300/60 rounded-full animate-pulse blur-xs" />
                      </>
                    )}
                  </div>

                  {/* Subtle glass morphism overlay to blend with nature */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10" />
                  </div>

                  {/* Goal name at bottom left with better contrast */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="relative z-10">
                      <div className="bg-black/30 backdrop-blur-md rounded-lg px-3 py-2 inline-block border border-white/20">
                        <h3 className="text-white font-semibold text-base md:text-lg leading-tight drop-shadow-xl tracking-wide">
                          {goal.name}
                        </h3>
                      </div>
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
