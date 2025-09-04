import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MigrationStep {
  step: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: any;
  error?: string;
}

interface MigrationResults {
  success: boolean;
  message: string;
  migrationSteps: MigrationStep[];
  summary: {
    migrationTimestamp: string;
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    tracksAnalyzed: number;
    issuesFound: number;
    tracksFixed: number;
    duplicatesResolved: number;
    tracksVerified: number;
    orphanedFiles: number;
    readyForAnalysis: boolean;
  };
}

const DataMigrationPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MigrationResults | null>(null);
  const { toast } = useToast();

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStepTitle = (step: string) => {
    const titles: { [key: string]: string } = {
      'analyze_storage_issues': 'Analyze Storage Issues',
      'fix_storage_keys': 'Fix Storage Keys',
      'resolve_duplicates': 'Resolve Duplicates',
      'organize_verified_files': 'Organize Verified Files',
      'cleanup_orphaned_files': 'Identify Orphaned Files'
    };
    return titles[step] || step;
  };

  const runMigration = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      toast({
        title: "Starting Migration",
        description: "Data migration and cleanup process initiated...",
      });

      const { data, error } = await supabase.functions.invoke('data-migration', {
        body: { action: 'migrate' }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      if (data.success) {
        toast({
          title: "Migration Complete",
          description: `Successfully processed ${data.summary.tracksAnalyzed} tracks with ${data.summary.completedSteps}/${data.summary.totalSteps} steps completed.`,
        });
      }

    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const progressPercentage = results 
    ? (results.summary.completedSteps / results.summary.totalSteps) * 100 
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Data Migration & Storage Cleanup
        </CardTitle>
        <CardDescription>
          Organize audio files, fix storage issues, resolve duplicates, and prepare data for analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Migration Controls */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={runMigration} 
            disabled={isRunning}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {isRunning ? 'Running Migration...' : 'Start Data Migration'}
          </Button>
          
          {results && (
            <Badge variant={results.summary.readyForAnalysis ? "default" : "secondary"}>
              {results.summary.readyForAnalysis ? "Ready for Analysis" : "Issues Remain"}
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        {results && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Migration Progress</span>
              <span>{results.summary.completedSteps}/{results.summary.totalSteps} steps completed</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        )}

        {/* Migration Steps */}
        {results && (
          <div className="space-y-3">
            <h3 className="font-semibold">Migration Steps</h3>
            <div className="space-y-2">
              {results.migrationSteps.map((step, index) => (
                <div key={step.step} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStepIcon(step.status)}
                    <span className="font-medium">{getStepTitle(step.step)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {step.results && step.status === 'completed' && (
                      <span>
                        {Object.entries(step.results).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </span>
                    )}
                    {step.error && (
                      <span className="text-red-500">{step.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        {results?.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/10 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{results.summary.tracksAnalyzed}</div>
              <div className="text-sm text-muted-foreground">Tracks Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.summary.tracksFixed}</div>
              <div className="text-sm text-muted-foreground">Issues Fixed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.summary.duplicatesResolved}</div>
              <div className="text-sm text-muted-foreground">Duplicates Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{results.summary.orphanedFiles}</div>
              <div className="text-sm text-muted-foreground">Orphaned Files</div>
            </div>
          </div>
        )}

        {/* Migration Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Fixes problematic storage key characters and formatting</p>
          <p>• Resolves duplicate storage path conflicts</p>
          <p>• Organizes verified files for analysis</p>
          <p>• Identifies orphaned files for manual review</p>
          <p>• Prepares data structure for audio analysis pipeline</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataMigrationPanel;