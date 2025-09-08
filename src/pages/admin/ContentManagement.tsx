import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Music, Play, Pause, Edit, Trash2, Upload, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  bpm?: number;
  audio_status: string;
  storage_bucket?: string;
  storage_key?: string;
  created_at?: string;
  valence?: number;
  energy_level?: number;
}

interface Playlist {
  id: number;
  name: string;
  description: string;
  track_count: number;
  created_date: string;
}

export default function ContentManagement() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch tracks
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (tracksError) throw tracksError;

      // Fetch playlists
      const { data: playlistsData, error: playlistsError } = await supabase
        .from('playlists')
        .select('*')
        .order('created_date', { ascending: false });

      if (playlistsError) throw playlistsError;

      setTracks(tracksData || []);
      setPlaylists(playlistsData || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch content: ' + error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTrackStatus = async (trackId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update({ audio_status: newStatus })
        .eq('id', trackId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Track status updated successfully'
      });

      fetchContent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update track status: ' + error.message,
        variant: 'destructive'
      });
    }
  };

  const deleteTrack = async (trackId: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;

    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Track deleted successfully'
      });

      fetchContent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete track: ' + error.message,
        variant: 'destructive'
      });
    }
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || track.audio_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'working':
        return 'default';
      case 'missing':
        return 'destructive';
      case 'problematic':
        return 'secondary';
      case 'unknown':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Manage tracks, playlists, and audio content.
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Content
        </Button>
      </div>

      <Tabs defaultValue="tracks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="analytics">Content Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Track Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tracks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="working">Working</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                    <SelectItem value="problematic">Problematic</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tracks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tracks ({filteredTracks.length})</CardTitle>
              <CardDescription>
                Manage audio tracks and their metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>BPM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTracks.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <Music className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {track.valence && `Valence: ${track.valence.toFixed(2)}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{track.artist}</TableCell>
                      <TableCell>{formatDuration(track.duration)}</TableCell>
                      <TableCell>{track.bpm}</TableCell>
                      <TableCell>
                        <Select
                          value={track.audio_status}
                          onValueChange={(value) => updateTrackStatus(track.id, value)}
                        >
                          <SelectTrigger className="w-28">
                            <Badge variant={getStatusBadgeVariant(track.audio_status)}>
                              {track.audio_status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="working">Working</SelectItem>
                            <SelectItem value="missing">Missing</SelectItem>
                            <SelectItem value="problematic">Problematic</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{track.storage_bucket}</p>
                          <p className="text-muted-foreground truncate max-w-20">
                            {track.storage_key}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteTrack(track.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Playlists ({playlists.length})</CardTitle>
              <CardDescription>
                Manage curated playlists and collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tracks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playlists.map((playlist) => (
                    <TableRow key={playlist.id}>
                      <TableCell className="font-medium">{playlist.name}</TableCell>
                      <TableCell>{playlist.description}</TableCell>
                      <TableCell>{playlist.track_count}</TableCell>
                      <TableCell>{new Date(playlist.created_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tracks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {tracks.filter(t => t.audio_status === 'working').length} working
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Missing Files</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {tracks.filter(t => t.audio_status === 'missing').length}
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDuration(Math.round(tracks.reduce((acc, t) => acc + t.duration, 0) / tracks.length) || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Per track</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Playlists</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{playlists.length}</div>
                <p className="text-xs text-muted-foreground">Active collections</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}