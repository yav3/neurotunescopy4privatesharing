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

// Enhanced artwork selection with better distribution for each track
const getTherapeuticArtwork = (frequencyBand: string, trackId: string): { url: string; position: string; gradient: string } => {
  // Expanded album art collection with beautiful nature imagery
  const albumArtwork = [
    '/lovable-uploads/d37bdb73-8ea1-4150-a35d-e08dbd929ff2.png', // Pink cosmos flowers in field
    '/lovable-uploads/4d20a0a1-857e-4d94-b1cb-6a9d68ae6910.png', // Field with butterflies and yellow flowers
    '/lovable-uploads/2526e614-65b3-4f38-8875-49396cbf8334.png', // Colorful daisies (yellow, orange, pink)
    '/lovable-uploads/d1dc4c39-c585-469c-b524-10ff6f1e6818.png', // Tropical beach with palm trees
    '/lovable-uploads/c17d43a8-c471-41ec-95d5-1131804b5181.png', // Mountain landscape with river
    '/lovable-uploads/71121ed8-7b8f-4d60-97d4-282e33ca08b2.png', // Yellow flowers under starry sky
    '/lovable-uploads/19a2f398-e797-4f64-b18b-ac2e3b736d30.png', // Vintage piano in flowering field
    '/lovable-uploads/5734dabc-389d-4cdc-9163-5494ea1da3ae.png', // Garden path through flower meadow
    '/lovable-uploads/19ca5ad8-bc5b-45c7-b13f-f3182585ae23.png', // Garden path with sunlight
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
    '/lovable-uploads/gamma-sunbeam-forest.png',
    '/lovable-uploads/262b2035-e633-446a-a217-97d2ec10d8a1.png',
    '/lovable-uploads/4e6f957d-a660-4a2e-9019-364f45cebb99.png',
    '/lovable-uploads/6fa80e74-6c84-4add-bc17-db4cb527a0a2.png',
    '/lovable-uploads/703143dc-8c8a-499e-bd2c-8e526bbe62d5.png',
    '/lovable-uploads/81d914ac-e118-4490-b539-e4dfa81be820.png',
    '/lovable-uploads/bd9f321d-961d-4c98-b4ba-32de014d6a9b.png',
    '/lovable-uploads/f252233e-2545-4bdc-ae4f-7aee7b58db7f.png'
  ];
  
  // Enhanced seed generation for better distribution
  const createEnhancedSeed = (str: string): number => {
    let hash = 5381;
    let hash2 = 5381;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) + hash) + char; // hash * 33 + char
      hash2 = ((hash2 << 5) + hash2) + char * 17; // Different multiplier for variation
    }
    
    // Combine both hashes for better distribution
    return Math.abs(hash ^ hash2);
  };
  
  // Use enhanced seeding with track ID and frequency band for more variety
  const combinedSeed = trackId + frequencyBand;
  const seed = createEnhancedSeed(combinedSeed);
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
    toggleSpatialAudio,
    queue
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
                     onLoad={() => {
                       console.log('🖼️ Album artwork loaded successfully:', artwork.url);
                     }}
                     onError={(e) => {
                       console.warn('❌ Failed to load album artwork:', artwork.url);
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