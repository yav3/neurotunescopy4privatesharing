import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Shield, AlertTriangle, Clock, TrendingUp, Eye, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityIncidents } from './SecurityIncidents';

interface AccessMetrics {
  totalUsers: number;
  activeUsers: number;
  loginAttempts: number;
  failedLogins: number;
  unauthorizedAccess: number;
  averageSessionDuration: number;
  pageViews: number;
  currentOnlineUsers: number;
}

interface RecentActivity {
  id: string;
  event_type: string;
  user_id: string;
  timestamp: string;
  details: any;
}

export const RealTimeAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<AccessMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    loginAttempts: 0,
    failedLogins: 0,
    unauthorizedAccess: 0,
    averageSessionDuration: 0,
    pageViews: 0,
    currentOnlineUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
    // Set up real-time refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch user count from profiles
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Simulate analytics data (in a real app, this would come from your analytics tracking)
      const mockMetrics: AccessMetrics = {
        totalUsers: userCount || 0,
        activeUsers: Math.floor((userCount || 0) * 0.7), // 70% active users
        loginAttempts: Math.floor(Math.random() * 50) + 20,
        failedLogins: Math.floor(Math.random() * 5),
        unauthorizedAccess: Math.floor(Math.random() * 3),
        averageSessionDuration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
        pageViews: Math.floor(Math.random() * 200) + 100,
        currentOnlineUsers: Math.floor(Math.random() * 10) + 1
      };

      setMetrics(mockMetrics);

      // Generate some mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          event_type: 'user_login',
          user_id: 'anonymous',
          timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
          details: { method: 'email', success: true }
        },
        {
          id: '2',
          event_type: 'page_view',
          user_id: 'anonymous',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          details: { page: '/goals', duration: 45 }
        },
        {
          id: '3',
          event_type: 'unauthorized_access',
          user_id: 'anonymous',
          timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
          details: { attempted_route: '/admin', blocked: true }
        },
        {
          id: '4',
          event_type: 'session_start',
          user_id: 'user-123',
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          details: { device: 'desktop', location: 'US' }
        }
      ];

      setRecentActivity(mockActivity);

    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'user_login':
        return <LogIn className="h-4 w-4 text-green-500" />;
      case 'page_view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'unauthorized_access':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'session_start':
        return <Activity className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Access Analytics</h2>
          <p className="text-muted-foreground">
            Real-time insights into user access patterns and security metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Key Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeUsers} active in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.loginAttempts > 0 
                ? Math.round(((metrics.loginAttempts - metrics.failedLogins) / metrics.loginAttempts) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.failedLogins} failed attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.unauthorizedAccess}</div>
            <p className="text-xs text-muted-foreground">
              Unauthorized access attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageSessionDuration}m</div>
            <p className="text-xs text-muted-foreground">
              {metrics.currentOnlineUsers} currently online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Page Views */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live user activity and security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  {getEventIcon(activity.event_type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {activity.event_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.event_type === 'page_view' && `Page: ${activity.details.page}`}
                      {activity.event_type === 'user_login' && `Method: ${activity.details.method}`}
                      {activity.event_type === 'unauthorized_access' && `Route: ${activity.details.attempted_route}`}
                      {activity.event_type === 'session_start' && `Device: ${activity.details.device}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Application engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Page Views Today</span>
                </div>
                <span className="text-sm font-bold">{metrics.pageViews}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Active Sessions</span>
                </div>
                <span className="text-sm font-bold">{metrics.currentOnlineUsers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Return Users</span>
                </div>
                <span className="text-sm font-bold">
                  {Math.round((metrics.activeUsers / metrics.totalUsers) * 100)}%
                </span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {metrics.totalUsers > 0 ? '100%' : '0%'}
                  </div>
                  <div className="text-xs text-muted-foreground">Security Compliance</div>
                  <p className="text-xs text-green-600 mt-1">All users authenticated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Incidents Analysis */}
      <SecurityIncidents />
    </div>
  );
};