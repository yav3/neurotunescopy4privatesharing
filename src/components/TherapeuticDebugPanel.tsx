import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Database, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Create a simple mock for therapeuticMetrics to avoid build errors
const mockTherapeuticMetrics = {
  getMetrics: () => ({}),
  getRecommendations: () => []
};

export const TherapeuticDebugPanel: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [therapeuticStats, setTherapeuticStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when debug mode is enabled
    const showDebugPanel = process.env.NODE_ENV === 'development' || 
                          localStorage.getItem('debug-mode') === 'true';
    setIsVisible(showDebugPanel);

    if (showDebugPanel) {
      updateStats();
      const interval = setInterval(updateStats, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, []);

  const updateStats = () => {
    setHealthStatus(performanceMonitor.getHealthStatus());
    setCacheStats(performanceMonitor.getCacheStats());
    setTherapeuticStats(mockTherapeuticMetrics.getMetrics());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'degraded': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'unhealthy': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50 space-y-2">
      {/* Performance Status Card */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Therapeutic Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthStatus && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={getStatusColor(healthStatus.status)}>
                  {getStatusIcon(healthStatus.status)}
                  {healthStatus.status}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Response Time</span>
                  <span>{healthStatus.avgResponseTime}ms</span>
                </div>
                <Progress 
                  value={Math.min((healthStatus.avgResponseTime / 2000) * 100, 100)} 
                  className="h-1"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Cache Hit Rate</span>
                  <span>{Math.round(healthStatus.cacheHitRate * 100)}%</span>
                </div>
                <Progress 
                  value={healthStatus.cacheHitRate * 100} 
                  className="h-1"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Error Rate</span>
                  <span>{Math.round(healthStatus.errorRate * 100)}%</span>
                </div>
                <Progress 
                  value={healthStatus.errorRate * 100} 
                  className="h-1"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cache Statistics Card */}
      {cacheStats && (
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              Track Cache
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Cached Goals</span>
              <span>{cacheStats.size}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Total Tracks</span>
              <span>{cacheStats.totalTracks}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Goals: {cacheStats.keys.join(', ') || 'None'}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Therapeutic Usage Stats */}
      {therapeuticStats && Object.keys(therapeuticStats).length > 0 && (
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(therapeuticStats).slice(0, 3).map(([goal, stats]: [string, any]) => (
              <div key={goal} className="text-xs">
                <div className="flex justify-between">
                  <span className="truncate">{goal}</span>
                  <span>{stats.count}x</span>
                </div>
                <div className="flex items-center gap-1">
                  <Progress value={stats.avgScore * 100} className="h-1 flex-1" />
                  <span className="text-muted-foreground">{Math.round(stats.avgScore * 100)}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
        <CardContent className="pt-4 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              performanceMonitor.clearCache();
              updateStats();
            }}
          >
            <Database className="w-3 h-3 mr-1" />
            Clear Cache
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              const stats = {
                health: healthStatus,
                cache: cacheStats,
                therapeutic: therapeuticStats,
                timestamp: new Date().toISOString()
              };
              console.group('🔧 Therapeutic Debug Export');
              console.log('Performance Data:', stats);
              console.log('Recommendations:', mockTherapeuticMetrics.getRecommendations());
              console.groupEnd();
            }}
          >
            <Activity className="w-3 h-3 mr-1" />
            Export Debug
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => setIsVisible(false)}
          >
            Hide Panel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapeuticDebugPanel;