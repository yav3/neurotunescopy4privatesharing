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
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();
  const { setPlaylist, currentTrack, loadTrack, state } = useAudio();

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 Category selected:', category);
    setShowPlayer(true);
    
    // Show feedback to user
    toast({
      title: "Loading Music",
      description: `Preparing ${category} tracks for you...`,
    });
  };

  const handleSessionStart = async (tracks: any[]) => {
    if (tracks.length > 0) {
      console.log(`🎵 Session starting with ${tracks.length} tracks`);
      const maxTracks = 50; // Match audio-core MAX_QUEUE
      const tracksToQueue = tracks.slice(0, maxTracks);
      console.log(`🔒 Limiting session queue to ${tracksToQueue.length} tracks (from ${tracks.length} total)`);
      
      setPlaylist(tracksToQueue);
      
      // Auto-play the first track to start the session
      if (tracksToQueue[0]) {
        console.log('🎵 Auto-playing first track:', tracksToQueue[0].title);
        
        toast({
          title: "Session Started",
          description: `Now playing: ${tracksToQueue[0].title}`,
        });
        
        await loadTrack(tracksToQueue[0]);
      }
      
      setShowPlayer(false); // Close any existing player
    }
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "ai-dj") {
      navigate("/ai-dj");
    } else if (tab === "mood-analyzer") {
      navigate("/mood-analyzer");
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
      "sessions": "Session Builder",
      "popular": "Popular Tracks",
      "recent": "Recent Activity"
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
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
      
      {currentTrack && <NowPlaying />}
    </div>
  );
};

export default Index;
