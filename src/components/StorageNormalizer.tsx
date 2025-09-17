import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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

export const StorageNormalizer = () => {
  const [bucketName, setBucketName] = useState('sonatasforstress');
  const [dryRun, setDryRun] = useState(true);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<NormalizationSummary | null>(null);
  const [repairStatus, setRepairStatus] = useState<any>(null);

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Storage File Normalizer</CardTitle>
          <CardDescription>
            Normalize file names in Supabase storage buckets to ensure consistent, safe naming conventions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex gap-4">
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
        </CardContent>
      </Card>

      {repairStatus && (
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