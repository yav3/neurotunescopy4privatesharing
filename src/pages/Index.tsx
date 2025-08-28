import { useState } from "react";
import { Header } from "@/components/Header";
import { TrendingTabs } from "@/components/TrendingTabs";
import { TherapeuticMusic } from "@/components/TherapeuticMusic";
import { Navigation } from "@/components/Navigation";
import { MusicPlayer } from "@/components/MusicPlayer";
import HuggingFaceClassifier from "@/components/HuggingFaceClassifier";

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
      
      {/* AI Mood Analyzer Section */}
      <section className="px-4 md:px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">AI Mood Analyzer</h2>
          <HuggingFaceClassifier />
        </div>
      </section>
      
      <Navigation activeTab={activeNavTab} onTabChange={setActiveNavTab} />
      <MusicPlayer open={showPlayer} onOpenChange={setShowPlayer} />
    </div>
  );
};

export default Index;
