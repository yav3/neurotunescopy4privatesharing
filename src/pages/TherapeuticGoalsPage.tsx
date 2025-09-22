import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { GenreSelectionModal } from '@/components/GenreSelectionModal';
import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';

// Import beautiful nature images
import peacefulLake from '@/assets/peaceful-lake-sunset.png';
import mistyLake from '@/assets/misty-lake-rock.png';
import tropicalFlowers from '@/assets/tropical-flowers.png';
import foggyLakeRock from '@/assets/foggy-lake-rock.png';
import waterfallGreen from '@/assets/waterfall-green.png';
import dewdropLeaf from '@/assets/dewdrop-leaf.png';
import dewdropMoon from '@/assets/dewdrop-moon.png';
import forestLakeMist from '@/assets/forest-lake-mist.png';
import yellowFlowers from '@/assets/yellow-flowers.png';
import positivePopDewdrops from '@/assets/positive-pop-dewdrops.png';
import stressLeaf from '@/assets/stress-support-leaf.png';
import anxietyLake from '@/assets/anxiety-support-lake.png';
import nocturnesStones from '@/assets/nocturnes-stones.png';
import chillTropicalHouse from '@/assets/chill-tropical-house.png';
import socialTimeFlowers from '@/assets/social-time-flowers.png';
import peacefulRiverBrook from '@/assets/peaceful-river-brook.png';
import { getAlbumArtByGoal } from '@/utils/albumArtPool';
import { audioSystemDebugger } from '@/utils/audioSystemDebugger';

// Create therapeutic goal cards
const therapeuticGoals = [
  ...THERAPEUTIC_GOALS.filter(goal => 
    goal.id !== 'stress-anxiety-support'
  ).map(goal => ({
    id: goal.id,
    name: goal.name,
    letter: goal.name.charAt(0),
    image: goal.artwork
  }))
];

// Trending music categories with varied images
const trendingCategories = [
  { id: 'chill-classical', name: 'Chill Classical', letter: 'C', image: peacefulLake },
  { id: 'nocturnes', name: 'Nocturnes', letter: 'N', image: nocturnesStones },
  { id: 'positive-pop', name: 'Positive Pop', letter: 'P', image: positivePopDewdrops },
  { id: 'chill-piano', name: 'Chill Piano', letter: 'P', image: forestLakeMist },
  { id: 'new-age-world', name: 'New Age & World', letter: 'N', image: waterfallGreen },
  { id: 'non-sleep-deep-rest', name: 'Non-Sleep Deep Rest', letter: 'N', image: yellowFlowers },
  { id: 'chill-tropical-house', name: 'Chill Tropical House', letter: 'C', image: chillTropicalHouse },
  { id: 'social-time', name: 'Social Time', letter: 'S', image: socialTimeFlowers },
  { id: 'chill-folk-bluegrass', name: 'Chill Folk & Bluegrass', letter: 'C', image: peacefulRiverBrook },
];

const TherapeuticGoalsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const handleGoalSelect = (goalId: string) => {
    console.log('🎯 Opening genre selection modal for goal:', goalId);
    // Map split cards back to original goal
    const mappedGoalId = goalId === 'calm-mood-boost' 
      ? 'calm-mood-boost'
      : goalId === 'anxiety-support'
      ? 'anxiety-support'
      : goalId;
    setSelectedGoalId(mappedGoalId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoalId('');
  };

  const handleTrendingSelect = (categoryId: string) => {
    console.log('🎵 Navigating to trending category:', categoryId);
    
    // For positive-pop, navigate directly to pop music without modal
    if (categoryId === 'positive-pop') {
      console.log('🎵 Navigating directly to positive pop music');
      navigate('/genre/mood-boost/pop');
      return;
    }
    
    // Map trending categories to their corresponding therapeutic goals
    const trendingToGoalMap: Record<string, string> = {
      'chill-classical': 'pain-support',
      'nocturnes': 'focus-enhancement', 
      'chill-piano': 'focus-enhancement',
      'new-age-world': 'meditation-support',
      'non-sleep-deep-rest': 'meditation-support',
      'chill-tropical-house': 'calm-mood-boost',
      'social-time': 'calm-mood-boost',
      'chill-folk-bluegrass': 'calm-mood-boost',
    };
    
    const goalId = trendingToGoalMap[categoryId] || 'focus-enhancement';
    console.log('🎵 Opening genre selection for:', categoryId, 'mapped to goal:', goalId);
    
    // Open genre selection modal for consistent user experience
    setSelectedGoalId(goalId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-2 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Branding */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Plus className="w-7 h-7 text-gray-900 dark:text-white" />
              <div>
                <div className="text-6xl font-sf font-medium text-gray-900 dark:text-white">NeuroTunes</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggle} 
              className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-32 sm:pb-24 pt-8 md:pt-12 lg:pt-16">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 lg:space-y-12">
          
          {/* Trending Section */}
          <div>
            <h2 className="text-3xl font-sf font-medium text-gray-900 dark:text-white mb-4 md:mb-6">Trending</h2>
            
            {/* Responsive grid with smaller cards for trending */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-2">
              {trendingCategories.map((category) => (
                <div key={category.id} className="flex flex-col items-start w-full">
                  <Card 
                    className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 border bg-card w-full aspect-[1/1]"
                    onClick={() => handleTrendingSelect(category.id)}
                  >
                    <img 
                      src={category.image}
                      alt={`${category.name} music category`}
                      loading="eager"
                      decoding="sync"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        imageRendering: 'auto',
                        filter: 'contrast(1.1) saturate(1.15) brightness(1.05)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/10 dark:from-black/30 dark:to-black/20" />
                    
                    {/* Hover text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      <span className="text-white font-sf font-medium text-xs px-2 py-1 bg-black/50 rounded backdrop-blur-sm">
                        Play
                      </span>
                    </div>
                  </Card>
                  <h3 className="text-gray-900 dark:text-white font-didot font-medium text-xs mt-1.5 text-left leading-tight break-words w-full">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Therapeutic Goals Section */}
          <div className="mt-8">
            <h2 className="text-3xl font-sf font-medium text-gray-900 dark:text-white mb-4 md:mb-6">Personalize Your Goal</h2>
            
            {/* Larger therapeutic goals cards with proper mobile/tablet layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {therapeuticGoals.map((goal) => (
                <div key={goal.id} className="flex flex-col items-start w-full">
                  <Card 
                    className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 aspect-[1.2/1] border bg-card w-full"
                    onClick={() => handleGoalSelect(goal.id)}
                    title="Pick a genre"
                  >
                    <img 
                      src={goal.image}
                      alt={`${goal.name} therapy program`}
                      loading="eager"
                      decoding="sync"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ 
                        imageRendering: 'auto',
                        filter: 'contrast(1.1) saturate(1.15) brightness(1.05)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/10 dark:from-black/30 dark:to-black/20" />
                    
                    {/* Hover text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      <span className="text-white font-sf font-medium text-xs px-2 py-1 bg-black/50 rounded backdrop-blur-sm">
                        Pick a genre
                      </span>
                    </div>
                  </Card>
                  <h3 className="text-gray-900 dark:text-white font-didot font-medium text-xs sm:text-sm mt-2 text-left leading-tight break-words w-full">
                    {goal.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <Navigation />
      </div>

      {/* Debug button in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-32 sm:bottom-20 right-4 z-40 space-y-2 max-w-[200px]">
          <Button 
            onClick={() => {
              import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
                BucketDiagnostics.checkAllBuckets();
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🔍 Debug All Buckets
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
                BucketDiagnostics.checkSpecificGenre('pain-support', 'new-age-chill');
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🎯 Check Pain/New Age
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/trackLoadingDebugger').then(({ TrackLoadingDebugger }) => {
                TrackLoadingDebugger.testPopEnergySpecifically();
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🎯 Test Pop Energy
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/trackLoadingDebugger').then(({ TrackLoadingDebugger }) => {
                TrackLoadingDebugger.debugGenreLoading('meditation-support', 'contemplative-piano');
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🧘 Test Meditation Piano
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/trackLoadingDebugger').then(({ TrackLoadingDebugger }) => {
                TrackLoadingDebugger.debugGenreLoading('meditation-support', 'non-sleep-deep-rest');
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🧘 Test Non-Sleep Deep Rest
          </Button>
        </div>
      )}

      {/* Genre Selection Modal */}
      <GenreSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        goalId={selectedGoalId}
      />
    </div>
  );
};

export default TherapeuticGoalsPage;