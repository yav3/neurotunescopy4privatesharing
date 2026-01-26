import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ThumbsDown, Pin, Radio, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { formatTime, cn } from '@/lib/utils';
import { useAudioStore } from '@/stores';
import { toast } from '@/hooks/use-toast';
import { blockTrack } from '@/services/blockedTracks';
import { TitleFormatter } from '@/utils/titleFormatter';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { usePinnedFavorites } from '@/hooks/usePinnedFavorites';
import { ArtworkMedia } from '@/components/ui/ArtworkMedia';
import { getAlbumArtForTrack } from '@/utils/albumArtPool';

export const NowPlaying: React.FC = () => {
  const navigate = useNavigate();
  const { 
    next, 
    prev, 
    isPlaying, 
    currentTrack: track, 
    currentTime, 
    duration, 
    volume, 
    play, 
    pause, 
    seek, 
    setVolume: handleVolumeChange,
    spatialAudioEnabled,
    toggleSpatialAudio,
    queue,
    playerMode,
    setPlayerMode,
    lastGoal
  } = useAudioStore();

  // Local state for enhanced features
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useUserFavorites();
  const { togglePinGoal, isGoalPinned } = usePinnedFavorites();

  // Artwork state - prioritizes track.artwork_url from database
  const [artworkSrc, setArtworkSrc] = useState<string | null>(null);
  const [artworkGradient, setArtworkGradient] = useState<string>('');

  // Load artwork when track changes - use database artwork_url directly
  useEffect(() => {
    if (!track) {
      setArtworkSrc(null);
      setArtworkGradient('');
      return;
    }

    // Use track.album_art_url (standard Track type) or artwork_url/artworkUrl variants
    const dbArtworkUrl = track.album_art_url || (track as any).artwork_url || (track as any).artworkUrl || null;
    
    // Generate a consistent gradient based on track ID
    const bands = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
    const hash = track.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const bandIndex = hash % bands.length;
    const gradients = [
      'from-blue-900/60 via-transparent to-transparent',
      'from-purple-900/60 via-transparent to-transparent',
      'from-green-900/60 via-transparent to-transparent',
      'from-amber-900/60 via-transparent to-transparent',
      'from-rose-900/60 via-transparent to-transparent'
    ];
    
    console.log(`🎨 NowPlaying: Using artwork_url from track:`, dbArtworkUrl ? 'found' : 'not found');
    setArtworkSrc(dbArtworkUrl);
    setArtworkGradient(gradients[bandIndex]);
  }, [track?.id]);

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'THERAPEUTIC MUSIC';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name.toUpperCase() : 'THERAPEUTIC MUSIC';
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleFavorite = async () => {
    if (!track) return;
    
    setIsFavoriteLoading(true);
    const isCurrentlyFavorited = isFavorite(track.id);
    
    try {
      if (isCurrentlyFavorited) {
        await removeFavorite(track.id);
        toast({
          title: "Removed from favorites",
          description: track.title,
        });
      } else {
        await addFavorite(track);
        toast({
          title: "Added to favorites",
          description: track.title,
        });
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

  const handleSpatialAudio = () => {
    const willBeEnabled = !spatialAudioEnabled;
    toggleSpatialAudio();
    toast({
      title: willBeEnabled ? "Spatial Audio enabled for session" : "Spatial Audio disabled", 
      description: willBeEnabled ? "Enhanced audio experience active" : "Spatial audio turned off",
    });
  };

  const handlePinPlaylist = async () => {
    if (!lastGoal) return;
    
    const isPinned = isGoalPinned(lastGoal);
    await togglePinGoal(lastGoal);
    
    const goalName = THERAPEUTIC_GOALS.find(g => 
      g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal
    )?.name || 'Playlist';
    
    toast({
      title: isPinned ? "Unpinned playlist" : "Pinned playlist",
      description: isPinned ? `Removed ${goalName} from favorites` : `Added ${goalName} to favorites`,
    });
  };

  // Enhanced logging with navigation context
  useEffect(() => {
    const logPlayerState = () => {
      console.log('🎵 NowPlaying: Navigation detected, current state:', {
        hasTrack: !!track,
        trackTitle: track?.title,
        isPlaying,
        queueLength: queue?.length || 0,
        currentPath: window.location.pathname
      });
    };
    
    logPlayerState();
  }, [track, isPlaying, queue]);

  if (!track) {
    const storeState = useAudioStore.getState();
    console.log('🎵 NowPlaying: currentTrack is null, hiding player. Store state:', {
      isPlaying, 
      isLoading: storeState.isLoading, 
      queueLength: storeState.queue.length,
      currentIndex: storeState.index,
      error: storeState.error,
      currentPath: window.location.pathname
    });
    return null;
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // artworkSrc and artworkGradient are set by the useEffect above with proper async handling
  const artworkUrl = artworkSrc;

  // Show full player when playerMode is 'full'
  if (playerMode === 'full') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Now Playing</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPlayerMode('mini')}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Full player content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            {/* Album artwork - responsive sizing */}
            <div className="aspect-square relative mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-[280px] sm:max-w-[320px] md:max-w-[400px]">
              <ArtworkMedia 
                src={artworkUrl} 
                alt={track.title}
                fallbackSrc={getAlbumArtForTrack(track.id)}
              />
              {artworkUrl && <div className={`absolute inset-0 bg-gradient-to-t ${artworkGradient} pointer-events-none`} />}
            </div>

            {/* Track info */}
            <div className="text-center mb-6 sm:mb-8 px-4">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">{TitleFormatter.formatTrackTitle(track.title)}</h3>
              <p className="text-base sm:text-lg text-muted-foreground">{getTherapeuticGoalName()}</p>
            </div>

            {/* Progress */}
            <div className="mb-6 sm:mb-8 px-4">
              <Slider
                value={[currentTime]}
                max={duration || 0}
                step={0.1}
                onValueChange={([value]) => seek(value)}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Button variant="ghost" size="icon" onClick={prev} className="h-10 w-10 sm:h-12 sm:w-12">
                <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              
              <Button
                size="icon"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                onClick={toggle}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={next} className="h-10 w-10 sm:h-12 sm:w-12">
                <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>

            {/* Enhanced controls - always visible and well-spaced */}
            <div className="space-y-4 px-4">
              {/* Debug info */}
              <div className="text-center text-xs text-muted-foreground bg-red-100 p-2 rounded">
                DEBUG: Controls should be visible - spatialAudio: {spatialAudioEnabled ? 'ON' : 'OFF'}, pinned: {lastGoal && isGoalPinned(lastGoal) ? 'ON' : 'OFF'}
              </div>
              
              {/* Main control buttons row */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleFavorite}
                  disabled={isFavoriteLoading}
                  className={cn(
                    "transition-all duration-200 h-12 w-12 rounded-full border-2 border-red-500 hover:bg-accent/50 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60",
                    track && isFavorite(track.id) ? "text-red-500 hover:text-red-400 bg-red-50/10 border-red-500/30" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isFavoriteLoading ? (
                    <div className="w-5 h-5 border-2 border-current/60 border-t-current rounded-full animate-spin" />
                  ) : (
                    <Heart size={22} className={cn(track && isFavorite(track.id) && "fill-current")} />
                  )}
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleThumbsDown}
                  className="transition-all duration-200 h-12 w-12 rounded-full border-2 border-blue-500 text-muted-foreground hover:text-destructive hover:bg-accent/50 hover:scale-105 hover:border-destructive/30"
                >
                  <ThumbsDown size={22} />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handlePinPlaylist}
                  disabled={!lastGoal}
                  className={cn(
                    "transition-all duration-200 h-12 w-12 rounded-full border-2 border-yellow-500 hover:bg-accent/50 hover:scale-105 disabled:opacity-30",
                    lastGoal && isGoalPinned(lastGoal) ? "text-yellow-500 hover:text-yellow-400 bg-yellow-50/10 border-yellow-500/30" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Pin size={22} />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSpatialAudio}
                  className={cn(
                    "transition-all duration-200 h-12 w-12 rounded-full border-2 border-green-500 hover:bg-accent/50 hover:scale-105",
                    spatialAudioEnabled ? "text-blue-500 hover:text-blue-400 bg-blue-50/10 border-blue-500/30" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Radio size={22} />
                </Button>
              </div>

              {/* Volume control */}
              <div className="flex items-center justify-center gap-3">
                <Volume2 size={18} className="text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => handleVolumeChange(value / 100)}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-16 left-0 right-0 z-50 rounded-none border-t bg-background/98 backdrop-blur-md">
      <div className="flex items-center gap-2 p-4">
        {/* Track Info */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setPlayerMode('full')}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br flex items-center justify-center transition-all duration-300 relative",
              lastGoal && isGoalPinned(lastGoal)
                ? "from-yellow-400/80 to-orange-500/80 animate-pulse" 
                : "from-primary/60 to-secondary/60"
            )}>
              {lastGoal && isGoalPinned(lastGoal) ? (
                <Pin className="w-6 h-6" />
              ) : (
                <>
                   <ArtworkMedia 
                     src={artworkUrl} 
                     alt={track.title}
                     fallbackSrc={getAlbumArtForTrack(track.id)}
                   />
                  {artworkUrl && <div className={`absolute inset-0 bg-gradient-to-br ${artworkGradient} mix-blend-soft-light pointer-events-none`} />}
                </>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-medium truncate">{TitleFormatter.formatTrackTitle(track.title)}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {spatialAudioEnabled && "🌐 "} {getTherapeuticGoalName()}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex items-center gap-1">
          {/* Favorite */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFavorite}
            disabled={isFavoriteLoading}
            className={cn(
              "transition-colors duration-200 h-9 w-9 hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-60",
              track && isFavorite(track.id) ? "text-red-500 hover:text-red-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isFavoriteLoading ? (
              <div className="w-4 h-4 border-2 border-current/60 border-t-current rounded-full animate-spin" />
            ) : (
              <Heart size={18} className={cn(track && isFavorite(track.id) && "fill-current")} />
            )}
          </Button>

          {/* Thumbs Down */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleThumbsDown}
            className="text-muted-foreground hover:text-destructive h-9 w-9 hover:bg-accent/50"
          >
            <ThumbsDown size={18} />
          </Button>

          {/* Pin Playlist */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePinPlaylist}
            disabled={!lastGoal}
            className={cn(
              "transition-colors duration-200 h-9 w-9 hover:bg-accent/50 disabled:opacity-30",
              lastGoal && isGoalPinned(lastGoal) ? "text-yellow-500 hover:text-yellow-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Pin size={18} />
          </Button>

          {/* Spatial Audio */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSpatialAudio}
            className={cn(
              "transition-colors duration-200 h-9 w-9 hover:bg-accent/50",
              spatialAudioEnabled ? "text-blue-500 hover:text-blue-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Radio size={18} />
          </Button>

          {/* Skip Back */}
          <Button variant="ghost" size="sm" onClick={prev}>
            <SkipBack size={16} />
          </Button>
          
          {/* Play/Pause */}
          <Button 
            variant="default" 
            size="sm" 
            onClick={toggle}
            className="w-10 h-10 rounded-full hover-scale"
          >
            {isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} className="ml-0.5" />
            )}
          </Button>
          
          {/* Skip Forward */}
          <Button variant="ghost" size="sm" onClick={next}>
            <SkipForward size={16} />
          </Button>
        </div>

        {/* Progress Bar - Desktop */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 0}
            step={0.1}
            onValueChange={([value]) => seek(value)}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume */}
        <div className="hidden lg:flex items-center gap-2 w-24">
          <Volume2 size={14} className="text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => handleVolumeChange(value / 100)}
            className="w-16"
          />
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};