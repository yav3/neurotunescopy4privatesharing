import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { compileAudioData, getAudioBucketStats } from '@/utils/compileAudioData';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music, Database, TrendingUp } from 'lucide-react';

interface AudioStats {
  total: number;
  hasBPM: number;
  hasCamelot: number;
  hasAnalysis: number;
  working: number;
  bpmCoverage: number;
  camelotCoverage: number;
  analysisCoverage: number;
}

export const AudioDataCompiler = () => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [stats, setStats] = useState<AudioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadStats = async () => {
    try {
      const audioStats = await getAudioBucketStats();
      setStats(audioStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 10 seconds during compilation
    const interval = setInterval(() => {
      if (isCompiling) {
        loadStats();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isCompiling]);

  const handleCompile = async () => {
    setIsCompiling(true);
    
    try {
      const result = await compileAudioData();
      
      if (result.success) {
        toast({
          title: "Compilation Started",
          description: result.message,
        });
        
        // Start polling for updates
        const pollInterval = setInterval(async () => {
          await loadStats();
          
          // Stop polling when compilation is likely complete
          const currentStats = await getAudioBucketStats();
          if (currentStats && 
              currentStats.bpmCoverage >= 98 && 
              currentStats.camelotCoverage >= 98 && 
              currentStats.analysisCoverage >= 98) {
            clearInterval(pollInterval);
            setIsCompiling(false);
            toast({
              title: "Compilation Complete",
              description: "All audio tracks have been analyzed successfully!",
            });
          }
        }, 5000);
        
        // Stop polling after 10 minutes max
        setTimeout(() => {
          clearInterval(pollInterval);
          setIsCompiling(false);
        }, 600000);
        
      } else {
        toast({
          title: "Compilation Failed",
          description: result.message,
          variant: "destructive",
        });
        setIsCompiling(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start compilation process",
        variant: "destructive",
      });
      setIsCompiling(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading audio data statistics...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Audio Data Compiler</CardTitle>
          </div>
          <CardDescription>
            Comprehensive analysis system for all audio bucket tracks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">BPM Coverage</span>
                  <Badge variant={stats.bpmCoverage >= 90 ? "default" : "secondary"}>
                    {stats.hasBPM}/{stats.total}
                  </Badge>
                </div>
                <Progress value={stats.bpmCoverage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {stats.bpmCoverage}% complete
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Camelot Keys</span>
                  <Badge variant={stats.camelotCoverage >= 90 ? "default" : "secondary"}>
                    {stats.hasCamelot}/{stats.total}
                  </Badge>
                </div>
                <Progress value={stats.camelotCoverage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {stats.camelotCoverage}% complete
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Full Analysis</span>
                  <Badge variant={stats.analysisCoverage >= 90 ? "default" : "secondary"}>
                    {stats.hasAnalysis}/{stats.total}
                  </Badge>
                </div>
                <Progress value={stats.analysisCoverage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {stats.analysisCoverage}% complete
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button
              onClick={handleCompile}
              disabled={isCompiling}
              className="min-w-[200px]"
            >
              {isCompiling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Compiling Data...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Compile Audio Data
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={loadStats}
              disabled={isCompiling}
            >
              Refresh Stats
            </Button>
          </div>

          {stats && (
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                <span>Total tracks in audio bucket: {stats.total}</span>
              </div>
              <div>Working tracks: {stats.working}</div>
              {isCompiling && (
                <div className="text-primary font-medium">
                  ⚡ Background compilation in progress...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {stats && (stats.bpmCoverage < 100 || stats.camelotCoverage < 100 || stats.analysisCoverage < 100) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Missing Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.bpmCoverage < 100 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {stats.total - stats.hasBPM}
                  </div>
                  <div className="text-sm text-muted-foreground">Missing BPM</div>
                </div>
              )}
              
              {stats.camelotCoverage < 100 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {stats.total - stats.hasCamelot}
                  </div>
                  <div className="text-sm text-muted-foreground">Missing Camelot</div>
                </div>
              )}
              
              {stats.analysisCoverage < 100 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {stats.total - stats.hasAnalysis}
                  </div>
                  <div className="text-sm text-muted-foreground">Missing Analysis</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};