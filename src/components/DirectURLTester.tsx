import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PlayCircle, XCircle, CheckCircle, Loader2 } from 'lucide-react';

interface TestResult {
  id: string;
  title: string;
  directUrl: string;
  status: 'pending' | 'success' | 'failed' | 'testing';
  error?: string;
  responseTime?: number;
}

export function DirectURLTester() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testDirectUrl = async (url: string): Promise<{ success: boolean; error?: string; responseTime: number }> => {
    const startTime = performance.now();
    
    try {
      // Test 1: HEAD request to check if file exists
      const response = await fetch(url, { method: 'HEAD' });
      const responseTime = performance.now() - startTime;
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `HTTP ${response.status}: ${response.statusText}`,
          responseTime 
        };
      }

      // Test 2: Try to load in audio element
      const audio = new Audio();
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          audio.src = '';
          resolve({ 
            success: false, 
            error: 'Audio load timeout (5s)',
            responseTime: performance.now() - startTime 
          });
        }, 5000);

        audio.onloadedmetadata = () => {
          clearTimeout(timeout);
          audio.src = '';
          resolve({ 
            success: true, 
            responseTime: performance.now() - startTime 
          });
        };

        audio.onerror = () => {
          clearTimeout(timeout);
          resolve({ 
            success: false, 
            error: 'Audio element load failed',
            responseTime: performance.now() - startTime 
          });
        };

        audio.src = url;
      });

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: performance.now() - startTime 
      };
    }
  };

  const runDirectTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Get tracks from API (bypass database types issue)
      const response = await fetch('https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api/playlist?goal=sleep-preparation&limit=10');
      const data = await response.json();
      
      if (!data.tracks?.length) throw new Error('No tracks found');

      // Initialize results with direct storage URLs
      const initialResults: TestResult[] = data.tracks.slice(0, 10).map((track: any) => ({
        id: track.id,
        title: track.title,
        directUrl: `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${track.storage_bucket || 'audio'}/${track.storage_key}`,
        status: 'pending'
      }));

      setResults(initialResults);

      // Test each URL directly
      for (let i = 0; i < initialResults.length; i++) {
        const result = initialResults[i];
        
        setResults(prev => prev.map(r => 
          r.id === result.id ? { ...r, status: 'testing' } : r
        ));

        const testResult = await testDirectUrl(result.directUrl);

        setResults(prev => prev.map(r => 
          r.id === result.id 
            ? { 
                ...r, 
                status: testResult.success ? 'success' : 'failed',
                error: testResult.error,
                responseTime: testResult.responseTime
              } 
            : r
        ));
      }

    } catch (error) {
      console.error('Direct URL test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const playDirectly = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(console.error);
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Direct URL Tester
          <Button onClick={runDirectTests} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Run Direct Tests'
            )}
          </Button>
        </CardTitle>
        {results.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Results: {successCount} success, {failedCount} failed, {results.length - successCount - failedCount} pending
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div key={result.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {result.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {result.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                  {result.status === 'testing' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {result.status === 'pending' && <div className="w-4 h-4 bg-gray-300 rounded-full" />}
                  
                  <div className="truncate">
                    <div className="font-medium truncate">{result.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{result.directUrl}</div>
                    {result.error && (
                      <div className="text-xs text-red-500">{result.error}</div>
                    )}
                    {result.responseTime && (
                      <div className="text-xs text-muted-foreground">{result.responseTime.toFixed(0)}ms</div>
                    )}
                  </div>
                </div>
              </div>
              
              {result.status === 'success' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playDirectly(result.directUrl)}
                  className="ml-2"
                >
                  <PlayCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}