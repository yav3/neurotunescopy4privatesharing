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
  return (
    <div className="w-full">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {tracks.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <div
              key={track.id}
              className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/60 hover:bg-card/90 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              onClick={() => isCurrentTrack ? onTogglePlay() : onTrackPlay(track)}
            >
              <div className="flex items-center gap-4">
                {/* Album Art - Larger */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-semibold text-base leading-tight truncate">
                    {track.title}
                  </h3>
                  <p className="text-muted-foreground/80 text-sm mt-1">
                    Therapeutic Music
                  </p>
                </div>
                
                {/* Play Button */}
                <Button
                  size="default"
                  variant={isCurrentTrack ? "default" : "ghost"}
                  className="w-12 h-12 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    isCurrentTrack ? onTogglePlay() : onTrackPlay(track);
                  }}
                  disabled={isLoading}
                >
                  {isLoading && isCurrentTrack ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (isPlaying && isCurrentTrack) ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
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