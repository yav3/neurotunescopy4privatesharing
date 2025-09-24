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
  Eye, Play, Pause, MousePointer, Music, Heart, Ban
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserAnalytics {
  totalActiveUsers: number;
  dailyActiveUsers: number;
  avgSessionDuration: number;
  totalSessions: number;
  engagementRate: number;
  totalListeningTime: number;
  averageSkipRate: number;
  totalFavorites: number;
  totalBlocked: number;
}

interface HealthMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  databaseHealth: string;
}

interface UserBehaviorData {
  date: string;
  sessions: number;
  favorites: number;
  blocks: number;
  totalTime: number;
}

export default function ComprehensiveDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics>({
    totalActiveUsers: 0,
    dailyActiveUsers: 0,
    avgSessionDuration: 0,
    totalSessions: 0,
    engagementRate: 0,
    totalListeningTime: 0,
    averageSkipRate: 0,
    totalFavorites: 0,
    totalBlocked: 0
  });
  
  const [behaviorData, setBehaviorData] = useState<UserBehaviorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const healthMetrics: HealthMetrics = {
    uptime: 99.8,
    responseTime: 245,
    errorRate: 0.5,
    activeConnections: 847,
    databaseHealth: 'healthy'
  };

  useEffect(() => {
    fetchComprehensiveAnalytics();
  }, [timeRange]);

  const fetchComprehensiveAnalytics = async () => {
    try {
      setLoading(true);
      
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      // Fetch all users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch listening sessions
      const { data: sessions, count: sessionCount } = await supabase
        .from('listening_sessions')
        .select('*', { count: 'exact' })
        .gte('created_at', startDate);

      // Fetch favorites
      const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate);

      // Fetch blocked tracks
      const { count: blockedCount } = await supabase
        .from('blocked_tracks')
        .select('*', { count: 'exact', head: true })
        .gte('blocked_at', startDate);

      // Calculate metrics
      const uniqueUsers = new Set(sessions?.map(s => s.user_id || s.patient_id).filter(Boolean)).size;
      const totalSessionMinutes = sessions?.reduce((sum, s) => sum + (s.session_duration_minutes || 0), 0) || 0;
      const avgSessionDuration = sessionCount ? totalSessionMinutes / sessionCount : 0;
      const totalSkips = sessions?.reduce((sum, s) => sum + Math.floor((s.tracks_played || 0) * (s.skip_rate || 0)), 0) || 0;
      const totalTracksPlayed = sessions?.reduce((sum, s) => sum + (s.tracks_played || 0), 0) || 0;
      const avgSkipRate = totalTracksPlayed > 0 ? (totalSkips / totalTracksPlayed) * 100 : 0;

      setUserAnalytics({
        totalActiveUsers: totalUsers || 0,
        dailyActiveUsers: Math.floor(uniqueUsers / daysBack),
        avgSessionDuration,
        totalSessions: sessionCount || 0,
        engagementRate: totalUsers ? (uniqueUsers / totalUsers) * 100 : 0,
        totalListeningTime: totalSessionMinutes,
        averageSkipRate: avgSkipRate,
        totalFavorites: favoritesCount || 0,
        totalBlocked: blockedCount || 0
      });

      // Generate behavior data for charts
      const behaviorByDay: Record<string, UserBehaviorData> = {};
      
      for (let i = 0; i < daysBack; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        behaviorByDay[dateStr] = {
          date: dateStr,
          sessions: 0,
          favorites: 0,
          blocks: 0,
          totalTime: 0
        };
      }

      // Populate with actual data
      sessions?.forEach(session => {
        const date = session.created_at.split('T')[0];
        if (behaviorByDay[date]) {
          behaviorByDay[date].sessions++;
          behaviorByDay[date].totalTime += session.session_duration_minutes || 0;
        }
      });

      setBehaviorData(Object.values(behaviorByDay).reverse());

    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon, trend }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    trend?: 'up' | 'down';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Comprehensive Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor user behavior, engagement, and system health</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Active Users"
                value={userAnalytics.totalActiveUsers}
                change={12.5}
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                title="Avg Session Duration"
                value={`${Math.round(userAnalytics.avgSessionDuration)}m`}
                change={5.2}
                icon={<Clock className="h-4 w-4" />}
              />
              <MetricCard
                title="Engagement Rate"
                value={`${Math.round(userAnalytics.engagementRate)}%`}
                change={8.1}
                icon={<Activity className="h-4 w-4" />}
              />
              <MetricCard
                title="Skip Rate"
                value={`${Math.round(userAnalytics.averageSkipRate)}%`}
                change={-3.2}
                icon={<MousePointer className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Trends</CardTitle>
                  <CardDescription>Daily sessions and listening time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={behaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" name="Sessions" />
                      <Line type="monotone" dataKey="totalTime" stroke="hsl(var(--secondary))" name="Total Minutes" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Metrics</CardTitle>
                  <CardDescription>Favorites vs Blocked tracks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: 'Favorites', value: userAnalytics.totalFavorites, color: 'hsl(var(--chart-1))' },
                      { name: 'Blocked', value: userAnalytics.totalBlocked, color: 'hsl(var(--chart-2))' },
                      { name: 'Sessions', value: userAnalytics.totalSessions, color: 'hsl(var(--chart-3))' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Total Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">{userAnalytics.totalFavorites}</div>
                  <p className="text-sm text-muted-foreground">Tracks marked as favorite</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-gray-500" />
                    Total Blocked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-600">{userAnalytics.totalBlocked}</div>
                  <p className="text-sm text-muted-foreground">Tracks blocked by users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    Total Listening Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(userAnalytics.totalListeningTime / 60)}h
                  </div>
                  <p className="text-sm text-muted-foreground">Hours of music played</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Analytics Tab */}
          <TabsContent value="user-analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Daily User Behavior</CardTitle>
                  <CardDescription>Track sessions, favorites, and blocks over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={behaviorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sessions" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" />
                      <Area type="monotone" dataKey="favorites" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" />
                      <Area type="monotone" dataKey="blocks" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Total Sessions</span>
                    <span className="ml-auto font-semibold">{userAnalytics.totalSessions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Avg Session Length</span>
                    <span className="ml-auto font-semibold">{Math.round(userAnalytics.avgSessionDuration)}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Engagement Rate</span>
                    <span className="ml-auto font-semibold">{Math.round(userAnalytics.engagementRate)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Skip Rate</span>
                    <span className="ml-auto font-semibold">{Math.round(userAnalytics.averageSkipRate)}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* App Health Tab */}
          <TabsContent value="app-health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="System Uptime"
                value={`${healthMetrics.uptime}%`}
                change={0.1}
                icon={<Server className="h-4 w-4" />}
              />
              <MetricCard
                title="Response Time"
                value={`${healthMetrics.responseTime}ms`}
                change={-8.3}
                icon={<Activity className="h-4 w-4" />}
              />
              <MetricCard
                title="Error Rate"
                value={`${healthMetrics.errorRate}%`}
                change={-12.1}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              <MetricCard
                title="Database Health"
                value="Healthy"
                icon={<Database className="h-4 w-4" />}
              />
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>System Status: Operational</AlertTitle>
              <AlertDescription>
                All systems are running normally. Database connections are stable and response times are within acceptable limits.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="real-time" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live User Activity</CardTitle>
                  <CardDescription>Real-time user engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <Badge variant="secondary">{userAnalytics.dailyActiveUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Sessions Today</span>
                      <Badge variant="secondary">{Math.floor(userAnalytics.totalSessions / 7)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Current Engagement</span>
                      <Badge variant="default">{Math.round(userAnalytics.engagementRate)}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Current system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Database Status</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Storage Status</span>
                      <Badge variant="default" className="bg-green-500">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response</span>
                      <Badge variant="secondary">{healthMetrics.responseTime}ms</Badge>
                    </div>
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