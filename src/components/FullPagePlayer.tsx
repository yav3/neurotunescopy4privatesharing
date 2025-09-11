import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, SkipBack, SkipForward, Heart, Volume2, ThumbsDown, Zap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores";
import { formatTrackTitleForDisplay } from "@/utils/trackTitleFormatter";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { toast } from "@/hooks/use-toast";

// Import artwork for different therapeutic goals
import moodBoostArtwork from "@/assets/mood-boost-artwork.jpg";
import focusArtwork from "@/assets/focus-enhancement-artwork.jpg";
import stressAnxietyArtwork from "@/assets/stress-anxiety-artwork.jpg";
import sleepArtwork from "@/assets/sleep-artwork.jpg";
import painSupportArtwork from "@/assets/pain-support-artwork.jpg";
import crossoverClassicalArt from '@/assets/crossover-classical-artwork.jpg';
import acousticArtwork from "@/assets/acoustic-artwork.jpg";
import energyBoostArtwork from "@/assets/energy-boost-artwork.jpg";

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

  // Local state for enhanced features
  const [isFavorited, setIsFavorited] = useState(false);
  const [lightningMode, setLightningMode] = useState(false);

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // Get artwork based on therapeutic goal
  const getTherapeuticArtwork = () => {
    if (!lastGoal) return focusArtwork; // Default fallback
    
    const goalMappings = {
      'mood-boost': moodBoostArtwork,
      'focus-enhancement': focusArtwork, 
      'stress-anxiety-support': stressAnxietyArtwork,
      'sleep-support': sleepArtwork,
      'pain-relief': painSupportArtwork,
      'energy-boost': energyBoostArtwork,
      'classical': crossoverClassicalArt,
      'acoustic': acousticArtwork
    };
    
    // Try direct goal match first
    if (goalMappings[lastGoal as keyof typeof goalMappings]) {
      return goalMappings[lastGoal as keyof typeof goalMappings];
    }
    
    // Try finding goal by therapeutic goals config
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    if (goal && goalMappings[goal.id as keyof typeof goalMappings]) {
      return goalMappings[goal.id as keyof typeof goalMappings];
    }
    
    return focusArtwork; // Default fallback
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Enhanced control handlers
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
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-30"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 50%))`
        }}
      />
      
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 text-foreground/70 hover:text-foreground z-10"
        onClick={() => setPlayerMode('mini')}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Player content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Album artwork */}
        <div className="aspect-square relative mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={track.album_art_url || (track as any).artwork_url || getTherapeuticArtwork()}
            alt={track.title || `${getTherapeuticGoalName()} - Therapeutic Music`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Track info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
            {formatTrackTitleForDisplay(track.title)}
          </h1>
          <p className="text-lg text-muted-foreground mb-1">{getTherapeuticGoalName()}</p>
          <p className="text-sm text-muted-foreground">Therapeutic Music</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
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
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground/70 hover:text-foreground w-12 h-12" 
            onClick={prev}
          >
            <SkipBack className="w-6 h-6" />
          </Button>
          
          <Button
            size="icon"
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            onClick={() => isPlaying ? pause() : play()}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Play className="w-10 h-10 text-primary-foreground ml-1" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground/70 hover:text-foreground w-12 h-12" 
            onClick={next}
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        {/* Enhanced Controls Section */}
        <div className="space-y-6">
          {/* Volume control */}
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4">
            {/* Favorite */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={cn(
                "w-12 h-12 rounded-full transition-colors duration-200",
                isFavorited 
                  ? "text-red-500 hover:text-red-600 bg-red-500/10" 
                  : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-6 h-6", isFavorited && "fill-current")} />
            </Button>

            {/* Thumbs Down */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThumbsDown}
              className="w-12 h-12 rounded-full text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              <ThumbsDown className="w-6 h-6" />
            </Button>

            {/* Lightning Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLightningMode}
              className={cn(
                "w-12 h-12 rounded-full transition-colors duration-200",
                lightningMode
                  ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/10"
                  : "text-muted-foreground hover:text-yellow-500"
              )}
            >
              <Zap className={cn("w-6 h-6", lightningMode && "fill-current")} />
            </Button>

            {/* Spatial Audio */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSpatialAudio}
              className={cn(
                "w-12 h-12 rounded-full transition-colors duration-200",
                spatialAudioEnabled
                  ? "text-blue-500 hover:text-blue-600 bg-blue-500/10"
                  : "text-muted-foreground hover:text-blue-500"
              )}
            >
              <Radio className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};