import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward, Radio, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function FullPlayer() {
  const navigate = useNavigate();
  const { play, pause, next, prev, isPlaying, currentTrack: track } = useAudioStore();

  // Local state for enhanced features
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(false);
  const [lightningMode, setLightningMode] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: track?.title,
    });
  };

  if (!track) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No track playing</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-primary hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="flex items-center gap-4 p-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <p className="text-sm text-muted-foreground">Now Playing</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8">
        <div className="text-center mb-12 max-w-md">
          <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
          <p className="text-xl text-muted-foreground mb-2">
            {spatialAudioEnabled && "🌐 "}{track.genre || 'Therapeutic Music'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <button onClick={prev} className="p-4 rounded-full hover:bg-secondary transition-colors">
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => isPlaying ? pause() : play()}
            className="p-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </button>
          
          <button onClick={next} className="p-4 rounded-full hover:bg-secondary transition-colors">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        {/* Enhanced Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Favorite */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleFavorite}
            className={cn(
              "transition-colors duration-200 p-4 rounded-full",
              isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground"
            )}
          >
            <Heart size={20} className={cn(isFavorited && "fill-current")} />
          </Button>

          {/* Lightning Mode */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleLightningMode}
            className={cn(
              "transition-colors duration-200 p-4 rounded-full",
              lightningMode ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground"
            )}
          >
            <Zap size={20} className={cn(lightningMode && "fill-current")} />
          </Button>

          {/* Spatial Audio */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleSpatialAudio}
            className={cn(
              "transition-colors duration-200 p-4 rounded-full",
              spatialAudioEnabled ? "text-blue-500 hover:text-blue-600" : "text-muted-foreground"
            )}
          >
            <Radio size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}