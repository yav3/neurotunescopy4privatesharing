import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { fetchTrending } from "@/lib/api";

// Import artwork for trending (use delta moonlit lake)
const trendingArtwork = '/lovable-uploads/delta-moonlit-lake.png';

interface TrendingCardProps {
  className?: string;
}

export const TrendingCard = ({ className }: TrendingCardProps) => {
  const [trendingTracks, setTrendingTracks] = useState<any[]>([]);
  const [allTrendingTracks, setAllTrendingTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue } = useAudioStore();

  useEffect(() => {
    const loadTrendingTracks = async () => {
      try {
        console.log('🔥 Loading trending tracks...');
        
        // Use the proper API function to get trending tracks - get more for continuous play
        // For 45+ minutes of continuous play, get 200+ tracks (assuming ~3min avg per track)
        const { tracks, error } = await fetchTrending(180, 250); // Last 3 hours, max 250 tracks
        
        if (error) {
          console.warn('Trending tracks error:', error);
          return;
        }
        
        if (tracks?.length) {
          console.log(`✅ Loaded ${tracks.length} trending tracks`);
          // Store all tracks for playback
          setAllTrendingTracks(tracks);
          // Take first 5 tracks for the trending preview display
          setTrendingTracks(tracks.slice(0, 5));
        } else {
          console.log('ℹ️ No trending tracks available');
        }
      } catch (error) {
        console.error('Failed to load trending tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingTracks();
  }, []);

  const handlePlayTrending = async () => {
    if (!allTrendingTracks.length) {
      console.warn('🔥 No trending tracks available to play');
      return;
    }
    
    try {
      console.log('🔥 Playing trending tracks:', allTrendingTracks.length, 'tracks');
      console.log('🔥 First trending track:', allTrendingTracks[0]);
      
      // Convert ALL trending tracks to proper audio store format for continuous play
      const formattedTracks = allTrendingTracks.map(track => ({
        id: String(track.id),
        title: track.title || 'Untitled',
        artist: track.genre || 'Unknown Artist',
        duration: 0,
        storage_bucket: track.storage_bucket || 'audio',
        storage_key: track.storage_key,
        bpm: track.bpm,
        genre: track.genre
      }));
      
      console.log('🔥 Formatted tracks for audio store:', formattedTracks);
      
      // Set a trending goal so the system can auto-reload more tracks when needed
      const audioStore = useAudioStore.getState();
      audioStore.lastGoal = 'trending';
      
      await setQueue(formattedTracks, 0);
      toast({
        title: "Playing Trending",
        description: `Started trending playlist with ${allTrendingTracks.length} tracks`,
      });
    } catch (error) {
      console.error('❌ Failed to play trending tracks:', error);
      toast({
        title: "Playback Error",
        description: "Failed to play trending music. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className={cn(
        "relative overflow-hidden cursor-pointer group",
        "bg-gradient-card shadow-card animate-pulse",
        "transition-all duration-500 ease-out",
        className
      )}>
        <div className="aspect-[4/3] relative bg-muted/30">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {/* Loading content - Fixed positioning for consistency */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group",
        "bg-gradient-card shadow-card",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_20px_60px_hsl(217_91%_60%_/_0.3),_0_8px_24px_hsl(217_91%_5%_/_0.6)]",
        "hover:border-primary/40 hover:-translate-y-2 hover:scale-[1.02]",
        "animate-fade-in",
        className
      )}
      onClick={handlePlayTrending}
    >
      <div className="aspect-[4/3] relative">
        {/* Background Image */}
        <img 
          src={trendingArtwork} 
          alt="Trending Music"
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 group-hover:from-black/70 transition-all duration-500" />
        
        {/* Animated glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t from-primary/60 to-transparent" />
        
        {/* Trending indicator */}
        <div className="absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <TrendingUp className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
        </div>
        
        {/* Content - Fixed positioning for perfect alignment */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            <h3 className="text-white font-semibold text-lg leading-tight drop-shadow-lg mb-1">
              Trending Now
            </h3>
            <div className="space-y-1.5 mt-1">
              <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                Popular tracks trending with our community
              </p>
              
              {/* Track Preview */}
              <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-2 group-hover:translate-y-0">
                {trendingTracks.slice(0, 2).map(track => track.title || 'Untitled').join(', ')}
                {trendingTracks.length > 2 && ` +${trendingTracks.length - 2} more`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};