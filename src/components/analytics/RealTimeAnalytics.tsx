import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Shield, AlertTriangle, Clock, TrendingUp, Eye, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityIncidents } from './SecurityIncidents';
import { SecurityMonitoringPanel } from '../SecurityMonitoringPanel';

interface UserBehaviorMetrics {
  totalRegisteredUsers: number;
  activeListeners: number;
  totalListeningSessions: number;
  totalListeningTime: number;
  averageSessionDuration: number;
  averageSkipRate: number;
  totalFavorites: number;
  totalBlockedTracks: number;
  userEngagementRate: number;
  dailyActiveUsers: number;
  weeklyRetentionRate: number;
  topListeningDays: { date: string; sessions: number; avgDuration: number }[];
}

interface RecentActivity {
  id: string;
  event_type: string;
  user_id: string;
  timestamp: string;
  details: any;
}

export const RealTimeAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<UserBehaviorMetrics>({
    totalRegisteredUsers: 0,
    activeListeners: 0,
    totalListeningSessions: 0,
    totalListeningTime: 0,
    averageSessionDuration: 0,
    averageSkipRate: 0,
    totalFavorites: 0,
    totalBlockedTracks: 0,
    userEngagementRate: 0,
    dailyActiveUsers: 0,
    weeklyRetentionRate: 0,
    topListeningDays: []
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

      // Get comprehensive user data from auth.users for accurate count
      const { count: totalUsers, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .limit(1);

      if (userError) throw userError;

      // Fetch ALL listening sessions (not just last 30 days) to get complete picture
      const { data: allSessions, error: sessionError } = await supabase
        .from('listening_sessions')
        .select(`
          user_id,
          patient_id,
          session_duration_minutes,
          skip_rate,
          tracks_played,
          created_at
        `);

      if (sessionError) throw sessionError;

      // Get recent sessions for activity analysis
      const recentSessions = allSessions?.filter(s => 
        new Date(s.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) || [];

      // For now, use empty user events array until comprehensive tracking is implemented
      const userEvents: any[] = [];

      // Fetch favorites data
      const { count: favoritesCount, error: favoritesError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact' })
        .limit(1);

      if (favoritesError) throw favoritesError;

      // Fetch blocked tracks data  
      const { count: blockedCount, error: blockedError } = await supabase
        .from('blocked_tracks')
        .select('*', { count: 'exact' })
        .limit(1);

      if (blockedError) throw blockedError;

      // Calculate metrics with proper user identification
      const allUserIds = new Set();
      const recentUserIds = new Set();
      
      // Count users from both listening sessions and activity events
      allSessions?.forEach(s => {
        if (s.user_id) allUserIds.add(s.user_id);
        if (s.patient_id) allUserIds.add(s.patient_id);
      });
      
      recentSessions.forEach(s => {
        if (s.user_id) recentUserIds.add(s.user_id);
        if (s.patient_id) recentUserIds.add(s.patient_id);
      });

      userEvents.forEach(e => {
        if (e.user_id) recentUserIds.add(e.user_id);
      });

      const totalActiveUsers = allUserIds.size;
      const recentActiveUsers = recentUserIds.size;
      const totalSessions = allSessions?.length || 0;
      const recentSessionCount = recentSessions.length;
      
      const totalListeningTime = allSessions?.reduce((sum, s) => sum + (s.session_duration_minutes || 0), 0) || 0;
      const avgSessionDuration = totalSessions > 0 ? totalListeningTime / totalSessions : 0;
      const avgSkipRate = allSessions?.length > 0 
        ? allSessions.reduce((sum, s) => sum + (s.skip_rate || 0), 0) / allSessions.length
        : 0;

      // Calculate TRUE engagement rate (users with ANY tracked activity vs total registered)
      const trueEngagementRate = totalUsers ? (Math.max(totalActiveUsers, recentActiveUsers) / totalUsers) * 100 : 0;

      // Get recent daily activity trends including ALL activity types
      const recentDays: Record<string, { sessions: number; totalDuration: number; events: number }> = {};
      
      // Add listening sessions to daily breakdown
      recentSessions.forEach(session => {
        const date = new Date(session.created_at).toISOString().split('T')[0];
        if (!recentDays[date]) {
          recentDays[date] = { sessions: 0, totalDuration: 0, events: 0 };
        }
        recentDays[date].sessions++;
        recentDays[date].totalDuration += session.session_duration_minutes || 0;
      });

      // Add user activity events to daily breakdown
      userEvents.forEach(event => {
        const date = new Date(event.timestamp).toISOString().split('T')[0];
        if (!recentDays[date]) {
          recentDays[date] = { sessions: 0, totalDuration: 0, events: 0 };
        }
        recentDays[date].events++;
      });

      const topListeningDays = Object.entries(recentDays)
        .map(([date, data]) => ({
          date,
          sessions: data.sessions,
          avgDuration: data.sessions > 0 ? data.totalDuration / data.sessions : 0
        }))
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 7);

      const comprehensiveMetrics: UserBehaviorMetrics = {
        totalRegisteredUsers: totalUsers || 0,
        activeListeners: totalActiveUsers,
        totalListeningSessions: totalSessions,
        totalListeningTime,
        averageSessionDuration: Math.round(avgSessionDuration * 10) / 10,
        averageSkipRate: Math.round(avgSkipRate * 1000) / 10, // Convert to percentage with 1 decimal
        totalFavorites: favoritesCount || 0,
        totalBlockedTracks: blockedCount || 0,
        userEngagementRate: Math.round(trueEngagementRate * 10) / 10,
        dailyActiveUsers: recentActiveUsers,
        weeklyRetentionRate: totalUsers ? Math.round((recentActiveUsers / totalUsers) * 100) : 0,
        topListeningDays
      };

      setMetrics(comprehensiveMetrics);

      // Generate detailed recent activity from real data
      const realActivity: RecentActivity[] = [];

      // Add recent user activity events
      userEvents.slice(-3).forEach((event, index) => {
        realActivity.push({
          id: `event-${index}`,
          event_type: event.event_type,
          user_id: event.user_id || 'anonymous',
          timestamp: event.timestamp,
          details: { 
            page: event.page_path,
            type: event.event_type
          }
        });
      });

      // Add recent listening sessions with detailed info
      recentSessions.slice(-3).forEach((session, index) => {
        realActivity.push({
          id: `session-${index}`,
          event_type: 'listening_session',
          user_id: session.user_id || session.patient_id || 'anonymous',
          timestamp: session.created_at,
          details: { 
            duration: session.session_duration_minutes,
            tracksPlayed: session.tracks_played,
            skipRate: Math.round((session.skip_rate || 0) * 100),
            type: 'music_therapy'
          }
        });
      });

      // Add critical data quality warning if engagement is low
      if (trueEngagementRate < 10) {
        realActivity.unshift({
          id: 'data-quality-warning',
          event_type: 'data_quality_issue',
          user_id: 'system',
          timestamp: new Date().toISOString(),
          details: { 
            issue: 'Low session tracking coverage',
            engagementRate: Math.round(trueEngagementRate),
            totalUsers,
            usersWithSessions: totalActiveUsers,
            recommendation: 'Check session tracking implementation'
          }
        });
      }

      // Add user engagement summary
      realActivity.push({
        id: 'engagement-summary',
        event_type: 'user_engagement',
        user_id: 'system',
        timestamp: new Date().toISOString(),
        details: { 
          activeUsers: totalActiveUsers,
          recentUsers: recentActiveUsers,
          engagementRate: Math.round(trueEngagementRate),
          totalSessions: totalSessions,
          recentSessions: recentSessionCount
        }
      });

      setRecentActivity(realActivity.reverse());

    } catch (error: any) {
      console.error('Error fetching comprehensive analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user behavior analytics: ' + error.message,
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
      case 'listening_session':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'page_view':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'unauthorized_access':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'session_start':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'system_healthy':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'user_engagement':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'data_quality_issue':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
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

      {/* Comprehensive User Behavior Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRegisteredUsers}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeListeners} active listeners ({metrics.userEngagementRate}% engagement)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalListeningSessions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(metrics.totalListeningTime / 60)}h total listening time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.averageSkipRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average skip rate (lower is better)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageSessionDuration}m</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeListeners} active users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional User Behavior Insights */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites & Blocks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalBlockedTracks} tracks blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Retention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.weeklyRetentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Weekly retention rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.dailyActiveUsers}</div>
            <p className="text-xs text-muted-foreground">
              Current daily active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics.topListeningDays.length > 0 ? '↗' : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.topListeningDays.length} active days tracked
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
                       {activity.event_type === 'listening_session' && `Duration: ${activity.details.duration}min, Skip Rate: ${activity.details.skipRate}%`}
                       {activity.event_type === 'page_view' && `Page: ${activity.details.page}`}
                       {activity.event_type === 'user_login' && `Method: ${activity.details.method}`}
                       {activity.event_type === 'unauthorized_access' && `Severity: ${activity.details.severity}`}
                       {activity.event_type === 'failed_login' && `Severity: ${activity.details.severity}`}
                       {activity.event_type === 'session_start' && `Device: ${activity.details.device}`}
                       {activity.event_type === 'system_healthy' && `Status: ${activity.details.status}`}
                       {activity.event_type === 'user_engagement' && `${activity.details.activeUsers} active, ${activity.details.engagementRate}% engagement`}
                       {activity.event_type === 'data_quality_issue' && `⚠️ ${activity.details.issue} - ${activity.details.recommendation}`}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Behavior Insights</CardTitle>
            <CardDescription>Detailed listening patterns and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Sessions</span>
                </div>
                <span className="text-sm font-bold">{metrics.totalListeningSessions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Average Skip Rate</span>
                </div>
                <span className="text-sm font-bold">{metrics.averageSkipRate}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">User Engagement Rate</span>
                </div>
                <span className="text-sm font-bold">
                  {metrics.userEngagementRate}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Total Listening Time</span>
                </div>
                <span className="text-sm font-bold">
                  {Math.round(metrics.totalListeningTime / 60)}h {Math.round(metrics.totalListeningTime % 60)}m
                </span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {metrics.totalRegisteredUsers > 0 ? `${metrics.activeListeners}/${metrics.totalRegisteredUsers}` : '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">Active vs Total Users</div>
                  <p className="text-xs text-green-600 mt-1">
                    {metrics.averageSkipRate < 20 ? 'High engagement detected' : 'Moderate engagement'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Security Monitoring */}
      <SecurityMonitoringPanel />
      
      {/* Detailed Security Incidents Analysis */}
      <SecurityIncidents />
    </div>
  );
};