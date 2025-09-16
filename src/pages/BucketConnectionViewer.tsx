import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

export const BucketConnectionViewer = () => {
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // ONLY REAL BUCKETS THAT ACTUALLY EXIST (based on your screenshot)
  const REAL_BUCKETS = [
    {
      name: "painreducingworld",
      description: "Pain reduction therapeutic music (shows 0 files - possible permission issue)",
      status: "Connected but empty"
    },
    {
      name: "neuralpositivemusic", 
      description: "Neural positive therapeutic music (confirmed 99 audio files)",
      status: "Working with content"
    },
    {
      name: "classicalfocus",
      description: "Classical music for focus",
      status: "Exists in system"
    }
  ];

  const testConnection = async (bucketName: string) => {
    console.log(`🔍 TESTING REAL BUCKET: ${bucketName}`);
    
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

      console.log(`✅ BUCKET ${bucketName}: ${files?.length || 0} total files, ${audioFiles.length} audio files`);
      
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
    console.log('🚀 TESTING ONLY REAL BUCKETS');
    console.log('📋 REAL BUCKETS TO TEST:', REAL_BUCKETS.map(b => b.name));
    
    const results: Record<string, any> = {};
    
    for (const bucket of REAL_BUCKETS) {
      console.log(`\n🔍 Testing: ${bucket.name}`);
      const result = await testConnection(bucket.name);
      results[bucket.name] = { ...result, ...bucket };
      
      // Update UI progressively
      setConnections(prev => ({ ...prev, [bucket.name]: results[bucket.name] }));
      
      // Small delay to prevent API overload
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Summary log
    const connected = Object.values(results).filter((r: any) => r.connected).length;
    const totalAudio = Object.values(results).reduce((sum: number, r: any) => sum + (r.audioFiles || 0), 0);
    
    console.log('📊 REAL BUCKET CONNECTION SUMMARY:');
    console.log(`✅ Connected buckets: ${connected}/${REAL_BUCKETS.length}`);
    console.log(`🎵 Total audio files: ${totalAudio}`);
    console.log('🔗 Connection details:', results);
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🔗 REAL Bucket Connections</CardTitle>
          <CardDescription>
            These are the ONLY REAL buckets that actually exist in your system - no fake ones!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {REAL_BUCKETS.map(bucket => (
                <div key={bucket.name} className="text-center">
                  <Badge variant="outline" className="justify-center p-2 mb-1">
                    {bucket.name}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {bucket.status}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={testAllConnections} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Testing Real Buckets..." : "Test Real Bucket Connections"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Results */}
      {Object.keys(connections).length > 0 && (
        <div className="grid gap-4">
          {REAL_BUCKETS.map(bucket => {
            const conn = connections[bucket.name];
            if (!conn) return null;

            return (
              <Card key={bucket.name} className={conn.connected ? "border-green-200" : "border-red-200"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bucket.name}</CardTitle>
                    <Badge variant={conn.connected ? "default" : "destructive"}>
                      {conn.connected ? "✅ CONNECTED" : "❌ FAILED"}
                    </Badge>
                  </div>
                  <CardDescription>{bucket.description}</CardDescription>
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
          <h3 className="font-semibold mb-2">🎯 REAL Connection Details</h3>
          <div className="text-sm space-y-1">
            <p><strong>CONFIRMED Real Buckets:</strong></p>
            <p><code>painreducingworld</code> - Connected but shows 0 files (permission issue?)</p>
            <p><code>neuralpositivemusic</code> - Connected with 99 audio files ✅</p>
            <p><code>classicalfocus</code> - Exists in your system</p>
            <p><strong>Supabase URL:</strong> https://pbtgvcjniayedqlajjzz.supabase.co</p>
            <p><strong>Storage Path:</strong> /storage/v1/object/public/[bucket]/[filename]</p>
            <p><strong>Audio Extensions:</strong> .mp3, .wav, .flac, .aac, .ogg, .m4a</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};