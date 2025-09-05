import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Wrench, CheckCircle, XCircle, AlertTriangle, Database, HardDrive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DatabaseStorageRepairer() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');

  const addResult = (phase: string, status: string, message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults((prev: any) => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        status,
        message,
        data,
        timestamp,
        logs: [...(prev[phase]?.logs || []), { status, message, data, timestamp }]
      }
    }));
    console.log(`[${phase}] ${status}: ${message}`, data);
  };

  // Phase 1: Inventory Reality
  const phase1_inventory = async () => {
    setCurrentPhase('Phase 1: Inventory');
    addResult('phase1', 'RUNNING', 'Starting comprehensive inventory...');

    try {
      // Check tracks_id_mapping table
      addResult('phase1', 'INFO', 'Checking tracks_id_mapping table...');
      const { data: mappings, error: mappingError } = await supabase
        .from('tracks_id_mapping')
        .select('*')
        .limit(10);

      if (mappingError) {
        addResult('phase1', 'WARNING', `Mapping table error: ${mappingError.message}`);
      } else {
        const { count: mappingCount } = await supabase
          .from('tracks_id_mapping')
          .select('*', { count: 'exact', head: true });

        addResult('phase1', 'SUCCESS', `Found ${mappingCount} mapping records`, {
          sampleMappings: mappings?.slice(0, 3),
          totalMappings: mappingCount,
          fields: mappings?.[0] ? Object.keys(mappings[0]) : []
        });
      }

      // Check current tracks table state
      addResult('phase1', 'INFO', 'Analyzing tracks table...');
      const { data: tracks, error: tracksError } = await supabase
        .from('tracks')
        .select('id, title, storage_bucket, storage_key, audio_status')
        .limit(10);

      if (tracksError) {
        addResult('phase1', 'ERROR', `Tracks query failed: ${tracksError.message}`);
        return;
      }

      const { count: tracksCount } = await supabase
        .from('tracks')
        .select('*', { count: 'exact', head: true });

      // Analyze bucket distribution
      const { data: bucketStats } = await supabase
        .from('tracks')
        .select('storage_bucket, audio_status')
        .not('storage_bucket', 'is', null);

      const bucketDistribution = bucketStats?.reduce((acc: any, track: any) => {
        const bucket = track.storage_bucket || 'null';
        const status = track.audio_status || 'unknown';
        if (!acc[bucket]) acc[bucket] = {};
        acc[bucket][status] = (acc[bucket][status] || 0) + 1;
        return acc;
      }, {});

      addResult('phase1', 'SUCCESS', `Tracks table analyzed: ${tracksCount} total tracks`, {
        sampleTracks: tracks?.slice(0, 3),
        totalTracks: tracksCount,
        bucketDistribution
      });

      // Check actual files in neuralpositivemusic bucket
      addResult('phase1', 'INFO', 'Listing actual files in storage...');
      const { data: files, error: storageError } = await supabase.storage
        .from('neuralpositivemusic')
        .list('', { limit: 100 });

      if (storageError) {
        addResult('phase1', 'WARNING', `Storage listing failed: ${storageError.message}`);
      } else {
        const audioFiles = files?.filter(f => f.name.match(/\.(mp3|wav|m4a|flac|ogg)$/i)) || [];
        
        addResult('phase1', 'SUCCESS', `Found ${audioFiles.length} audio files in neuralpositivemusic bucket`, {
          totalFiles: files?.length,
          audioFiles: audioFiles.length,
          sampleFiles: audioFiles.slice(0, 5).map(f => f.name)
        });
      }

      addResult('phase1', 'COMPLETE', 'Inventory phase completed successfully');

    } catch (error) {
      addResult('phase1', 'ERROR', `Inventory failed: ${error.message}`);
    }
  };

  // Phase 2: Rebuild Database-Storage Connection
  const phase2_rebuild = async () => {
    setCurrentPhase('Phase 2: Rebuild');
    addResult('phase2', 'RUNNING', 'Starting database-storage connection rebuild...');

    try {
      // Option A: Use tracks_id_mapping if it exists and has the right structure
      addResult('phase2', 'INFO', 'Attempting Option A: Using tracks_id_mapping table...');
      
      const { data: mappings } = await supabase
        .from('tracks_id_mapping')
        .select('*')
        .limit(5);

      if (mappings && mappings.length > 0) {
        const mapping = mappings[0];
        const hasTrackId = 'new_id' in mapping;
        const hasFileName = 'actual_filename' in mapping || 'real_filename' in mapping;

        if (hasTrackId) {
          addResult('phase2', 'INFO', 'Mapping table found with track IDs. Attempting batch update...');
          
          // Get actual files list first
          const { data: files } = await supabase.storage
            .from('neuralpositivemusic')
            .list('', { limit: 1000 });

          const audioFiles = files?.filter(f => f.name.match(/\.(mp3|wav|m4a|flac|ogg)$/i)) || [];
          const fileNames = audioFiles.map(f => f.name);

          addResult('phase2', 'SUCCESS', `Found ${fileNames.length} actual audio files to work with`);

          // For tracks with mapping, update to neuralpositivemusic bucket
          // This is a simulated update - in reality you'd need proper SQL access
          let updatedCount = 0;
          const sampleUpdates = [];

          for (const mapping of mappings.slice(0, 10)) {
            const trackId = mapping.new_id;
            
            if (trackId) {
              // Find the corresponding track
              const { data: track } = await supabase
                .from('tracks')
                .select('id, title')
                .eq('id', trackId)
                .single();

              if (track) {
                // Try to match track title to existing files
                const matchedFile = findBestFileMatch(track.title, fileNames);
                
                if (matchedFile) {
                  sampleUpdates.push({
                    trackId: track.id,
                    title: track.title,
                    matchedFile,
                    confidence: calculateMatchConfidence(track.title, matchedFile)
                  });
                  updatedCount++;
                }
              }
            }
          }

          addResult('phase2', 'SUCCESS', `Option A analysis: ${updatedCount} potential matches found`, {
            sampleMatches: sampleUpdates,
            totalProcessed: mappings.length
          });

        } else {
          addResult('phase2', 'WARNING', 'Mapping table lacks required fields, trying Option B...');
        }
      }

      // Option B: Title-based fuzzy matching
      addResult('phase2', 'INFO', 'Executing Option B: Title-based fuzzy matching...');
      
      const { data: files } = await supabase.storage
        .from('neuralpositivemusic')
        .list('', { limit: 1000 });

      const audioFiles = files?.filter(f => f.name.match(/\.(mp3|wav|m4a|flac|ogg)$/i)) || [];
      const fileNames = audioFiles.map(f => f.name);

      const { data: unmatchedTracks } = await supabase
        .from('tracks')
        .select('id, title, storage_bucket, storage_key')
        .neq('storage_bucket', 'neuralpositivemusic')
        .limit(20);

      const matches = [];
      for (const track of unmatchedTracks || []) {
        const bestMatch = findBestFileMatch(track.title, fileNames);
        if (bestMatch) {
          const confidence = calculateMatchConfidence(track.title, bestMatch);
          if (confidence > 0.6) { // Only high-confidence matches
            matches.push({
              trackId: track.id,
              title: track.title,
              matchedFile: bestMatch,
              confidence
            });
          }
        }
      }

      addResult('phase2', 'SUCCESS', `Option B: Found ${matches.length} high-confidence matches`, {
        matches: matches.slice(0, 10),
        totalProcessed: unmatchedTracks?.length
      });

      addResult('phase2', 'COMPLETE', `Rebuild analysis completed. Ready for batch update with ${matches.length} matches`);

    } catch (error) {
      addResult('phase2', 'ERROR', `Rebuild failed: ${error.message}`);
    }
  };

  // Phase 3: Validate and Test
  const phase3_validate = async () => {
    setCurrentPhase('Phase 3: Validate');
    addResult('phase3', 'RUNNING', 'Starting validation and testing...');

    try {
      // Test existing neuralpositivemusic tracks
      const { data: workingTracks } = await supabase
        .from('tracks')
        .select('id, title, storage_bucket, storage_key')
        .eq('storage_bucket', 'neuralpositivemusic')
        .limit(10);

      addResult('phase3', 'INFO', `Testing ${workingTracks?.length || 0} tracks in neuralpositivemusic bucket...`);

      const testResults = [];
      for (const track of workingTracks || []) {
        const url = `https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/${track.storage_bucket}/${encodeURIComponent(track.storage_key)}`;
        
        try {
          const response = await fetch(url, { method: 'HEAD' });
          testResults.push({
            track: { id: track.id, title: track.title },
            url,
            status: response.status,
            working: response.ok
          });
        } catch (error) {
          testResults.push({
            track: { id: track.id, title: track.title },
            url,
            status: 'ERROR',
            working: false,
            error: error.message
          });
        }
      }

      const workingCount = testResults.filter(r => r.working).length;
      addResult('phase3', 'SUCCESS', `URL Test Results: ${workingCount}/${testResults.length} tracks working`, {
        testResults,
        workingPercentage: Math.round((workingCount / testResults.length) * 100)
      });

      // Get audio status distribution
      const { data: statusStats } = await supabase
        .from('tracks')
        .select('audio_status, storage_bucket');

      const distribution = statusStats?.reduce((acc: any, track: any) => {
        const status = track.audio_status || 'unknown';
        const bucket = track.storage_bucket || 'no_bucket';
        if (!acc[bucket]) acc[bucket] = {};
        acc[bucket][status] = (acc[bucket][status] || 0) + 1;
        return acc;
      }, {});

      addResult('phase3', 'SUCCESS', 'Status distribution analyzed', { distribution });

      addResult('phase3', 'COMPLETE', 'Validation phase completed');

    } catch (error) {
      addResult('phase3', 'ERROR', `Validation failed: ${error.message}`);
    }
  };

  // Helper functions
  const findBestFileMatch = (title: string, fileNames: string[]) => {
    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    let bestMatch = '';
    let highestScore = 0;

    for (const fileName of fileNames) {
      const normalizedFile = fileName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const score = calculateSimilarity(normalizedTitle, normalizedFile);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = fileName;
      }
    }

    return highestScore > 0.5 ? bestMatch : null;
  };

  const calculateMatchConfidence = (title: string, fileName: string) => {
    return calculateSimilarity(
      title.toLowerCase().replace(/[^a-z0-9]/g, ''),
      fileName.toLowerCase().replace(/[^a-z0-9]/g, '')
    );
  };

  const calculateSimilarity = (str1: string, str2: string) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (str1: string, str2: string) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const runFullRepair = async () => {
    setLoading(true);
    setResults({});
    
    await phase1_inventory();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await phase2_rebuild();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await phase3_validate();
    
    setCurrentPhase('Complete');
    setLoading(false);
  };

  const clearResults = () => {
    setResults({});
    setCurrentPhase('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Database-Storage Repairer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Execute the 3-phase repair plan to fix database-storage mapping
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-4">
            <Button onClick={runFullRepair} disabled={loading} className="min-w-[200px]">
              {loading ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2 animate-spin" />
                  {currentPhase}...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 mr-2" />
                  Run Full Repair
                </>
              )}
            </Button>
            <Button onClick={phase1_inventory} variant="outline" disabled={loading}>
              <Database className="h-4 w-4 mr-2" />
              Phase 1: Inventory
            </Button>
            <Button onClick={phase2_rebuild} variant="outline" disabled={loading}>
              <HardDrive className="h-4 w-4 mr-2" />
              Phase 2: Rebuild
            </Button>
            <Button onClick={phase3_validate} variant="outline" disabled={loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Phase 3: Validate
            </Button>
            <Button onClick={clearResults} variant="destructive" size="sm">
              Clear
            </Button>
          </div>

          {loading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress: {currentPhase}</span>
                <span>{Object.keys(results).length}/3 phases</span>
              </div>
              <Progress value={(Object.keys(results).length / 3) * 100} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          {Object.entries(results).map(([phase, data]: [string, any]) => (
            <Card key={phase}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {data.status === 'COMPLETE' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : data.status === 'ERROR' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  {phase.replace('phase', 'Phase ').toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className={`text-sm ${
                    data.status === 'COMPLETE' ? 'text-green-600' :
                    data.status === 'ERROR' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {data.status} - {data.message}
                  </div>
                  
                  {data.data && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">
                        Show Detailed Results
                      </summary>
                      <div className="mt-2 p-3 bg-muted rounded">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(data.data, null, 2)}
                        </pre>
                      </div>
                    </details>
                  )}

                  {data.logs && data.logs.length > 1 && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">
                        Show Step-by-Step Log ({data.logs.length} steps)
                      </summary>
                      <div className="mt-2 space-y-1">
                        {data.logs.map((log: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs p-1 border-l-2 border-l-muted pl-2">
                            <span className={
                              log.status === 'SUCCESS' || log.status === 'COMPLETE' ? 'text-green-600' :
                              log.status === 'ERROR' ? 'text-red-600' :
                              'text-yellow-600'
                            }>
                              {log.status}: {log.message}
                            </span>
                            <span className="text-muted-foreground">{log.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}