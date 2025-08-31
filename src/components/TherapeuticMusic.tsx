import { MusicCategoryCard } from "./MusicCategoryCard";
import focusArtwork from "@/assets/focus-artwork.jpg";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import sleepArtwork from "@/assets/sleep-artwork.jpg";
import acousticArtwork from "@/assets/acoustic-artwork.jpg";
import { useTherapeuticFlow } from "@/controllers/useTherapeuticFlow";
import { toast } from "sonner";
import type { TherapeuticGoal } from "@/types/music";

interface TherapeuticMusicProps {
  onCategorySelect?: (category: string) => void;
}

// Map category IDs to therapeutic goals
const CATEGORY_TO_GOAL: Record<string, TherapeuticGoal> = {
  "focus": "focus_up",
  "relax": "anxiety_down", 
  "sleep": "sleep",
  "energy": "mood_up"
};

export const TherapeuticMusic = ({ onCategorySelect }: TherapeuticMusicProps) => {
  const flow = useTherapeuticFlow();
  
  const categories = [
    { id: "focus", title: "Focus Enhancement", image: focusArtwork },
    { id: "relax", title: "Stress Reduction", image: moodBoostArtwork },
    { id: "sleep", title: "Sleep Preparation", image: sleepArtwork },
    { id: "energy", title: "Mood Boost", image: acousticArtwork },
  ];

  const handleCategoryClick = async (categoryId: string, categoryTitle: string) => {
    const goal = CATEGORY_TO_GOAL[categoryId];
    if (!goal) {
      toast.error("Invalid category selected");
      return;
    }

    toast.loading(`Preparing therapeutic ${categoryTitle.toLowerCase()} session…`, { id: "goal" });
    try {
      console.log('🎵 Starting therapeutic session from category:', categoryId, categoryTitle, 'goal:', goal);
      
      // Select goal and start the therapeutic flow
      flow.selectGoal(goal);
      await flow.start();
      
      toast.success(`Playing therapeutically ordered ${categoryTitle.toLowerCase()} tracks`, { id: "goal" });
      onCategorySelect?.(categoryTitle);
    } catch (e: any) {
      console.error('❌ Category selection failed:', e);
      toast.error(e.message ?? "Could not load therapeutic tracks", { id: "goal" });
    }
  };

  return (
    <section className="px-4 md:px-8 mb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Therapeutic Music</h2>
          <p className="text-muted-foreground">Scientifically ordered tracks using VAD and Camelot wheel harmonic progression</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <MusicCategoryCard
              key={category.id}
              title={category.title}
              image={category.image}
              onClick={() => handleCategoryClick(category.id, category.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};