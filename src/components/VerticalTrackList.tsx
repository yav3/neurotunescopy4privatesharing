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
          <h2 className="text-lg font-semibold text-foreground">Playlist Controls</h2>
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

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {filteredTracks.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isFavorited = favorites.has(track.id);
          
          return (
            <div
              key={track.id}
              className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/60 hover:bg-card/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                {/* Album Art */}
                <div 
                  className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                  onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
                >
                  {track.artwork_url ? (
                    <img 
                      src={track.artwork_url} 
                      alt={track.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/40 rounded-md"></div>
                  )}
                </div>
                
                {/* Track Info */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
                >
                  <h3 className="text-foreground font-semibold text-base leading-tight truncate">
                    {track.title}
                  </h3>
                  <p className="text-muted-foreground/80 text-sm mt-1">
                    Therapeutic Music
                  </p>
                </div>
                
                {/* Enhanced Controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Favorite */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleFavorite(track.id, e)}
                    className={cn(
                      "w-8 h-8 transition-colors duration-200",
                      isFavorited 
                        ? "text-red-500 hover:text-red-600" 
                        : "text-muted-foreground hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                  </Button>

                  {/* Thumbs Down */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleThumbsDown(track.id, e)}
                    className="w-8 h-8 text-muted-foreground hover:text-destructive transition-colors duration-200"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>

                  {/* Play Button */}
                  <Button
                    size="default"
                    variant={isCurrentTrack ? "default" : "ghost"}
                    className="w-10 h-10 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      isCurrentTrack ? onTogglePlay() : onTrackPlay(track);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading && isCurrentTrack ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (isPlaying && isCurrentTrack) ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};