import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TrackRowCard } from './TrackRowCard';
import { TherapeuticGoal } from '@/config/therapeuticGoals';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getTracksFromStorage } from '@/services/storageDirectAccess';
import { useAudioStore } from '@/stores';
import { toast } from 'sonner';

interface TherapeuticRowProps {
  goal: TherapeuticGoal;
  className?: string;
}

interface Track {
  id: string;
  title: string;
  storage_bucket?: string;
  storage_key?: string;
}

export const TherapeuticRow: React.FC<TherapeuticRowProps> = ({ goal, className }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { currentTrack, setQueue, playFromGoal, isLoading: audioLoading } = useAudioStore();

  // Load tracks for this therapeutic goal
  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      try {
        console.log(`🎵 Loading tracks for ${goal.name} from buckets:`, goal.musicBuckets);
        
        // Try to get tracks from the goal's dedicated buckets
        const { tracks: fetchedTracks, error } = await getTracksFromStorage(
          goal.backendKey, 
          20, // Load 20 tracks per row
          goal.musicBuckets
        );
        
        if (error) {
          console.warn(`⚠️ Error loading tracks for ${goal.name}:`, error);
        }
        
        if (fetchedTracks && fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
          console.log(`✅ Loaded ${fetchedTracks.length} tracks for ${goal.name}`);
        } else {
          console.warn(`⚠️ No tracks found for ${goal.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to load tracks for ${goal.name}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [goal]);

  // Check scroll buttons visibility
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons(); // Initial check
      
      // Check after content loads
      const resizeObserver = new ResizeObserver(updateScrollButtons);
      resizeObserver.observe(container);
      
      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, [tracks]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 400; // Scroll by ~2 card widths
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
      
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleTrackPlay = async (track: Track) => {
    if (audioLoading) {
      toast.error("Already loading music, please wait...");
      return;
    }

    try {
      toast.loading(`Starting ${goal.name.toLowerCase()} session...`, { id: "row-play" });
      
      // Start playing from this therapeutic goal with all tracks
      await playFromGoal(goal.backendKey);
      
      toast.success(`Playing ${goal.name.toLowerCase()} music`, { id: "row-play" });
    } catch (error) {
      console.error('❌ Failed to play track:', error);
      toast.error("Failed to start playback", { id: "row-play" });
    }
  };

  const isTrackPlaying = (track: Track): boolean => {
    return currentTrack?.id === track.id;
  };

  if (isLoading) {
    return (
      <div className={cn("mb-8", className)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">{goal.name}</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="w-48 h-64 bg-muted animate-pulse rounded-lg flex-shrink-0" 
            />
          ))}
        </div>
      </div>
    );
  }

  if (!tracks.length) {
    return (
      <div className={cn("mb-8", className)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">{goal.name}</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No tracks available for {goal.name}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mb-8", className)}>
      {/* Row header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r",
            goal.gradient
          )}>
            <goal.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{goal.name}</h2>
            <p className="text-sm text-muted-foreground">{tracks.length} tracks available</p>
          </div>
        </div>
        
        {/* Scroll controls */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Scrollable track container */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tracks.map((track) => (
            <TrackRowCard
              key={track.id}
              track={track}
              isPlaying={isTrackPlaying(track)}
              onPlay={() => handleTrackPlay(track)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};