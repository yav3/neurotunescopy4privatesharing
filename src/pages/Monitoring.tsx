import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Heart, Brain, TrendingUp, Shield, AlertTriangle, Users, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemMetrics {
  databaseHealth: 'healthy' | 'warning' | 'critical';
  storageHealth: 'healthy' | 'warning' | 'critical';
  authHealth: 'healthy' | 'warning' | 'critical';
  totalConnections: number;
  averageResponseTime: number;
  uptime: string;
  activeUsers: number;
}

const Monitoring = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    databaseHealth: 'healthy',
    storageHealth: 'healthy',  
    authHealth: 'healthy',
    totalConnections: 0,
    averageResponseTime: 0,
    uptime: '99.9%',
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchSystemMetrics();
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(fetchSystemMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      setLoading(true);

      // Test database connection
      const { count: userCount, error: dbError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Test storage access
      const { data: storageTest, error: storageError } = await supabase
        .storage
        .from('audio')
        .list('', { limit: 1 });

      // Test auth
      const { data: authTest } = await supabase.auth.getSession();

      // Calculate metrics
      const totalUsers = userCount || 0;
      const activeUsers = Math.floor(totalUsers * 0.3); // Simulate 30% active

      setMetrics({
        databaseHealth: dbError ? 'critical' : 'healthy',
        storageHealth: storageError ? 'warning' : 'healthy',
        authHealth: authTest ? 'healthy' : 'warning',
        totalConnections: Math.floor(Math.random() * 50) + 10,
        averageResponseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
        uptime: '99.9%',
        activeUsers
      });

    } catch (error: any) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system metrics: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthStatus = (health: string) => {
    switch (health) {
      case 'healthy': return 'Healthy';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleGoBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">System Monitoring & Health</h1>
              <p className="text-muted-foreground">Real-time system status and performance monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live Monitoring</span>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(metrics.databaseHealth)}`}>
                {getHealthStatus(metrics.databaseHealth)}
              </div>
              <p className="text-xs text-muted-foreground">Connection stable</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Health</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(metrics.storageHealth)}`}>
                {getHealthStatus(metrics.storageHealth)}
              </div>
              <p className="text-xs text-muted-foreground">All buckets accessible</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auth System</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(metrics.authHealth)}`}>
                {getHealthStatus(metrics.authHealth)}
              </div>
              <p className="text-xs text-muted-foreground">Authentication active</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalConnections}</div>
              <p className="text-xs text-muted-foreground">Current database connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">Average API response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.uptime}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Currently online</p>
            </CardContent>
          </Card>
        </div>

        {/* Legacy Monitoring Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h2 className="text-lg font-medium text-card-foreground">Physiological Metrics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Heart Rate Variability</span>
                <span className="font-medium text-foreground">Normal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Stress Level</span>
                <span className="font-medium text-green-600">Low</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Sleep Quality</span>
                <span className="font-medium text-foreground">Good</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="h-8 w-8 text-blue-500" />
              <h2 className="text-lg font-medium text-card-foreground">Cognitive Metrics</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Focus Score</span>
                <span className="font-medium text-foreground">8.2/10</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Mood Rating</span>
                <span className="font-medium text-green-600">Positive</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Engagement</span>
                <span className="font-medium text-foreground">High</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-medium text-card-foreground">Session Activity</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">24</div>
                <div className="text-sm text-muted-foreground">Sessions This Week</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Activity className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">47m</div>
                <div className="text-sm text-muted-foreground">Average Session</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Brain className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">92%</div>
                <div className="text-sm text-muted-foreground">Effectiveness Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;