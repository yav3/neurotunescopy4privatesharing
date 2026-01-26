import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, SkipBack, SkipForward, Heart, Volume2, ThumbsDown, Plus, Radio, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores";
import { TitleFormatter } from '@/utils/titleFormatter';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { toast } from "@/hooks/use-toast";
import { blockTrack } from "@/services/blockedTracks";
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { Analytics } from '@/utils/analytics';
import { ArtworkMedia } from '@/components/ui/ArtworkMedia';
import { getAlbumArtForTrack } from '@/utils/albumArtPool';

export const FullPagePlayer = () => {
  const { 
    play, 
    pause, 
    next, 
    prev, 
    isPlaying, 
    currentTrack: track, 
    lastGoal, 
    currentTime, 
    duration, 
    volume, 
    setVolume, 
    seek,
    setPlayerMode,
    spatialAudioEnabled,
    toggleSpatialAudio
  } = useAudioStore();

  // Reduced debug logging - only on track changes  
  useEffect(() => {
    if (track?.id) {
      console.log('🎵 FullPagePlayer track changed:', {
        trackId: track.id,
        title: track.title,
        isPlaying
      });
    }
  }, [track?.id, isPlaying]);

  // Local state for enhanced features
  const [lightningMode, setLightningMode] = useState(false);
  const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useUserFavorites();

  // Artwork is now handled by ArtworkService - no hardcoded fallbacks needed

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // Format time helper
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Artwork state - prioritizes track.artwork_url from database
  const [artwork, setArtwork] = useState<{ url: string | null; gradient: string }>({ url: null, gradient: '' });

  // Load artwork when track changes - prioritize database artwork_url
  useEffect(() => {
    if (!track) {
      setArtwork({ url: null, gradient: '' });
      return;
    }

    // Use track.artwork_url (database) or track.artworkUrl (landing page) if available
    const artworkUrl = (track as any).artwork_url || (track as any).artworkUrl || null;
    
    // Generate a consistent gradient based on track ID
    const bands = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    const hash = track.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bandIndex = hash % bands.length;
    const gradients = [
      'from-blue-900/60 via-transparent to-transparent',
      'from-purple-900/60 via-transparent to-transparent',
      'from-green-900/60 via-transparent to-transparent',
      'from-amber-900/60 via-transparent to-transparent',
      'from-rose-900/60 via-transparent to-transparent'
    ];
    
    console.log(`🎨 FullPagePlayer: Using artwork_url from track:`, artworkUrl ? 'found' : 'not found');
    setArtwork({
      url: artworkUrl,
      gradient: gradients[bandIndex]
    });
  }, [track?.id]);

  // Enhanced control handlers
  const handleFavorite = async () => {
    if (!track) return;
    
    setIsFavoriteLoading(true);
    const isCurrentlyFavorited = isFavorite(track.id);
    
    try {
      if (isCurrentlyFavorited) {
        const result = await removeFavorite(track.id);
        if (result.success) {
          toast({
            title: "Removed from favorites",
            description: track.title,
          });
          Analytics.trackUserAction('track_unfavorited', {
            track_id: track.id,
            track_title: track.title,
            goal: track.goal || 'unknown'
          });
        } else {
          toast({
            title: "Error removing favorite",
            description: result.error,
            variant: "destructive"
          });
        }
      } else {
        const result = await addFavorite(track);
        if (result.success) {
          toast({
            title: "Added to favorites",
            description: track.title,
          });
          Analytics.trackUserAction('track_favorited', {
            track_id: track.id,
            track_title: track.title,
            goal: track.goal || 'unknown'
          });
        } else {
          toast({
            title: "Error adding favorite",
            description: result.error,
            variant: "destructive"
          });
        }
      }
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleThumbsDown = async () => {
    if (!track) return;
    
    try {
      await blockTrack(track.id, track.title);
      toast({
        title: "Track disliked",
        description: "Blocked and skipping to next track",
      });
      await next();
    } catch (error) {
      console.error('Failed to block track:', error);
      toast({
        title: "Error",
        description: "Failed to block track, but skipping anyway",
      });
      await next();
    }
  };

  const handleLightningMode = () => {
    setLightningMode(!lightningMode);
    toast({
      title: lightningMode ? "Lightning mode disabled" : "Lightning mode enabled",
      description: "Therapeutic boost " + (lightningMode ? "deactivated" : "activated"),
    });
  };

  const handleSpatialAudio = () => {
    const willBeEnabled = !spatialAudioEnabled;
    toggleSpatialAudio();
    toast({
      title: willBeEnabled ? "Spatial Audio enabled" : "Spatial Audio disabled",
      description: willBeEnabled ? "Enhanced audio experience active" : "Standard audio mode",
    });
  };

  if (!track) {
    console.log('🎵 FullPagePlayer: No track available, returning null');
    return null;
  }
  
  console.log('🎵 FullPagePlayer: Rendering with track:', track.title);

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col overflow-y-auto"
      onClick={(e) => {
        // Allow closing by clicking the background (but not the content area)
        if (e.target === e.currentTarget) {
          console.log('🔘 Background clicked - closing player');
          setPlayerMode('mini');
        }
      }}
    >
      {/* Glass Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/30 to-secondary/20 backdrop-blur-xl pointer-events-none" />
      
      {/* Close button - Enhanced for better touch interaction */}
      <div className="absolute top-2 right-2 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:text-foreground backdrop-blur-sm bg-background/90 border-2 border-foreground/30 rounded-full w-14 h-14 touch-manipulation active:scale-90 transition-all duration-200 hover:bg-background hover:border-foreground/50 shadow-xl"
          onClick={(e) => {
            console.log('🔘 Close button clicked!');
            e.preventDefault();
            e.stopPropagation();
            setPlayerMode('mini');
          }}
          onTouchStart={(e) => {
            console.log('🔘 Close button touch started!');
            e.preventDefault();
          }}
          style={{ 
            minHeight: '56px', 
            minWidth: '56px',
            pointerEvents: 'all',
            zIndex: 9999
          }}
          aria-label="Minimize player"
        >
          <ChevronDown className="w-7 h-7 pointer-events-none" strokeWidth={2.5} />
        </Button>
      </div>

      {/* Player content - properly sized container */}
      <div 
        className="relative z-10 w-full max-w-md mx-auto px-6 py-20 min-h-full flex flex-col justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Album artwork with Glass Morphism - supports images, GIFs, and videos */}
        <div className="aspect-square relative mb-6 rounded-2xl overflow-hidden backdrop-blur-lg bg-card/30 border border-white/10 shadow-glass-lg max-w-[240px] mx-auto">
          <ArtworkMedia 
            src={artwork.url}
            alt={TitleFormatter.formatTrackTitle(track.title) || `${getTherapeuticGoalName()} - Therapeutic Music`}
            fallbackSrc={getAlbumArtForTrack(track.id)}
          />
          {artwork.url && <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />}
        </div>

        {/* Track info - compact */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-normal text-foreground mb-1 leading-tight line-clamp-2">
            {TitleFormatter.formatTrackTitle(track.title)}
          </h1>
          <p className="text-base text-foreground/70">{getTherapeuticGoalName()}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Slider
            value={[progressPercentage]}
            max={100}
            step={0.1}
            className="mb-3"
            onValueChange={(value) => {
              if (duration > 0) {
                const newTime = (value[0] / 100) * duration;
                seek(newTime);
              }
            }}
          />
          <div className="flex justify-between text-sm text-foreground/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons with Glass Morphism */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground/70 hover:text-foreground w-10 h-10 backdrop-blur-sm bg-card/20 border border-border/50 rounded-full shadow-glass-inset" 
            onClick={prev}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button
            size="icon"
            className="w-16 h-16 rounded-full bg-gray-900 hover:bg-gray-800 shadow-glass-lg backdrop-blur-sm dark:bg-white dark:hover:bg-gray-100"
            onClick={() => isPlaying ? pause() : play()}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white dark:text-black" />
            ) : (
              <Play className="w-8 h-8 text-white dark:text-black ml-1" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground/70 hover:text-foreground w-10 h-10 backdrop-blur-sm bg-card/20 border border-border/50 rounded-full shadow-glass-inset" 
            onClick={next}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Enhanced Controls Section with Glass Morphism - compact */}
        <div className="space-y-3">
          {/* Volume control */}
          <div className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm bg-card/30 border border-border/50 shadow-glass-inset">
            <Volume2 className="w-4 h-4 text-foreground/70" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
          </div>

          {/* Action buttons with Glass Morphism */}
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl backdrop-blur-md bg-card/40 border border-border/50 shadow-lg">
            {/* Favorite */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              disabled={isFavoriteLoading}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200 backdrop-blur-sm border border-border/50 bg-card/30 shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60",
                track && isFavorite(track.id)
                  ? "text-red-400 bg-red-500/30 border-red-400/50 shadow-red-500/20" 
                  : "text-foreground hover:text-red-400 hover:bg-red-500/20 hover:border-red-400/30"
              )}
            >
              {isFavoriteLoading ? (
                <div className="w-5 h-5 border-2 border-current/60 border-t-current rounded-full animate-spin" />
              ) : (
                <Heart className={cn("w-5 h-5", track && isFavorite(track.id) && "fill-current")} />
              )}
            </Button>

            {/* Thumbs Down */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThumbsDown}
              className="w-10 h-10 rounded-full backdrop-blur-sm border border-border/50 bg-card/30 shadow-lg text-foreground hover:text-orange-400 hover:bg-orange-500/20 hover:border-orange-400/30 transition-all duration-200 hover:scale-105"
            >
              <ThumbsDown className="w-5 h-5" />
            </Button>

            {/* Lightning Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLightningMode}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200 backdrop-blur-sm border border-border/50 bg-card/30 shadow-lg hover:scale-105",
                lightningMode
                  ? "text-yellow-400 bg-yellow-500/30 border-yellow-400/50 shadow-yellow-500/20"
                  : "text-foreground hover:text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400/30"
              )}
            >
              <Plus className="w-5 h-5" strokeWidth={1} />
            </Button>

            {/* Spatial Audio */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSpatialAudio}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200 backdrop-blur-sm border border-border/50 bg-card/30 shadow-lg hover:scale-105",
                spatialAudioEnabled
                  ? "text-blue-400 bg-blue-500/30 border-blue-400/50 shadow-blue-500/20"
                  : "text-foreground hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/30"
              )}
            >
              <Radio className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};