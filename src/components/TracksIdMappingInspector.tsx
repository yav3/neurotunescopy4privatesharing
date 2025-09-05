import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function TracksIdMappingInspector() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const inspectMappingTable = async () => {
    setLoading(true);
    setResults(null);

    try {
      console.log('🔍 Inspecting tracks_id_mapping table...');

      // Get sample mapping records
      const { data: mappings, error } = await supabase
        .from('tracks_id_mapping')
        .select('*')
        .limit(10);

      if (error) {
        setResults({
          error: error.message,
          status: 'ERROR'
        });
        return;
      }

      if (!mappings || mappings.length === 0) {
        setResults({
          message: 'tracks_id_mapping table is empty or does not exist',
          status: 'EMPTY'
        });
        return;
      }

      // Analyze the mapping structure
      const sampleMapping = mappings[0];
      const fields = Object.keys(sampleMapping);
      
      // Count total records
      const { count } = await supabase
        .from('tracks_id_mapping')
        .select('*', { count: 'exact', head: true });

      // Look for patterns in the mapping data
      const hasNewIds = mappings.some(m => 
        m.new_id && m.new_id.match(/^[0-9a-f-]{36}$/)
      );

      const hasOldIds = mappings.some(m => 
        m.old_id && typeof m.old_id === 'number'
      );

      setResults({
        status: 'SUCCESS',
        totalRecords: count,
        sampleMappings: mappings,
        tableFields: fields,
        analysis: {
          hasNewIds,
          hasOldIds,
          sampleMapping
        }
      });

      console.log('✅ Mapping table inspection complete:', {
        totalRecords: count,
        fields,
        sampleMappings: mappings.slice(0, 3)
      });

    } catch (error) {
      console.error('❌ Mapping inspection failed:', error);
      setResults({
        error: error.message,
        status: 'ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Tracks ID Mapping Inspector
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Check the tracks_id_mapping table to understand how database IDs connect to real filenames
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={inspectMappingTable} disabled={loading}>
              {loading ? 'Inspecting...' : 'Inspect Mapping Table'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.status === 'SUCCESS' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Mapping Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.error && (
                <div className="p-3 border border-red-200 rounded bg-red-50 text-red-700">
                  Error: {results.error}
                </div>
              )}

              {results.totalRecords && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total Records:</strong> {results.totalRecords}
                  </div>
                  <div>
                    <strong>Table Fields:</strong> {results.tableFields?.join(', ')}
                  </div>
                </div>
              )}

              {results.sampleMappings && (
                <details className="border rounded">
                  <summary className="p-3 cursor-pointer font-medium">
                    Sample Mappings ({results.sampleMappings.length})
                  </summary>
                  <div className="p-3 pt-0">
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(results.sampleMappings.slice(0, 5), null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}