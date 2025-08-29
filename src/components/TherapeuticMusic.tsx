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
    { id: "focus", title: "Focus", image: focusArtwork },
    { id: "mood-boost", title: "Mood Boost", image: moodBoostArtwork },
    { id: "sleep", title: "Sleep", image: sleepArtwork },
    { id: "acoustic", title: "Acoustic", image: acousticArtwork },
  ];

  const handleCategoryClick = async (categoryId: string, categoryTitle: string) => {
    toast.loading(`Preparing ${categoryTitle.toLowerCase()}…`, { id: "goal" });
    try {
      const n = await playFromGoal(categoryId);
      toast.success(`Playing ${n} ${categoryTitle.toLowerCase()} tracks`, { id: "goal" });
      onCategorySelect?.(categoryTitle);
    } catch (e: any) {
      toast.error(e.message ?? "Could not load tracks", { id: "goal" });
    }
  };

  return (
    <section className="px-4 md:px-8 mb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Therapeutic Music</h2>
          <p className="text-muted-foreground">Choose Your Therapeutic Goal</p>
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