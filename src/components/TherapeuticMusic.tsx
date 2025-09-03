import { MusicCategoryCard } from "./MusicCategoryCard";
import focusArtwork from "@/assets/focus-artwork.jpg";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import sleepArtwork from "@/assets/sleep-artwork.jpg";
import acousticArtwork from "@/assets/acoustic-artwork.jpg";
import { useAudioStore } from "@/stores/audioStore";
import { toast } from "sonner";

interface TherapeuticMusicProps {
  onCategorySelect?: (category: string) => void;
}

// Map category IDs to TherapeuticGoal enum values
const CATEGORY_TO_GOAL: Record<string, string> = {
  "focus": "focus_up",
  "anxiety": "anxiety_down", 
  "stress": "anxiety_down",  // stress reduction maps to anxiety_down
  "sleep": "sleep",
  "mood": "mood_up"
};

export const TherapeuticMusic = ({ onCategorySelect }: TherapeuticMusicProps) => {
  const { playFromGoal, isLoading } = useAudioStore();
  
  const categories = [
    { id: "focus", title: "Focus Enhancement", image: focusArtwork },
    { id: "anxiety", title: "Anxiety Relief", image: acousticArtwork },
    { id: "stress", title: "Stress Reduction", image: moodBoostArtwork },
    { id: "sleep", title: "Sleep Preparation", image: sleepArtwork },
    { id: "mood", title: "Mood Boost", image: moodBoostArtwork },
  ];

  const handleCategoryClick = async (categoryId: string, categoryTitle: string) => {
    // 🔍 DEBUG: Log category selection
    console.group(`🎯 Therapeutic Category Selected: ${categoryId}`);
    console.log('Category ID:', categoryId);
    console.log('Category Title:', categoryTitle);
    console.log('Is Loading:', isLoading);
    
    const goal = CATEGORY_TO_GOAL[categoryId];
    console.log('Mapped Goal:', goal);
    console.groupEnd();
    
    if (!goal) {
      toast.error("Invalid category selected");
      return;
    }

    if (isLoading) {
      toast.error("Already loading music, please wait...");
      return;
    }

    toast.loading(`Preparing therapeutic ${categoryTitle.toLowerCase()} session…`, { id: "goal" });
    try {
      console.log('🎵 Starting therapeutic session from category:', categoryId, categoryTitle, 'goal:', goal);
      
      // Use unified audio store for playback
      await playFromGoal(goal);
      
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
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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