import React, { useState } from 'react';
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { MusicCategoryCard } from "@/components/MusicCategoryCard";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { fetchPlaylist } from "@/lib/api";
import { newSeed, remember, excludeQS } from "@/state/playlistSession";

const AIDJ = () => {
  const [activeNavTab, setActiveNavTab] = useState("flow");
  const { setQueue } = useAudioStore();

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 Flow State category selected:', category);
    
    try {
      // Map flow types to therapeutic goals
      const goalMap = {
        'Focus Enhancement': 'focus-enhancement',
        'Energy Boost': 'mood-boost' // Use mood-boost for energy since it's high energy
      };

      const goalSlug = goalMap[category];
      if (!goalSlug) {
        throw new Error(`Unknown flow type: ${category}`);
      }

      // Fetch real tracks from your music library
      const { tracks, error } = await fetchPlaylist(goalSlug, 20, newSeed(), excludeQS());
      
      if (error) {
        console.warn('Playlist error:', error);
      }
      
      if (!tracks?.length) {
        toast({
          title: "No tracks found",
          description: `No ${category.toLowerCase()} tracks found in your music library. Please try another category.`,
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ Loaded ${tracks.length} real ${category} tracks from library`);

      // Remember played tracks for future exclusion
      tracks.slice(0, 5).forEach(track => remember(track.id));

      // GUARANTEE track selection and playback start
      await setQueue(tracks, 0);

      toast({
        title: "Playing Flow State",
        description: `Started ${category} playlist with ${tracks.length} tracks`,
      });

    } catch (error) {
      console.error('❌ Failed to load category:', category, error);
      toast({
        title: "Playback Error",
        description: `Failed to load ${category} music. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-4xl font-bold text-foreground mb-2">Flow State</h1>
        <p className="text-lg text-muted-foreground">
          Direct storage playlists for peak performance
        </p>
      </div>

      {/* Cards Grid - Same as Home Page */}
      <div className="px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center place-content-center">
            
            {/* Focus Enhancement Card */}
            <MusicCategoryCard
              title="Focus Enhancement"
              image="/lovable-uploads/acoustic-sunset-field.png"
              onClick={() => handleCategorySelect('Focus Enhancement')}
              className="animate-fade-in"
            />

            {/* Energy Boost Card */}
            <MusicCategoryCard
              title="Energy Boost"
              image="/lovable-uploads/gamma-sunbeam-forest.png"
              onClick={() => handleCategorySelect('Energy Boost')}
              className="animate-fade-in"
            />

          </div>
        </div>
      </div>

      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
    </div>
  );
};

export default AIDJ;