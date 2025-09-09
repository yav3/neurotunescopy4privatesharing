import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ThumbsDown, Zap, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { formatTime, cn } from '@/lib/utils';
import { useAudioStore } from '@/stores';
import { toast } from '@/hooks/use-toast';
import { formatTrackTitleForDisplay } from '@/utils/trackTitleFormatter';

// Deterministic artwork selection to give each song a unique image
const getTherapeuticArtwork = (frequencyBand: string, trackId: string): { url: string; position: string; gradient: string } => {
  // Expanded album art collection for individual songs
  const albumArtwork = [
    '/lovable-uploads/19ca5ad8-bc5b-45c7-b13f-f3182585ae23.png', // Garden path with sunlight
    '/lovable-uploads/67cfdc0c-339d-48e8-776-13ce34bf1a4f.png', // White piano with musical notes
    '/lovable-uploads/d8b56c80-98c4-4a08-be13-deb891d9ecee.png', // Guitars in meadow with flowers
    '/lovable-uploads/9e1bc0cb-0051-4860-86be-69529a277181.png', // Field of pink/white flowers
    '/lovable-uploads/0f6c961c-91b2-4686-b3fe-3a6064af4bc7.png', // Field with butterflies and wildflowers
    '/lovable-uploads/dbaf206d-bc29-4f4c-aeed-34b611a6dc64.png', // Colorful flowers (orange, yellow, pink)
    '/lovable-uploads/e9f49ad3-57da-487a-9db7-f3dafba05e56.png', // Colorful electric guitar
    '/lovable-uploads/3c8ddd8c-7d5a-4d6a-a985-e6509d4fdcbf.png', // Starry/cosmic sky scene
    '/lovable-uploads/fb52f9d9-56f9-4dc4-81c4-f06dd182984b.png', // Forest scene with lights and guitar
    '/lovable-uploads/folk-instruments-meadow.png',
    '/lovable-uploads/classical-meadow-ensemble.png', 
    '/lovable-uploads/string-quartet-studio.png',
    '/lovable-uploads/european-classical-terrace.png',
    '/lovable-uploads/acoustic-sunset-field.png',
    '/lovable-uploads/delta-moonlit-lake.png',
    '/lovable-uploads/theta-misty-path.png',
    '/lovable-uploads/alpha-mountain-lake.png',
    '/lovable-uploads/beta-waterfall.png',
    '/lovable-uploads/gamma-sunbeam-forest.png'
  ];
  
  // Create deterministic seed from trackId to prevent race conditions
  const createSeed = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };
  
  // Each track gets a unique image based on its ID
  const seed = createSeed(trackId);
  const artworkIndex = seed % albumArtwork.length;
  
  // Gradient based on frequency band for therapeutic visual cues
  const gradientMap = {
    delta: 'from-blue-900/70 via-slate-800/50 to-blue-800/70', // Deep sleep & healing
    theta: 'from-amber-700/70 via-yellow-600/50 to-orange-700/70', // Meditation
    alpha: 'from-blue-800/70 via-cyan-600/50 to-teal-700/70', // Focus
    beta: 'from-green-700/70 via-emerald-600/50 to-teal-700/70', // Concentration
    gamma: 'from-yellow-600/70 via-orange-500/50 to-red-600/70' // Peak performance
  };
  
  return {
    url: albumArtwork[artworkIndex],
    position: 'object-cover',
    gradient: gradientMap[frequencyBand as keyof typeof gradientMap] || gradientMap.alpha
  };
};

// Helper function to determine frequency band from BPM
const getFrequencyBandFromBPM = (bpm?: number): string => {
  if (!bpm) return 'alpha'; // Default to alpha band
  
  if (bpm < 60) return 'delta';
  if (bpm < 90) return 'theta';  
  if (bpm < 120) return 'alpha';
  if (bpm < 150) return 'beta';
  return 'gamma';
};

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
    toggleSpatialAudio
  } = useAudioStore();

  // Local state for enhanced features
  const [isFavorited, setIsFavorited] = useState(false);
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

  if (!track) {
    const storeState = useAudioStore.getState();
    console.log('🎵 NowPlaying: currentTrack is null, hiding player. Store state:', {
      isPlaying, 
      isLoading: storeState.isLoading, 
      queueLength: storeState.queue.length,
      currentIndex: storeState.index,
      error: storeState.error
    });
    return null;
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // Get therapeutic artwork for current track
  const frequencyBand = getFrequencyBandFromBPM(track.bpm);
  const artwork = getTherapeuticArtwork(frequencyBand, track.id);

  return (
    <Card className="fixed bottom-16 left-0 right-0 z-50 rounded-none border-t bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-4">
        {/* Track Info */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate('/player')}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br flex items-center justify-center transition-all duration-300 relative",
              lightningMode 
                ? "from-yellow-400/80 to-orange-500/80 animate-pulse" 
                : "from-primary/60 to-secondary/60"
            )}>
              {lightningMode ? (
                <div className="text-xl">⚡</div>
              ) : (
                <>
                  <img 
                    src={artwork.url} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to brain emoji if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center text-xl">
                    🧠
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${artwork.gradient} mix-blend-soft-light`} />
                </>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="font-medium truncate">{formatTrackTitleForDisplay(track.title)}</h4>
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