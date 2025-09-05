import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Database, FileAudio, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function DatabaseSchemaInspector() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (section, status, details, data = null) => {
    const result = {
      section,
      status,
      details,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [...prev, result]);
    console.log(`[SCHEMA] ${section}: ${status}`, details, data);
  };

  const inspectTrackData = async () => {
    try {
      addResult('Track Data', 'SAMPLING', 'Getting sample track records to see actual metadata...');

      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('*')
        .limit(10);

      if (error) {
        addResult('Track Data', 'ERROR', error.message);
        return;
      }

      if (!tracks || tracks.length === 0) {
        addResult('Track Data', 'EMPTY', 'No tracks found in tracks table');
        return;
      }

      // Analyze the storage-related fields
      const sampleTrack = tracks[0];
      const storageFields = Object.keys(sampleTrack).filter(key =>
        key.includes('storage') || 
        key.includes('bucket') || 
        key.includes('path') || 
        key.includes('key') ||
        key.includes('url') ||
        key.includes('file')
      );

      // Check for different bucket values
      const buckets = [...new Set(tracks.map(t => t.storage_bucket).filter(Boolean))];
      const keyPatterns = [...new Set(tracks.map(t => {
        if (!t.storage_key) return 'NULL';
        if (t.storage_key.includes('/')) return 'HAS_FOLDER';
        if (t.storage_key.match(/^[0-9a-f-]{36}\.mp3$/)) return 'UUID_FORMAT';
        return 'DESCRIPTIVE_NAME';
      }))];

      // Analyze audio status distribution
      const statusCounts = tracks.reduce((acc, track) => {
        const status = track.audio_status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      addResult('Track Data', 'ANALYZED', `Found ${tracks.length} sample tracks`, {
        sampleTrack: sampleTrack,
        storageFields: storageFields,
        uniqueBuckets: buckets,
        keyPatterns: keyPatterns,
        statusDistribution: statusCounts,
        trackSamples: tracks.slice(0, 5).map(t => ({
          id: t.id,
          title: t.title,
          storage_bucket: t.storage_bucket,
          storage_key: t.storage_key,
          audio_status: t.audio_status
        }))
      });

    } catch (error) {
      addResult('Track Data', 'ERROR', error.message);
    }
  };

  const testStorageConnectivity = async () => {
    try {
      addResult('Storage Test', 'TESTING', 'Testing storage bucket access...');

      // Test both buckets
      const buckets = ['audio', 'neuralpositivemusic'];
      const results = {};

      for (const bucket of buckets) {
        try {
          const { data: files, error } = await supabase.storage
            .from(bucket)
            .list('', { limit: 10 });

          if (error) {
            results[bucket] = { status: 'ERROR', message: error.message };
          } else {
            const audioFiles = files?.filter(f => f.name.match(/\.(mp3|wav|m4a|flac|ogg)$/i)) || [];
            results[bucket] = { 
              status: 'SUCCESS', 
              totalFiles: files?.length || 0,
              audioFiles: audioFiles.length,
              sampleFiles: audioFiles.slice(0, 5).map(f => f.name)
            };
          }
        } catch (err) {
          results[bucket] = { status: 'ERROR', message: err.message };
        }
      }

      addResult('Storage Test', 'COMPLETE', 'Storage bucket test finished', results);

    } catch (error) {
      addResult('Storage Test', 'ERROR', error.message);
    }
  };

  const findDataMismatches = async () => {
    try {
      addResult('Data Validation', 'CHECKING', 'Looking for mismatches between database and storage...');

      // Get tracks with storage info
      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('id, title, storage_bucket, storage_key, audio_status')
        .not('storage_key', 'is', null)
        .limit(15);

      if (error) {
        addResult('Data Validation', 'ERROR', error.message);
        return;
      }

      const results = [];
      let validCount = 0;
      let errorCount = 0;

      for (const track of tracks) {
        try {
          // Generate URL and test it
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          const encodedStorageKey = track.storage_key.split('/').map(encodeURIComponent).join('/');
          const testUrl = `${supabaseUrl}/storage/v1/object/public/${track.storage_bucket}/${encodedStorageKey}`;
          
          // Test with HEAD request
          const response = await fetch(testUrl, { method: 'HEAD' });
          
          if (response.ok) {
            validCount++;
            results.push({
              track: { id: track.id, title: track.title },
              status: 'VALID',
              url: testUrl,
              httpStatus: response.status
            });
          } else {
            errorCount++;
            results.push({
              track: { id: track.id, title: track.title },
              status: 'BROKEN',
              url: testUrl,
              httpStatus: response.status,
              issue: `HTTP ${response.status}`
            });
          }
        } catch (err) {
          errorCount++;
          results.push({
            track: { id: track.id, title: track.title },
            status: 'ERROR',
            error: err.message
          });
        }
      }

      addResult('Data Validation', 'COMPLETE', 
        `Validated ${tracks.length} tracks: ${validCount} valid, ${errorCount} broken/error`, 
        {
          summary: { total: tracks.length, valid: validCount, broken: errorCount },
          results: results
        }
      );

    } catch (error) {
      addResult('Data Validation', 'ERROR', error.message);
    }
  };

  const analyzeStorageKeyPatterns = async () => {
    try {
      addResult('Pattern Analysis', 'ANALYZING', 'Analyzing storage key patterns across all tracks...');

      // Get larger sample for pattern analysis
      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('storage_bucket, storage_key, audio_status')
        .not('storage_key', 'is', null)
        .limit(100);

      if (error) {
        addResult('Pattern Analysis', 'ERROR', error.message);
        return;
      }

      // Analyze patterns
      const patterns = {
        withTracks: tracks.filter(t => t.storage_key?.startsWith('tracks/')).length,
        withoutTracks: tracks.filter(t => t.storage_key && !t.storage_key.startsWith('tracks/')).length,
        hasExtension: tracks.filter(t => t.storage_key?.match(/\.(mp3|wav|m4a|flac|ogg)$/i)).length,
        noExtension: tracks.filter(t => t.storage_key && !t.storage_key.match(/\.(mp3|wav|m4a|flac|ogg)$/i)).length,
        audioBucket: tracks.filter(t => t.storage_bucket === 'audio').length,
        neuralpositivemusic: tracks.filter(t => t.storage_bucket === 'neuralpositivemusic').length,
        workingStatus: tracks.filter(t => t.audio_status === 'working').length,
        brokenStatus: tracks.filter(t => t.audio_status !== 'working').length
      };

      // Common prefixes
      const prefixes = {};
      tracks.forEach(track => {
        if (track.storage_key) {
          const parts = track.storage_key.split('/');
          const prefix = parts.length > 1 ? parts[0] : 'ROOT';
          prefixes[prefix] = (prefixes[prefix] || 0) + 1;
        }
      });

      addResult('Pattern Analysis', 'COMPLETE', `Analyzed ${tracks.length} storage keys`, {
        patterns,
        commonPrefixes: prefixes,
        sampleKeys: tracks.slice(0, 10).map(t => ({
          bucket: t.storage_bucket,
          key: t.storage_key,
          status: t.audio_status
        }))
      });

    } catch (error) {
      addResult('Pattern Analysis', 'ERROR', error.message);
    }
  };

  const runFullInspection = async () => {
    setLoading(true);
    setResults([]);

    addResult('Inspection', 'STARTING', 'Running comprehensive database inspection...');

    await inspectTrackData();
    await testStorageConnectivity();
    await analyzeStorageKeyPatterns();
    await findDataMismatches();

    addResult('Inspection', 'COMPLETE', 'Full database inspection finished');
    setLoading(false);
  };

  const clearResults = () => setResults([]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema Inspector
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Inspect your database schema and track metadata mapping to identify storage inconsistencies
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-4">
            <Button onClick={runFullInspection} disabled={loading}>
              {loading ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2 animate-spin" />
                  Inspecting...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Run Full Inspection
                </>
              )}
            </Button>
            <Button onClick={inspectTrackData} variant="outline" disabled={loading}>
              Check Track Data
            </Button>
            <Button onClick={testStorageConnectivity} variant="outline" disabled={loading}>
              Test Storage
            </Button>
            <Button onClick={findDataMismatches} variant="outline" disabled={loading}>
              Find Mismatches
            </Button>
            <Button onClick={clearResults} variant="destructive" size="sm">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-muted-foreground">No inspection run yet. Click "Run Full Inspection" to start.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="p-3 border rounded text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      {result.status === 'COMPLETE' || result.status === 'FOUND' || result.status === 'ANALYZED' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : result.status === 'ERROR' ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium">{result.section}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                  </div>
                  <div className={`text-xs mb-1 ${
                    result.status === 'COMPLETE' || result.status === 'FOUND' || result.status === 'ANALYZED' ? 'text-green-600' :
                    result.status === 'ERROR' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {result.status}: {result.details}
                  </div>
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Show Data</summary>
                      <pre className="mt-1 p-2 bg-muted rounded overflow-x-auto text-xs">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}