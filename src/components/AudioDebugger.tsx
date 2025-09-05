import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const AudioDebugger = () => {
  const [storageFiles, setStorageFiles] = useState<string[]>([]);
  const [dbTracks, setDbTracks] = useState<any[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check storage files
      const { data: files, error: storageError } = await supabase.storage
        .from('neuralpositivemusic')
        .list('', { limit: 20 });
      
      if (storageError) throw storageError;
      
      setStorageFiles(files?.map(f => f.name) || []);
      
      // Get sample tracks (database still has storage_bucket='audio' but files are in neuralpositivemusic)
      const { data: tracks, error: dbError } = await supabase
        .from('tracks')
        .select('id, title, storage_key, storage_bucket')
        .eq('storage_bucket', 'audio')  // This is what database has (wrong)
        .not('camelot', 'is', null)
        .eq('audio_status', 'working')
        .limit(5);
      
      if (dbError) throw dbError;
      setDbTracks(tracks || []);
      
      // Test streaming endpoints for each track
      const results = [];
      for (const track of tracks || []) {
        try {
          const { buildStreamUrl } = await import('@/lib/stream');
          const streamUrl = buildStreamUrl(track.id);
          const response = await fetch(streamUrl, { method: 'HEAD' });
          
          results.push({
            trackId: track.id,
            title: track.title,
            streamUrl,
            status: response.status,
            success: response.ok
          });
        } catch (err) {
          results.push({
            trackId: track.id,
            title: track.title,
            status: 'ERROR',
            error: err.message,
            success: false
          });
        }
      }
      
      setTestResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testDemoAudio = () => {
    const audio = new Audio('/lovable-uploads/acoustic-sunset-field.png');
    audio.play().catch(err => {
      setError(`Demo audio failed: ${err.message}`);
    });
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Audio System Debugger</h3>
      </div>

      <div className="flex gap-2">
        <Button onClick={checkStorage} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Check Storage & Streaming
        </Button>
        <Button variant="outline" onClick={testDemoAudio}>
          Test Demo Audio
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Storage Files */}
        <div>
          <h4 className="font-medium mb-2">Storage Files ({storageFiles.length})</h4>
          <div className="bg-secondary rounded-lg p-3 max-h-32 overflow-y-auto">
            {storageFiles.length > 0 ? (
              <ul className="text-sm space-y-1">
                {storageFiles.slice(0, 10).map(file => (
                  <li key={file} className="font-mono">{file}</li>
                ))}
                {storageFiles.length > 10 && <li className="text-muted-foreground">...and {storageFiles.length - 10} more</li>}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No files found</p>
            )}
          </div>
        </div>

        {/* Database Tracks */}
        <div>
          <h4 className="font-medium mb-2">Database Tracks ({dbTracks.length})</h4>
          <div className="bg-secondary rounded-lg p-3 max-h-32 overflow-y-auto">
            {dbTracks.length > 0 ? (
              <ul className="text-sm space-y-1">
                {dbTracks.map(track => (
                  <li key={track.id} className="truncate">
                    <span className="font-medium">{track.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No tracks found</p>
            )}
          </div>
        </div>
      </div>

      {/* Stream Test Results */}
      {testResults.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Streaming Test Results</h4>
          <div className="space-y-2">
            {testResults.map(result => (
              <div key={result.trackId} className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{result.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Status: {result.status} | Track ID: {result.trackId}
                  </p>
                  {result.error && (
                    <p className="text-xs text-red-500 mt-1">{result.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};