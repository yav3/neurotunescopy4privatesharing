import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimpleAudioStore } from "@/stores/simpleAudioStore";
import { BucketConnectionTest } from "@/components/BucketConnectionTest";
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
      <h1 className="text-2xl font-bold mb-6">🎵 Direct Storage Connection Test</h1>
      
      <BucketConnectionTest />
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Individual Bucket Test</CardTitle>
            <CardDescription>
              Test a specific bucket by name
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
              {isLoading ? "Testing..." : "Test & Play Multiple Buckets"}
            </Button>

            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">Exact bucket names we're using:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><code>painreducingworld</code> - Contains alternativeHz-frequencies.mp3</li>
                <li><code>neuralpositivemusic</code> - Neural positive music</li>
                <li><code>classicalfocus</code> - Classical focus music</li>
                <li><code>deepworkbeats</code> - Deep work beats</li>
                <li><code>anxietyreduction</code> - Anxiety reduction music</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};