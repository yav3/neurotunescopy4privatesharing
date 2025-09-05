import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
        // Fetch trending tracks directly from the API endpoint
        const apiUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api/v1/playlist?goal=focus-enhancement&count=20';
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        const data = await response.json();
        
        if (data.tracks?.length) {
          // Take first 5 tracks for the trending preview
          setTrendingTracks(data.tracks.slice(0, 5));
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
    if (!trendingTracks.length) return;
    
    try {
      await setQueue(trendingTracks, 0);
      toast({
        title: "Playing Trending",
        description: `Started trending playlist with ${trendingTracks.length} tracks`,
      });
    } catch (error) {
      console.error('Failed to play trending tracks:', error);
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
        "bg-gradient-to-br from-card to-card/80 border-border/50 animate-pulse",
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
        "bg-gradient-to-br from-card to-card/80 border-border/50",
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
            <h3 className="text-white font-semibold text-lg leading-tight">
              Trending Now
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              Popular tracks trending with our community
            </p>
            
            {/* Track Preview */}
            <p className="text-white/60 text-xs">
              {trendingTracks.slice(0, 2).map(track => track.title || 'Untitled').join(', ')}
              {trendingTracks.length > 2 && ` +${trendingTracks.length - 2} more`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};