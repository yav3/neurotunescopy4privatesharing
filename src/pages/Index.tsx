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
];

const Index = () => {
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

  const handleTrendingSelect = async (categoryId: string) => {
    console.log('🎵 Navigating to trending category:', categoryId);
    
    // Run full diagnostic first to identify issues
    console.log('🔧 Running audio system diagnostic...');
    await audioSystemDebugger.testFullSystem();
    
    // Map trending categories to specific genre buckets for targeted playback
    const trendingToBucketsMap: Record<string, { goal: string; buckets: string[] }> = {
      'chill-classical': { goal: 'pain-support', buckets: ['Chopin'] }, // ONLY use Chopin for classical music
      'nocturnes': { goal: 'focus-enhancement', buckets: ['Nocturnes'] }, // Use actual Nocturnes bucket
      'positive-pop': { goal: 'energy-boost', buckets: ['pop'] }, // Actual pop music
      'chill-piano': { goal: 'focus-enhancement', buckets: ['Chopin'] }, // Piano music specifically
      'new-age-world': { goal: 'meditation-support', buckets: ['meditation'] }, // New Age & World maps to meditation bucket
      'non-sleep-deep-rest': { goal: 'meditation-support', buckets: ['meditation'] }, // Non-Sleep Deep Rest from meditation bucket
    };
    
    const mapping = trendingToBucketsMap[categoryId] || { goal: 'focus-enhancement', buckets: [] };
    console.log('🎵 Starting playback for category:', categoryId, 'using goal:', mapping.goal, 'buckets:', mapping.buckets);
    console.log('🔍 DEBUG: Selected category mapping details:', { categoryId, mapping, allMappings: trendingToBucketsMap });
    console.log('🎼 CLASSICAL FIX: Ensuring classical categories only use classical buckets, not New Age');
    
    // Use the playFromGenre action from playFromGoal.ts to play from specific buckets
    import('@/actions/playFromGoal').then(({ playFromGenre }) => {
      playFromGenre(mapping.goal, mapping.buckets);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Branding */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Plus className="w-7 h-7 text-teal-500" />
              <div>
                <div className="text-4xl font-light md:font-bold text-foreground">NeuroTunes</div>
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
          <h1 className="text-base font-normal md:font-medium text-muted-foreground">Good morning Let's Personalize! Pick one.</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          
          {/* Therapeutic Goals Section */}
          <div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
              {therapeuticGoals.map((goal) => (
                <Card 
                  key={goal.id}
                  className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 aspect-[1.5/1] border bg-card"
                  onClick={() => handleGoalSelect(goal.id)}
                >
                  <img 
                    src={goal.image}
                    alt={`${goal.name} therapy program`}
                    loading="eager"
                    decoding="sync"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ 
                      imageRendering: 'auto',
                      filter: 'contrast(1.08) saturate(1.05) brightness(1.01)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 dark:from-teal-500/50 dark:to-teal-600/30" />
                   <div className="relative h-full p-3 md:p-4 flex flex-col justify-end">
                     <div>
                       <h3 className="text-white font-normal md:font-semibold text-sm leading-tight drop-shadow-lg">
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
            <h2 className="text-2xl font-normal md:font-bold text-foreground mb-4 md:mb-6">Trending</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
              {trendingCategories.map((category) => (
                <Card 
                  key={category.id}
                  className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 aspect-[2.25/1.5] border bg-card"
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
                      filter: 'contrast(1.08) saturate(1.05) brightness(1.01)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 dark:from-teal-500/50 dark:to-teal-600/30" />
                   <div className="relative h-full p-4 md:p-6 flex flex-col justify-end">
                     <div>
                       <h3 className="text-white font-medium md:font-bold text-lg leading-tight drop-shadow-lg">
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
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
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
                TrackLoadingDebugger.debugGenreLoading('meditation-support', 'contemplative-piano');
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full"
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
            className="bg-background/90 backdrop-blur-sm block w-full"
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

export default Index;