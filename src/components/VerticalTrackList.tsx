import React, { useState } from 'react';
import { Play, Pause, Heart, ThumbsDown, Plus, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAudioStore } from '@/stores';
import { TitleFormatter } from '@/utils/titleFormatter';
import { useUserFavorites } from '@/hooks/useUserFavorites';

interface Track {
  id: string;
  title: string;
  storage_bucket?: string;
  storage_key?: string;
  artwork_url?: string;
}

interface VerticalTrackListProps {
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
  onTogglePlay: () => void;
  isLoading: boolean;
}

export const VerticalTrackList: React.FC<VerticalTrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlay,
  isLoading
}) => {
  const { next, spatialAudioEnabled, toggleSpatialAudio } = useAudioStore();
  const { addFavorite, removeFavorite, isFavorite } = useUserFavorites();
  const [blockedTracks, setBlockedTracks] = useState<Set<string>>(new Set());
  const [lightningMode, setLightningMode] = useState(false);
  const [favoriteLoadingStates, setFavoriteLoadingStates] = useState<Set<string>>(new Set());

  const handleFavorite = async (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    // Set loading state
    setFavoriteLoadingStates(prev => new Set(prev).add(trackId));
    
    const isCurrentlyFavorited = isFavorite(trackId);
    
    try {
      if (isCurrentlyFavorited) {
        await removeFavorite(trackId);
        toast({
          title: "Removed from favorites",
          description: "Track removed from your favorites",
        });
      } else {
        await addFavorite(track);
        toast({
          title: "Added to favorites",
          description: "Track added to your favorites",
        });
      }
    } finally {
      // Remove loading state
      setFavoriteLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
    }
  };

  const handleThumbsDown = async (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBlocked = new Set(blockedTracks);
    newBlocked.add(trackId);
    setBlockedTracks(newBlocked);
    
    toast({
      title: "Track disliked",
      description: "Skipping and blocking this track",
    });
    
    // Skip to next track if this is the current track
    const isCurrentTrack = currentTrack?.id === trackId;
    if (isCurrentTrack) {
      await next();
    }
  };

  const handleLightningMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightningMode(!lightningMode);
    toast({
      title: lightningMode ? "Lightning mode disabled" : "Lightning mode enabled",
      description: lightningMode ? "Playlist mode deactivated" : "Saving therapeutic playlist",
    });
  };

  const handleSpatialAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeEnabled = !spatialAudioEnabled;
    toggleSpatialAudio();
    toast({
      title: willBeEnabled ? "Spatial Audio enabled" : "Spatial Audio disabled",
      description: willBeEnabled ? "Enhanced audio experience active" : "Standard audio mode",
    });
  };

  // Filter out blocked tracks
  const filteredTracks = tracks.filter(track => !blockedTracks.has(track.id));

  return (
    <div className="w-full">
      {/* Enhanced Controls Header with Glass Morphism */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl backdrop-blur-lg bg-card/30 border border-white/10 shadow-glass-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Your Mix</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Lightning Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLightningMode}
            className={cn(
              "transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm border border-white/10 rounded-full",
              lightningMode
                ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/20 border-yellow-500/30 shadow-glass-inset"
                : "text-foreground/80 hover:text-yellow-500 bg-card/20 hover:bg-yellow-500/10"
            )}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" strokeWidth={1} />
            <span className="hidden sm:inline">Lightning</span>
            <span className="sm:hidden">+</span>
            {lightningMode && <span className="ml-1 text-xs">save mix</span>}
          </Button>

          {/* Spatial Audio */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSpatialAudio}
            className={cn(
              "transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm border border-white/10 rounded-full",
              spatialAudioEnabled
                ? "text-primary hover:text-primary bg-primary/20 border-primary/30 shadow-glass-inset"
                : "text-foreground/80 hover:text-primary bg-card/20 hover:bg-primary/10"
            )}
          >
            <Radio className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Spatial</span>
            <span className="sm:hidden">📡</span>
          </Button>
        </div>
      </div>

      {/* Playlist with Glass Morphism */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {filteredTracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isFavorited = isFavorite(track.id);
          const isFavoriteLoading = favoriteLoadingStates.has(track.id);
          
          return (
            <div
              key={track.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm border border-white/10 hover:shadow-glass transition-all duration-200 group cursor-pointer shadow-glass-inset",
                isCurrentTrack 
                  ? "bg-primary/20 border-primary/30 shadow-glass" 
                  : "bg-card/20 hover:bg-card/40"
              )}
              onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
            >
              {/* Track Number / Play Button */}
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full bg-card/50 border border-white/10">
                {isLoading && isCurrentTrack ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : isCurrentTrack && isPlaying ? (
                  <Pause className="w-4 h-4 text-primary" />
                ) : (
                  <div className="relative">
                    <span className="text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <Play className="w-4 h-4 text-primary absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>

              {/* Album Art with Glass Effect */}
              <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-white/10 flex-shrink-0">
                {track.artwork_url ? (
                  <img 
                    src={track.artwork_url} 
                    alt={TitleFormatter.formatTrackTitle(track.title)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">♪</div>
                )}
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm leading-tight truncate max-w-[200px]">
                  {TitleFormatter.formatTrackTitle(track.title).split(' ').slice(0, 4).join(' ')}
                  {TitleFormatter.formatTrackTitle(track.title).split(' ').length > 4 ? '...' : ''}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  Therapeutic Music
                </p>
              </div>

               {/* Action Buttons with Glass Morphism */}
               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                 {/* Favorite */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleFavorite(track.id, e)}
                    disabled={isFavoriteLoading}
                    className={cn(
                      "w-10 h-10 sm:w-8 sm:h-8 transition-all duration-200 backdrop-blur-sm border border-white/10 bg-card/30 rounded-full touch-manipulation active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                      isFavorited 
                        ? "text-red-500 hover:text-red-600 bg-red-500/20 border-red-500/30" 
                        : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    )}
                  >
                    {isFavoriteLoading ? (
                      <div className="w-4 h-4 border-2 border-current/60 border-t-current rounded-full animate-spin" />
                    ) : (
                      <Heart className={cn("w-5 h-5 sm:w-4 sm:h-4", isFavorited && "fill-current")} />
                    )}
                  </Button>

                 {/* Thumbs Down */}
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={(e) => handleThumbsDown(track.id, e)}
                   className="w-10 h-10 sm:w-8 sm:h-8 backdrop-blur-sm border border-white/10 bg-card/30 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 touch-manipulation active:scale-95"
                 >
                   <ThumbsDown className="w-5 h-5 sm:w-4 sm:h-4" />
                 </Button>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};