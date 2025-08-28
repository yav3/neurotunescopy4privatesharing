import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";

interface MusicPlayerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MusicPlayer = ({ open, onOpenChange }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([25]);
  const [isLiked, setIsLiked] = useState(false);

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
            <h2 className="text-2xl font-bold text-foreground mb-2">Dawn, Behold</h2>
            <p className="text-lg text-muted-foreground mb-1">DJ Chris & DJ Wallace</p>
            <p className="text-sm text-muted-foreground">sleep • Relaxation & Calm</p>
          </div>

          <div className="mb-6">
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0:38</span>
              <span>3:36</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <SkipBack className="w-6 h-6" />
            </Button>
            
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Volume2 className="w-5 h-5" />
            </Button>
            
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