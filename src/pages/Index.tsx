import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TherapeuticRowsLayout } from "@/components/TherapeuticRowsLayout";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import SoundCloudFallback from "@/components/SoundCloudFallback";
import { useAudioStore } from "@/stores";
import "@/utils/startCompilation"; // Auto-start compilation

const Index = () => {
  const [activeNavTab, setActiveNavTab] = useState("home");
  const navigate = useNavigate();
  const { error, lastGoal } = useAudioStore();

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === "profile") {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TherapeuticRowsLayout />
      
      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      
      {/* SoundCloud fallback for mood boost */}
      {error === "soundcloud-fallback" && lastGoal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur z-50 flex items-center justify-center">
          <SoundCloudFallback goal={lastGoal} />
        </div>
      )}
    </div>
  );
};

export default Index;
