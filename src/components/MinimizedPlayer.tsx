import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, X, Heart, Plus } from "lucide-react";
import { useAudioStore } from "@/stores";
import { TitleFormatter } from "@/utils/titleFormatter";
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
    playerMode,
    currentTime,
    duration,
    lastGoal
  } = useAudioStore();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Centralized artwork using ArtworkService to prevent race conditions
  const [artworkSrc, setArtworkSrc] = useState<string>('/src/assets/album-art-leaf-droplets.png');

  useEffect(() => {
    if (track) {
      ArtworkService.getTrackArtwork(track).then(setArtworkSrc);
    }
  }, [track?.id]);

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // NOW SAFE TO HAVE CONDITIONAL RETURNS AFTER ALL HOOKS
  // Show MinimizedPlayer unless explicitly in full mode with a track
  if (playerMode === 'full' && track) {
    return null; // Only hide when full player is active with a track
  }

  // Debug player state (only when visible)
  console.log('🎵 MinimizedPlayer render state:', {
    hasTrack: !!track,
    trackTitle: track?.title,
    isPlaying,
    playerMode,
    currentTime,
    duration
  });

  // Always show MinimizedPlayer when there's a track OR audio is playing
  // This prevents the player from disappearing due to race conditions
  if (!track) {
    // Debug: Check if audio is actually playing despite no track in store
    const audio = document.querySelector('audio[data-therapeutic="true"]') as HTMLAudioElement;
    const isAudioActuallyPlaying = audio && !audio.paused && !audio.ended && audio.readyState > 2;
    
    if (isAudioActuallyPlaying) {
      console.error('🚨 PLAYER BUG: Audio is playing but currentTrack is null!', {
        audioSrc: audio.src,
        audioPaused: audio.paused,
        audioCurrentTime: audio.currentTime,
        audioDuration: audio.duration,
        storeCurrentTrack: useAudioStore.getState().currentTrack,
        storeIsPlaying: useAudioStore.getState().isPlaying
      });
      
      // Show player with current audio info instead of hiding
      const progressPercentage = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
      const audioTitle = audio.src ? decodeURIComponent(audio.src.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Unknown Track') : 'Playing...';
      
      return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] backdrop-blur-lg bg-card/30 border-t border-border shadow-glass-lg">
          {/* Progress bar showing actual audio progress */}
          <div className="w-full h-1 bg-muted/30">
            <div 
              className="h-full bg-primary/70 transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          {/* Player content with actual audio info */}
          <div 
            className="px-4 py-3 flex items-center gap-3 cursor-pointer"
            onClick={() => {
              console.log('🎵 MinimizedPlayer clicked - switching to full mode');
              setPlayerMode('full');
            }}
          >
            {/* Album art */}
            <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
              <img
                src={artworkSrc}
                alt="Playing"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            
            {/* Track info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground text-sm leading-tight truncate">
                {TitleFormatter.formatTrackTitle(audioTitle)}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {getTherapeuticGoalName()}
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 sm:w-8 sm:h-8 bg-primary/30 hover:bg-primary/40 border border-primary/50 rounded-full backdrop-blur-sm shadow-glass-inset touch-manipulation active:scale-95 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (audio.paused) {
                    audio.play();
                  } else {
                    audio.pause();
                  }
                }}
              >
                {!audio.paused ? (
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
            </div>
          </div>
        </div>
      );
    } else {
      // Only hide when truly no audio is playing
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
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

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
        onClick={() => {
          console.log('🎵 MinimizedPlayer clicked - switching to full mode');
          setPlayerMode('full');
        }}
        onTouchStart={() => {
          // Ensure touch devices can trigger the full player
          console.log('🎵 MinimizedPlayer touched');
        }}
      >
        {/* Album art with Glass Effect */}
        <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
          <img
            src={artworkSrc}
            alt={TitleFormatter.formatTrackTitle(track.title)}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-tight truncate">
            {TitleFormatter.formatTrackTitle(track.title)}
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