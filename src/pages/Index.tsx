import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_CATEGORIES } from '@/config/therapeuticCategories';
import { Navigation } from '@/components/Navigation';
import { GenreSelectionModal } from '@/components/GenreSelectionModal';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';

// Import beautiful nature images
import peacefulLake from '@/assets/peaceful-lake-sunset.png';
import mistyLake from '@/assets/misty-lake-rock.png';
import tropicalFlowers from '@/assets/tropical-flowers.png';
import { getAlbumArtByGoal } from '@/utils/albumArtPool';

// Therapeutic goals with diverse images
const therapeuticGoals = [
  { id: 'focus-enhancement', name: 'Focus Enhancement', letter: 'F', image: peacefulLake },
  { id: 'stress-anxiety-support', name: 'Anxiety Reduction', letter: 'A', image: mistyLake },
  { id: 'pain-support', name: 'Pain Reduction', letter: 'P', image: getAlbumArtByGoal('pain-support') },
  { id: 'energy-boost', name: 'Energy Boost', letter: 'E', image: tropicalFlowers },
  { id: 'mood-boost', name: 'Mood Enhancement', letter: 'M', image: getAlbumArtByGoal('mood-boost') },
  { id: 'stress-anxiety-support', name: 'Stress Reduction', letter: 'S', image: getAlbumArtByGoal('stress-anxiety-support') },
];

// Trending music categories with varied images
const trendingCategories = [
  { id: 'chill-classical', name: 'Chill Classical', letter: 'C', image: peacefulLake },
  { id: 'electronic-dance', name: 'Electronic Dance', letter: 'D', image: tropicalFlowers },
  { id: 'positive-pop', name: 'Positive Pop', letter: 'P', image: mistyLake },
  { id: 'chill-piano', name: 'Chill Piano', letter: 'P', image: peacefulLake },
  { id: 'relaxing-new-age', name: 'Relaxing New Age', letter: 'N', image: tropicalFlowers },
  { id: 'classical-focus', name: 'Classical Focus', letter: 'F', image: mistyLake },
];

const Index = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const handleGoalSelect = (goalId: string) => {
    console.log('🎯 Opening genre selection modal for goal:', goalId);
    setSelectedGoalId(goalId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoalId('');
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
                  className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200 aspect-[2/1] border-0"
                  onClick={() => handleGoalSelect(goal.id)}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${goal.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/30" />
                  <div className="relative h-full p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{goal.letter}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">
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
                  className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200 aspect-[3/2] border-0"
                  onClick={() => handleTrendingSelect(category.id)}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-accent/30" />
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{category.letter}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">
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

      {/* Genre Selection Modal */}
      <GenreSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        goalId={selectedGoalId}
      />
    </div>
  );
};

export default Index;