import React, { useState } from 'react';
import { Play, Pause, Heart, ThumbsDown, Zap, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAudioStore } from '@/stores';

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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [blockedTracks, setBlockedTracks] = useState<Set<string>>(new Set());
  const [lightningMode, setLightningMode] = useState(false);

  const handleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
      toast({
        title: "Removed from favorites",
        description: "Track removed from your favorites",
      });
    } else {
      newFavorites.add(trackId);
      toast({
        title: "Added to favorites",
        description: "Track added to your favorites",
      });
    }
    setFavorites(newFavorites);
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
      {/* Enhanced Controls Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-card/50 rounded-lg border border-border/40">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">Music Collection</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Lightning Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLightningMode}
            className={cn(
              "transition-colors duration-200",
              lightningMode
                ? "text-yellow-500 hover:text-yellow-600 bg-yellow-500/10"
                : "text-muted-foreground hover:text-yellow-500"
            )}
          >
            <Zap className={cn("w-4 h-4 mr-2", lightningMode && "fill-current")} />
            Lightning
          </Button>

          {/* Spatial Audio */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSpatialAudio}
            className={cn(
              "transition-colors duration-200",
              spatialAudioEnabled
                ? "text-blue-500 hover:text-blue-600 bg-blue-500/10"
                : "text-muted-foreground hover:text-blue-500"
            )}
          >
            <Radio className="w-4 h-4 mr-2" />
            Spatial
          </Button>
        </div>
      </div>

      {/* Album Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[70vh] overflow-y-auto pr-2">
        {filteredTracks.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isFavorited = favorites.has(track.id);
          
          return (
            <div
              key={track.id}
              className={cn(
                "bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border/60 hover:bg-card/90 transition-all duration-300 shadow-sm hover:shadow-lg group cursor-pointer hover:-translate-y-1",
                isCurrentTrack && "ring-2 ring-primary/50 bg-card"
              )}
              onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
            >
              {/* Album Art */}
              <div className="relative aspect-square mb-3">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {track.artwork_url ? (
                    <img 
                      src={track.artwork_url} 
                      alt={track.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/40 rounded-md"></div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      {isLoading && isCurrentTrack ? (
                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (isPlaying && isCurrentTrack) ? (
                        <Pause className="w-6 h-6 text-primary" />
                      ) : (
                        <Play className="w-6 h-6 text-primary ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Favorite */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleFavorite(track.id, e)}
                    className={cn(
                      "w-8 h-8 bg-black/50 hover:bg-black/70 transition-colors duration-200",
                      isFavorited 
                        ? "text-red-500 hover:text-red-600" 
                        : "text-white hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                  </Button>

                  {/* Thumbs Down */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleThumbsDown(track.id, e)}
                    className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white hover:text-destructive transition-colors duration-200"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Track Info */}
              <div className="text-center">
                <h3 className="text-foreground font-medium text-sm leading-tight line-clamp-2 mb-1">
                  {track.title}
                </h3>
                <p className="text-muted-foreground/70 text-xs">
                  Therapeutic Music
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};