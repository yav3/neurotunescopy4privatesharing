import { useState } from "react";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);

  const handleCategorySelect = (category: string) => {
    setShowPlayer(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TrendingTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <TherapeuticMusic onCategorySelect={handleCategorySelect} />
      <Navigation activeTab={activeNavTab} onTabChange={setActiveNavTab} />
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
    </div>
  );
};

export default Index;
