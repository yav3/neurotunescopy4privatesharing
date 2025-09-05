import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditResult {
  bucket: string;
  totalStorageFiles: number;
  totalDbTracks: number;
  missingInStorage: number;
  missingInDb: number;
  sampleStorageFiles: string[];
  sampleDbKeys: string[];
  sampleMismatches: Array<{
    dbKey: string;
    possibleMatches: string[];
  }>;
  firstFewMissingInStorage: string[];
  firstFewMissingInDb: string[];
}

export const StorageAudit: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('storage-audit', {
        body: { bucket: 'neuralpositivemusic', limit: 50 }
      });
      
      if (error) throw error;
      
      setResult(data);
    } catch (err) {
      console.error('Audit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run audit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Storage & Database Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Compare what audio files exist in storage vs what's recorded in the database.
          </p>
          
          <Button 
            onClick={runAudit} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Audit...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Run Storage Audit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Audit Results Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.totalStorageFiles}</div>
                  <div className="text-sm text-muted-foreground">Files in Storage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.totalDbTracks}</div>
                  <div className="text-sm text-muted-foreground">DB Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{result.missingInStorage}</div>
                  <div className="text-sm text-muted-foreground">Missing in Storage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{result.missingInDb}</div>
                  <div className="text-sm text-muted-foreground">Missing in DB</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mismatches */}
          {result.sampleMismatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sample Filename Mismatches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.sampleMismatches.map((mismatch, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="font-medium text-red-600 mb-2">
                        DB Key: {mismatch.dbKey}
                      </div>
                      {mismatch.possibleMatches.length > 0 ? (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Possible matches in storage:</div>
                          <ul className="text-sm space-y-1">
                            {mismatch.possibleMatches.map((match, matchIndex) => (
                              <li key={matchIndex} className="text-green-600 font-mono">
                                {match}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No similar files found in storage</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Files */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sample Storage Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm font-mono space-y-1 max-h-40 overflow-y-auto">
                  {result.sampleStorageFiles.map((file, index) => (
                    <li key={index} className="text-green-600">{file}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample DB Keys</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm font-mono space-y-1 max-h-40 overflow-y-auto">
                  {result.sampleDbKeys.map((key, index) => (
                    <li key={index} className="text-blue-600">{key}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};