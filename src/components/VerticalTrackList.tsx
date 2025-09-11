import React, { useState } from 'react';
import { Play, Pause, Heart, ThumbsDown, Zap, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAudioStore } from '@/stores';
import { formatTrackTitleForDisplay } from '@/utils/trackTitleFormatter';

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
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200">
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
              "transition-colors duration-200 text-xs sm:text-sm",
              lightningMode
                ? "text-yellow-600 hover:text-yellow-700 bg-yellow-50"
                : "text-gray-600 hover:text-yellow-600"
            )}
          >
            <Zap className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2", lightningMode && "fill-current")} />
            <span className="hidden sm:inline">Lightning</span>
            <span className="sm:hidden">⚡</span>
            {lightningMode && <span className="ml-1 text-xs">save mix</span>}
          </Button>

          {/* Spatial Audio */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSpatialAudio}
            className={cn(
              "transition-colors duration-200 text-xs sm:text-sm",
              spatialAudioEnabled
                ? "text-gray-700 hover:text-gray-800 bg-gray-100"
                : "text-gray-600 hover:text-gray-700"
            )}
          >
            <Radio className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Spatial</span>
            <span className="sm:hidden">📡</span>
          </Button>
        </div>
      </div>

      {/* Standard Playlist - Vertical Scrolling List */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {filteredTracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isFavorited = favorites.has(track.id);
          
          return (
            <div
              key={track.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 group cursor-pointer",
                isCurrentTrack && "ring-2 ring-primary bg-primary/5 border-primary/30"
              )}
              onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
            >
              {/* Track Number / Play Button */}
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                {isLoading && isCurrentTrack ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : isCurrentTrack && isPlaying ? (
                  <Pause className="w-4 h-4 text-primary" />
                ) : (
                  <div className="relative">
                    <span className="text-sm text-gray-500 group-hover:opacity-0 transition-opacity">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <Play className="w-4 h-4 text-primary absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </div>

              {/* Small Album Art */}
              <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                {track.artwork_url ? (
                  <img 
                    src={track.artwork_url} 
                    alt={formatTrackTitleForDisplay(track.title)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">♪</div>
                )}
              </div>
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm leading-tight truncate">
                  {formatTrackTitleForDisplay(track.title)}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  Therapeutic Music
                </p>
              </div>

              {/* Action Buttons - Only show on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                {/* Favorite */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleFavorite(track.id, e)}
                  className={cn(
                    "w-8 h-8 transition-colors duration-200",
                    isFavorited 
                      ? "text-red-500 hover:text-red-600" 
                      : "text-gray-400 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                </Button>

                {/* Thumbs Down */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleThumbsDown(track.id, e)}
                  className="w-8 h-8 text-gray-400 hover:text-destructive transition-colors duration-200"
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};