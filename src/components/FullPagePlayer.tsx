import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores";
import { formatTrackTitleForDisplay } from "@/utils/trackTitleFormatter";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';

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
    setPlayerMode 
  } = useAudioStore();

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

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
        <div className="aspect-square relative mb-8 rounded-3xl overflow-hidden shadow-2xl bg-card/20 backdrop-blur-sm border border-border/20">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-6xl text-primary/40">♪</div>
          </div>
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

        {/* Volume and like */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="flex-1 max-w-32"
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-red-500 transition-colors duration-200"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};