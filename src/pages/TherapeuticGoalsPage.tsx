import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Plus, Pin, Guitar, Waves, Drum, Palmtree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { Navigation } from '@/components/Navigation';
import { GenreSelectionModal } from '@/components/GenreSelectionModal';
import { getTherapeuticIcon, LotusIcon, WaveIcon } from '@/components/icons/TherapeuticIcons';
import { WelcomeBox } from '@/components/WelcomeBox';

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
import tropicalHousePartyBg from '@/assets/tropical-house-party-green.png';
import neurotunesLogo from '@/assets/neurotunes-logo.png';
import relaxationCard from '@/assets/relaxation-card.png';
import relaxationCardDark from '@/assets/relaxation-blue-swirls.png';
import recoveryCard from '@/assets/recovery-teal-bubbles.png';
import focusCard from '@/assets/focus-card.png';
import restCard from '@/assets/rest-card.png';
import exerciseCard from '@/assets/exercise-button-bg.png';
import boostCard from '@/assets/boost-button-bg.png';
import genreChillTropicalHouse from '@/assets/genre-chill-tropical-house-new.png';
import genreHiitEnergy from '@/assets/genre-hiit-energy-new.png';
import genreClassicalCalm from '@/assets/genre-classical-calm.png';
import genreChillSamba from '@/assets/genre-chill-samba-new.png';
import genreRelaxation from '@/assets/genre-relaxation.png';
import tropicalHouseFocusCream from '@/assets/tropical-house-focus-cream.png';
import tropicalHousePartyTeal from '@/assets/tropical-house-party-teal.png';
import boostCardYellow from '@/assets/boost-card-yellow.png';
import focusCardCream from '@/assets/focus-card-cream.png';
import favoritePurple from '@/assets/favorite-purple.png';
import favoritePeach from '@/assets/favorite-peach.png';
import favoriteCyan from '@/assets/favorite-cyan.png';
import favoriteGreen from '@/assets/favorite-green.png';
import favoriteCyanLight from '@/assets/favorite-cyan-light.png';
import favoriteCyanFlow from '@/assets/favorite-cyan-flow.png';
import favoriteTealDark from '@/assets/favorite-teal-dark.png';
import favoriteWhite from '@/assets/favorite-white.png';
import favoriteGold from '@/assets/favorite-gold.png';
import favoriteTealCells from '@/assets/favorite-teal-cells.png';
import favoriteTealGreenWaves from '@/assets/favorite-teal-green-waves.png';
import favoriteBlueWaves from '@/assets/favorite-blue-waves.png';
import favoriteDarkGreen from '@/assets/favorite-dark-green.png';
import favoriteTealGreenGradient from '@/assets/favorite-teal-green-gradient.png';
import favoriteDarkNavy from '@/assets/favorite-dark-navy.png';
import relaxationCardTealGlass from '@/assets/relaxation-card-teal-glass.png';

// Create therapeutic goal cards with new names and images
// Map visual cards to actual therapeutic goal IDs from config
const therapeuticGoals = [
  {
    id: "anxiety-support",
    name: "Relaxation",
    abstractImage: relaxationCardTealGlass,
    natureImage: anxietyLake,
    goalId: "anxiety-support"
  },
  {
    id: "pain-support",
    name: "Recovery",
    abstractImage: recoveryCard,
    natureImage: dewdropLeaf,
    goalId: "pain-support"
  },
  {
    id: "sleep-preparation",
    name: "Rest",
    abstractImage: restCard,
    natureImage: nonSleepDeepRestLeaf,
    goalId: "sleep-preparation"
  },
  {
    id: "focus-enhancement",
    name: "Focus+",
    abstractImage: focusCardCream,
    natureImage: peacefulLake,
    goalId: "focus-enhancement"
  },
  {
    id: "energy-boost",
    name: "Exercise",
    abstractImage: exerciseCard,
    natureImage: waterfallGreen,
    goalId: "energy-boost"
  },
  {
    id: "depression-support",
    name: "Boost",
    abstractImage: boostCardYellow,
    natureImage: tropicalFlowers,
    goalId: "depression-support"
  }
];

const TherapeuticGoalsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [showNatureCards, setShowNatureCards] = useState(false);
  
  
  // Welcome returning users
  useWelcomeMessage();
  
  // Post-session survey
  const { showSurvey, closeSurvey } = usePostSessionSurvey();
  
  // Pinned favorites based on user behavior
  const { pinnedItems, loading: pinnedLoading, togglePinGoal, isGoalPinned } = usePinnedFavorites();
  
  // Check if user should see onboarding (only truly new users)
  const hasSeenOnboarding = useAppStore(state => state.preferences.hasSeenOnboarding);
  const sessionHistory = useAppStore(state => state.sessionHistory);
  const setPreference = useAppStore(state => state.setPreference);
  
  const showOnboarding = !hasSeenOnboarding;

  const handleDismissWelcome = () => {
    setPreference('hasSeenOnboarding', true);
  };

  const handleGoalSelect = (goalId: string) => {
    console.log('🎯 Opening genre selection modal for goal:', goalId);
    // Mark onboarding as seen after first interaction
    if (!hasSeenOnboarding) {
      setPreference('hasSeenOnboarding', true);
    }
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
      <div className="px-4 py-2 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Branding */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-foreground" />
              <div>
                <div className="text-lg sm:text-xl font-sf font-medium text-foreground leading-tight">NeuroTunes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNatureCards(!showNatureCards)} 
                className="text-muted-foreground hover:text-foreground hover:bg-accent text-xs"
              >
                {showNatureCards ? 'Abstract' : 'Nature'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggle} 
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome message for new users */}
      {showOnboarding && (
        <div className="px-6 sm:px-8 md:px-12 pt-2">
          <div className="max-w-3xl mx-auto">
            <WelcomeBox onDismiss={handleDismissWelcome} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-6 sm:px-8 md:px-12 pb-20 pt-6 sm:pt-8">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
          
          {/* Pinned Favorites Section - Only show if user has pinned items */}
          {!pinnedLoading && pinnedItems.length > 0 && (
            <div>
              <h2 className="text-sm sm:text-base font-sf font-medium text-foreground mb-4 leading-tight">Your Favorites</h2>
              
              {/* Horizontal scrolling container for pinned favorites */}
              <div className="overflow-x-auto pb-1">
                <div className="flex gap-3 min-w-max">
                  {pinnedItems.map((item, index) => {
                    // Lighter backgrounds for energetic/boosting goals
                    const energeticBackgrounds = [
                      favoriteTealGreenWaves,
                      favoriteBlueWaves,
                      favoriteTealGreenGradient,
                      favoriteCyanLight,
                      favoriteCyan,
                      favoriteWhite
                    ];
                    
                    // Darker backgrounds for peaceful/relaxing goals
                    const peacefulBackgrounds = [
                      favoriteDarkNavy,
                      favoriteDarkGreen,
                      favoriteTealDark,
                      favoritePurple,
                      favoritePeach,
                      favoriteTealCells
                    ];
                    
                    // Determine if this is an energetic or peaceful goal
                    const energeticGoals = ['energy-boost', 'depression-support', 'focus-enhancement'];
                    const energeticGenres = ['hiit-training', 'tropical-house-focus', 'house-music', 'samba', 'reggaeton', 'pop'];
                    
                    const isEnergetic = item.type === 'goal' 
                      ? energeticGoals.includes(item.id)
                      : item.id.split('-').some(part => energeticGenres.includes(part));
                    
                    const backgrounds = isEnergetic ? energeticBackgrounds : peacefulBackgrounds;
                    const backgroundImage = backgrounds[index % backgrounds.length];
                    
                    return (
                   <div key={item.id} className="flex flex-col items-start flex-shrink-0 w-[72px] sm:w-20">
                      <Card 
                        className="relative overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 border-0 bg-card w-full aspect-[1/1] rounded-lg sm:rounded-xl"
                        onClick={() => handlePinnedItemSelect(item)}
                      >
                        <img 
                          src={backgroundImage}
                          alt={`${item.name}`}
                          loading="eager"
                          decoding="sync"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ 
                            imageRendering: 'auto',
                            filter: 'contrast(1.1) saturate(1.15) brightness(1.05)'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                        
                        {/* Name in bottom left corner */}
                        <div className="absolute bottom-1.5 left-1.5">
                          <span className="text-white font-didot font-medium text-[10px] sm:text-xs drop-shadow-lg">
                            {item.name}
                          </span>
                        </div>
                      </Card>
                    </div>
                  )})}
                </div>
              </div>
            </div>
          )}

          {/* Therapeutic Goals Section - All 6 cards in grid */}
          <div>
            <h2 className="text-sm sm:text-base font-medium text-foreground mb-6 leading-tight" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>Personalize Your Goal</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {therapeuticGoals.map((goal) => {
                const isPinned = isGoalPinned(goal.id);
                return (
                  <div key={goal.id} className="relative">
                    <Card 
                      className="relative overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] bg-card border-0 aspect-[4/3]"
                      onClick={() => handleGoalSelect(goal.id)}
                    >
                      <img 
                        src={showNatureCards ? goal.natureImage : goal.abstractImage}
                        alt={goal.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white font-medium text-sm leading-tight drop-shadow-lg">
                          {goal.name}
                        </h3>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinGoal(goal.id);
                        }}
                        className={cn(
                          "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity",
                          isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Pin 
                          className={cn("w-3.5 h-3.5 text-white", isPinned && "fill-white")}
                        />
                      </button>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Genres Section */}
          <div>
            <h2 className="text-sm sm:text-base font-medium text-foreground mb-6 leading-tight" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>New Genres</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { goalId: 'focus-enhancement', genreId: 'tropical-house-focus', name: 'Tropical House Focus', icon: Waves },
                { goalId: 'mood-boost', genreId: 'samba', name: 'Chill Samba', icon: WaveIcon },
                { goalId: 'mood-boost', genreId: 'house-music', name: 'Tropical House Party', icon: Palmtree },
                { goalId: 'energy-boost', genreId: 'hiit-training', name: 'HIIT Energy', icon: Drum },
                { goalId: 'anxiety-support', genreId: 'classical-acoustic', name: 'Classical Calm', icon: Guitar },
              ].map((genre) => {
                const genreKey = `${genre.goalId}-${genre.genreId}`;
                const IconComponent = genre.icon;
                return (
                  <button
                    key={genreKey}
                    onClick={() => navigate(`/genre/${genre.goalId}/${genre.genreId}`)}
                    className="relative h-[72px] sm:h-20 rounded-full cursor-pointer group transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98] overflow-visible"
                    style={{
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: `
                        0 0 0 1px rgba(255, 255, 255, 0.25),
                        inset 0 1px 4px rgba(255, 255, 255, 0.1),
                        inset 0 -1px 4px rgba(0, 0, 0, 0.5),
                        0 4px 16px rgba(0, 0, 0, 0.6)
                      `,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-5 sm:px-6">
                      <span 
                        className="text-[15px] sm:text-[16px] font-medium tracking-wide text-left flex-1" 
                        style={{ 
                          fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: '#C0C0C8',
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        }}
                      >
                        {genre.name}
                      </span>
                      
                      <div className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105">
                        <div 
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: `
                              0 0 0 1px rgba(255, 255, 255, 0.2),
                              inset 0 1px 2px rgba(255, 255, 255, 0.1),
                              0 2px 8px rgba(0, 0, 0, 0.4)
                            `,
                          }}
                        >
                          <IconComponent 
                            className="w-4 h-4"
                            style={{ 
                              color: '#C0C0C8',
                              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <Navigation />
      </div>

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