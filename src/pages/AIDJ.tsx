import React, { useState } from "react";
import { Header } from "@/components/Header";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import SoundCloudFallback from "@/components/SoundCloudFallback";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { fetchPlaylist } from "@/lib/api";
import { toGoalSlug } from "@/domain/goals";
import { excludeQS, newSeed, remember } from "@/state/playlistSession";

const AIDJ = () => {
  const [activeNavTab, setActiveNavTab] = useState("ai-dj");
  const [showPlayer, setShowPlayer] = useState(false);
  const { currentTrack, setQueue, error, lastGoal } = useAudioStore();

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 AI DJ Category selected:', category);
    
    try {
      // Get tracks for the selected category using AI DJ logic
      const goalSlug = toGoalSlug(category.toLowerCase());
      const { tracks, error } = await fetchPlaylist(goalSlug, 50, newSeed(), excludeQS());
      
      if (error) {
        console.warn('AI DJ Playlist fallback/error:', error);
      }
      
      if (!tracks?.length) {
        toast({
          title: "No tracks found",
          description: `No music available for ${category}. Please try another category.`,
          variant: "destructive",
        });
        return;
      }
      
      // Remember played tracks for future exclusion
      tracks.slice(0, 5).forEach(track => remember(track.id));
      
      // Start AI DJ session
      await setQueue(tracks, 0);
      
      toast({
        title: "AI DJ Started",
        description: `Your AI DJ is now playing ${category} with ${tracks.length} tracks`,
      });
      
      // Auto-show player when AI DJ starts
      setShowPlayer(true);
      
    } catch (error) {
      console.error('❌ AI DJ Failed to load category:', category, error);
      toast({
        title: "AI DJ Error",
        description: `Failed to start AI DJ for ${category}. Please try again.`,
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
      
      {/* AI DJ Header */}
      <div className="px-4 md:px-8 py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          AI DJ
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your personalized AI DJ creates therapeutic music experiences tailored to your needs. 
          Choose a mood or goal and let the AI curate the perfect playlist for you.
        </p>
      </div>
      
      <TherapeuticMusic onCategorySelect={handleCategorySelect} />
      
      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      
      {/* SoundCloud fallback for mood boost */}
      {error === "soundcloud-fallback" && lastGoal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur z-50 flex items-center justify-center">
          <SoundCloudFallback goal={lastGoal} />
        </div>
      )}
      
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
    </div>
  );
};

export default AIDJ;