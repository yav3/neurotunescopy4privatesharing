import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimpleAudioStore } from "@/stores/simpleAudioStore";
import { DirectStoragePlayer } from "@/services/directStoragePlayer";
import { toast } from "sonner";

export const TestStoragePage = () => {
  const [bucketName, setBucketName] = useState("painreducingworld");
  const [isLoading, setIsLoading] = useState(false);
  const { playFromBuckets } = useSimpleAudioStore();

  const testBucket = async () => {
    setIsLoading(true);
    try {
      console.log(`🧪 Testing bucket: ${bucketName}`);
      const tracks = await DirectStoragePlayer.getTracksFromBucket(bucketName);
      
      if (tracks.length === 0) {
        toast.error(`No audio tracks found in bucket: ${bucketName}`);
        return;
      }

      console.log(`✅ Found ${tracks.length} tracks in ${bucketName}`);
      console.log('Sample tracks:', tracks.slice(0, 3));
      
      toast.success(`Found ${tracks.length} tracks in ${bucketName}`);
      
      // Play the tracks
      await playFromBuckets([bucketName]);
      
    } catch (error) {
      console.error('🧪 Test failed:', error);
      toast.error('Failed to test bucket');
    } finally {
      setIsLoading(false);
    }
  };

  const testMultipleBuckets = async () => {
    const buckets = ["painreducingworld", "neuralpositivemusic", "classicalfocus"];
    setIsLoading(true);
    
    try {
      console.log(`🧪 Testing multiple buckets: ${buckets.join(', ')}`);
      await playFromBuckets(buckets);
    } catch (error) {
      console.error('🧪 Multi-bucket test failed:', error);
      toast.error('Failed to test multiple buckets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Direct Storage Test</CardTitle>
          <CardDescription>
            Test direct access to Supabase storage buckets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Bucket name (e.g., painreducingworld)"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
            />
            <Button 
              onClick={testBucket} 
              disabled={isLoading || !bucketName}
            >
              {isLoading ? "Testing..." : "Test Bucket"}
            </Button>
          </div>
          
          <Button 
            onClick={testMultipleBuckets} 
            disabled={isLoading}
            variant="secondary"
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Multiple Buckets"}
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Available buckets to test:</p>
            <ul className="list-disc list-inside">
              <li>painreducingworld</li>
              <li>neuralpositivemusic</li>
              <li>classicalfocus</li>
              <li>deepworkbeats</li>
              <li>anxietyreduction</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};