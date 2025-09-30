import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';
import { qaAutomation, QAReport } from '@/utils/qaAutomation';
import { toast } from 'sonner';

interface QATestHistory {
  timestamp: string;
  duration: number;
  passed: number;
  failed: number;
  warnings: number;
}

export const QAAutomationMonitor: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [autoRunEnabled, setAutoRunEnabled] = useState(false);
  const [lastReport, setLastReport] = useState<QAReport | null>(null);
  const [history, setHistory] = useState<QATestHistory[]>([]);
  const [progress, setProgress] = useState(0);
  const [nextRunIn, setNextRunIn] = useState(300); // 5 minutes

  useEffect(() => {
    // Auto-run timer
    if (autoRunEnabled && !isRunning) {
      const timer = setInterval(() => {
        setNextRunIn(prev => {
          if (prev <= 1) {
            runQATests(true);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoRunEnabled, isRunning]);

  const runQATests = async (isAuto = false) => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      if (!isAuto) {
        toast.info('Running QA automation suite...');
      }
      
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 90));
      }, 500);

      const result = await qaAutomation.runFullQASuite();
      
      clearInterval(progressInterval);
      setProgress(100);
      setLastReport(result);
      
      // Add to history
      setHistory(prev => [
        {
          timestamp: new Date().toISOString(),
          duration: result.overview.duration,
          passed: result.overview.passed,
          failed: result.overview.failed,
          warnings: result.overview.warnings
        },
        ...prev.slice(0, 9) // Keep last 10 runs
      ]);
      
      if (result.overview.failed > 0) {
        toast.error(`QA Alert: ${result.overview.failed} tests failing`, {
          description: 'Immediate attention required'
        });
      } else if (result.overview.warnings > 0 && !isAuto) {
        toast.warning(`QA: ${result.overview.warnings} warnings found`);
      } else if (!isAuto) {
        toast.success('QA: All tests passing');
      }
      
    } catch (error) {
      toast.error('QA automation error: ' + error);
      console.error('QA Error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleAutoRun = () => {
    setAutoRunEnabled(!autoRunEnabled);
    setNextRunIn(300);
    if (!autoRunEnabled) {
      toast.success('Auto QA enabled: Running every 5 minutes');
    } else {
      toast.info('Auto QA disabled');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHealthScore = () => {
    if (!lastReport) return 0;
    const total = lastReport.overview.passed + lastReport.overview.failed;
    if (total === 0) return 100;
    return Math.round((lastReport.overview.passed / total) * 100);
  };

  const healthScore = getHealthScore();
  const healthColor = healthScore >= 90 ? 'text-success' : healthScore >= 70 ? 'text-warning' : 'text-destructive';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              QA Automation Monitor
            </CardTitle>
            <CardDescription>
              Continuous quality assurance with automated testing
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleAutoRun}
              variant={autoRunEnabled ? "default" : "outline"}
              size="sm"
            >
              {autoRunEnabled ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              Auto-Run
            </Button>
            <Button
              onClick={() => runQATests(false)}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              Run Now
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${healthColor}`}>
                  {healthScore}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  System Health
                </div>
              </div>
            </CardContent>
          </Card>

          {lastReport && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-success flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {lastReport.overview.passed}
                      </div>
                      <div className="text-sm text-muted-foreground">Tests Passing</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-destructive flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        {lastReport.overview.failed}
                      </div>
                      <div className="text-sm text-muted-foreground">Failing</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning flex items-center justify-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {lastReport.overview.warnings}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Warnings
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Running tests...</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Auto-run status */}
        {autoRunEnabled && !isRunning && (
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Next automated run in</span>
            </div>
            <Badge variant="secondary">{formatTime(nextRunIn)}</Badge>
          </div>
        )}

        {/* Recent Recommendations */}
        {lastReport && lastReport.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Action Items
            </div>
            <div className="space-y-2">
              {lastReport.recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test History Trend */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              Recent Test History
            </div>
            <div className="grid grid-cols-5 gap-2">
              {history.slice(0, 5).map((test, idx) => {
                const successRate = Math.round(
                  (test.passed / (test.passed + test.failed)) * 100
                );
                const color = successRate >= 90 ? 'bg-success' : successRate >= 70 ? 'bg-warning' : 'bg-destructive';
                
                return (
                  <div key={idx} className="text-center">
                    <div className={`h-16 ${color} rounded-t-lg flex items-end justify-center pb-2 text-white font-bold`}>
                      {successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(test.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold">{history.length}</div>
              <div className="text-xs text-muted-foreground">Total Runs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {Math.round(history.reduce((acc, h) => acc + h.duration, 0) / history.length / 1000)}s
              </div>
              <div className="text-xs text-muted-foreground">Avg Duration</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">
                {Math.round(history.reduce((acc, h) => {
                  const total = h.passed + h.failed;
                  return acc + (total > 0 ? (h.passed / total) * 100 : 0);
                }, 0) / history.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
