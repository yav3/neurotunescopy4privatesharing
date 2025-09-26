import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, SkipBack, SkipForward, Heart, Volume2, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores";
import { formatTime } from "@/lib/utils";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { SmartTitle } from "@/components/ui/SmartTitle";
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { blockTrack } from '@/services/blockedTracks';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { Analytics } from '@/utils/analytics';
import { toast } from 'sonner';

interface MusicPlayerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MusicPlayer = ({ open, onOpenChange }: MusicPlayerProps) => {
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { play, pause, next, prev, isPlaying, currentTrack: track, lastGoal } = useAudioStore();
  const { isAdmin } = useAuthContext();
  const { addFavorite, removeFavorite, isFavorite } = useUserFavorites();

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  const handleFavorite = async () => {
    if (!track) return;

    setIsFavoriteLoading(true);
    const isCurrentlyFavorited = isFavorite(track.id);

    try {
      if (isCurrentlyFavorited) {
        const result = await removeFavorite(track.id);
        if (result.success) {
          toast.success(`Removed "${track.title}" from favorites`);
          Analytics.trackUserAction('track_unfavorited', {
            track_id: track.id,
            track_title: track.title,
            goal: track.goal || 'unknown'
          });
        } else {
          toast.error(result.error || 'Failed to remove favorite');
        }
      } else {
        const result = await addFavorite(track);
        if (result.success) {
          toast.success(`Added "${track.title}" to favorites`);
          Analytics.trackUserAction('track_favorited', {
            track_id: track.id,
            track_title: track.title,
            goal: track.goal || 'unknown'
          });
        } else {
          toast.error(result.error || 'Failed to add favorite');
        }
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleBlockTrack = async () => {
    if (!track) return;
    
    const success = await blockTrack(track.id, track.title);
    if (success) {
      // Track analytics for block
      Analytics.trackUserAction('track_blocked', {
        track_id: track.id,
        track_title: track.title,
        goal: track.goal || 'unknown'
      });
      
      next();
    }
  };

  if (!track) {
    return null;
  }

  const progressPercentage = 0; // Simplified for now

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
              src={track.album_art_url || (track as any).artwork_url || moodBoostArtwork} 
              alt={track.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="text-center mb-6">
            <SmartTitle 
              title={track.title}
              context="player"
              maxLength={60}
              showMetadata={true}
              className="text-2xl font-bold text-foreground mb-2"
            />
            <p className="text-lg text-muted-foreground mb-1">{getTherapeuticGoalName()}</p>
            {isAdmin() && (
              <p className="text-sm text-muted-foreground">
                {track.bpm && `${Math.round(track.bpm)} BPM • `}
                Relaxation & Focus
              </p>
            )}
          </div>

          <div className="mb-6">
            <Slider
              value={[0]}
              max={100}
              step={0.1}
              className="mb-2 [&_.slider-track]:bg-foreground/20 [&_.slider-range]:bg-foreground [&_.slider-thumb]:bg-foreground [&_.slider-thumb]:border-background"
              disabled
            />
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
              className="w-16 h-16 rounded-full bg-foreground hover:bg-foreground/90 text-background"
              onClick={() => isPlaying ? pause() : play()}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={next}>
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={[80]}
                max={100}
                step={1}
                className="flex-1 max-w-24 [&_.slider-track]:bg-foreground/20 [&_.slider-range]:bg-foreground [&_.slider-thumb]:bg-foreground [&_.slider-thumb]:border-background"
                disabled
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                  track && isFavorite(track.id) ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
                )}
                onClick={handleFavorite}
                disabled={isFavoriteLoading}
              >
                {isFavoriteLoading ? (
                  <div className="w-5 h-5 border-2 border-current/60 border-t-current rounded-full animate-spin" />
                ) : (
                  <Heart className={cn("w-5 h-5", track && isFavorite(track.id) && "fill-current")} />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive transition-colors"
                onClick={handleBlockTrack}
                title="Block this track - never play it again"
              >
                <Ban className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};