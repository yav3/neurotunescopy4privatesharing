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
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue } = useAudioStore();

  useEffect(() => {
    const loadTrendingTracks = async () => {
      try {
        console.log('🔥 Loading trending tracks...');
        
        // Use the proper API function to get trending tracks
        const { tracks, error } = await fetchTrending(60, 20); // Last 60 minutes, max 20 tracks
        
        if (error) {
          console.warn('Trending tracks error:', error);
          return;
        }
        
        if (tracks?.length) {
          console.log(`✅ Loaded ${tracks.length} trending tracks`);
          // Take first 5 tracks for the trending preview
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
    if (!trendingTracks.length) {
      console.warn('🔥 No trending tracks available to play');
      return;
    }
    
    try {
      console.log('🔥 Playing trending tracks:', trendingTracks.length, 'tracks');
      console.log('🔥 First trending track:', trendingTracks[0]);
      
      // Convert trending tracks to proper audio store format
      const formattedTracks = trendingTracks.map(track => ({
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
      
      await setQueue(formattedTracks, 0);
      toast({
        title: "Playing Trending",
        description: `Started trending playlist with ${trendingTracks.length} tracks`,
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
        "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "bg-gradient-to-br from-card to-card/80 animate-pulse",
        className
      )}>
        <div className="aspect-[4/3] relative bg-muted/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
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
        "relative overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "bg-gradient-to-br from-card to-card/80",
        className
      )}
      onClick={handlePlayTrending}
    >
      <div className="aspect-[4/3] relative">
        {/* Background Image */}
        <img 
          src={trendingArtwork} 
          alt="Trending Music"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          {/* Bottom Section - Title and Details */}
          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg leading-tight text-left">
              Trending Now
            </h3>
            <p className="text-white/80 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Popular tracks trending with our community
            </p>
            
            {/* Track Preview */}
            <p className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {trendingTracks.slice(0, 2).map(track => track.title || 'Untitled').join(', ')}
              {trendingTracks.length > 2 && ` +${trendingTracks.length - 2} more`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};