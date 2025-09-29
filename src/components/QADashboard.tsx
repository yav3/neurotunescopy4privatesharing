/**
 * QA Dashboard Component - Visual interface for automated testing
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { qaAutomation, QAReport, QATestResult } from '@/utils/qaAutomation';
import { Play, CheckCircle, XCircle, AlertTriangle, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export const QADashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<QAReport | null>(null);
  const [progress, setProgress] = useState(0);

  const runQATests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast.info('Starting comprehensive QA automation...');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 90));
      }, 500);

      const result = await qaAutomation.runFullQASuite();
      
      clearInterval(progressInterval);
      setProgress(100);
      setReport(result);
      
      const { passed, failed, warnings } = result.overview;
      if (failed > 0) {
        toast.error(`QA Complete: ${failed} tests failed, ${warnings} warnings`);
      } else if (warnings > 0) {
        toast.warning(`QA Complete: ${warnings} warnings found`);
      } else {
        toast.success(`QA Complete: All ${passed} tests passed!`);
      }
      
    } catch (error) {
      toast.error('QA automation failed: ' + error);
      console.error('QA Error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'FAIL': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'WARN': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'PASS' ? 'default' : status === 'FAIL' ? 'destructive' : 'secondary';
    return <Badge variant={variant}>{status}</Badge>;
  };

  const groupResultsByCategory = (results: QATestResult[]) => {
    return results.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    }, {} as Record<string, QATestResult[]>);
  };

  const getCategoryStats = (results: QATestResult[]) => {
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const warnings = results.filter(r => r.status === 'WARN').length;
    return { passed, failed, warnings, total: results.length };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            QA Automation Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive testing suite for the therapeutic music application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button 
              onClick={runQATests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Tests...' : 'Run Full QA Suite'}
            </Button>
            
            {isRunning && (
              <div className="flex-1 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Testing in progress... {Math.round(progress)}%
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>

          {report && (
            <div className="mt-6 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">{report.overview.passed}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-destructive">{report.overview.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-warning">{report.overview.warnings}</div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{(report.overview.duration / 1000).toFixed(1)}s</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              {report.recommendations.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">Recommendations:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {report.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Detailed Results */}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="details">Detailed Results</TabsTrigger>
                  <TabsTrigger value="failures">Failures Only</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="grid gap-4">
                    {Object.entries(groupResultsByCategory(report.results)).map(([category, results]) => {
                      const stats = getCategoryStats(results);
                      return (
                        <Card key={category}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{category}</CardTitle>
                              <div className="flex gap-2">
                                {stats.passed > 0 && <Badge variant="default">{stats.passed} Passed</Badge>}
                                {stats.failed > 0 && <Badge variant="destructive">{stats.failed} Failed</Badge>}
                                {stats.warnings > 0 && <Badge variant="secondary">{stats.warnings} Warnings</Badge>}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Progress 
                              value={(stats.passed / stats.total) * 100} 
                              className="w-full"
                            />
                            <div className="text-sm text-muted-foreground mt-2">
                              {stats.passed}/{stats.total} tests passing
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="space-y-4">
                    {Object.entries(groupResultsByCategory(report.results)).map(([category, results]) => (
                      <Card key={category}>
                        <CardHeader>
                          <CardTitle>{category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {results.map((result, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                {getStatusIcon(result.status)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{result.test}</span>
                                    {getStatusBadge(result.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{result.message}</p>
                                  {result.details && (
                                    <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                                      {JSON.stringify(result.details, null, 2)}
                                    </pre>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="failures">
                  <div className="space-y-4">
                    {report.results.filter(r => r.status === 'FAIL' || r.status === 'WARN').map((result, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(result.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{result.category} - {result.test}</span>
                                {getStatusBadge(result.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{result.message}</p>
                              {result.details && (
                                <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};