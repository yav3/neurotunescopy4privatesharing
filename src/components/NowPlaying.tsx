import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ThumbsDown, Zap, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { formatTime, cn } from '@/lib/utils';
import { useAudioStore } from '@/stores';
import { toast } from '@/hooks/use-toast';

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
    setVolume: handleVolumeChange 
  } = useAudioStore();

  // Local state for enhanced features
  const [isFavorited, setIsFavorited] = useState(false);
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(false);
  const [lightningMode, setLightningMode] = useState(false);

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: track?.title,
    });
  };

  const handleThumbsDown = async () => {
    toast({
      title: "Track disliked",
      description: "Skipping to next track",
    });
    await next();
  };

  const handleSpatialAudio = () => {
    setSpatialAudioEnabled(!spatialAudioEnabled);
    toast({
      title: spatialAudioEnabled ? "Spatial Audio disabled" : "Spatial Audio enabled",
      description: "Enhanced audio experience",
    });
  };

  const handleLightningMode = () => {
    setLightningMode(!lightningMode);
    toast({
      title: lightningMode ? "Lightning mode disabled" : "Lightning mode enabled",
      description: "Therapeutic boost activated",
    });
  };

  if (!track) {
    return null;
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-40 rounded-none border-t bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-4">
        {/* Track Info */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate('/player')}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-xl transition-all duration-300",
              lightningMode 
                ? "from-yellow-400/80 to-orange-500/80 animate-pulse" 
                : "from-primary/60 to-secondary/60"
            )}>
              {lightningMode ? "⚡" : "🧠"}
            </div>
            <div className="min-w-0">
              <h4 className="font-medium truncate">{track.title}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {spatialAudioEnabled && "🌐 "} THERAPEUTIC MUSIC
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex items-center gap-1">
          {/* Favorite */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFavorite}
            className={cn(
              "transition-colors duration-200",
              isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
            )}
          >
            <Heart size={14} className={cn(isFavorited && "fill-current")} />
          </Button>

          {/* Thumbs Down */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleThumbsDown}
            className="text-muted-foreground hover:text-destructive"
          >
            <ThumbsDown size={14} />
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

          {/* Lightning Mode */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLightningMode}
            className={cn(
              "transition-colors duration-200",
              lightningMode ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground"
            )}
          >
            <Zap size={14} className={cn(lightningMode && "fill-current")} />
          </Button>

          {/* Spatial Audio */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSpatialAudio}
            className={cn(
              "transition-colors duration-200",
              spatialAudioEnabled ? "text-blue-500 hover:text-blue-600" : "text-muted-foreground"
            )}
          >
            <Radio size={14} />
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