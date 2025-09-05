import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const BulkStatusFixer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fixBulkStatus = async () => {
    setIsLoading(true);
    
    try {
      // First get current counts
      const { data: beforeCounts } = await supabase
        .from('tracks')
        .select('audio_status')
        .neq('audio_status', null);
      
      const beforeStats = beforeCounts?.reduce((acc, track) => {
        acc[track.audio_status || 'null'] = (acc[track.audio_status || 'null'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Update unknown tracks to working
      const { data: updateResult, error } = await supabase
        .from('tracks')
        .update({ audio_status: 'working' })
        .eq('audio_status', 'unknown')
        .not('storage_key', 'is', null)
        .not('storage_bucket', 'is', null)
        .select('id');

      if (error) throw error;

      // Get new counts
      const { data: afterCounts } = await supabase
        .from('tracks')
        .select('audio_status')
        .neq('audio_status', null);
      
      const afterStats = afterCounts?.reduce((acc, track) => {
        acc[track.audio_status || 'null'] = (acc[track.audio_status || 'null'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setResult({
        updatedCount: updateResult?.length || 0,
        beforeStats,
        afterStats
      });

      toast.success(`Updated ${updateResult?.length || 0} tracks from 'unknown' to 'working'`);
      
    } catch (err) {
      console.error('Bulk fix error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update tracks');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Bulk Status Fixer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mark all 'unknown' tracks as 'working' to make them available for playlists.
            This implements the "try to stream, if it fails move to next" approach.
          </p>
          
          <Button 
            onClick={fixBulkStatus} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Tracks...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Mark Unknown Tracks as Working
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-medium">
                  Updated {result.updatedCount} tracks
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-2">Before:</div>
                  {Object.entries(result.beforeStats).map(([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <span>{status}:</span>
                      <span>{String(count)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-medium mb-2">After:</div>
                  {Object.entries(result.afterStats).map(([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <span>{status}:</span>
                      <span>{String(count)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};