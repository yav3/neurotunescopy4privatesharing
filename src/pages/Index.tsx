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
                  {/* Nature background scene */}
                  <div className="absolute inset-0">
                    {goal.id === 'focus-enhancement' && (
                      <>
                        {/* Forest clearing background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-emerald-500/40 to-teal-600/50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-800/40 via-green-600/20 to-green-400/10" />
                        {/* Tree silhouettes */}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-900/60 to-transparent" />
                        <div className="absolute bottom-0 right-4 w-8 h-20 bg-green-900/40 rounded-t-full" />
                        <div className="absolute bottom-0 left-6 w-6 h-16 bg-green-800/50 rounded-t-full" />
                      </>
                    )}
                    
                    {goal.id === 'stress-anxiety-support' && (
                      <>
                        {/* Mountain lake scene */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/40 via-cyan-400/50 to-teal-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/30 via-blue-600/15 to-sky-400/10" />
                        {/* Mountain silhouette */}
                        <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-slate-700/50 to-transparent" />
                        <div className="absolute bottom-0 right-2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[24px] border-b-slate-600/40" />
                      </>
                    )}
                    
                    {goal.id === 'cardio-support' && (
                      <>
                        {/* Sunrise beach scene */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/40 via-red-400/50 to-pink-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-800/30 via-red-600/15 to-yellow-400/10" />
                        {/* Beach horizon */}
                        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-amber-700/40 to-transparent" />
                      </>
                    )}
                    
                    {goal.id === 'mood-boost' && (
                      <>
                        {/* Sunlit meadow scene */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/40 via-green-400/50 to-lime-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-green-700/30 via-lime-600/15 to-yellow-300/10" />
                        {/* Meadow grass */}
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-green-800/50 to-transparent" />
                        <div className="absolute bottom-0 left-4 w-2 h-8 bg-green-700/60 rounded-t-full" />
                        <div className="absolute bottom-0 right-8 w-1 h-6 bg-green-600/50 rounded-t-full" />
                      </>
                    )}
                    
                    {goal.id === 'pain-support' && (
                      <>
                        {/* Peaceful waterfall scene */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/40 via-blue-400/50 to-indigo-500/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-800/30 via-blue-600/15 to-cyan-300/10" />
                        {/* Waterfall effect */}
                        <div className="absolute top-0 right-6 w-2 h-full bg-gradient-to-b from-white/40 via-cyan-200/30 to-transparent" />
                        <div className="absolute bottom-0 right-0 w-full h-1/4 bg-gradient-to-t from-blue-800/40 to-transparent" />
                      </>
                    )}
                    
                    {goal.id === 'energy-boost' && (
                      <>
                        {/* Mountain summit scene */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/40 via-blue-400/50 to-indigo-600/60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 via-purple-600/15 to-blue-300/10" />
                        {/* Mountain peaks */}
                        <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-slate-800/50 to-transparent" />
                        <div className="absolute bottom-0 left-4 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[20px] border-b-slate-700/50" />
                      </>
                    )}
                  </div>

                  {/* Glass morphism instrument */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Base glass layer */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[8px] border border-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-black/10" />
                    
                    {goal.id === 'focus-enhancement' && (
                      <>
                        {/* Glass piano in forest clearing */}
                        <div className="absolute bottom-8 right-4 w-24 h-16 bg-white/20 backdrop-blur-lg border-2 border-white/40 rounded-lg shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
                          {/* Piano keys */}
                          <div className="absolute bottom-0 left-2 w-3 h-8 bg-white/60 border border-white/40 rounded-b-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
                          <div className="absolute bottom-0 left-6 w-3 h-8 bg-white/60 border border-white/40 rounded-b-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
                          <div className="absolute bottom-0 left-10 w-3 h-8 bg-white/60 border border-white/40 rounded-b-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
                          <div className="absolute bottom-0 left-14 w-3 h-8 bg-white/60 border border-white/40 rounded-b-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
                          <div className="absolute bottom-0 left-18 w-3 h-8 bg-white/60 border border-white/40 rounded-b-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
                          {/* Black keys */}
                          <div className="absolute bottom-4 left-4 w-2 h-4 bg-black/40 backdrop-blur-sm border border-white/20 rounded-b-sm" />
                          <div className="absolute bottom-4 left-8 w-2 h-4 bg-black/40 backdrop-blur-sm border border-white/20 rounded-b-sm" />
                          <div className="absolute bottom-4 left-16 w-2 h-4 bg-black/40 backdrop-blur-sm border border-white/20 rounded-b-sm" />
                        </div>
                      </>
                    )}
                    
                    {goal.id === 'stress-anxiety-support' && (
                      <>
                        {/* Glass harp by mountain lake */}
                        <div className="absolute left-6 top-8 w-16 h-20 bg-white/15 backdrop-blur-lg border border-white/30 rounded-t-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)]">
                          {/* Harp strings */}
                          <div className="absolute left-2 top-2 w-0.5 h-16 bg-white/50 rounded-full shadow-sm" />
                          <div className="absolute left-4 top-3 w-0.5 h-14 bg-white/45 rounded-full shadow-sm" />
                          <div className="absolute left-6 top-4 w-0.5 h-12 bg-white/40 rounded-full shadow-sm" />
                          <div className="absolute left-8 top-5 w-0.5 h-10 bg-white/35 rounded-full shadow-sm" />
                          <div className="absolute left-10 top-6 w-0.5 h-8 bg-white/30 rounded-full shadow-sm" />
                          <div className="absolute left-12 top-7 w-0.5 h-6 bg-white/25 rounded-full shadow-sm" />
                        </div>
                      </>
                    )}
                    
                    {goal.id === 'cardio-support' && (
                      <>
                        {/* Glass drums on beach */}
                        <div className="absolute right-8 bottom-6 w-16 h-16 bg-white/20 backdrop-blur-lg border-2 border-white/40 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.2)]">
                          <div className="absolute inset-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full shadow-[inset_0_1px_4px_rgba(255,255,255,0.4)]" />
                        </div>
                        <div className="absolute right-4 bottom-8 w-12 h-12 bg-white/18 backdrop-blur-lg border border-white/35 rounded-full shadow-[inset_0_2px_6px_rgba(255,255,255,0.25),0_3px_12px_rgba(0,0,0,0.18)]">
                          <div className="absolute inset-2 bg-white/12 backdrop-blur-md border border-white/25 rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)]" />
                        </div>
                        {/* Drumsticks */}
                        <div className="absolute right-6 bottom-4 w-1 h-8 bg-white/40 rounded-full transform rotate-45 shadow-sm" />
                        <div className="absolute right-10 bottom-2 w-1 h-8 bg-white/35 rounded-full transform -rotate-30 shadow-sm" />
                      </>
                    )}
                    
                    {goal.id === 'mood-boost' && (
                      <>
                        {/* Glass guitar in sunlit meadow */}
                        <div className="absolute left-4 bottom-4 w-20 h-24 bg-white/15 backdrop-blur-lg border border-white/30 rounded-3xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)]">
                          {/* Guitar body */}
                          <div className="absolute inset-x-2 top-8 bottom-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]" />
                          {/* Sound hole */}
                          <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]" />
                          {/* Strings */}
                          <div className="absolute left-1/2 top-2 w-0.5 h-20 bg-white/40 rounded-full transform -translate-x-1/2 shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-20 bg-white/35 rounded-full transform -translate-x-1/2 translate-x-1 shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-20 bg-white/30 rounded-full transform -translate-x-1/2 -translate-x-1 shadow-sm" />
                        </div>
                      </>
                    )}
                    
                    {goal.id === 'pain-support' && (
                      <>
                        {/* Glass violin by waterfall */}
                        <div className="absolute right-6 top-6 w-12 h-20 bg-white/18 backdrop-blur-lg border border-white/35 rounded-t-3xl rounded-b-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.18)]">
                          {/* F-holes */}
                          <div className="absolute left-3 top-6 w-1 h-8 bg-black/40 backdrop-blur-sm rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
                          <div className="absolute left-3 top-8 w-3 h-2 bg-black/30 backdrop-blur-sm rounded-full" />
                          <div className="absolute left-3 top-12 w-3 h-2 bg-black/30 backdrop-blur-sm rounded-full" />
                          <div className="absolute right-3 top-6 w-1 h-8 bg-black/40 backdrop-blur-sm rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
                          <div className="absolute right-6 top-8 w-3 h-2 bg-black/30 backdrop-blur-sm rounded-full" />
                          <div className="absolute right-6 top-12 w-3 h-2 bg-black/30 backdrop-blur-sm rounded-full" />
                          {/* Strings */}
                          <div className="absolute left-1/2 top-2 w-0.5 h-16 bg-white/45 rounded-full transform -translate-x-2 shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-16 bg-white/40 rounded-full transform -translate-x-1 shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-16 bg-white/35 rounded-full shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-16 bg-white/30 rounded-full transform translate-x-1 shadow-sm" />
                        </div>
                        {/* Bow */}
                        <div className="absolute right-2 top-12 w-12 h-1 bg-white/35 rounded-full transform rotate-30 shadow-sm" />
                      </>
                    )}
                    
                    {goal.id === 'energy-boost' && (
                      <>
                        {/* Glass electric guitar on mountain summit */}
                        <div className="absolute left-8 bottom-6 w-16 h-22 bg-white/15 backdrop-blur-lg border border-white/30 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.15)]">
                          {/* Guitar body */}
                          <div className="absolute inset-x-2 top-6 bottom-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.3)]" />
                          {/* Pickups */}
                          <div className="absolute left-1/2 top-8 w-8 h-2 bg-white/40 backdrop-blur-sm border border-white/30 rounded-full transform -translate-x-1/2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" />
                          <div className="absolute left-1/2 top-12 w-8 h-2 bg-white/35 backdrop-blur-sm border border-white/25 rounded-full transform -translate-x-1/2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
                          {/* Strings */}
                          <div className="absolute left-1/2 top-2 w-0.5 h-18 bg-white/50 rounded-full transform -translate-x-2 shadow-sm animate-pulse" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-18 bg-white/45 rounded-full transform -translate-x-1 shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-18 bg-white/40 rounded-full shadow-sm" />
                          <div className="absolute left-1/2 top-2 w-0.5 h-18 bg-white/35 rounded-full transform translate-x-1 shadow-sm" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Goal name at bottom left */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="relative z-10">
                      <h3 className="text-white font-semibold text-base md:text-lg leading-tight drop-shadow-lg tracking-wide">
                        {goal.name}
                      </h3>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
