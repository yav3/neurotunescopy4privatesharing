import { useState } from 'react';
import { Play, Pause, Heart, MoreVertical, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePlayerStore } from '@/stores/playerStore';

interface Track {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  duration?: number;
  audio_url?: string;
  valence?: number;
  energy?: number;
  danceability?: number;
  acousticness?: number;
}

interface TrackCardProps {
  track: Track;
  className?: string;
  showAddToQueue?: boolean;
  showFavorite?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrackCard = ({ 
  track, 
  className, 
  showAddToQueue = true, 
  showFavorite = true, 
  size = 'md' 
}: TrackCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    togglePlay,
    addToQueue,
    toggleFavorite,
    isFavorite
  } = usePlayerStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackFavorite = isFavorite(track.id);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentTrack) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      togglePlay();
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track.id);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cardSizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const textSizeClasses = {
    sm: {
      title: 'text-sm font-medium',
      artist: 'text-xs text-muted-foreground',
      genre: 'text-xs'
    },
    md: {
      title: 'text-base font-semibold',
      artist: 'text-sm text-muted-foreground',
      genre: 'text-sm'
    },
    lg: {
      title: 'text-lg font-bold',
      artist: 'text-base text-muted-foreground',
      genre: 'text-base'
    }
  };

  return (
    <Card 
      className={cn(
        'group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50',
        isCurrentTrack && 'ring-2 ring-primary bg-primary/5',
        cardSizeClasses[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setCurrentTrack(track)}
    >
      <div className="flex items-center justify-between space-x-4">
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'truncate transition-colors',
            textSizeClasses[size].title,
            isCurrentTrack && 'text-primary'
          )}>
            {track.title}
          </h3>
          
          {track.artist && (
            <p className={cn(
              'truncate mt-1',
              textSizeClasses[size].artist
            )}>
              {track.artist}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            {track.genre && (
              <span className={cn(
                'px-2 py-1 bg-secondary rounded-full text-secondary-foreground',
                textSizeClasses[size].genre
              )}>
                {track.genre}
              </span>
            )}
            
            {track.duration && (
              <span className={cn(
                'text-muted-foreground',
                textSizeClasses[size].genre
              )}>
                {formatDuration(track.duration)}
              </span>
            )}
          </div>
          
          {/* Audio Features (only show for md and lg sizes) */}
          {size !== 'sm' && (track.valence !== undefined || track.energy !== undefined) && (
            <div className="flex gap-2 mt-2">
              {track.valence !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Mood:</span>
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${track.valence * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {track.energy !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Energy:</span>
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${track.energy * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className={cn(
              'h-8 w-8 rounded-full transition-all',
              isCurrentTrack && isPlaying 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-primary hover:text-primary-foreground'
            )}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Favorite Button */}
          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={cn(
                'h-8 w-8 rounded-full transition-all opacity-0 group-hover:opacity-100',
                isTrackFavorite && 'opacity-100 text-red-500 hover:text-red-600',
                isHovered && 'opacity-100'
              )}
            >
              <Heart 
                className={cn(
                  'h-4 w-4 transition-all',
                  isTrackFavorite && 'fill-current'
                )} 
              />
            </Button>
          )}

          {/* Add to Queue Button */}
          {showAddToQueue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToQueue}
              className="h-8 w-8 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}

          {/* More Options */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};