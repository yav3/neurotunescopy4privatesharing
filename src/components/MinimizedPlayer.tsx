import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, X, Heart, Plus } from "lucide-react";
import { useAudioStore } from "@/stores";
import { formatTrackTitleForDisplay } from "@/utils/trackTitleFormatter";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { ArtworkService } from '@/services/artworkService';

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
    duration,
    lastGoal
  } = useAudioStore();

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // Artwork state managed by centralized service (prevents race conditions)
  const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null);

  // Load artwork using centralized service to prevent race conditions
  useEffect(() => {
    if (!track) return;

    let cancelled = false;
    
    const loadArtwork = async () => {
      try {
        const artwork = await ArtworkService.getTrackArtwork(track);
        if (!cancelled) {
          setAlbumArtUrl(artwork);
        }
      } catch (error) {
        console.error('Error loading artwork:', error);
      }
    };

    loadArtwork();
    return () => { cancelled = true; };
  }, [track?.id]);

  if (!track) {
    // Show empty player with message when no track is loaded
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] backdrop-blur-lg bg-card/30 border-t border-border shadow-glass-lg">
        {/* Empty progress bar */}
        <div className="w-full h-1 bg-muted/30">
          <div className="h-full bg-primary/30 transition-all duration-300 shadow-sm" style={{ width: '0%' }} />
        </div>
        
        {/* Player content */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Default album art */}
          <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">🎵</span>
            </div>
          </div>
          
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm leading-tight">
              Select music to begin
            </h3>
            <p className="text-xs text-muted-foreground">
              Therapeutic music player ready
            </p>
          </div>
          
          {/* Disabled controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="w-12 h-12 sm:w-8 sm:h-8 bg-muted/20 border border-border/30 rounded-full opacity-50"
            >
              <Play className="w-6 h-6 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Centralized artwork prevents race conditions  
  const artworkSrc = (track as any)?.album_art_url || (track as any)?.artwork_url || '/lovable-uploads/focus-enhancement-artwork.jpg';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] backdrop-blur-lg bg-card/30 border-t border-border shadow-glass-lg">
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted/30">
        <div 
          className="h-full bg-primary/70 transition-all duration-300 shadow-sm"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Player content */}
      <div 
        className="px-4 py-3 flex items-center gap-3 cursor-pointer"
        onClick={() => setPlayerMode('full')}
      >
        {/* Album art with Glass Effect */}
        <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
          <img
            src={artworkSrc}
            alt={formatTrackTitleForDisplay(track.title)}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-tight truncate">
            {formatTrackTitleForDisplay(track.title)}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {getTherapeuticGoalName()}
          </p>
        </div>
        
        {/* Controls with Glass Morphism */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // TODO: Add favorite functionality
            }}
          >
            <Heart className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              // TODO: Add lightning playlist functionality
            }}
          >
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" strokeWidth={1} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 sm:w-8 sm:h-8 bg-primary/30 hover:bg-primary/40 border border-primary/50 rounded-full backdrop-blur-sm shadow-glass-inset touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              isPlaying ? pause() : play();
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-4 sm:h-4 text-primary" />
            ) : (
              <Play className="w-6 h-6 sm:w-4 sm:h-4 text-primary" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-foreground/80 hover:text-foreground hover:bg-card/40 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              next();
            }}
          >
            <SkipForward className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              stop();
            }}
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};