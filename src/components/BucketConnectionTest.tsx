import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const BucketConnectionTest = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // EXACT buckets we're trying to connect to
  const STORAGE_BUCKETS = [
    {
      name: "painreducingworld",
      description: "Pain reduction therapeutic music",
      expectedFiles: ["alternativeHz-frequencies.mp3"] // Known file from your message
    },
    {
      name: "neuralpositivemusic", 
      description: "Neural positive therapeutic music",
      expectedFiles: []
    },
    {
      name: "classicalfocus",
      description: "Classical music for focus",
      expectedFiles: []
    },
    {
      name: "deepworkbeats",
      description: "Music for deep work sessions", 
      expectedFiles: []
    },
    {
      name: "anxietyreduction",
      description: "Anxiety reduction therapeutic music",
      expectedFiles: []
    }
  ];

  const testBucketConnection = async (bucketName: string) => {
    console.log(`🧪 Testing bucket connection: ${bucketName}`);
    
    try {
      // Test 1: Basic bucket access
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 10 });

      if (error) {
        console.error(`❌ Bucket ${bucketName} error:`, error);
        return {
          accessible: false,
          error: error.message,
          files: [],
          audioFiles: [],
          testUrls: []
        };
      }

      console.log(`✅ Bucket ${bucketName} accessible, found ${files?.length || 0} files`);

      // Test 2: Filter for audio files
      const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
      const audioFiles = files?.filter(file => 
        audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      ) || [];

      console.log(`🎵 Found ${audioFiles.length} audio files in ${bucketName}`);

      // Test 3: Generate and test URLs for first few audio files
      const testUrls = [];
      for (const file of audioFiles.slice(0, 3)) {
        const publicUrl = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${file.name}`;
        
        // Test URL accessibility
        try {
          const response = await fetch(publicUrl, { method: 'HEAD' });
          testUrls.push({
            filename: file.name,
            url: publicUrl,
            accessible: response.ok,
            status: response.status
          });
          console.log(`🔗 ${file.name}: ${response.ok ? '✅ ACCESSIBLE' : '❌ BLOCKED'} (${response.status})`);
        } catch (error) {
          testUrls.push({
            filename: file.name, 
            url: publicUrl,
            accessible: false,
            error: String(error)
          });
          console.log(`🔗 ${file.name}: ❌ ERROR - ${error}`);
        }
      }

      return {
        accessible: true,
        files: files || [],
        audioFiles,
        testUrls,
        totalFiles: files?.length || 0,
        audioCount: audioFiles.length
      };

    } catch (error) {
      console.error(`💥 Unexpected error testing ${bucketName}:`, error);
      return {
        accessible: false,
        error: String(error),
        files: [],
        audioFiles: [],
        testUrls: []
      };
    }
  };

  const testAllBuckets = async () => {
    setIsLoading(true);
    setTestResults({});
    
    console.log('🚀 STARTING COMPREHENSIVE BUCKET CONNECTION TEST');
    console.log('📋 Testing these exact buckets:', STORAGE_BUCKETS.map(b => b.name));
    
    const results: Record<string, any> = {};
    
    for (const bucket of STORAGE_BUCKETS) {
      console.log(`\n🔍 Testing: ${bucket.name}`);
      const result = await testBucketConnection(bucket.name);
      results[bucket.name] = { ...result, ...bucket };
      
      // Update UI progressively
      setTestResults(prev => ({ ...prev, [bucket.name]: results[bucket.name] }));
      
      // Small delay to prevent overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Summary
    const accessible = Object.values(results).filter((r: any) => r.accessible).length;
    const totalAudio = Object.values(results).reduce((sum: number, r: any) => sum + (r.audioCount || 0), 0);
    
    console.log(`\n📊 BUCKET CONNECTION SUMMARY:`);
    console.log(`✅ Accessible buckets: ${accessible}/${STORAGE_BUCKETS.length}`);
    console.log(`🎵 Total audio files found: ${totalAudio}`);
    
    if (accessible === 0) {
      toast.error("No buckets are accessible!");
    } else if (totalAudio === 0) {
      toast.error("Buckets accessible but no audio files found!");
    } else {
      toast.success(`Connected to ${accessible} buckets with ${totalAudio} audio files!`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔗 Bucket Connection Test</CardTitle>
          <CardDescription>
            Testing direct connections to these exact Supabase storage buckets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testAllBuckets} 
            disabled={isLoading}
            className="w-full mb-4"
          >
            {isLoading ? "Testing Connections..." : "Test All Bucket Connections"}
          </Button>
          
          <div className="text-sm space-y-2">
            <p className="font-semibold">Buckets we're testing:</p>
            {STORAGE_BUCKETS.map(bucket => (
              <div key={bucket.name} className="flex items-center gap-2">
                <Badge variant="outline">{bucket.name}</Badge>
                <span className="text-muted-foreground">{bucket.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {STORAGE_BUCKETS.map(bucket => {
            const result = testResults[bucket.name];
            if (!result) return null;

            return (
              <Card key={bucket.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bucket.name}</CardTitle>
                    <Badge variant={result.accessible ? "default" : "destructive"}>
                      {result.accessible ? "✅ CONNECTED" : "❌ FAILED"}
                    </Badge>
                  </div>
                  <CardDescription>{bucket.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.accessible ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Files:</span> {result.totalFiles}
                        </div>
                        <div>
                          <span className="font-medium">Audio Files:</span> {result.audioCount}
                        </div>
                      </div>
                      
                      {result.testUrls.length > 0 && (
                        <div>
                          <p className="font-medium text-sm mb-2">Sample URLs tested:</p>
                          <div className="space-y-1">
                            {result.testUrls.map((test: any, idx: number) => (
                              <div key={idx} className="text-xs">
                                <Badge variant={test.accessible ? "default" : "destructive"} className="text-xs">
                                  {test.accessible ? "✅" : "❌"}
                                </Badge>
                                <span className="ml-2 font-mono">{test.filename}</span>
                                {test.status && <span className="ml-2 text-muted-foreground">({test.status})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-red-600 text-sm">
                      <p className="font-medium">Connection Failed:</p>
                      <p>{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};