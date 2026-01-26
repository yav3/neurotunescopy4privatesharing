import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, ThumbsDown, Pin, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAudioStore } from '@/stores';
import { TitleFormatter } from '@/utils/titleFormatter';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { usePinnedFavorites } from '@/hooks/usePinnedFavorites';
import { blockTrack } from '@/services/blockedTracks';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { ArtworkMedia } from '@/components/ui/ArtworkMedia';
import { getAlbumArtForTrack } from '@/utils/albumArtPool';

// Helper to get artwork for a track - prioritizes track.artwork_url from database
const getTrackArtwork = (track: { id: string; artwork_url?: string }): string | null => {
  // Use database artwork_url if available
  if (track.artwork_url) {
    return track.artwork_url;
  }
  // No database artwork - return null (fallback will be used)
  return null;
};

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
  const { next, spatialAudioEnabled, toggleSpatialAudio, lastGoal } = useAudioStore();
  const { addFavorite, removeFavorite, isFavorite } = useUserFavorites();
  const { togglePinGoal, isGoalPinned } = usePinnedFavorites();
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
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    try {
      await blockTrack(trackId, track.title);
      toast({
        title: "Track disliked",
        description: "Blocked and skipping to next track",
      });
      
      // Skip to next track if this is the current track
      const isCurrentTrack = currentTrack?.id === trackId;
      if (isCurrentTrack) {
        await next();
      }
    } catch (error) {
      console.error('Failed to block track:', error);
      toast({
        title: "Error",
        description: "Failed to block track, but skipping anyway",
      });
      
      // Still skip even if blocking failed
      const isCurrentTrack = currentTrack?.id === trackId;
      if (isCurrentTrack) {
        await next();
      }
    }
  };

  const handlePinPlaylist = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleSpatialAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeEnabled = !spatialAudioEnabled;
    toggleSpatialAudio();
    toast({
      title: willBeEnabled ? "Spatial Audio enabled" : "Spatial Audio disabled",
      description: willBeEnabled ? "Enhanced audio experience active" : "Standard audio mode",
    });
  };

  // No need to filter - blocked tracks won't appear in future sessions

  return (
    <div className="w-full">
      {/* Enhanced Controls Header with Glass Morphism */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-2xl backdrop-blur-lg bg-card/30 border border-white/10 shadow-glass-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Your Mix</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Pin Playlist */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePinPlaylist}
            disabled={!lastGoal}
            className={cn(
              "transition-all duration-200 text-xs sm:text-sm backdrop-blur-sm border border-white/10 rounded-full disabled:opacity-30",
              lastGoal && isGoalPinned(lastGoal)
                ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/20 border-yellow-500/30 shadow-glass-inset"
                : "text-foreground/80 hover:text-yellow-500 bg-card/20 hover:bg-yellow-500/10"
            )}
          >
            <Pin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Pin</span>
            <span className="sm:hidden">📌</span>
            {lastGoal && isGoalPinned(lastGoal) && <span className="ml-1 text-xs">pinned</span>}
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
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isFavorited = React.useMemo(() => isFavorite(track.id), [isFavorite, track.id]);
          const isFavoriteLoading = favoriteLoadingStates.has(track.id);
          
          return (
            <div key={track.id}>
              <div
                className={cn(
                  "flex items-center gap-3 p-3 backdrop-blur-sm border border-white/10 hover:shadow-glass transition-all duration-200 group cursor-pointer shadow-glass-inset",
                  isCurrentTrack 
                    ? "bg-primary/20 border-primary/30 shadow-glass" 
                    : "bg-card/20 hover:bg-card/40"
                )}
                onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
              >
                {/* Track Number / Play Button - Fixed Size */}
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full bg-card/50 border border-white/10">
                  {isLoading && isCurrentTrack ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : isCurrentTrack && isPlaying ? (
                    <Pause className="w-5 h-5 text-primary" />
                  ) : (
                    <div className="relative">
                      <span className="text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <Play className="w-5 h-5 text-primary absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                {/* Album Art with Glass Effect */}
                <div className="w-12 h-12 rounded-lg overflow-hidden backdrop-blur-sm bg-card/30 border border-white/10 flex-shrink-0">
                  <ArtworkMedia 
                    src={getTrackArtwork(track)} 
                    alt={TitleFormatter.formatTrackTitle(track.title)}
                    loading="lazy"
                    fallbackSrc={getAlbumArtForTrack(track.id)}
                  />
                </div>
                
                {/* Track Info with Vertical Scrolling Title */}
                <div className="flex-1 min-w-0">
                  <div className="h-5 overflow-hidden">
                    <h3 className="font-medium text-foreground text-sm leading-tight animate-scroll whitespace-nowrap">
                      {TitleFormatter.formatTrackTitle(track.title)}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Therapeutic Music
                  </p>
                </div>

                 {/* Action Buttons with Glass Morphism - Fixed Size */}
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                   {/* Favorite */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleFavorite(track.id, e)}
                      disabled={isFavoriteLoading}
                      className={cn(
                        "w-10 h-10 transition-all duration-200 backdrop-blur-sm border border-white/10 bg-card/30 rounded-full touch-manipulation active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                        isFavorited 
                          ? "text-red-500 hover:text-red-600 bg-red-500/20 border-red-500/30" 
                          : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      )}
                    >
                      {isFavoriteLoading ? (
                        <div className="w-4 h-4 border-2 border-current/60 border-t-current rounded-full animate-spin" />
                      ) : (
                        <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                      )}
                    </Button>

                   {/* Thumbs Down */}
                   <Button
                     variant="ghost"
                     size="icon"
                     onClick={(e) => handleThumbsDown(track.id, e)}
                     className="w-10 h-10 backdrop-blur-sm border border-white/10 bg-card/30 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 touch-manipulation active:scale-95"
                   >
                     <ThumbsDown className="w-4 h-4" />
                   </Button>
                 </div>
              </div>
              
              {/* Separator Line */}
              {index < tracks.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};