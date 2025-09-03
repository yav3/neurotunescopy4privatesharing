import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { TherapeuticSessionBuilder } from "@/components/TherapeuticSessionBuilder";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { AudioSystemDebugger } from "@/components/AudioSystemDebugger";
import { useAudioStore } from "@/stores/audioStore";
import { toast } from "@/hooks/use-toast";
import { API } from "@/lib/api";
import { setQueue } from "@/player/audio-core";

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();
  const { currentTrack } = useAudioStore();

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 Category selected:', category);
    
    try {
      // Get tracks for the selected category (deterministic API call)
      const { tracks } = await API.playlist({ goal: category.toLowerCase(), limit: 50 });
      
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
    if (tab === "ai-dj") {
      navigate("/ai-dj");
    } else if (tab === "profile") {
      navigate("/profile");
    }
  };

  const handleTabChange = (tab: string) => {
    console.log('🔄 Tab changed to:', tab);
    setActiveTab(tab);
    
    // Show feedback for tab changes
    const tabNames = {
      "goals": "Therapeutic Goals",
      "sessions": "Session Builder"
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
      
      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      
      {/* Audio Debug Tools - development only */}
      {import.meta.env.DEV && <AudioSystemDebugger />}
      
      {/* Add test buttons for invariant checking */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-20 left-4 space-y-2 z-40">
          <button 
            onClick={() => (window as any).testPlaybackInvariants?.()}
            className="bg-primary text-primary-foreground px-3 py-2 rounded text-xs"
          >
            🧪 Test Invariants
          </button>
          <button 
            onClick={() => (window as any).fixApiConfig?.()}
            className="bg-secondary text-secondary-foreground px-3 py-2 rounded text-xs"
          >
            🔧 Check API Config
          </button>
        </div>
      )}
      
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
      
      {currentTrack && <NowPlaying />}
    </div>
  );
};

export default Index;
