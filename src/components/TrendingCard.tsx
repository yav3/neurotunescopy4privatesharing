import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Play, Music } from "lucide-react";
import { useAudioStore } from "@/stores";
import { toast } from "@/hooks/use-toast";
import { streamUrl } from "@/lib/api";

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
      <Card className={`bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
            <CardTitle className="text-lg">Loading Trending...</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Trending Now</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            {trendingTracks.length} tracks
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {trendingTracks.slice(0, 3).map((track, index) => (
            <div key={track.id} className="flex items-center gap-2 text-sm">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-medium text-xs">
                {index + 1}
              </div>
              <Music className="w-3 h-3 text-muted-foreground" />
              <span className="truncate text-foreground/80">
                {track.title || track.filename || 'Untitled Track'}
              </span>
            </div>
          ))}
          {trendingTracks.length > 3 && (
            <div className="text-xs text-muted-foreground pl-8">
              +{trendingTracks.length - 3} more tracks
            </div>
          )}
        </div>
        
        <Button 
          onClick={handlePlayTrending}
          className="w-full bg-primary/90 hover:bg-primary text-primary-foreground"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Play Trending
        </Button>
      </CardContent>
    </Card>
  );
};