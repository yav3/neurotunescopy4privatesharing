import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePlayer } from "@/stores/usePlayer";

interface MusicCategoryCardProps {
  title: string;
  image: string;
  className?: string;
  onClick?: () => void;
}

export const MusicCategoryCard = ({ title, image, className, onClick }: MusicCategoryCardProps) => {
  const loadGoal = usePlayer((s) => s.loadGoal);
  const playAt = usePlayer((s) => s.playAt);
  const setPlaying = usePlayer((s) => s.setPlaying);
  const isLoading = usePlayer((s) => s.isLoading);

  const handleClick = async () => {
    console.log('🎵 Category card clicked:', title);
    
    try {
      await loadGoal(title.toLowerCase());   // fetch from backend
      playAt(0);                             // start at first track
      setPlaying(true);                      // begin playback
      onClick?.();
    } catch (error) {
      console.error('❌ Category click failed:', error);
      onClick?.();
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-card bg-gradient-card border-border/50",
        isLoading && "opacity-50 cursor-wait",
        className
      )}
      onClick={handleClick}
    >
      <div className="aspect-square relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-foreground font-semibold text-lg">{title}</h3>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </Card>
  );
};