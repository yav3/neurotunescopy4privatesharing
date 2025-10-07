import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, X, Heart, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores";
import { TitleFormatter } from "@/utils/titleFormatter";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { ArtworkService } from '@/services/artworkService';

export const MinimizedPlayer = () => {
  const navigate = useNavigate();
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
  // Generate frequency band from track properties for artwork selection  
  const getFrequencyBand = (track: any): string => {
    const bands = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    const hash = track.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return bands[hash % bands.length];
  };

  // Use therapeutic artwork system (same as FullPagePlayer and TrackCard)
  const artwork = React.useMemo(() => {
    if (!track) return { url: '/src/assets/album-art-leaf-droplets.png', gradient: '' };
    
    const frequencyBand = getFrequencyBand(track);
    return ArtworkService.getTherapeuticArtwork(frequencyBand, track.id);
  }, [track?.id]);

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // Click handler to expand to full player
  const handleExpand = (e: React.MouseEvent | React.TouchEvent) => {
    // Only handle clicks on the container, not on buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    
    console.log('🎵 Expanding minimized player to full view');
    console.log('🎵 Current state:', { track: !!track, playerMode, isPlaying });
    setPlayerMode('full');
    console.log('🎵 Called setPlayerMode("full")');
  };

  // NOW SAFE TO HAVE CONDITIONAL RETURNS AFTER ALL HOOKS
  // Only show MinimizedPlayer when explicitly in mini mode
  if (playerMode !== 'mini') {
    return null;
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
            className="px-4 py-3 flex items-center gap-3 cursor-pointer select-none active:bg-accent/50 transition-colors"
            onClick={handleExpand}
            onTouchEnd={handleExpand}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setPlayerMode('full');
              }
            }}
          >
            {/* Album art */}
            <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
              <img
                src={artwork.url}
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
            className="w-12 h-12 sm:w-8 sm:h-8 bg-gray-900/30 hover:bg-gray-900/40 border border-gray-900/50 rounded-full backdrop-blur-sm shadow-glass-inset touch-manipulation active:scale-95 transition-transform dark:bg-white/30 dark:hover:bg-white/40 dark:border-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (isPlaying) {
                    pause();
                  } else {
                    play();
                  }
                }}
              >
                {!audio.paused ? (
                  <Pause className="w-6 h-6 sm:w-4 sm:h-4 text-gray-900 dark:text-white" />
                ) : (
                  <Play className="w-6 h-6 sm:w-4 sm:h-4 text-gray-900 dark:text-white" />
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
        className="px-4 py-3 flex items-center gap-3 cursor-pointer select-none active:bg-accent/50 transition-colors"
        onClick={handleExpand}
        onTouchEnd={handleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setPlayerMode('full');
          }
        }}
      >
        {/* Album art with Glass Effect */}
        <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-border/50 flex-shrink-0 shadow-glass-inset">
          <img
            src={artwork.url}
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
              <p className="text-xs text-foreground/60 truncate">
                {getTherapeuticGoalName()}
              </p>
            </div>
        
        {/* Controls with Glass Morphism */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm bg-card/30 border border-border/50 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 touch-manipulation active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate('/profile');
            }}
            title="View Profile"
          >
            <User className="w-5 h-5 sm:w-4 sm:h-4" />
          </Button>
          
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
            className="w-12 h-12 sm:w-8 sm:h-8 bg-gray-900/30 hover:bg-gray-900/40 border border-gray-900/50 rounded-full backdrop-blur-sm shadow-glass-inset touch-manipulation active:scale-95 transition-transform dark:bg-white/30 dark:hover:bg-white/40 dark:border-white/50"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              isPlaying ? pause() : play();
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 sm:w-4 sm:h-4 text-gray-900 dark:text-white" />
            ) : (
              <Play className="w-6 h-6 sm:w-4 sm:h-4 text-gray-900 dark:text-white" />
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