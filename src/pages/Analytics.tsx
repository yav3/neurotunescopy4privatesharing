import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Music, 
  Calendar,
  Clock,
  Heart,
  Smartphone,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalSessions: number;
  avgSessionDuration: number;
  totalListeningTime: number;
  popularGenres: Array<{ genre: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  dailyActiveUsers: Array<{ date: string; count: number }>;
  userGrowth: Array<{ date: string; new_users: number; total_users: number }>;
}

interface UserDetails {
  id: string;
  display_name: string;
  created_at: string;
  last_session: string;
  total_sessions: number;
  total_listening_time: number;
  favorite_genres: string[];
  role: string;
}

const Analytics: React.FC = () => {
  const { user, hasRole } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
  const [timeframe, setTimeframe] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Check VIP access
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!hasRole(['premium_user', 'moderator', 'admin', 'super_admin'])) {
      navigate('/');
      return;
    }

    loadAnalyticsData();
    loadUserDetails();
  }, [user, hasRole, timeframe]);

  const loadAnalyticsData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const days = parseInt(timeframe);
      const startDate = startOfDay(subDays(new Date(), days));
      const endDate = endOfDay(new Date());

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (users with sessions in timeframe)
      const { data: activeSessions } = await supabase
        .from('listening_sessions')
        .select('user_id')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const activeUsers = new Set(activeSessions?.map(s => s.user_id)).size;

      // Get new users today
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay(new Date()).toISOString());

      // Get session data
      const { data: sessions } = await supabase
        .from('listening_sessions')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      const totalSessions = sessions?.length || 0;
      const totalListeningTime = sessions?.reduce((acc, s) => acc + (s.session_duration_minutes || 0), 0) || 0;
      const avgSessionDuration = totalSessions > 0 ? Math.round(totalListeningTime / totalSessions) : 0;

      // Get popular genres
      const genreCounts: Record<string, number> = {};
      sessions?.forEach(session => {
        if (session.dominant_genres) {
          session.dominant_genres.forEach((genre: string) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });
      
      const popularGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([genre, count]) => ({ genre, count }));

      // Get device breakdown
      const { data: userSessions } = await supabase
        .from('user_sessions')
        .select('device_info')
        .gte('created_at', startDate.toISOString());

      const deviceCounts: Record<string, number> = {};
      userSessions?.forEach(session => {
        const deviceInfo = session.device_info as any;
        const deviceType = deviceInfo?.device || 'Unknown';
        deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
      });

      const deviceBreakdown = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }));

      // Calculate daily active users
      const dailyActiveUsers: Array<{ date: string; count: number }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        const { data: daySessions } = await supabase
          .from('listening_sessions')
          .select('user_id')
          .gte('created_at', startOfDay(date).toISOString())
          .lte('created_at', endOfDay(date).toISOString());
        
        const uniqueUsers = new Set(daySessions?.map(s => s.user_id)).size;
        dailyActiveUsers.push({ date: dateStr, count: uniqueUsers });
      }

      setAnalyticsData({
        totalUsers: totalUsers || 0,
        activeUsers,
        newUsersToday: newUsersToday || 0,
        totalSessions,
        avgSessionDuration,
        totalListeningTime,
        popularGenres,
        deviceBreakdown,
        dailyActiveUsers,
        userGrowth: [] // Placeholder for now
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!profiles) return;

      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Get session data for each user
      const userDetailsPromises = profiles.map(async (profile) => {
        const { data: sessions } = await supabase
          .from('listening_sessions')
          .select('*')
          .eq('user_id', profile.user_id)
          .order('created_at', { ascending: false });

        const userRole = roles?.find(r => r.user_id === profile.user_id)?.role || 'user';
        
        const totalSessions = sessions?.length || 0;
        const totalListeningTime = sessions?.reduce((acc, s) => acc + (s.session_duration_minutes || 0), 0) || 0;
        const lastSession = sessions?.[0]?.created_at || 'Never';
        
        const genreCounts: Record<string, number> = {};
        sessions?.forEach(session => {
          if (session.dominant_genres) {
            session.dominant_genres.forEach((genre: string) => {
              genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
          }
        });
        
        const favoriteGenres = Object.entries(genreCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([genre]) => genre);

        return {
          id: profile.user_id,
          display_name: profile.display_name || 'Anonymous User',
          created_at: profile.created_at,
          last_session: lastSession,
          total_sessions: totalSessions,
          total_listening_time: totalListeningTime,
          favorite_genres: favoriteGenres,
          role: userRole
        };
      });

      const userDetailsResults = await Promise.all(userDetailsPromises);
      setUserDetails(userDetailsResults);

    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const exportData = async () => {
    try {
      const data = {
        analytics: analyticsData,
        users: userDetails,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto px-4 py-6 pb-32 sm:pb-36 mb-safe">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              User Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into user behavior and platform usage
            </p>
            <Badge variant="default" className="mt-2">VIP Access</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24h</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => { loadAnalyticsData(); loadUserDetails(); }} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.newUsersToday} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Activity className="w-4 h-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Last {timeframe} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Music className="w-4 h-4" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.totalSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg {analyticsData?.avgSessionDuration}min each
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Total Listening
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((analyticsData?.totalListeningTime || 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.totalListeningTime} minutes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Details</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Genres */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Popular Genres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData?.popularGenres.map((genre, index) => (
                      <div key={genre.genre} className="flex items-center justify-between">
                        <span className="text-sm">{genre.genre}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(genre.count / (analyticsData?.popularGenres[0]?.count || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {genre.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Device Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData?.deviceBreakdown.map((device) => (
                      <div key={device.device} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{device.device}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ 
                                width: `${(device.count / Math.max(...(analyticsData?.deviceBreakdown.map(d => d.count) || [1]))) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {device.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Active Users Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {analyticsData?.dailyActiveUsers.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-primary rounded-t w-full min-h-[4px]"
                        style={{ 
                          height: `${(day.count / Math.max(...(analyticsData?.dailyActiveUsers.map(d => d.count) || [1]))) * 200 + 4}px` 
                        }}
                      />
                      <div className="text-xs text-muted-foreground mt-2 rotate-45 origin-left">
                        {format(new Date(day.date), 'MM/dd')}
                      </div>
                      <div className="text-xs font-medium">{day.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>
                  Detailed view of all registered users and their activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDetails.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{user.display_name}</h4>
                          <Badge variant={user.role === 'user' ? 'secondary' : 'default'} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {format(new Date(user.created_at), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last session: {user.last_session !== 'Never' 
                            ? format(new Date(user.last_session), 'MMM d, yyyy')
                            : 'Never'
                          }
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium">{user.total_sessions} sessions</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(user.total_listening_time / 60)}h total
                        </div>
                        <div className="flex gap-1">
                          {user.favorite_genres.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  User engagement and retention analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <PieChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Advanced engagement metrics coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Device Analytics</CardTitle>
                <CardDescription>
                  Detailed device usage and platform statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Smartphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Advanced device analytics coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Analytics;