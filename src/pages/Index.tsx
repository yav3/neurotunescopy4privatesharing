import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [activeNavTab, setActiveNavTab] = useState("home");
  const [showPlayer, setShowPlayer] = useState(false);
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    setShowPlayer(true);
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
      <TherapeuticMusic onCategorySelect={handleCategorySelect} />
      
      <Navigation activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
    </div>
  );
};

export default Index;
