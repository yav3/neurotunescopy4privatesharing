import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileText, CheckCircle, XCircle, AlertTriangle, PlayCircle, PauseCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NormalizationResult {
  id: string;
  old_name: string;
  new_name: string;
  status: string;
  error?: string;
  action: string;
}

interface NormalizationSummary {
  bucket: string;
  mode: string;
  total_processed: number;
  successful: number;
  failed: number;
  results: NormalizationResult[];
}

interface BucketStatus {
  bucket: string;
  total_files: number;
  files_needing_repair: number;
  files_repaired: number;
  status: 'pending' | 'analyzing' | 'ready' | 'processing' | 'completed' | 'error';
  error?: string;
}

// All audio buckets in the system
const AUDIO_BUCKETS = [
  'neuralpositivemusic',
  'audio',
  'ENERGYBOOST', 
  'focus-music',
  'opera',
  'samba',
  'HIIT',
  'Chopin',
  'classicalfocus',
  'newageworldstressanxietyreduction',
  'moodboostremixesworlddance',
  'pop',
  'countryandamericana',
  'gentleclassicalforpain',
  'sonatasforstress',
  'painreducingworld',
  'NewAgeandWorldFocus'
];

export const StorageNormalizer = () => {
  const [bucketName, setBucketName] = useState('sonatasforstress');
  const [dryRun, setDryRun] = useState(true);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NormalizationSummary | null>(null);
  const [repairStatus, setRepairStatus] = useState<any>(null);
  
  // Bulk operations state
  const [bulkMode, setBulkMode] = useState(false);
  const [bucketStatuses, setBucketStatuses] = useState<Record<string, BucketStatus>>({});
  const [isBulkAnalyzing, setIsBulkAnalyzing] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [currentProcessingBucket, setCurrentProcessingBucket] = useState<string | null>(null);

  const analyzeFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('populate_bucket_repair_map', {
        _bucket_name: bucketName
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: `Found ${data[0]?.total_unsafe_keys || 0} files needing normalization`,
      });

      // Get detailed status
      await getRepairStatus();
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRepairStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('get_bucket_repair_status', {
        _bucket_name: bucketName
      });

      if (error) throw error;
      setRepairStatus(data[0]);
    } catch (error) {
      console.error('Status fetch error:', error);
    }
  };

  const normalizeFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('normalize-storage-files', {
        body: {
          bucket_name: bucketName,
          dry_run: dryRun,
          limit: limit
        }
      });

      if (error) throw error;

      setResults(data);
      
      toast({
        title: dryRun ? "Dry Run Complete" : "Normalization Complete",
        description: `Processed ${data.total_processed} files. ${data.successful} successful, ${data.failed} failed.`,
      });

      // Refresh status after operation
      await getRepairStatus();
    } catch (error) {
      console.error('Normalization error:', error);
      toast({
        title: "Normalization Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk operations
  const analyzeAllBuckets = async () => {
    setIsBulkAnalyzing(true);
    const initialStatuses: Record<string, BucketStatus> = {};
    
    // Initialize all buckets as pending
    AUDIO_BUCKETS.forEach(bucket => {
      initialStatuses[bucket] = {
        bucket,
        total_files: 0,
        files_needing_repair: 0,
        files_repaired: 0,
        status: 'pending'
      };
    });
    setBucketStatuses(initialStatuses);

    // Process each bucket
    for (const bucket of AUDIO_BUCKETS) {
      setBucketStatuses(prev => ({
        ...prev,
        [bucket]: { ...prev[bucket], status: 'analyzing' }
      }));

      try {
        // Populate repair map
        const { data: analyzeData, error: analyzeError } = await supabase.rpc('populate_bucket_repair_map', {
          _bucket_name: bucket
        });

        if (analyzeError) throw analyzeError;

        // Get detailed status
        const { data: statusData, error: statusError } = await supabase.rpc('get_bucket_repair_status', {
          _bucket_name: bucket
        });

        if (statusError) throw statusError;

        const status = statusData[0];
        setBucketStatuses(prev => ({
          ...prev,
          [bucket]: {
            bucket,
            total_files: status.total_files,
            files_needing_repair: status.files_needing_repair,
            files_repaired: status.files_repaired,
            status: status.files_needing_repair > 0 ? 'ready' : 'completed'
          }
        }));

      } catch (error) {
        console.error(`Error analyzing bucket ${bucket}:`, error);
        setBucketStatuses(prev => ({
          ...prev,
          [bucket]: { 
            ...prev[bucket], 
            status: 'error', 
            error: error.message 
          }
        }));
      }

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsBulkAnalyzing(false);
    toast({
      title: "Bulk Analysis Complete",
      description: `Analyzed ${AUDIO_BUCKETS.length} buckets`,
    });
  };

  const processAllBuckets = async () => {
    setIsBulkProcessing(true);
    let totalProcessed = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;

    // Get buckets that need processing
    const bucketsToProcess = Object.values(bucketStatuses)
      .filter(status => status.status === 'ready' && status.files_needing_repair > 0)
      .map(status => status.bucket);

    for (const bucket of bucketsToProcess) {
      setCurrentProcessingBucket(bucket);
      setBucketStatuses(prev => ({
        ...prev,
        [bucket]: { ...prev[bucket], status: 'processing' }
      }));

      try {
        const { data, error } = await supabase.functions.invoke('normalize-storage-files', {
          body: {
            bucket_name: bucket,
            dry_run: dryRun,
            limit: 50 // Process more files per bucket in bulk mode
          }
        });

        if (error) throw error;

        totalProcessed += data.total_processed;
        totalSuccessful += data.successful;
        totalFailed += data.failed;

        setBucketStatuses(prev => ({
          ...prev,
          [bucket]: { 
            ...prev[bucket], 
            status: data.failed === 0 ? 'completed' : 'error',
            error: data.failed > 0 ? `${data.failed} files failed` : undefined
          }
        }));

      } catch (error) {
        console.error(`Error processing bucket ${bucket}:`, error);
        setBucketStatuses(prev => ({
          ...prev,
          [bucket]: { 
            ...prev[bucket], 
            status: 'error', 
            error: error.message 
          }
        }));
        totalFailed++;
      }

      // Delay between buckets
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setCurrentProcessingBucket(null);
    setIsBulkProcessing(false);
    
    toast({
      title: dryRun ? "Bulk Preview Complete" : "Bulk Normalization Complete",
      description: `Processed ${totalProcessed} files across ${bucketsToProcess.length} buckets. ${totalSuccessful} successful, ${totalFailed} failed.`,
    });
  };

  const getBucketStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'ready':
        return <PlayCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <PauseCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'would_rename':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Storage File Normalizer
            <div className="flex items-center space-x-2">
              <Label htmlFor="bulk-mode" className="text-sm">Bulk Mode</Label>
              <Switch
                id="bulk-mode"
                checked={bulkMode}
                onCheckedChange={setBulkMode}
              />
            </div>
          </CardTitle>
          <CardDescription>
            {bulkMode 
              ? 'Normalize file names across all audio buckets automatically.'
              : 'Normalize file names in individual Supabase storage buckets to ensure consistent, safe naming conventions.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bulkMode ? (
            // Bulk mode interface
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label htmlFor="dryrun-bulk">Operation Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dryrun-bulk"
                      checked={dryRun}
                      onCheckedChange={setDryRun}
                    />
                    <Label htmlFor="dryrun-bulk" className="text-sm text-muted-foreground">
                      {dryRun ? 'Preview mode (safe)' : 'Live changes (DESTRUCTIVE)'}
                    </Label>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {AUDIO_BUCKETS.length} buckets total
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={analyzeAllBuckets} 
                  disabled={isBulkAnalyzing || isBulkProcessing}
                  variant="outline"
                  size="lg"
                >
                  {isBulkAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  Analyze All Buckets
                </Button>
                <Button 
                  onClick={processAllBuckets} 
                  disabled={isBulkAnalyzing || isBulkProcessing || Object.keys(bucketStatuses).length === 0}
                  variant={dryRun ? "secondary" : "default"}
                  size="lg"
                >
                  {isBulkProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {dryRun ? 'Preview All Changes' : 'Normalize All Buckets'}
                </Button>
              </div>

              {currentProcessingBucket && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium">Currently processing: {currentProcessingBucket}</div>
                  <Progress value={
                    (Object.values(bucketStatuses).filter(s => s.status === 'completed').length / 
                     Object.values(bucketStatuses).filter(s => s.files_needing_repair > 0).length) * 100
                  } className="mt-2" />
                </div>
              )}
            </div>
          ) : (
            // Single bucket mode interface  
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bucket">Bucket Name</Label>
                  <Input
                    id="bucket"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    placeholder="Enter bucket name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">File Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 10)}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dryrun">Dry Run Mode</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dryrun"
                      checked={dryRun}
                      onCheckedChange={setDryRun}
                    />
                    <Label htmlFor="dryrun" className="text-sm text-muted-foreground">
                      {dryRun ? 'Simulation only' : 'Live changes'}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={analyzeFiles} 
                  disabled={isLoading || !bucketName}
                  variant="outline"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  Analyze Files
                </Button>
                <Button 
                  onClick={normalizeFiles} 
                  disabled={isLoading || !bucketName}
                  variant={dryRun ? "secondary" : "default"}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {dryRun ? 'Preview Changes' : 'Normalize Files'}
                </Button>
                <Button 
                  onClick={getRepairStatus} 
                  disabled={isLoading}
                  variant="ghost"
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk status overview */}
      {bulkMode && Object.keys(bucketStatuses).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Processing Status</CardTitle>
            <CardDescription>
              Status of all audio buckets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AUDIO_BUCKETS.map(bucket => {
                const status = bucketStatuses[bucket];
                if (!status) return null;
                
                return (
                  <div key={bucket} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{bucket}</span>
                      {getBucketStatusIcon(status.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{status.total_files}</div>
                        <div className="text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600">{status.files_needing_repair}</div>
                        <div className="text-muted-foreground">Need Fix</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{status.files_repaired}</div>
                        <div className="text-muted-foreground">Fixed</div>
                      </div>
                    </div>
                    {status.error && (
                      <div className="text-red-500 text-xs truncate" title={status.error}>
                        {status.error}
                      </div>
                    )}
                    <Badge variant={status.status === 'completed' ? 'default' : 
                                   status.status === 'error' ? 'destructive' : 'secondary'} 
                           className="w-full justify-center text-xs">
                      {status.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {repairStatus && !bulkMode && (
        <Card>
          <CardHeader>
            <CardTitle>Repair Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{repairStatus.total_files}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{repairStatus.files_needing_repair}</div>
                <div className="text-sm text-muted-foreground">Need Repair</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{repairStatus.files_repaired}</div>
                <div className="text-sm text-muted-foreground">Repaired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {Math.round((repairStatus.files_repaired / (repairStatus.total_files || 1)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            {repairStatus.sample_repairs && repairStatus.sample_repairs.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Sample Repairs:</h4>
                <div className="space-y-2">
                  {repairStatus.sample_repairs.slice(0, 3).map((repair: any, index: number) => (
                    <div key={index} className="text-sm bg-muted p-2 rounded">
                      <div className="font-mono text-xs">
                        <span className="text-red-600">{repair.old_name}</span>
                        <span className="mx-2">→</span>
                        <span className="text-green-600">{repair.new_name}</span>
                      </div>
                      <Badge variant={repair.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                        {repair.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results.mode === 'dry_run' ? 'Preview Results' : 'Normalization Results'}
            </CardTitle>
            <CardDescription>
              Bucket: {results.bucket} | Processed: {results.total_processed} | 
              Success: {results.successful} | Failed: {results.failed}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(result.status)}
                      <Badge variant={result.status === 'success' || result.status === 'would_rename' ? 'default' : 'destructive'}>
                        {result.action}
                      </Badge>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      <div className="truncate">{result.old_name}</div>
                      <div className="text-green-600 truncate">→ {result.new_name}</div>
                    </div>
                    {result.error && (
                      <div className="text-red-500 text-xs mt-1">{result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};