import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, FileQuestion } from 'lucide-react';
import { toast } from 'sonner';

interface TrackDiagnostic {
  track_id: string;
  title: string;
  storage_bucket: string;
  storage_key: string;
  audio_status: string;
  last_error: string;
  last_verified_at: string;
  created_at: string;
  issue_category: string;
  issue_description: string;
  suggested_fix: string;
  days_broken: number;
}

interface Summary {
  total_unplayable: number;
  missing_metadata: number;
  missing_bucket: number;
  file_not_found: number;
  file_corrupted: number;
  never_verified: number;
  needs_reverification: number;
  oldest_issue_days: number;
  by_bucket: Record<string, number>;
}

export default function TrackHealthDashboard() {
  const [diagnostics, setDiagnostics] = useState<TrackDiagnostic[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load summary
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_unplayable_tracks_summary');
      
      if (summaryError) throw summaryError;
      
      const rawSummary = summaryData?.[0];
      if (rawSummary) {
        setSummary({
          ...rawSummary,
          by_bucket: (rawSummary.by_bucket as any) || {}
        } as Summary);
      }

      // Load diagnostics
      const { data: diagnosticsData, error: diagnosticsError } = await supabase
        .rpc('get_unplayable_tracks_diagnostic');
      
      if (diagnosticsError) throw diagnosticsError;
      setDiagnostics(diagnosticsData || []);

      toast.success('Report loaded successfully');
    } catch (error) {
      console.error('Error loading track health data:', error);
      toast.error('Failed to load track health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'missing_metadata': return <FileQuestion className="h-4 w-4" />;
      case 'missing_bucket': return <XCircle className="h-4 w-4" />;
      case 'file_not_found': return <AlertTriangle className="h-4 w-4" />;
      case 'file_corrupted': return <XCircle className="h-4 w-4" />;
      case 'never_verified': return <Clock className="h-4 w-4" />;
      case 'needs_reverification': return <RefreshCw className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'missing_metadata':
      case 'missing_bucket':
        return 'destructive';
      case 'file_not_found':
      case 'file_corrupted':
        return 'destructive';
      case 'never_verified':
        return 'secondary';
      case 'needs_reverification':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const filteredDiagnostics = selectedCategory
    ? diagnostics.filter(d => d.issue_category === selectedCategory)
    : diagnostics;

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Track Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor and diagnose unplayable music tracks</p>
        </div>
        <Button onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.total_unplayable || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Oldest: {summary?.oldest_issue_days || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {(summary?.missing_metadata || 0) + (summary?.missing_bucket || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Missing metadata/bucket</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Files Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.file_not_found || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">404 errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Needs Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(summary?.never_verified || 0) + (summary?.needs_reverification || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unverified tracks</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Categories</CardTitle>
          <CardDescription>Click a category to filter results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Issues ({diagnostics.length})
            </Button>
            {Object.entries({
              missing_metadata: summary?.missing_metadata || 0,
              missing_bucket: summary?.missing_bucket || 0,
              file_not_found: summary?.file_not_found || 0,
              file_corrupted: summary?.file_corrupted || 0,
              never_verified: summary?.never_verified || 0,
              needs_reverification: summary?.needs_reverification || 0,
            }).map(([category, count]) => (
              count > 0 && (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category.replace(/_/g, ' ')} ({count})</span>
                </Button>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Diagnostics</CardTitle>
          <CardDescription>
            {selectedCategory 
              ? `Showing ${filteredDiagnostics.length} tracks with ${selectedCategory.replace(/_/g, ' ')} issues`
              : `Showing all ${filteredDiagnostics.length} unplayable tracks`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDiagnostics.slice(0, 50).map((track) => (
              <div key={track.track_id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{track.title}</h4>
                      <Badge variant={getCategoryColor(track.issue_category)}>
                        {track.issue_category.replace(/_/g, ' ')}
                      </Badge>
                      {track.days_broken > 30 && (
                        <Badge variant="destructive">
                          {track.days_broken} days broken
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {track.storage_bucket} / {track.storage_key || '(no key)'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Issue:</p>
                    <p className="text-muted-foreground">{track.issue_description}</p>
                  </div>
                  <div>
                    <p className="font-medium">Suggested Fix:</p>
                    <p className="text-muted-foreground">{track.suggested_fix}</p>
                  </div>
                </div>

                {track.last_error && (
                  <div className="text-sm">
                    <p className="font-medium">Last Error:</p>
                    <p className="text-muted-foreground font-mono text-xs bg-muted p-2 rounded">
                      {track.last_error}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredDiagnostics.length > 50 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing first 50 of {filteredDiagnostics.length} results
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
