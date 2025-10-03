import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { GenreSelectionModal } from '@/components/GenreSelectionModal';
import { getTherapeuticIcon } from '@/components/icons/TherapeuticIcons';

import { cn } from '@/lib/utils';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useWelcomeMessage } from '@/hooks/useWelcomeMessage';
import { usePostSessionSurvey } from '@/hooks/usePostSessionSurvey';
import { PostSessionSurvey } from '@/components/surveys/PostSessionSurvey';
import { usePinnedFavorites } from '@/hooks/usePinnedFavorites';
import { useAppStore } from '@/stores/appStore';

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
import relaxationCard from '@/assets/relaxation-card.png';
import recoveryCard from '@/assets/recovery-card.png';
import focusCard from '@/assets/focus-card.png';
import restCard from '@/assets/rest-card.png';
import exerciseCard from '@/assets/exercise-card.png';
import boostCard from '@/assets/boost-card.png';

// Create therapeutic goal cards with new names and images
// Map visual cards to actual therapeutic goal IDs from config
const therapeuticGoals = [
  {
    id: "anxiety-support",
    name: "Relaxation",
    image: relaxationCard,
    goalId: "anxiety-support"
  },
  {
    id: "pain-support",
    name: "Recovery",
    image: recoveryCard,
    goalId: "pain-support"
  },
  {
    id: "focus-enhancement",
    name: "Focus+",
    image: focusCard,
    goalId: "focus-enhancement"
  },
  {
    id: "sleep-preparation",
    name: "Rest",
    image: restCard,
    goalId: "sleep-preparation"
  },
  {
    id: "energy-boost",
    name: "Exercise",
    image: exerciseCard,
    goalId: "energy-boost"
  },
  {
    id: "depression-support",
    name: "Boost",
    image: boostCard,
    goalId: "depression-support"
  }
];

const TherapeuticGoalsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  
  // Welcome returning users
  useWelcomeMessage();
  
  // Post-session survey
  const { showSurvey, closeSurvey } = usePostSessionSurvey();
  
  // Pinned favorites based on user behavior
  const { pinnedItems, loading: pinnedLoading } = usePinnedFavorites();
  
  // Check if user should see onboarding (only truly new users)
  const hasSeenOnboarding = useAppStore(state => state.preferences.hasSeenOnboarding);
  const sessionHistory = useAppStore(state => state.sessionHistory);
  const setPreference = useAppStore(state => state.setPreference);
  
  // Mark as seen when user has any session history
  React.useEffect(() => {
    if (!hasSeenOnboarding && sessionHistory.length > 0) {
      setPreference('hasSeenOnboarding', true);
    }
  }, [hasSeenOnboarding, sessionHistory.length, setPreference]);
  
  const showOnboarding = !hasSeenOnboarding && sessionHistory.length === 0;

  const handleGoalSelect = (goalId: string) => {
    console.log('🎯 Opening genre selection modal for goal:', goalId);
    // goalId now matches the actual therapeutic goal IDs
    setSelectedGoalId(goalId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoalId('');
  };

  const handlePinnedItemSelect = (item: typeof pinnedItems[0]) => {
    if (item.type === 'goal') {
      handleGoalSelect(item.id);
    } else {
      // Navigate to track (could enhance this later)
      console.log('🎵 Selected favorited track:', item.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-1.5 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Branding */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-gray-900 dark:text-white" />
              <div>
                <div className="text-3xl sm:text-4xl font-sf font-medium text-gray-900 dark:text-white leading-tight">NeuroTunes</div>
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
      <div className="px-6 sm:px-8 md:px-12 pb-16 pt-64 sm:pt-80">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
          
          {/* Pinned Favorites Section - Only show if user has pinned items */}
          {!pinnedLoading && pinnedItems.length > 0 && (
            <div>
              <h2 className="text-base sm:text-lg font-sf font-medium text-gray-900 dark:text-white mb-2 leading-tight">Your Favorites</h2>
              
              {/* Horizontal scrolling container for pinned favorites */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 min-w-max">
                  {pinnedItems.map((item) => (
                    <div key={item.id} className="flex flex-col items-start flex-shrink-0 w-24 sm:w-28 md:w-32">
                      <Card 
                        className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 border bg-card w-full aspect-[1/1]"
                        onClick={() => handlePinnedItemSelect(item)}
                      >
                        <img 
                          src={item.image}
                          alt={`${item.name}`}
                          loading="eager"
                          decoding="sync"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{ 
                            imageRendering: 'auto',
                            filter: 'contrast(1.1) saturate(1.15) brightness(1.05)'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/10 dark:from-black/30 dark:to-black/20" />
                        
                        {/* Usage count badge for goals */}
                        {item.type === 'goal' && item.usageCount && (
                          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-white text-xs font-sf font-medium">{item.usageCount}x</span>
                          </div>
                        )}
                        
                        {/* Hover text overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                          <span className="text-white font-sf font-medium text-xs px-2 py-1 bg-black/50 rounded backdrop-blur-sm">
                            Play
                          </span>
                        </div>
                      </Card>
                      <h3 className="text-gray-900 dark:text-white font-didot font-medium text-sm sm:text-base mt-4 sm:mt-5 text-left leading-snug break-words w-full card-title">
                        {item.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Onboarding message for new users */}
          {showOnboarding && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Click on a goal to select a genre. I'll learn your preferences and improve recommendations with every session, ultimately enabling a closed loop experience. Pin a mode to the top: you'll get recommendations based on your recent favorites. Select from a therapeutic goal to listen on discovery mode.
              </p>
            </div>
          )}

          {/* Therapeutic Goals Section - All 6 cards in grid */}
          <div>
            <h2 className="text-lg sm:text-xl font-sf font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">Personalize Your Goal</h2>
            
            {/* Horizontal scrolling container for all therapeutic goals */}
            <div className="overflow-x-auto pb-2 -mx-6 px-6 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12">
              <div className="flex gap-3 sm:gap-4 min-w-max">
              {therapeuticGoals.map((goal) => {
                const IconComponent = getTherapeuticIcon(goal.goalId);
                return (
                  <div key={goal.id} className="flex-shrink-0 w-52 sm:w-64">
                    <Card 
                      className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 bg-card w-full aspect-square rounded-2xl sm:rounded-3xl border-0"
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
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 group-hover:from-black/20 group-hover:to-black/60 transition-all duration-300" />
                      
                      {/* Centered icon sprite */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="text-white opacity-90 group-hover:opacity-100 transition-opacity" size={40} />
                      </div>
                      
                      {/* Title on hover only */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                        <h3 className="text-white font-didot font-medium text-base sm:text-lg">
                          {goal.name}
                        </h3>
                      </div>
                    </Card>
                  </div>
                );
              })}
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
        <div className="fixed top-20 right-4 z-40 space-y-2 max-w-[200px]">
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
      
      {/* Post-Session Survey */}
      <PostSessionSurvey
        open={showSurvey}
        onClose={closeSurvey}
      />
    </div>
  );
};

export default TherapeuticGoalsPage;