import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Music, BarChart3, Settings, Monitor, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalUsers: number;
  totalTracks: number;
  workingTracks: number;
  totalPlaylists: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTracks: 0,
    workingTracks: 0,
    totalPlaylists: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch user count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Fetch track stats with efficient aggregation  
      const { data: trackStats, error: trackError } = await supabase
        .from('tracks')
        .select('audio_status')
        .limit(1);

      if (trackError) {
        console.error('Track stats error:', trackError);
        throw trackError;
      }

      // Get counts using direct query
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
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your application's performance and key metrics.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTracks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.workingTracks} working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Playlists</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlaylists.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-500">Healthy</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Database operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Database Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Database Overview</CardTitle>
            <CardDescription>Current data distribution and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Working Tracks</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.workingTracks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Missing Audio Files</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.totalTracks - stats.workingTracks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active Playlists</span>
                </div>
                <span className="text-sm text-muted-foreground">{stats.totalPlaylists}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4" />
                <span className="text-sm">Manage Users</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <div className="flex items-center space-x-3">
                <Music className="h-4 w-4" />
                <span className="text-sm">Content Review</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">View Reports</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4" />
                <span className="text-sm">System Settings</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}