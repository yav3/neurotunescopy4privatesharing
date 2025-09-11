import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, X } from "lucide-react";
import { useAudioStore } from "@/stores";
import { formatTrackTitleForDisplay } from "@/utils/trackTitleFormatter";

export const MinimizedPlayer = () => {
  const { 
    play, 
    pause, 
    next, 
    stop,
    isPlaying, 
    currentTrack: track, 
    setPlayerMode,
    currentTime,
    duration
  } = useAudioStore();

  if (!track) {
    return null;
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-2xl">
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Player content */}
      <div 
        className="px-4 py-3 flex items-center gap-3 cursor-pointer"
        onClick={() => setPlayerMode('full')}
      >
        {/* Album art */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
          {(track as any).album_art_url || (track as any).artwork_url ? (
            <img
              src={(track as any).album_art_url || (track as any).artwork_url}
              alt={formatTrackTitleForDisplay(track.title)}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/60">♪</div>
          )}
        </div>
        
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-tight truncate">
            {formatTrackTitleForDisplay(track.title)}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            Therapeutic Music
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? pause() : play();
            }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};