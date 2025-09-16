import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

export const BucketConnectionViewer = () => {
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // EXACTLY these buckets - no more, no less
  const EXACT_BUCKETS = [
    "painreducingworld",    // Contains alternativeHz-frequencies.mp3 
    "neuralpositivemusic",  // Neural positive music
    "classicalfocus",       // Classical focus music  
    "deepworkbeats",        // Deep work beats
    "anxietyreduction"      // Anxiety reduction music
  ];

  const testConnection = async (bucketName: string) => {
    console.log(`🔍 CONNECTING TO BUCKET: ${bucketName}`);
    
    try {
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list('', { limit: 100 });

      if (error) {
        console.error(`❌ BUCKET ${bucketName} ERROR:`, error);
        return {
          name: bucketName,
          connected: false,
          error: error.message,
          files: 0,
          audioFiles: 0,
          sampleUrls: []
        };
      }

      // Filter for audio files
      const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
      const audioFiles = files?.filter(file => 
        audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
      ) || [];

      // Generate sample URLs for first 3 audio files
      const sampleUrls = audioFiles.slice(0, 3).map(file => 
        `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${bucketName}/${file.name}`
      );

      console.log(`✅ BUCKET ${bucketName} CONNECTED: ${files?.length || 0} total files, ${audioFiles.length} audio files`);
      
      return {
        name: bucketName,
        connected: true,
        files: files?.length || 0,
        audioFiles: audioFiles.length,
        sampleUrls,
        sampleFiles: audioFiles.slice(0, 3).map(f => f.name)
      };

    } catch (error) {
      console.error(`💥 BUCKET ${bucketName} EXCEPTION:`, error);
      return {
        name: bucketName,
        connected: false,
        error: String(error),
        files: 0,
        audioFiles: 0,
        sampleUrls: []
      };
    }
  };

  const testAllConnections = async () => {
    setIsLoading(true);
    console.log('🚀 TESTING ALL BUCKET CONNECTIONS');
    console.log('📋 BUCKETS TO TEST:', EXACT_BUCKETS);
    
    const results: Record<string, any> = {};
    
    for (const bucket of EXACT_BUCKETS) {
      const result = await testConnection(bucket);
      results[bucket] = result;
      setConnections(prev => ({ ...prev, [bucket]: result }));
      
      // Small delay to prevent API overload
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Summary log
    const connected = Object.values(results).filter((r: any) => r.connected).length;
    const totalAudio = Object.values(results).reduce((sum: number, r: any) => sum + (r.audioFiles || 0), 0);
    
    console.log('📊 CONNECTION SUMMARY:');
    console.log(`✅ Connected buckets: ${connected}/${EXACT_BUCKETS.length}`);
    console.log(`🎵 Total audio files: ${totalAudio}`);
    console.log('🔗 Connection details:', results);
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🔗 Exact Bucket Connections</CardTitle>
          <CardDescription>
            These are the EXACT buckets we connect to - no fallbacks, no alternatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {EXACT_BUCKETS.map(bucket => (
                <Badge key={bucket} variant="outline" className="justify-center p-2">
                  {bucket}
                </Badge>
              ))}
            </div>
            
            <Button 
              onClick={testAllConnections} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Testing Connections..." : "Test All Bucket Connections"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Results */}
      {Object.keys(connections).length > 0 && (
        <div className="grid gap-4">
          {EXACT_BUCKETS.map(bucketName => {
            const conn = connections[bucketName];
            if (!conn) return null;

            return (
              <Card key={bucketName} className={conn.connected ? "border-green-200" : "border-red-200"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bucketName}</CardTitle>
                    <Badge variant={conn.connected ? "default" : "destructive"}>
                      {conn.connected ? "✅ CONNECTED" : "❌ FAILED"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {conn.connected ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Total Files: <strong>{conn.files}</strong></div>
                        <div>Audio Files: <strong>{conn.audioFiles}</strong></div>
                      </div>
                      
                      {conn.sampleFiles && conn.sampleFiles.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Sample Audio Files:</p>
                          <div className="space-y-1">
                            {conn.sampleFiles.map((filename: string, idx: number) => (
                              <div key={idx} className="text-xs bg-muted p-1 rounded">
                                📁 {filename}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {conn.sampleUrls && conn.sampleUrls.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Direct URLs Generated:</p>
                          <div className="space-y-1">
                            {conn.sampleUrls.map((url: string, idx: number) => (
                              <div key={idx} className="text-xs font-mono bg-muted p-1 rounded break-all">
                                🔗 {url}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm">
                      <p className="font-medium">Connection Failed:</p>
                      <p>{conn.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">🎯 Connection Details</h3>
          <div className="text-sm space-y-1">
            <p><strong>Supabase URL:</strong> https://pbtgvcjniayedqlajjzz.supabase.co</p>
            <p><strong>Storage Path:</strong> /storage/v1/object/public/[bucket]/[filename]</p>
            <p><strong>Audio Extensions:</strong> .mp3, .wav, .flac, .aac, .ogg, .m4a</p>
            <p><strong>Known File:</strong> painreducingworld/alternativeHz-frequencies.mp3</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};