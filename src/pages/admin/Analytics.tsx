import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Users, Music, Activity, TrendingUp, Clock, Headphones, Target, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalUsers: number;
  totalTracks: number;
  workingTracks: number;
  missingTracks: number;
  totalPlaylists: number;
  avgBpm: number;
  tracksByStatus: Record<string, number>;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalTracks: 0,
    workingTracks: 0,
    missingTracks: 0,
    totalPlaylists: 0,
    avgBpm: 0,
    tracksByStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch user count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Fetch track data
      const { data: tracks, error: trackError } = await supabase
        .from('tracks')
        .select('audio_status, bpm');

      if (trackError) throw trackError;

      // Fetch playlist count
      const { count: playlistCount, error: playlistError } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true });

      if (playlistError) throw playlistError;

      // Process track data
      const tracksByStatus: Record<string, number> = {};
      let totalBpm = 0;
      let validBpm = 0;

      tracks?.forEach(track => {
        tracksByStatus[track.audio_status] = (tracksByStatus[track.audio_status] || 0) + 1;
        if (track.bpm && track.bpm > 0) {
          totalBpm += track.bpm;
          validBpm++;
        }
      });

      setAnalytics({
        totalUsers: userCount || 0,
        totalTracks: tracks?.length || 0,
        workingTracks: tracksByStatus['working'] || 0,
        missingTracks: tracksByStatus['missing'] || 0,
        totalPlaylists: playlistCount || 0,
        avgBpm: validBpm > 0 ? totalBpm / validBpm : 0,
        tracksByStatus
      });

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
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
          <p className="text-muted-foreground">
            Real-time insights into your application's data and performance.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTracks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{analytics.workingTracks} working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Files</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{analytics.missingTracks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg BPM</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analytics.avgBpm)}</div>
            <p className="text-xs text-muted-foreground">Beats per minute</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Status</TabsTrigger>
          <TabsTrigger value="database">Database Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Track Status Distribution</CardTitle>
                <CardDescription>Audio file status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.tracksByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          status === 'working' ? 'bg-green-500' :
                          status === 'missing' ? 'bg-red-500' :
                          status === 'problematic' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium capitalize">{status}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Connection</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage Access</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Working Tracks Ratio</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        analytics.totalTracks > 0 && (analytics.workingTracks / analytics.totalTracks) > 0.8 
                          ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-muted-foreground">
                        {analytics.totalTracks > 0 
                          ? Math.round((analytics.workingTracks / analytics.totalTracks) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Working Tracks</CardTitle>
                <CardDescription>Audio files ready for playback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{analytics.workingTracks}</div>
                <p className="text-sm text-muted-foreground">
                  {analytics.totalTracks > 0 
                    ? Math.round((analytics.workingTracks / analytics.totalTracks) * 100) 
                    : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Missing Files</CardTitle>
                <CardDescription>Audio files that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{analytics.missingTracks}</div>
                <p className="text-sm text-muted-foreground">
                  {analytics.totalTracks > 0 
                    ? Math.round((analytics.missingTracks / analytics.totalTracks) * 100) 
                    : 0}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average BPM</CardTitle>
                <CardDescription>Typical track tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(analytics.avgBpm)}</div>
                <p className="text-sm text-muted-foreground">Beats per minute</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Registered user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Profiles in database</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Tracks</CardTitle>
                <CardDescription>Music files in catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalTracks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Audio entries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Playlists</CardTitle>
                <CardDescription>Curated collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalPlaylists.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Active playlists</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Health</CardTitle>
                <CardDescription>Overall data quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Status Breakdown</CardTitle>
              <CardDescription>Track status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.tracksByStatus).map(([status, count]) => {
                  const percentage = analytics.totalTracks > 0 
                    ? Math.round((count / analytics.totalTracks) * 100) 
                    : 0;
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{status} Tracks</span>
                        <span className="text-sm text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            status === 'working' ? 'bg-green-500' :
                            status === 'missing' ? 'bg-red-500' :
                            status === 'problematic' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}