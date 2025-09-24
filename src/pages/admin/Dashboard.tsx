import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Users, Activity, Clock, AlertTriangle, CheckCircle, 
  XCircle, TrendingUp, TrendingDown, Server, Database,
  Eye, Play, MousePointer, Music, Settings, Monitor
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Helper Components and Functions
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
        {Math.abs(change)}% from last period
      </div>
    </CardContent>
  </Card>
);

const getAlertClassName = (type: string) => {
  switch (type) {
    case 'error':
      return 'border-red-200 bg-red-50';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50';
    case 'info':
      return 'border-blue-200 bg-blue-50';
    default:
      return '';
  }
};

const getSeverityVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'outline';
  }
};

interface DashboardStats {
  totalUsers: number;
  totalTracks: number;
  workingTracks: number;
  totalPlaylists: number;
}

// Mock data - replace with real API calls
const mockUserAnalytics = {
  totalActiveUsers: 1234,
  dailyActiveUsers: 456,
  avgSessionDuration: 12.5,
  totalSessions: 5678,
  engagementRate: 78.5
};

const mockHealthMetrics = {
  uptime: 99.8,
  responseTime: 245,
  errorRate: 0.5,
  activeConnections: 847,
  databaseHealth: 'healthy'
};

const mockUserBehaviorData = [
  { date: '2024-01-01', pageViews: 120, audioPlays: 89, clicks: 234 },
  { date: '2024-01-02', pageViews: 142, audioPlays: 95, clicks: 267 },
  { date: '2024-01-03', pageViews: 138, audioPlays: 102, clicks: 289 },
  { date: '2024-01-04', pageViews: 165, audioPlays: 118, clicks: 312 },
  { date: '2024-01-05', pageViews: 148, audioPlays: 98, clicks: 298 }
];

const mockHealthTrends = [
  { time: '00:00', responseTime: 234, errorRate: 0.2, uptime: 99.9 },
  { time: '04:00', responseTime: 189, errorRate: 0.1, uptime: 99.9 },
  { time: '08:00', responseTime: 267, errorRate: 0.3, uptime: 99.8 },
  { time: '12:00', responseTime: 245, errorRate: 0.5, uptime: 99.8 },
  { time: '16:00', responseTime: 198, errorRate: 0.2, uptime: 99.9 },
  { time: '20:00', responseTime: 223, errorRate: 0.4, uptime: 99.8 }
];

const mockFeatureUsage = [
  { feature: 'Audio Play', usage: 1234, color: '#8884d8' },
  { feature: 'Session Start', usage: 987, color: '#82ca9d' },
  { feature: 'Profile View', usage: 743, color: '#ffc658' },
  { feature: 'Settings', usage: 456, color: '#ff7c7c' },
  { feature: 'Export Data', usage: 234, color: '#8dd1e1' }
];

const mockAlerts = [
  { id: 1, type: 'warning', message: 'High response time detected', severity: 'medium', timestamp: '2024-01-05T10:30:00Z' },
  { id: 2, type: 'info', message: 'System maintenance scheduled', severity: 'low', timestamp: '2024-01-05T09:15:00Z' },
  { id: 3, type: 'error', message: 'Database connection timeout', severity: 'high', timestamp: '2024-01-05T08:45:00Z' }
];

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTracks: 0,
    workingTracks: 0,
    totalPlaylists: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch user count from profiles
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Get track counts using direct query
      const [totalResult, workingResult] = await Promise.all([
        supabase.from('tracks').select('*', { count: 'exact', head: true }),
        supabase.from('tracks').select('*', { count: 'exact', head: true }).eq('audio_status', 'working')
      ]);

      // Fetch playlist count
      const { count: playlistCount, error: playlistError } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true });

      if (playlistError) throw playlistError;

      const totalTracks = totalResult.count || 0;
      const workingTracks = workingResult.count || 0;

      setStats({
        totalUsers: userCount || 0,
        totalTracks: totalTracks,
        workingTracks: workingTracks,
        totalPlaylists: playlistCount || 0
      });

    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard stats: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor user behavior and system health</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="user-analytics">User Analytics</TabsTrigger>
            <TabsTrigger value="app-health">App Health</TabsTrigger>
            <TabsTrigger value="real-time">Real-time</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Users"
                value={stats.totalUsers.toLocaleString()}
                change={12.5}
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                title="Avg Session Time"
                value={`${mockUserAnalytics.avgSessionDuration}m`}
                change={5.2}
                icon={<Clock className="h-4 w-4" />}
              />
              <MetricCard
                title="System Uptime"
                value={`${mockHealthMetrics.uptime}%`}
                change={0.1}
                icon={<Server className="h-4 w-4" />}
              />
              <MetricCard
                title="Response Time"
                value={`${mockHealthMetrics.responseTime}ms`}
                change={-8.3}
                icon={<Activity className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockUserBehaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="pageViews" stroke="#8884d8" />
                      <Line type="monotone" dataKey="audioPlays" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockFeatureUsage}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="usage"
                        label={({ feature, usage }) => `${feature}: ${usage}`}
                      >
                        {mockFeatureUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Section */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <Alert key={alert.id} className={getAlertClassName(alert.type)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center gap-2">
                        {alert.message}
                        <Badge variant={getSeverityVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        {new Date(alert.timestamp).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Analytics Tab */}
          <TabsContent value="user-analytics" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button
                variant={timeRange === '24h' ? 'default' : 'outline'}
                onClick={() => setTimeRange('24h')}
              >
                24h
              </Button>
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                onClick={() => setTimeRange('7d')}
              >
                7 days
              </Button>
              <Button
                variant={timeRange === '30d' ? 'default' : 'outline'}
                onClick={() => setTimeRange('30d')}
              >
                30 days
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Interaction Events</CardTitle>
                  <CardDescription>Track how users interact with your app</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={mockUserBehaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="clicks" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="audioPlays" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Page Views</span>
                    <span className="ml-auto font-semibold">12.4K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Audio Plays</span>
                    <span className="ml-auto font-semibold">8.9K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">User Clicks</span>
                    <span className="ml-auto font-semibold">15.2K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Active Sessions</span>
                    <span className="ml-auto font-semibold">2.1K</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* App Health Tab */}
          <TabsContent value="app-health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Server Uptime"
                value={`${mockHealthMetrics.uptime}%`}
                change={0.1}
                icon={<CheckCircle className="h-4 w-4 text-green-500" />}
              />
              <MetricCard
                title="Error Rate"
                value={`${mockHealthMetrics.errorRate}%`}
                change={-2.1}
                icon={<XCircle className="h-4 w-4 text-red-500" />}
              />
              <MetricCard
                title="Active Connections"
                value={mockHealthMetrics.activeConnections.toLocaleString()}
                change={8.7}
                icon={<Database className="h-4 w-4 text-blue-500" />}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>System performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockHealthTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#8884d8" name="Response Time (ms)" />
                    <Line yAxisId="right" type="monotone" dataKey="uptime" stroke="#82ca9d" name="Uptime (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="real-time" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">New user registration</span>
                      <Badge variant="secondary">2 min ago</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Audio track uploaded</span>
                      <Badge variant="secondary">5 min ago</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">System backup completed</span>
                      <Badge variant="secondary">12 min ago</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Status</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge className="bg-green-500">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Status</span>
                    <Badge className="bg-green-500">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CDN Status</span>
                    <Badge className="bg-yellow-500">Degraded</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}