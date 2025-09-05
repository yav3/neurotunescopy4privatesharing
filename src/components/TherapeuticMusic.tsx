import { TherapeuticGoalCard } from "./ui/TherapeuticGoalCard";
import { TrendingCard } from "./TrendingCard";
import { useTherapeuticGoals } from "@/hooks/useTherapeuticGoals";
import { useAudioStore } from "@/stores";
import { toast } from "sonner";

interface TherapeuticMusicProps {
  onCategorySelect?: (category: string) => void;
}

export const TherapeuticMusic = ({ onCategorySelect }: TherapeuticMusicProps) => {
  const { playFromGoal, isLoading } = useAudioStore();
  const { goals, mapper } = useTherapeuticGoals();

  const handleCategoryClick = async (goalId: string) => {
    const goal = mapper.getById(goalId);
    if (!goal) {
      toast.error("Invalid category selected");
      return;
    }

    // 🔍 DEBUG: Log category selection
    console.group(`🎯 Therapeutic Category Selected: ${goalId}`);
    console.log('Goal ID:', goalId);
    console.log('Goal Name:', goal.name);
    console.log('Backend Key:', goal.backendKey);
    console.log('Is Loading:', isLoading);
    console.groupEnd();

    if (isLoading) {
      toast.error("Already loading music, please wait...");
      return;
    }

    toast.loading(`Preparing therapeutic ${goal.name.toLowerCase()} session…`, { id: "goal" });
    try {
      console.log('🎵 Starting therapeutic session:', goal.name, 'backend key:', goal.backendKey);
      
      // Use unified audio store for playback with backend key
      await playFromGoal(goal.backendKey);
      
      toast.success(`Playing therapeutically ordered ${goal.name.toLowerCase()} tracks`, { id: "goal" });
      onCategorySelect?.(goal.name);
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
        </div>
        
        {/* Trending Card */}
        <div className="mb-6">
          <TrendingCard className="max-w-md" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {goals.map((goal) => (
            <TherapeuticGoalCard
              key={goal.id}
              goal={goal}
              showBpmRange={false}
              onClick={() => handleCategoryClick(goal.id)}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
};