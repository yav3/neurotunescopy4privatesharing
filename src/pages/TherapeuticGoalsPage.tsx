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
import { useWelcomeMessage } from '@/hooks/useWelcomeMessage';

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
import chillTropicalHouseStones from '@/assets/chill-tropical-house-stones.png';
import socialTimeLotus from '@/assets/social-time-lotus.png';
import chillFolkBluegrassLake from '@/assets/chill-folk-bluegrass-lake.png';
import newAgeWorldLandscape from '@/assets/new-age-world-landscape.png';
import nonSleepDeepRestLeaf from '@/assets/non-sleep-deep-rest-leaf.png';
import americanaJamBandStones from '@/assets/americana-jam-band-stones.png';
import chillSambaTropical from '@/assets/chill-samba-bg.png';
import tropicalHousePartyBg from '@/assets/tropical-house-party-bg.png';
import neurotunesLogo from '@/assets/neurotunes-logo.png';

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
  { id: 'chill-samba', name: 'Chill Samba', letter: 'C', image: chillSambaTropical },
  { id: 'chill-piano', name: 'New Age Focus', letter: 'N', image: forestLakeMist },
  { id: 'non-sleep-deep-rest', name: 'Deep Relaxation', letter: 'D', image: nonSleepDeepRestLeaf },
  { id: 'chill-folk-bluegrass', name: 'Chill Folk & Bluegrass', letter: 'C', image: chillFolkBluegrassLake },
  { id: 'americana-jam-band', name: 'Mood Boosting Americana & Jam Band', letter: 'M', image: americanaJamBandStones },
];

const TherapeuticGoalsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  
  // Welcome returning users
  useWelcomeMessage();

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
    
    // Direct navigation for specific categories to avoid wrong genre selection
    if (categoryId === 'chill-samba') {
      console.log('🎵 Navigating directly to chill samba music');
      navigate('/genre/mood-boost/samba');
      return;
    }
    
    
    if (categoryId === 'chill-tropical-house') {
      console.log('🎵 Navigating directly to chill tropical house music');
      navigate('/genre/mood-boost/chill-tropical-house');
      return;
    }
    
    if (categoryId === 'americana-jam-band') {
      console.log('🎵 Navigating directly to americana & jam band music');
      navigate('/genre/mood-boost/americana-jam-band');
      return;
    }
    
    // Map trending categories to their corresponding therapeutic goals
    const trendingToGoalMap: Record<string, string> = {
      'chill-classical': 'pain-support',
      'nocturnes': 'focus-enhancement', 
      'chill-piano': 'focus-enhancement',
      'non-sleep-deep-rest': 'depression-support',
      'chill-tropical-house': 'depression-support',
      'social-time': 'depression-support',
      'chill-folk-bluegrass': 'depression-support',
      'americana-jam-band': 'depression-support',
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
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900 dark:text-white" />
              <div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-sf font-medium text-gray-900 dark:text-white leading-tight">NeuroTunes</div>
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
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-32 sm:pb-24 pt-6 sm:pt-8 md:pt-12 lg:pt-16">
        <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 md:space-y-14 lg:space-y-16">
          

          {/* Trending Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-sf font-medium text-gray-900 dark:text-white mb-6 md:mb-8 leading-tight">Trending</h2>
            
            {/* Horizontal scrolling container for trending */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max">
                {trendingCategories.map((category) => (
                  <div key={category.id} className="flex flex-col items-start flex-shrink-0 w-24 sm:w-28 md:w-32">
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
                    <h3 className="text-gray-900 dark:text-white font-didot font-medium text-sm sm:text-base mt-4 sm:mt-5 text-left leading-snug break-words w-full card-title">
                      {category.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Therapeutic Goals Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-sf font-medium text-gray-900 dark:text-white mb-6 md:mb-8 leading-tight">Personalize Your Goal</h2>
            
            {/* Horizontal scrolling container for therapeutic goals */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-4 min-w-max">
                {therapeuticGoals.map((goal) => (
                  <div key={goal.id} className="flex flex-col items-start flex-shrink-0 w-32 sm:w-36 md:w-40">
                    <Card 
                      className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 border bg-card w-full aspect-[1/1]"
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
                    <h3 className="text-gray-900 dark:text-white font-didot font-medium text-sm sm:text-base mt-4 sm:mt-5 text-left leading-snug break-words w-full card-title">
                      {goal.name}
                    </h3>
                  </div>
                ))}
              </div>
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
              import('@/utils/meditationDebugger').then(({ MeditationDebugger }) => {
                MeditationDebugger.debugMeditationMode();
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🧘 Debug Meditation Mode
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/modePlaybackDebugger').then(({ ModePlaybackDebugger }) => {
                ModePlaybackDebugger.testSpecificMode('meditation-support');
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🧘 Test Meditation Tracks
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/modePlaybackDebugger').then(({ ModePlaybackDebugger }) => {
                ModePlaybackDebugger.testAllModes();
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🔍 Test All Modes
          </Button>
          <Button 
            onClick={() => {
              import('@/utils/bucketDiagnostics').then(({ BucketDiagnostics }) => {
                BucketDiagnostics.checkSpecificGenre('meditation-support', 'zen-new-age');
              });
            }}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-sm block w-full text-xs"
          >
            🎯 Check Meditation Buckets
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