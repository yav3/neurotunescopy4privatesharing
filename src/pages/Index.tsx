import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { TherapeuticSessionBuilder } from "@/components/TherapeuticSessionBuilder";
import { AudioDataCompiler } from "@/components/AudioDataCompiler";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { AudioSystemDebugger } from "@/components/AudioSystemDebugger";
import SoundCloudFallback from "@/components/SoundCloudFallback";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { API } from "@/lib/api";
import { toGoalSlug } from "@/domain/goals";
import "@/utils/startCompilation"; // Auto-start compilation

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();
  const { currentTrack, setQueue, error, lastGoal } = useAudioStore();

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 Category selected:', category);
    
    try {
      // Get tracks for the selected category (deterministic API call)
      const goalSlug = toGoalSlug(category.toLowerCase());
      const { tracks } = await API.playlist(goalSlug, 50);
      
      if (!tracks?.length) {
        toast({
          title: "No tracks found",
          description: `No music available for ${category}. Please try another category.`,
          variant: "destructive",
        });
        return;
      }
      
      // GUARANTEE track selection and playback start
      await setQueue(tracks, 0);
      
      toast({
        title: "Playing Music",
        description: `Started ${category} playlist with ${tracks.length} tracks`,
      });
      
      // Auto-show player when therapeutic music starts
      setShowPlayer(true);
      
    } catch (error) {
      console.error('❌ Failed to load category:', category, error);
      toast({
        title: "Playback Error",
        description: `Failed to load ${category} music. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleSessionStart = async (tracks: any[]) => {
    // Session is already handled in TherapeuticSessionBuilder
    // Just ensure the modal player is closed since NowPlaying will show
    setShowPlayer(false);
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "profile") {
      navigate("/profile");
    }
  };

  const handleTabChange = (tab: string) => {
    console.log('🔄 Tab changed to:', tab);
    setActiveTab(tab);
    
    // Show feedback for tab changes
    const tabNames = {
      "goals": "Therapeutic Goals",
      "sessions": "Session Builder",
      "data": "Audio Data Management"
    };
    
    toast({
      title: "Section Changed",
      description: `Switched to ${tabNames[tab as keyof typeof tabNames] || tab}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TrendingTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === "goals" && (
        <TherapeuticMusic onCategorySelect={handleCategorySelect} />
      )}
      
      {activeTab === "sessions" && (
        <div className="px-4 md:px-8 mb-24">
          <div className="max-w-4xl mx-auto">
            <TherapeuticSessionBuilder onSessionStart={handleSessionStart} />
          </div>
        </div>
      )}
      
      {activeTab === "data" && (
        <div className="px-4 md:px-8 mb-24">
          <div className="max-w-4xl mx-auto">
            <AudioDataCompiler />
          </div>
        </div>
      )}
      
      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      
      {/* SoundCloud fallback for mood boost */}
      {error === "soundcloud-fallback" && lastGoal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur z-50 flex items-center justify-center">
          <SoundCloudFallback goal={lastGoal} />
        </div>
      )}
      
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
      
      {currentTrack && <NowPlaying />}
    </div>
  );
};

export default Index;
