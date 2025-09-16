import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus } from 'lucide-react';
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
import foggyLakeRock from '@/assets/foggy-lake-rock.png';
import waterfallGreen from '@/assets/waterfall-green.png';
import dewdropLeaf from '@/assets/dewdrop-leaf.png';
import dewdropMoon from '@/assets/dewdrop-moon.png';
import forestLakeMist from '@/assets/forest-lake-mist.png';
import yellowFlowers from '@/assets/yellow-flowers.png';
import { getAlbumArtByGoal } from '@/utils/albumArtPool';
import { audioSystemDebugger } from '@/utils/audioSystemDebugger';

// Therapeutic goals with diverse images
const therapeuticGoals = [
  { id: 'focus-enhancement', name: 'Focus Enhancement', letter: 'F', image: peacefulLake },
  { id: 'stress-anxiety-support', name: 'Anxiety Reduction', letter: 'A', image: mistyLake },
  { id: 'pain-support', name: 'Pain Reduction', letter: 'P', image: getAlbumArtByGoal('pain-support') },
  { id: 'energy-boost', name: 'Energy Boost', letter: 'E', image: tropicalFlowers },
  { id: 'mood-boost', name: 'Mood Enhancement', letter: 'M', image: getAlbumArtByGoal('mood-boost') },
  { id: 'stress-reduction-alt', name: 'Stress Reduction', letter: 'S', image: getAlbumArtByGoal('stress-anxiety-support'), goalMapping: 'stress-anxiety-support' },
];

// Trending music categories with varied images
const trendingCategories = [
  { id: 'chill-classical', name: 'Chill Classical', letter: 'C', image: peacefulLake },
  { id: 'electronic-dance', name: 'Electronic Dance', letter: 'D', image: tropicalFlowers },
  { id: 'positive-pop', name: 'Positive Pop', letter: 'P', image: mistyLake },
  { id: 'chill-piano', name: 'Chill Piano', letter: 'P', image: forestLakeMist },
  { id: 'relaxing-new-age', name: 'Relaxing New Age', letter: 'N', image: waterfallGreen },
  { id: 'classical-focus', name: 'Classical Focus', letter: 'F', image: yellowFlowers },
];

const Index = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const handleGoalSelect = (goalId: string) => {
    console.log('🎯 Opening genre selection modal for goal:', goalId);
    // Map stress-reduction-alt to the actual stress-anxiety-support goal
    const mappedGoalId = goalId === 'stress-reduction-alt' ? 'stress-anxiety-support' : goalId;
    setSelectedGoalId(mappedGoalId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoalId('');
  };

  const handleTrendingSelect = async (categoryId: string) => {
    console.log('🎵 Navigating to trending category:', categoryId);
    
    // Run full diagnostic first to identify issues
    console.log('🔧 Running audio system diagnostic...');
    await audioSystemDebugger.testFullSystem();
    
    // Map trending categories to actual music goals for immediate playback
    const trendingToGoalMap: Record<string, string> = {
      'chill-classical': 'focus-enhancement',
      'electronic-dance': 'energy-boost', 
      'positive-pop': 'mood-boost',
      'chill-piano': 'focus-enhancement',
      'relaxing-new-age': 'stress-anxiety-support',
      'classical-focus': 'focus-enhancement'
    };
    
    const goalId = trendingToGoalMap[categoryId] || 'focus-enhancement';
    console.log('🎵 Starting playback for goal:', goalId);
    
    // Use the playFromGoal action from audio store
    import('@/stores').then(({ useAudioStore }) => {
      useAudioStore.getState().playFromGoal(goalId);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Branding */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Plus className="w-7 h-7 text-foreground" />
              <div>
                <div className="text-4xl font-bold text-foreground">NeuroTunes</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggle} 
              className="text-foreground hover:bg-accent"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Greeting */}
          <h1 className="text-base font-medium text-foreground">Good morning Let's Personalize! Pick one.</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Therapeutic Goals Section */}
          <div>
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

      {/* Debug button in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-20 right-4 z-50 space-y-2">
          <Button 
            onClick={() => {
              import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
                BucketDiagnostics.checkAllBuckets();
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full"
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
            className="bg-background/90 backdrop-blur-sm block w-full"
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
            className="bg-background/90 backdrop-blur-sm block w-full"
          >
            🎯 Test Pop Energy
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/trackLoadingDebugger').then(({ TrackLoadingDebugger }) => {
                TrackLoadingDebugger.testPainReductionSpecifically();
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full"
          >
            🎯 Test Pain/New Age
          </Button>
        </div>
      )}
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