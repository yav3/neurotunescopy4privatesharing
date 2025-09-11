import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Track {
  id: string;
  title: string;
  storage_bucket?: string;
  storage_key?: string;
  artwork_url?: string;
}

interface HorizontalTrackListProps {
  tracks: Track[];
  currentTrack?: Track | null;
  isPlaying: boolean;
  onTrackPlay: (track: Track) => void;
  onTogglePlay: () => void;
  isLoading: boolean;
}

export const HorizontalTrackList: React.FC<HorizontalTrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackPlay,
  onTogglePlay,
  isLoading
}) => {
  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {tracks.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <div
              key={track.id}
              className="flex-shrink-0 w-72 bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 hover:bg-card/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Album Art */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {track.artwork_url ? (
                    <img 
                      src={track.artwork_url} 
                      alt={track.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-primary/40 rounded"></div>
                  )}
                </div>
                
                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium text-sm leading-tight truncate">
                    {track.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Therapeutic Music
                  </p>
                </div>
                
                {/* Play Button */}
                <Button
                  size="sm"
                  variant={isCurrentTrack ? "default" : "ghost"}
                  className="w-8 h-8 p-0 flex-shrink-0"
                  onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
                  disabled={isLoading}
                >
                  {isLoading && isCurrentTrack ? (
                    <div className="w-3 h-3 border border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (isPlaying && isCurrentTrack) ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};