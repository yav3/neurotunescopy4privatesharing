import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAudio } from "@/context/AudioContext";
import { SupabaseService } from "@/services/supabase";

interface MusicCategoryCardProps {
  title: string;
  image: string;
  className?: string;
  onClick?: () => void;
}

export const MusicCategoryCard = ({ title, image, className, onClick }: MusicCategoryCardProps) => {
  const { setPlaylist, loadTrack } = useAudio();

  const handleClick = async () => {
    console.log('🎵 Category card clicked:', title);
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-card bg-gradient-card border-border/50",
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
      </div>
    </Card>
  );
};