import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

export const BucketConnectionViewer = () => {
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // ALL REAL BUCKETS FROM YOUR SUPABASE PROJECT
  const REAL_BUCKETS = [
    {
      name: "neuralpositivemusic", 
      description: "Neural positive therapeutic music (confirmed 99 audio files)",
      status: "Working with content"
    },
    {
      name: "audio",
      description: "General audio storage bucket",
      status: "Main audio bucket"
    },
    {
      name: "ENERGYBOOST",
      description: "High energy music for workouts",
      status: "Energy music collection"
    },
    {
      name: "focus-music",
      description: "Music specifically for focus and concentration",
      status: "Focus collection"
    },
    {
      name: "opera",
      description: "Opera music collection",
      status: "Classical opera"
    },
    {
      name: "HIIT",
      description: "High intensity interval training music",
      status: "Workout music"
    },
    {
      name: "samba",
      description: "Samba and Brazilian music",
      status: "World music"
    },
    {
      name: "Chopin",
      description: "Classical Chopin compositions",
      status: "Classical piano"
    },
    {
      name: "curated-music-collection",
      description: "Professionally curated music collection",
      status: "Curated content"
    },
    {
      name: "classicalfocus",
      description: "Classical music for focus and productivity",
      status: "Classical focus"
    },
    {
      name: "newageworldstressanxietyreduction",
      description: "New age and world music for stress and anxiety relief",
      status: "Therapeutic music"
    },
    {
      name: "pop",
      description: "Popular music collection",
      status: "Pop music"
    },
    {
      name: "countryandamericana",
      description: "Country and Americana music",
      status: "Country collection"
    },
    {
      name: "gentleclassicalforpain",
      description: "Gentle classical music for pain management",
      status: "Pain relief music"
    },
    {
      name: "sonatasforstress",
      description: "Classical sonatas for stress relief",
      status: "Stress relief"
    },
    {
      name: "painreducingworld",
      description: "World music for pain reduction (shows 0 files - possible permission issue)",
      status: "Connected but empty"
    },
    {
      name: "NewAgeandWorldFocus",
      description: "New age and world music for focus",
      status: "Focus collection"
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

      // Test URL accessibility
      const urlTests = await Promise.all(
        sampleUrls.map(async (url) => {
          try {
            const response = await fetch(url, { method: 'HEAD' });
            return { url, accessible: response.ok, status: response.status };
          } catch (error) {
            return { url, accessible: false, error: String(error) };
          }
        })
      );

      console.log(`✅ BUCKET ${bucketName}: ${files?.length || 0} total files, ${audioFiles.length} audio files`);
      console.log(`🔗 URL Tests:`, urlTests);
      
      return {
        name: bucketName,
        connected: true,
        files: files?.length || 0,
        audioFiles: audioFiles.length,
        sampleUrls,
        sampleFiles: audioFiles.slice(0, 3).map(f => f.name),
        urlTests
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
    console.log('🚀 TESTING BUCKETS WITH SERVICE ROLE KEY');
    console.log('📋 BUCKETS TO TEST:', REAL_BUCKETS.map(b => b.name));
    
    try {
      // Call edge function with service role access
      const { data, error } = await supabase.functions.invoke('storage-bucket-test', {
        body: { buckets: REAL_BUCKETS }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setConnections(data.results);
        
        console.log('📊 SERVICE ROLE BUCKET TEST SUMMARY:');
        console.log(`✅ Connected buckets: ${data.summary.connected}/${data.summary.total}`);
        console.log(`🎵 Total audio files: ${data.summary.totalAudio}`);
        console.log('🔗 Connection details:', data.results);
      } else {
        console.error('❌ Test failed:', data.error);
      }
      
    } catch (error) {
      console.error('💥 Request failed:', error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🔑 SERVICE ROLE Storage Test</CardTitle>
          <CardDescription>
            Testing ALL real buckets with SERVICE ROLE KEY for full admin access
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
              {isLoading ? "Testing with Service Role..." : "🔑 Test All Buckets (Service Role)"}
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
                      
                      {conn.urlTests && conn.urlTests.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">URL Accessibility Tests:</p>
                          <div className="space-y-1">
                            {conn.urlTests.map((test: any, idx: number) => (
                              <div key={idx} className={`text-xs p-2 rounded ${test.accessible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {test.accessible ? '✅' : '❌'} {test.accessible ? `Playable (${test.status})` : `Not accessible: ${test.error || test.status}`}
                                <div className="text-xs mt-1 break-all">{test.url}</div>
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
          <h3 className="font-semibold mb-2">🔑 SERVICE ROLE Access Details</h3>
          <div className="text-sm space-y-1">
            <p><strong>Access Level:</strong> Full admin access with SERVICE ROLE KEY</p>
            <p><strong>All Storage Buckets:</strong> {REAL_BUCKETS.length} buckets from your Supabase project</p>
            <p><strong>Supabase URL:</strong> https://pbtgvcjniayedqlajjzz.supabase.co</p>
            <p><strong>Storage Path:</strong> /storage/v1/object/public/[bucket]/[filename]</p>
            <p><strong>Audio Extensions:</strong> .mp3, .wav, .flac, .aac, .ogg, .m4a</p>
            <p><strong>URL Testing:</strong> HEAD requests to verify accessibility</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};