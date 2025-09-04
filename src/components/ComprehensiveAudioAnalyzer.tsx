import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisReport {
  summary: {
    totalStorageFiles: number;
    totalDatabaseTracks: number;
    matchedTracks: number;
    unmatchedTracks: number;
    unmatchedFiles: number;
    updatesNeeded: number;
    updatesApplied: number;
    error?: boolean;
  };
  matches: Array<{
    trackId: string;
    title: string;
    currentStorageKey: string;
    newStorageKey: string;
    matchType: string;
    needsUpdate: boolean;
  }>;
  unmatchedTracks: Array<{
    trackId: string;
    title: string;
    currentStorageKey: string;
    currentStatus: string;
  }>;
  unmatchedFiles: Array<{
    name: string;
    size?: number;
    lastModified?: string;
  }>;
  updates: Array<{
    id: string;
    storage_key: string;
    audio_status: string;
    storage_bucket: string;
  }>;
}

export const ComprehensiveAudioAnalyzer: React.FC = () => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const runAnalysis = async (applyUpdates = false) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-audio-analyzer', {
        body: { applyUpdates }
      });

      if (error) throw error;
      setReport(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setReport({
        summary: { 
          error: true, 
          totalStorageFiles: 0, 
          totalDatabaseTracks: 0, 
          matchedTracks: 0, 
          unmatchedTracks: 0, 
          unmatchedFiles: 0, 
          updatesNeeded: 0, 
          updatesApplied: 0 
        },
        matches: [],
        unmatchedTracks: [],
        unmatchedFiles: [],
        updates: []
      });
    } finally {
      setIsAnalyzing(false);
      setIsApplying(false);
    }
  };

  const applyUpdates = async () => {
    setIsApplying(true);
    await runAnalysis(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Audio Analysis</CardTitle>
          <CardDescription>
            Complete cross-reference analysis between storage files and database records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => runAnalysis(false)} 
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Storage & Database'}
            </Button>
            
            {report && report.updates.length > 0 && (
              <Button 
                onClick={applyUpdates} 
                disabled={isApplying}
                className="bg-primary text-primary-foreground"
              >
                {isApplying ? 'Applying...' : `Apply ${report.updates.length} Updates`}
              </Button>
            )}
          </div>

          {report && (
            <div className="space-y-4">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Storage Files:</span>
                      <div className="text-lg">{report.summary.totalStorageFiles}</div>
                    </div>
                    <div>
                      <span className="font-medium">DB Tracks:</span>
                      <div className="text-lg">{report.summary.totalDatabaseTracks}</div>
                    </div>
                    <div>
                      <span className="font-medium">Matched:</span>
                      <div className="text-lg text-green-600">{report.summary.matchedTracks}</div>
                    </div>
                    <div>
                      <span className="font-medium">Unmatched:</span>
                      <div className="text-lg text-red-600">{report.summary.unmatchedTracks}</div>
                    </div>
                  </div>
                  
                  {report.summary.updatesApplied > 0 && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      ✅ {report.summary.updatesApplied} updates applied successfully
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Matches */}
              {report.matches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Matched Tracks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {report.matches.slice(0, 10).map((match, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{match.title}</div>
                            <div className="text-xs text-muted-foreground">{match.newStorageKey}</div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={match.matchType.includes('exact') ? 'default' : 'secondary'}>
                              {match.matchType}
                            </Badge>
                            {match.needsUpdate && <Badge variant="outline">needs update</Badge>}
                          </div>
                        </div>
                      ))}
                      {report.matches.length > 10 && (
                        <div className="text-center text-sm text-muted-foreground">
                          ... and {report.matches.length - 10} more matches
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Unmatched Tracks */}
              {report.unmatchedTracks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">Unmatched Database Tracks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {report.unmatchedTracks.slice(0, 10).map((track, index) => (
                        <div key={index} className="p-2 bg-red-50 rounded">
                          <div className="font-medium text-sm">{track.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Key: {track.currentStorageKey || 'none'} | Status: {track.currentStatus}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Unmatched Files */}
              {report.unmatchedFiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-600">Unmatched Storage Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {report.unmatchedFiles.map((file, index) => (
                        <div key={index} className="text-sm p-1 bg-yellow-50 rounded">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};