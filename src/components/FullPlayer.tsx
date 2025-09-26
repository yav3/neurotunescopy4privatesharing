import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward, Radio, Plus, Heart, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { Analytics } from '@/utils/analytics';

// Therapeutic artwork selection (same as TrackCard)
const getTherapeuticArtwork = (frequencyBand: string, trackId: string) => {
  const artworkMap = {
    alpha: [
      '/lovable-uploads/alpha-mountain-lake.png',
      '/lovable-uploads/acoustic-sunset-field.png'
    ],
    beta: [
      '/lovable-uploads/beta-waterfall.png', 
      '/lovable-uploads/focus-nature-piano.jpg'
    ],
    gamma: [
      '/lovable-uploads/gamma-sunbeam-forest.png',
      '/lovable-uploads/energy-nature-electric.jpg'
    ],
    delta: [
      '/lovable-uploads/delta-moonlit-lake.png',
      '/lovable-uploads/sleep-artwork.jpg'
    ],
    theta: [
      '/lovable-uploads/theta-misty-path.png',
      '/lovable-uploads/peaceful-piano-moonlit.jpg'
    ]
  };

  const gradientMap = {
    alpha: 'linear-gradient(135deg, hsl(217 91% 60% / 0.9), hsl(217 91% 25% / 0.8))',
    beta: 'linear-gradient(135deg, hsl(262 83% 58% / 0.9), hsl(262 83% 20% / 0.8))', 
    gamma: 'linear-gradient(135deg, hsl(31 100% 70% / 0.9), hsl(31 100% 25% / 0.8))',
    delta: 'linear-gradient(135deg, hsl(221 39% 11% / 0.9), hsl(221 39% 5% / 0.8))',
    theta: 'linear-gradient(135deg, hsl(276 100% 80% / 0.9), hsl(276 100% 25% / 0.8))'
  };

  const artworks = artworkMap[frequencyBand as keyof typeof artworkMap] || artworkMap.alpha;
  const gradient = gradientMap[frequencyBand as keyof typeof gradientMap] || gradientMap.alpha;
  
  // Use track ID for consistent artwork selection
  const artworkIndex = Math.abs(trackId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % artworks.length;
  
  return {
    url: artworks[artworkIndex],
    gradient
  };
};

export default function FullPlayer() {
  const navigate = useNavigate();
  const { play, pause, next, prev, isPlaying, currentTrack: track, spatialAudioEnabled, toggleSpatialAudio, lastGoal } = useAudioStore();

  // Get therapeutic goal display name
  const getTherapeuticGoalName = () => {
    if (!lastGoal) return 'Therapeutic Music';
    const goal = THERAPEUTIC_GOALS.find(g => g.id === lastGoal || g.slug === lastGoal || g.backendKey === lastGoal);
    return goal ? goal.name : 'Therapeutic Music';
  };

  // Get therapeutic artwork for current track
  const trackArtwork = useMemo(() => {
    if (!track) return null;
    
    // Determine frequency band from therapeutic applications or BPM
    let frequencyBand = 'alpha'; // default
    
    if (track.therapeutic_applications?.[0]?.frequency_band_primary) {
      frequencyBand = track.therapeutic_applications[0].frequency_band_primary;
    } else if (track.bpm) {
      // Fallback: determine from BPM
      if (track.bpm < 60) frequencyBand = 'delta';
      else if (track.bpm < 90) frequencyBand = 'theta';
      else if (track.bpm < 120) frequencyBand = 'alpha';
      else if (track.bpm < 150) frequencyBand = 'beta';
      else frequencyBand = 'gamma';
    }
    
    return getTherapeuticArtwork(frequencyBand, track.id);
  }, [track]);

  // Local state for enhanced features
  const [lightningMode, setLightningMode] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useUserFavorites();

  const handleSpatialAudio = () => {
    const willBeEnabled = !spatialAudioEnabled;
    toggleSpatialAudio();
    toast({
      title: willBeEnabled ? "Spatial Audio enabled for session" : "Spatial Audio disabled",
      description: willBeEnabled ? "Enhanced audio experience active" : "Spatial audio turned off",
    });
  };

  const handleLightningMode = () => {
    setLightningMode(!lightningMode);
    toast({
      title: lightningMode ? "Lightning mode disabled" : "Lightning mode enabled",
      description: "Therapeutic boost activated",
    });
  };

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
          // Track analytics
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
          // Track analytics
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
    toast({
      title: "Track disliked",
      description: "Skipping to next track",
    });
    await next();
  };

  if (!track) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-4 p-6">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-secondary/20 backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="text-center flex-1">
          <p className="text-sm text-muted-foreground">Now Playing</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8">
        {/* Album Artwork with Glass Morphism */}
        <div className="relative mb-8 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden backdrop-blur-lg bg-card/30 border border-white/10 shadow-glass-lg">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-card/50 to-secondary/30"
            style={{ background: trackArtwork?.gradient || 'linear-gradient(135deg, hsl(217 91% 60% / 0.9), hsl(217 91% 25% / 0.8))' }}
          />
          
          {/* Loading State */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          
          {trackArtwork?.url && (
            <img
              src={trackArtwork.url}
              alt="Album artwork"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                setIsImageLoading(false);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        <div className="text-center mb-12 max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-snug break-words line-clamp-2">{track.title}</h1>
          <p className="text-base md:text-xl text-muted-foreground mb-2">
            {spatialAudioEnabled && "🌐 "}{getTherapeuticGoalName()}
          </p>
          <p className="text-sm text-muted-foreground">Therapeutic Music</p>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <button 
            onClick={prev} 
            className="p-4 rounded-full hover:bg-secondary/20 backdrop-blur-sm border border-white/10 bg-card/20 transition-all duration-200 hover:shadow-glass"
          >
            <SkipBack className="w-8 h-8 text-foreground" />
          </button>
          
          <button
            onClick={() => isPlaying ? pause() : play()}
            className="p-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors backdrop-blur-sm shadow-glass-lg"
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
          </button>
          
          <button 
            onClick={next} 
            className="p-4 rounded-full hover:bg-secondary/20 backdrop-blur-sm border border-white/10 bg-card/20 transition-all duration-200 hover:shadow-glass"
          >
            <SkipForward className="w-8 h-8 text-foreground" />
          </button>
        </div>

        {/* Enhanced Controls - Glass Morphism */}
        <div className="flex items-center justify-center gap-4 px-8">
          {/* Favorite */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleFavorite}
            disabled={isFavoriteLoading}
            className={cn(
              "transition-all duration-200 p-3 rounded-full backdrop-blur-md bg-card/40 border border-white/20 shadow-lg",
              "hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60",
              track && isFavorite(track.id)
                ? "text-red-400 bg-red-500/30 border-red-400/50 shadow-red-500/20" 
                : "text-foreground hover:text-red-400 hover:bg-red-500/20 hover:border-red-400/30"
            )}
          >
            {isFavoriteLoading ? (
              <div className="w-6 h-6 border-2 border-current/60 border-t-current rounded-full animate-spin" />
            ) : (
              <Heart size={24} className={cn(track && isFavorite(track.id) && "fill-current")} />
            )}
          </Button>

          {/* Thumbs Down */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleThumbsDown}
            className="transition-all duration-200 p-3 rounded-full backdrop-blur-md bg-card/40 border border-white/20 shadow-lg text-foreground hover:text-orange-400 hover:bg-orange-500/20 hover:border-orange-400/30 hover:scale-105 hover:shadow-xl"
          >
            <ThumbsDown size={24} />
          </Button>

          {/* Lightning Mode */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleLightningMode}
            className={cn(
              "transition-all duration-200 p-3 rounded-full backdrop-blur-md bg-card/40 border border-white/20 shadow-lg",
              "hover:scale-105 hover:shadow-xl",
              lightningMode 
                ? "text-yellow-400 bg-yellow-500/30 border-yellow-400/50 shadow-yellow-500/20" 
                : "text-foreground hover:text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400/30"
            )}
          >
            <Plus size={24} strokeWidth={1} />
          </Button>

          {/* Spatial Audio */}
          <Button 
            variant="ghost" 
            size="lg"
            onClick={handleSpatialAudio}
            className={cn(
              "transition-all duration-200 p-3 rounded-full backdrop-blur-md bg-card/40 border border-white/20 shadow-lg",
              "hover:scale-105 hover:shadow-xl",
              spatialAudioEnabled 
                ? "text-blue-400 bg-blue-500/30 border-blue-400/50 shadow-blue-500/20" 
                : "text-foreground hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/30"
            )}
          >
            <Radio size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}