import { MusicCategoryCard } from "./MusicCategoryCard";
import focusArtwork from "@/assets/focus-artwork.jpg";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import sleepArtwork from "@/assets/sleep-artwork.jpg";
import acousticArtwork from "@/assets/acoustic-artwork.jpg";
import { playFromGoal } from "@/actions/playFromGoal";
import { toast } from "sonner";

interface TherapeuticMusicProps {
  onCategorySelect?: (category: string) => void;
}

export const TherapeuticMusic = ({ onCategorySelect }: TherapeuticMusicProps) => {
  const categories = [
    { id: "focus", title: "Focus Enhancement", image: focusArtwork },
    { id: "relax", title: "Stress Reduction", image: moodBoostArtwork },
    { id: "sleep", title: "Sleep Preparation", image: sleepArtwork },
    { id: "energy", title: "Mood Boost", image: acousticArtwork },
  ];

  const handleCategoryClick = async (categoryId: string, categoryTitle: string) => {
    toast.loading(`Preparing therapeutic ${categoryTitle.toLowerCase()} session…`, { id: "goal" });
    try {
      console.log('🎵 Starting therapeutic session from category:', categoryId, categoryTitle);
      const n = await playFromGoal(categoryId);
      toast.success(`Playing ${n} therapeutically ordered ${categoryTitle.toLowerCase()} tracks`, { id: "goal" });
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