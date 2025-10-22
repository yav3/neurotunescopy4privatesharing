import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Ban, SkipForward, User } from 'lucide-react';
import { toast } from 'sonner';

interface FavoriteData {
  id: string;
  user_id: string;
  track_id: number;
  created_at: string;
  user_email?: string;
}

interface BlockedData {
  id: string;
  user_id: string;
  track_id: number;
  blocked_at: string;
  user_email?: string;
}

interface SkipData {
  id: string;
  user_id: string;
  skip_rate: number;
  tracks_played: number;
  session_date: string;
  user_email?: string;
}

export default function UserEngagement() {
  const [favorites, setFavorites] = useState<FavoriteData[]>([]);
  const [blocked, setBlocked] = useState<BlockedData[]>([]);
  const [skips, setSkips] = useState<SkipData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load favorites with user emails
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('*, user_email:user_id')
        .order('created_at', { ascending: false })
        .limit(500);

      if (favError) throw favError;
      setFavorites(favData || []);

      // Load blocked tracks with user emails
      const { data: blockData, error: blockError } = await supabase
        .from('blocked_tracks')
        .select('*, user_email:user_id')
        .order('blocked_at', { ascending: false })
        .limit(500);

      if (blockError) throw blockError;
      setBlocked(blockData || []);

      // Load sessions with high skip rates
      const { data: skipData, error: skipError } = await supabase
        .from('listening_sessions')
        .select('id, user_id, skip_rate, tracks_played, session_date')
        .gt('skip_rate', 0)
        .order('session_date', { ascending: false })
        .limit(500);

      if (skipError) throw skipError;
      setSkips(skipData || []);

      toast.success('Data loaded successfully');
    } catch (error: any) {
      console.error('Error loading engagement data:', error);
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Engagement Tracking</h1>
        <p className="text-muted-foreground">Review user likes, blocks, and skips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
            <Ban className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocked.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions w/ Skips</CardTitle>
            <SkipForward className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skips.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList>
          <TabsTrigger value="favorites">
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="blocked">
            <Ban className="h-4 w-4 mr-2" />
            Blocked
          </TabsTrigger>
          <TabsTrigger value="skips">
            <SkipForward className="h-4 w-4 mr-2" />
            Skips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>User Favorites</CardTitle>
              <CardDescription>Tracks that users have liked</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No favorites yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User ID</th>
                        <th className="text-left p-2">Track ID</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {favorites.map((fav) => (
                        <tr key={fav.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono text-sm">{fav.user_id.slice(0, 8)}...</td>
                          <td className="p-2">{fav.track_id}</td>
                          <td className="p-2 text-sm text-muted-foreground">{formatDate(fav.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Tracks</CardTitle>
              <CardDescription>Tracks that users have blocked</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : blocked.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No blocked tracks yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User ID</th>
                        <th className="text-left p-2">Track Hash</th>
                        <th className="text-left p-2">Date Blocked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blocked.map((block) => (
                        <tr key={block.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono text-sm">{block.user_id.slice(0, 8)}...</td>
                          <td className="p-2">{block.track_id}</td>
                          <td className="p-2 text-sm text-muted-foreground">{formatDate(block.blocked_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skips">
          <Card>
            <CardHeader>
              <CardTitle>Skip Data</CardTitle>
              <CardDescription>Sessions with skip activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : skips.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No skip data yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User ID</th>
                        <th className="text-left p-2">Skip Rate</th>
                        <th className="text-left p-2">Tracks Played</th>
                        <th className="text-left p-2">Session Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skips.map((skip) => (
                        <tr key={skip.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono text-sm">{skip.user_id.slice(0, 8)}...</td>
                          <td className="p-2">
                            <span className={`font-semibold ${skip.skip_rate > 0.5 ? 'text-red-500' : 'text-yellow-500'}`}>
                              {(skip.skip_rate * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-2">{skip.tracks_played}</td>
                          <td className="p-2 text-sm text-muted-foreground">{formatDate(skip.session_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
