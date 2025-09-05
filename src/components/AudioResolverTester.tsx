import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { SmartAudioResolver } from '@/utils/smartAudioResolver';
import { Play, Search, RefreshCw } from 'lucide-react';

export default function AudioResolverTester() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testProblematicTracks = async () => {
    setLoading(true);
    setResults(null);

    try {
      console.log('🧪 Testing SmartAudioResolver on problematic tracks...');

      // Get some tracks that have been failing
      const { data: tracks } = await supabase
        .from('tracks')
        .select('id, title, storage_bucket, storage_key, audio_status')
        .eq('storage_bucket', 'audio') // These are the ones failing
        .limit(5);

      if (!tracks || tracks.length === 0) {
        setResults({ error: 'No tracks found to test' });
        return;
      }

      console.log(`🔍 Testing ${tracks.length} tracks...`);

      const testResults = [];
      
      for (const track of tracks) {
        console.log(`\n🎵 Testing: "${track.title}"`);
        
        const resolution = await SmartAudioResolver.resolveAudioUrl({
          id: track.id,
          title: track.title,
          storage_bucket: track.storage_bucket,
          storage_key: track.storage_key
        });

        testResults.push({
          track: {
            id: track.id,
            title: track.title,
            original_bucket: track.storage_bucket,
            original_key: track.storage_key,
            audio_status: track.audio_status
          },
          resolution
        });
      }

      const successful = testResults.filter(r => r.resolution.success).length;
      const failed = testResults.filter(r => !r.resolution.success).length;

      setResults({
        summary: {
          total: testResults.length,
          successful,
          failed,
          successRate: Math.round((successful / testResults.length) * 100)
        },
        testResults,
        cacheStats: SmartAudioResolver.getCacheStats()
      });

      console.log(`✅ Testing complete: ${successful}/${testResults.length} tracks resolved`);

    } catch (error) {
      console.error('❌ Test failed:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    SmartAudioResolver.clearCache();
    console.log('🗑️ Resolver cache cleared');
    if (results?.cacheStats) {
      setResults({
        ...results,
        cacheStats: SmartAudioResolver.getCacheStats()
      });
    }
  };

  const playTestTrack = async (url: string, title: string) => {
    try {
      console.log(`🎵 Testing playback: ${title}`);
      const audio = new Audio(url);
      await audio.play();
      console.log(`✅ Playback started successfully`);
      
      // Stop after 2 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        console.log(`⏹️ Stopped test playback`);
      }, 2000);
    } catch (error) {
      console.error(`❌ Playback failed:`, error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Audio Resolver Tester
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the SmartAudioResolver on problematic tracks to see if it can find working URLs
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testProblematicTracks} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Test Resolver
                </>
              )}
            </Button>
            <Button onClick={clearCache} variant="outline">
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.error && (
                <div className="p-3 border border-red-200 rounded bg-red-50 text-red-700">
                  Error: {results.error}
                </div>
              )}

              {results.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 border rounded">
                    <div className="font-medium">Total Tests</div>
                    <div className="text-2xl font-bold">{results.summary.total}</div>
                  </div>
                  <div className="p-3 border rounded bg-green-50">
                    <div className="font-medium text-green-700">Successful</div>
                    <div className="text-2xl font-bold text-green-800">{results.summary.successful}</div>
                  </div>
                  <div className="p-3 border rounded bg-red-50">
                    <div className="font-medium text-red-700">Failed</div>
                    <div className="text-2xl font-bold text-red-800">{results.summary.failed}</div>
                  </div>
                  <div className="p-3 border rounded bg-blue-50">
                    <div className="font-medium text-blue-700">Success Rate</div>
                    <div className="text-2xl font-bold text-blue-800">{results.summary.successRate}%</div>
                  </div>
                </div>
              )}

              {results.testResults && (
                <div className="space-y-3">
                  <h4 className="font-medium">Individual Track Results:</h4>
                  {results.testResults.map((result: any, i: number) => (
                    <div key={i} className={`p-3 border rounded ${result.resolution.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{result.track.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Original: {result.track.original_bucket}/{result.track.original_key}
                          </div>
                        </div>
                        {result.resolution.success && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => playTestTrack(result.resolution.url, result.track.title)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Test Play
                          </Button>
                        )}
                      </div>
                      
                      {result.resolution.success ? (
                        <div className="text-sm">
                          <div className="text-green-700 font-medium mb-1">
                            ✅ Found via {result.resolution.method}
                          </div>
                          <div className="font-mono text-xs bg-white p-2 rounded border">
                            {result.resolution.url}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="text-red-700 font-medium mb-1">
                            ❌ All resolution methods failed
                          </div>
                          <details className="text-xs">
                            <summary className="cursor-pointer">Show attempted URLs</summary>
                            <div className="mt-1 space-y-1">
                              {result.resolution.attempts.map((attempt: any, j: number) => (
                                <div key={j} className="flex justify-between font-mono">
                                  <span>{attempt.method}</span>
                                  <span className={attempt.status === 200 ? 'text-green-600' : 'text-red-600'}>
                                    {attempt.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {results.cacheStats && (
                <details className="border rounded">
                  <summary className="p-3 cursor-pointer font-medium">
                    Cache Stats ({results.cacheStats.size} entries)
                  </summary>
                  <div className="p-3 pt-0">
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(results.cacheStats, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}