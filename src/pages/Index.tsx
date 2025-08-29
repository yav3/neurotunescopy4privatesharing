import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { TherapeuticSessionBuilder } from "@/components/TherapeuticSessionBuilder";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { useAudio } from "@/context/AudioContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();
  const { setPlaylist, currentTrack } = useAudio();

  const handleCategorySelect = (category: string) => {
    setShowPlayer(true);
  };

  const handleSessionStart = (tracks: any[]) => {
    if (tracks.length > 0) {
      setPlaylist(tracks);
      setShowPlayer(false); // Close any existing player
    }
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "ai-dj") {
      navigate("/ai-dj");
    } else if (tab === "mood-analyzer") {
      navigate("/mood-analyzer");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TrendingTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
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
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
      
      {currentTrack && <NowPlaying />}
    </div>
  );
};

export default Index;
