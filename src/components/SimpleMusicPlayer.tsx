import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlay } from "@/hooks/usePlay";
import { usePlayer, currentTrack } from "@/stores/usePlayer";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";

interface SimpleMusicPlayerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SimpleMusicPlayer = ({ open, onOpenChange }: SimpleMusicPlayerProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { safePlay, pause, isPlaying } = usePlay();
  const { next, prev } = usePlayer();
  const track = currentTrack();

  if (!track) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-gradient-hero border-border/50 p-0">
        <div className="relative p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-sm">Now Playing</p>
          </div>

          <div className="aspect-square relative mb-8 rounded-2xl overflow-hidden shadow-player">
            <img 
              src={moodBoostArtwork} 
              alt="Now Playing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">{track.title}</h2>
            <p className="text-lg text-muted-foreground mb-1">{track.genre || 'Therapeutic Music'}</p>
            <p className="text-sm text-muted-foreground">
              {track.bpm && `${Math.round(track.bpm)} BPM • `}
              Relaxation & Focus
            </p>
          </div>

          <div className="mb-6">
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <div className="bg-primary h-2 rounded-full w-0" />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0:00</span>
              <span>0:00</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={prev}>
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => isPlaying ? pause() : safePlay(track.id)}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={next}>
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors duration-200",
                isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
              )}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};