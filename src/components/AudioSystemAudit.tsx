import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { runCompleteAudit, AudioDataAuditResult } from '@/utils/audioDataAudit';
import { Database, FileAudio, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AuditResults {
  auditResults: AudioDataAuditResult;
  storageResults: Array<{
    track: any;
    testResults: Array<{
      url: string;
      status: number;
      accessible: boolean;
    }>;
  }>;
}

export const AudioSystemAudit: React.FC = () => {
  const [results, setResults] = useState<AuditResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);
    
    try {
      const auditResults = await runCompleteAudit();
      setResults(auditResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed');
      console.error('Audit error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Audio System Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This audit will systematically analyze your audio database and storage to identify 
              inconsistencies causing 400 errors. It will check what buckets and paths are actually 
              in your database vs what files exist in storage.
            </p>
            
            <Button 
              onClick={runAudit} 
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2 animate-spin" />
                  Running Comprehensive Audit...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Run Complete Audio Audit
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 border border-destructive rounded-md bg-destructive/5">
                <p className="text-sm text-destructive">Error: {error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Database Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Database Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Storage Bucket Distribution</h4>
                <div className="space-y-2">
                  {results.auditResults.keyPrefixStats.slice(0, 10).map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-mono text-sm">
                        {stat.storage_bucket}/{stat.key_prefix}*
                      </span>
                      <Badge variant="secondary">{stat.count} tracks</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Reality Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5" />
                Storage Accessibility Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.storageResults.map((result, index) => {
                  const workingUrls = result.testResults.filter(test => test.accessible);
                  const hasWorkingUrl = workingUrls.length > 0;
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {hasWorkingUrl ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{result.track.title}</span>
                        </div>
                        <Badge variant={hasWorkingUrl ? "default" : "destructive"}>
                          {workingUrls.length}/{result.testResults.length} URLs work
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="text-muted-foreground">
                          DB: {result.track.storage_bucket}/{result.track.storage_key}
                        </div>
                        
                        {hasWorkingUrl && (
                          <div className="text-green-600 font-mono break-all">
                            ✅ Working: {workingUrls[0].url}
                          </div>
                        )}
                        
                        <details className="mt-2">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            Show all test results
                          </summary>
                          <ul className="mt-2 space-y-1">
                            {result.testResults.map((test, testIndex) => (
                              <li key={testIndex} className="font-mono text-xs break-all">
                                <span className={test.accessible ? 'text-green-600' : 'text-red-600'}>
                                  {test.accessible ? '✅' : '❌'} {test.status}
                                </span>
                                {' - '}
                                <span className="text-muted-foreground">{test.url}</span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-medium">Next Steps:</h4>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Review the working URLs above to identify the correct pattern</li>
                    <li>Run database cleanup to standardize all tracks to use the working pattern</li>
                    <li>Implement a single, authoritative URL generation function</li>
                    <li>Test music playback to confirm fixes</li>
                  </ol>
                </div>
                
                <div className="p-3 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                  <h4 className="font-medium">Common Issues Found:</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Database records point to wrong storage bucket</li>
                    <li>Inconsistent use of "tracks/" prefix in storage keys</li>
                    <li>Files moved between buckets but database not updated</li>
                    <li>Special characters in filenames not properly encoded</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AudioSystemAudit;