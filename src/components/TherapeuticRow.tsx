import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface GenreOption {
  id: string;
  name: string;
  description: string;
  buckets: string[];
  artwork: string;
}

interface Track {
  id: string;
  title: string;
  storage_bucket?: string;
  storage_key?: string;
}

export const TherapeuticRow: React.FC<TherapeuticRowProps> = ({ goal, className }) => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { currentTrack, setQueue, playFromGoal, isLoading: audioLoading } = useAudioStore();

  // Genre options for each therapeutic goal
  const getGenreOptions = (goalId: string): GenreOption[] => {
    if (goalId === 'focus-enhancement') {
      return [
        {
          id: 'crossover-classical',
          name: 'Crossover Classical',
          description: 'Modern classical compositions for concentration',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Ambient electronic music for focus',
          buckets: ['focus-music'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'world-new-age',
          name: 'World & New Age',
          description: 'Global sounds and new age music',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        }
      ];
    } else if (goalId === 'mood-boost') {
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Modern classical music with contemporary elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'Uplifting electronic beats and rhythms',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Soothing world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Smooth jazz and Brazilian rhythms',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/494A919302CB58E88F52E96F4FEDDD68B9E220433097EAC2A78DF75E1BB1863D_sk_6_cid_1.jpeg'
        }
      ];
    } else if (goalId === 'energy-boost') {
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Energizing classical music with modern elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'electronic',
          name: 'Electronic',
          description: 'High-energy electronic music and beats',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1.jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Motivational world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Energetic jazz and Brazilian rhythms',
          buckets: ['ENERGYBOOST'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/494A919302CB58E88F52E96F4FEDDD68B9E220433097EAC2A78DF75E1BB1863D_sk_6_cid_1.jpeg'
        }
      ];
    } else {
      // For stress-anxiety-support and pain-support
      return [
        {
          id: 'classical-crossover',
          name: 'Classical Crossover',
          description: 'Modern classical music with contemporary elements',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/117C864AE7A4E7398F43D87FFB1B21C8222AC165161EC128BBE2FEAABFB7C3A0_sk_6_cid_1.jpeg'
        },
        {
          id: 'new-age-world',
          name: 'New Age & World',
          description: 'Soothing world music and new age sounds',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/414EBE5027B77577DFEF40EA2823103319D32B7A8261D00D4413FCE57E22FB91_sk_6_cid_1.jpeg'
        },
        {
          id: 'samba-jazz',
          name: 'Samba & Jazz',
          description: 'Smooth jazz and Brazilian rhythms',
          buckets: ['neuralpositivemusic'],
          artwork: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/494A919302CB58E88F52E96F4FEDDD68B9E220433097EAC2A78DF75E1BB1863D_sk_6_cid_1.jpeg'
        }
      ];
    }
  };

  const genreOptions = getGenreOptions(goal.id);

  // Load tracks for this therapeutic goal
  useEffect(() => {
    // Only load tracks after genre selection
    if (!selectedGenre) {
      setIsLoading(false);
      return;
    }

    const loadTracks = async () => {
      setIsLoading(true);
      try {
        let buckets = goal.musicBuckets;
        let searchKey = goal.backendKey;
        
        // Use genre-specific buckets for selected genre
        if (selectedGenre) {
          const genreOption = genreOptions.find(g => g.id === selectedGenre);
          if (genreOption) {
            buckets = genreOption.buckets;
            console.log(`🎵 Loading ${genreOption.name} tracks from buckets:`, buckets);
          }
        }
        
        console.log(`🎵 Loading tracks for ${goal.name} from buckets:`, buckets);
        
        // Try to get tracks from the specified buckets
        const { tracks: fetchedTracks, error } = await getTracksFromStorage(
          searchKey, 
          20, // Load 20 tracks per row
          buckets
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
  }, [goal, selectedGenre, genreOptions]);

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
      let genreName = '';
      if (selectedGenre) {
        const genreOption = genreOptions.find(g => g.id === selectedGenre);
        genreName = genreOption ? ` ${genreOption.name.toLowerCase()}` : '';
      }
      
      toast.loading(`Starting ${goal.name.toLowerCase()}${genreName} session...`, { id: "row-play" });
      
      // Start playing from this therapeutic goal with all tracks
      await playFromGoal(goal.backendKey);
      
      toast.success(`Playing ${goal.name.toLowerCase()}${genreName} music`, { id: "row-play" });
    } catch (error) {
      console.error('❌ Failed to play track:', error);
      toast.error("Failed to start playback", { id: "row-play" });
    }
  };

  const isTrackPlaying = (track: Track): boolean => {
    return currentTrack?.id === track.id;
  };

  // Genre selection interface for all therapeutic goals
  if (!selectedGenre) {
    return (
      <div className={cn("mb-8", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{goal.name}</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred genre</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {genreOptions.map((genre) => (
            <button
              key={genre.id}
              onClick={() => navigate(`/genre/${goal.id}/${genre.id}`)}
              className="group relative overflow-hidden rounded-md border border-border hover:border-primary/50 transition-all duration-200 text-left bg-card hover:shadow-lg w-full"
            >
              <div className="aspect-square relative w-full h-0 pb-[100%]">
                <img 
                  src={genre.artwork} 
                  alt={genre.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                <div className="absolute bottom-1 left-1 right-1">
                  <h3 className="text-xs font-semibold text-white mb-0.5 group-hover:text-primary-foreground line-clamp-1">
                    {genre.name}
                  </h3>
                  <p className="text-[10px] text-white/70 line-clamp-1">
                    {genre.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

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
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {goal.name}
              {selectedGenre && (
                <span className="text-primary ml-2">
                  • {genreOptions.find(g => g.id === selectedGenre)?.name}
                </span>
              )}
            </h2>
            {selectedGenre && (
              <button
                onClick={() => setSelectedGenre(null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-1"
              >
                ← Change genre
              </button>
            )}
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