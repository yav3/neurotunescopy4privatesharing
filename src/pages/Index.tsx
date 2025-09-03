import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { TherapeuticSessionBuilder } from "@/components/TherapeuticSessionBuilder";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { AudioDebugPanel } from "@/components/AudioDebugPanel";
import { useAudioStore } from "@/stores/audioStore";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();
  const { currentTrack } = useAudioStore();

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 Category selected:', category);
    // Auto-show player when therapeutic music starts
    setShowPlayer(true);
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
      
      {/* Audio Debug Panel - development only */}
      {import.meta.env.DEV && <AudioDebugPanel />}
      
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
      
      {currentTrack && <NowPlaying />}
    </div>
  );
};

export default Index;
