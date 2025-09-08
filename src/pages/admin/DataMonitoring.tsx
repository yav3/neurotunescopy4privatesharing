import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  RefreshCw,
  Download,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
  details?: any;
}

interface DatabaseHealth {
  table: string;
  status: 'healthy' | 'warning' | 'error';
  recordCount: number;
  lastUpdated: string;
  issues?: string[];
}

export default function DataMonitoring() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [dbHealth, setDbHealth] = useState<DatabaseHealth[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      
      // Mock system logs data - in real app, this would come from logging service
      const mockLogs: SystemLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'User authentication successful',
          source: 'auth-service',
          details: { userId: 'user-123', ip: '192.168.1.1' }
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          level: 'warn',
          message: 'High memory usage detected',
          source: 'system-monitor',
          details: { usage: '85%', threshold: '80%' }
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          level: 'error',
          message: 'Failed to process track analysis',
          source: 'audio-processor',
          details: { trackId: 'track-456', error: 'File not found' }
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          level: 'info',
          message: 'Database backup completed successfully',
          source: 'backup-service',
          details: { size: '1.2GB', duration: '45s' }
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          level: 'warn',
          message: 'API rate limit approaching for user',
          source: 'api-gateway',
          details: { userId: 'user-789', requests: 950, limit: 1000 }
        }
      ];

      // Get actual database table info
      const tables = ['tracks', 'profiles', 'playlists', 'user_roles', 'blocked_tracks'];
      const healthData: DatabaseHealth[] = [];

      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (error) throw error;

          healthData.push({
            table,
            status: 'healthy',
            recordCount: count || 0,
            lastUpdated: new Date().toISOString(),
            issues: []
          });
        } catch (error) {
          healthData.push({
            table,
            status: 'error',
            recordCount: 0,
            lastUpdated: new Date().toISOString(),
            issues: ['Unable to fetch record count']
          });
        }
      }

      setLogs(mockLogs);
      setDbHealth(healthData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch monitoring data: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchMonitoringData();
    toast({
      title: 'Data Refreshed',
      description: 'Monitoring data has been updated.'
    });
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: 'Logs Exported',
      description: 'System logs have been exported to a JSON file.'
    });
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warn':
        return <Badge variant="secondary">Warning</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor system health, logs, and database performance.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshData}>
            <Refresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="database">Database Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Status Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                  <span className="text-sm text-muted-foreground">99.9% uptime</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  <span className="text-sm text-muted-foreground">12ms avg</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.1%</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>System alerts and warnings from the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.filter(log => log.level === 'error' || log.level === 'warn').slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    {log.level === 'error' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{log.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.source} • {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                    {getLogLevelBadge(log.level)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          {/* Log Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Log Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* System Logs */}
          <Card>
            <CardHeader>
              <CardTitle>System Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>Real-time system events and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getLogLevelBadge(log.level)}
                        <span className="font-medium">{log.message}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Source: {log.source}</span>
                      {log.details && (
                        <details className="cursor-pointer">
                          <summary>View Details</summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Health Overview</CardTitle>
              <CardDescription>Monitor database tables and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dbHealth.map((health) => (
                  <div key={health.table} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getHealthStatusIcon(health.status)}
                      <div>
                        <p className="font-medium">{health.table}</p>
                        <p className="text-sm text-muted-foreground">
                          {health.recordCount.toLocaleString()} records
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={health.status === 'healthy' ? 'default' : 'destructive'}>
                        {health.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated: {formatTimestamp(health.lastUpdated)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Operations</CardTitle>
              <CardDescription>Quick database maintenance actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <Button variant="outline" className="justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Optimize Tables
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Analyze Performance
                </Button>
                <Button variant="outline" className="justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Run Health Check
                </Button>
                <Button variant="outline" className="justify-start">
                  <Refresh className="mr-2 h-4 w-4" />
                  Refresh Statistics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124ms</div>
                <p className="text-xs text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3k</div>
                <p className="text-xs text-muted-foreground">Requests per minute</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-muted-foreground">Current utilization</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">Memory utilization</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>System performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <span className="text-sm text-muted-foreground">124ms avg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Database Query Time</span>
                    <span className="text-sm text-muted-foreground">12ms avg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>File Processing Time</span>
                    <span className="text-sm text-muted-foreground">2.3s avg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}