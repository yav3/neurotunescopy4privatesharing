import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AudioCacheService } from '@/services/audioCache';

export const AudioCacheManager = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [stats, setStats] = useState(AudioCacheService.getCacheStats());

  const handleScan = async () => {
    setIsScanning(true);
    toast.info("Scanning and caching audio tracks...");
    
    try {
      await AudioCacheService.scanAndCacheAudioTracks();
      setStats(AudioCacheService.getCacheStats());
      toast.success("Audio cache updated successfully!");
    } catch (error) {
      console.error('Cache scan error:', error);
      toast.error("Failed to update audio cache");
    } finally {
      setIsScanning(false);
    }
  };

  const handleForceRefresh = async () => {
    setIsScanning(true);
    toast.info("Force refreshing audio cache...");
    
    try {
      await AudioCacheService.forceRefresh();
      setStats(AudioCacheService.getCacheStats());
      toast.success("Audio cache refreshed!");
    } catch (error) {
      console.error('Cache refresh error:', error);
      toast.error("Failed to refresh audio cache");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎵 Audio Cache Manager
          {AudioCacheService.needsRefresh() && (
            <Badge variant="outline" className="text-xs">
              Needs Refresh
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Cached Genres:</span>
            <span className="font-mono">{stats.totalGenres}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Cached Tracks:</span>
            <span className="font-mono">{stats.totalTracks}</span>
          </div>
        </div>

        {isScanning && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Validating audio tracks...
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full"
            variant="outline"
          >
            {isScanning ? "Scanning..." : "Scan & Cache Tracks"}
          </Button>
          
          <Button
            onClick={handleForceRefresh}
            disabled={isScanning}
            className="w-full"
            variant="secondary"
          >
            {isScanning ? "Refreshing..." : "Force Refresh Cache"}
          </Button>
        </div>

        {Object.keys(stats.genres).length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium">Cache Breakdown:</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(stats.genres).map(([genre, count]) => (
                <div key={genre} className="flex justify-between text-xs">
                  <span className="truncate flex-1">{genre}</span>
                  <span className="font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Cached tracks provide reliable fallbacks when live tracks fail to load.
        </div>
      </CardContent>
    </Card>
  );
};