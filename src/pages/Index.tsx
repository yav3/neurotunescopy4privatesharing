import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "@/utils/startCompilation"; // Auto-start compilation

const Index = () => {
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();
  const { currentTrack, setQueue, error, lastGoal, playTrack } = useAudioStore();
  
  // Auto-play Cantata della Sposa on load
  React.useEffect(() => {
    const cantataTrack = {
      id: "f6be5239-5d79-4fd3-952f-85a047798f92",
      title: "Cantata della Sposa, Cantata, Classical, FOCUS, COFFEE, MORNING BREAK",
      bpm: 82,
      valence: 0.74,
      arousal: 0.57,
      dominance: 0.71,
      storage_bucket: "audio",
      storage_key: "tracks/cantata_della_sposa_cantata_classical_focus_coffee_morning_break_3_10430.mp3",
      audio_status: "working" as const
    };
    
    playTrack(cantataTrack);
    setShowPlayer(true);
  }, [playTrack]);

  const handleCategorySelect = async (category: string) => {
    console.log('🎵 Category selected:', category);
    
    try {
      // Get tracks for the selected category using new API with seeding and exclusions
      const goalSlug = toGoalSlug(category.toLowerCase());
      const { tracks, error } = await fetchPlaylist(goalSlug, 50, newSeed(), excludeQS());
      
      if (error) {
        console.warn('Playlist fallback/error:', error);
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
    // Session handling removed - only goals tab remains
    setShowPlayer(false);
  };

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "profile") {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
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

export default Index;
