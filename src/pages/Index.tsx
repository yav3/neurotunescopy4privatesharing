import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_CATEGORIES } from '@/config/therapeuticCategories';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';

// Import beautiful album art images
import zenStonesArt from '@/assets/album-art-zen-stones.png';
import mountainLakeArt from '@/assets/album-art-mountain-lake.png';
import dewdropArt from '@/assets/album-art-dewdrop.png';
import energyOceanArt from '@/assets/energy-ocean-wave.png';
import goldenSplashArt from '@/assets/album-art-golden-splash.png';
import sunsetLakeArt from '@/assets/album-art-sunset-lake.png';
import oceanWaveArt from '@/assets/album-art-ocean-wave.png';
import waterDropArt from '@/assets/album-art-water-drop.png';
import leafDropletsArt from '@/assets/album-art-leaf-droplets.png';

// Therapeutic goals with beautiful images
const therapeuticGoals = [
  { id: 'focus-enhancement', name: 'Focus Enhancement', letter: 'F', image: zenStonesArt },
  { id: 'stress-anxiety-support', name: 'Anxiety Reduction', letter: 'A', image: mountainLakeArt },
  { id: 'pain-support', name: 'Pain Reduction', letter: 'P', image: dewdropArt },
  { id: 'energy-boost', name: 'Energy Boost', letter: 'E', image: energyOceanArt },
  { id: 'mood-boost', name: 'Mood Enhancement', letter: 'M', image: goldenSplashArt },
  { id: 'stress-anxiety-support', name: 'Stress Reduction', letter: 'S', image: sunsetLakeArt },
];

// Trending music categories with beautiful images
const trendingCategories = [
  { id: 'chill-classical', name: 'Chill Classical', letter: 'C', image: waterDropArt },
  { id: 'electronic-dance', name: 'Electronic Dance', letter: 'D', image: oceanWaveArt },
  { id: 'positive-pop', name: 'Positive Pop', letter: 'P', image: goldenSplashArt },
  { id: 'chill-piano', name: 'Chill Piano', letter: 'P', image: leafDropletsArt },
  { id: 'relaxing-new-age', name: 'Relaxing New Age', letter: 'N', image: mountainLakeArt },
  { id: 'classical-focus', name: 'Classical Focus', letter: 'F', image: zenStonesArt },
];

const Index = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();

  const handleGoalSelect = (goalId: string) => {
    console.log('🎯 Navigating to genre selection for goal:', goalId);
    try {
      navigate(`/goals/${goalId}/genres`);
    } catch (error) {
      console.error('❌ Error navigating to genre selection:', error);
    }
  };

  const handleTrendingSelect = (categoryId: string) => {
    console.log('🎵 Navigating to trending category:', categoryId);
    // Navigate to trending category or playlist
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Good morning</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggle} 
            className="text-foreground hover:bg-accent"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Therapeutic Goals Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Therapeutic Goals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {therapeuticGoals.map((goal) => (
                <Card 
                  key={goal.id}
                  className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 aspect-[2/1] border-0 rounded-xl shadow-lg"
                  onClick={() => handleGoalSelect(goal.id)}
                >
                  {/* Beautiful background image */}
                  <div className="absolute inset-0">
                    <img 
                      src={goal.image} 
                      alt={goal.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 group-hover:from-black/50 group-hover:to-black/60 transition-all duration-300" />
                  
                  <div className="relative h-full p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <span className="text-white font-bold text-sm">{goal.letter}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight drop-shadow-lg">
                        {goal.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Trending</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingCategories.map((category) => (
                <Card 
                  key={category.id}
                  className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 aspect-[3/2] border-0 rounded-xl shadow-lg"
                  onClick={() => handleTrendingSelect(category.id)}
                >
                  {/* Beautiful background image */}
                  <div className="absolute inset-0">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-black/70 group-hover:from-black/50 group-hover:to-black/60 transition-all duration-300" />
                  
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <span className="text-white font-bold text-lg">{category.letter}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="backdrop-blur-sm border-t bg-background/95 border-border">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;