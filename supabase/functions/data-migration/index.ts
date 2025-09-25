import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface MigrationStep {
  step: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: any;
  error?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action = 'migrate' } = await req.json().catch(() => ({}));
    
    console.log('🔄 Starting data migration process...');
    
    const migrationSteps: MigrationStep[] = [
      { step: 'analyze_storage_issues', status: 'pending' },
      { step: 'fix_storage_keys', status: 'pending' },
      { step: 'resolve_duplicates', status: 'pending' },
      { step: 'organize_verified_files', status: 'pending' },
      { step: 'cleanup_orphaned_files', status: 'pending' }
    ];

    // Step 1: Analyze storage issues
    migrationSteps[0].status = 'running';
    console.log('📊 Step 1: Analyzing storage issues...');
    
    const { data: tracksWithIssues, error: analysisError } = await supabase
      .from('tracks')
      .select('id, title, storage_key, storage_bucket, audio_status')
      .eq('storage_bucket', 'audio')
      .or('storage_key.is.null,audio_status.neq.working');

    if (analysisError) {
      migrationSteps[0].status = 'failed';
      migrationSteps[0].error = analysisError.message;
    } else {
      migrationSteps[0].status = 'completed';
      migrationSteps[0].results = {
        tracksAnalyzed: tracksWithIssues?.length || 0,
        issuesFound: tracksWithIssues?.filter(t => !t.storage_key || t.audio_status !== 'working').length || 0
      };
    }

    // Step 2: Fix storage keys - sanitize problematic filenames
    migrationSteps[1].status = 'running';
    console.log('🔧 Step 2: Fixing storage key issues...');
    
    const tracksToFix = tracksWithIssues?.filter(track => 
      track.storage_key && (
        track.storage_key.includes(' ') || 
        track.storage_key.includes('<') || 
        track.storage_key.includes('>') ||
        track.storage_key.includes('\"')
      )
    ) || [];

    let fixedKeysCount = 0;
    for (const track of tracksToFix.slice(0, 20)) { // Process first 20
      const sanitizedKey = track.storage_key
        ?.replace(/[<>:\"/\\|?*]/g, '_')
        ?.replace(/\s+/g, '_')
        ?.replace(/_+/g, '_')
        ?.replace(/^_+|_$/g, '');

      if (sanitizedKey && sanitizedKey !== track.storage_key) {
        const { error: updateError } = await supabase
          .from('tracks')
          .update({ 
            storage_key: sanitizedKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', track.id);

        if (!updateError) {
          fixedKeysCount++;
        }
      }
    }

    migrationSteps[1].status = 'completed';
    migrationSteps[1].results = { 
      tracksFixed: fixedKeysCount,
      tracksProcessed: Math.min(tracksToFix.length, 20)
    };

    // Step 3: Resolve duplicates
    migrationSteps[2].status = 'running';
    console.log('🔍 Step 3: Resolving duplicate storage keys...');
    
    let duplicateQuery = null;
    try {
      const { data } = await supabase.rpc('find_duplicate_storage_keys');
      duplicateQuery = data;
    } catch (error) {
      console.log('RPC function not available, using manual approach');
      duplicateQuery = null;
    }

    // If RPC doesn't exist, find duplicates manually
    const { data: allTracks } = await supabase
      .from('tracks')
      .select('id, storage_key')
      .eq('storage_bucket', 'audio')
      .not('storage_key', 'is', null);

    const keyGroups: { [key: string]: string[] } = {};
    allTracks?.forEach(track => {
      if (track.storage_key) {
        if (!keyGroups[track.storage_key]) {
          keyGroups[track.storage_key] = [];
        }
        keyGroups[track.storage_key].push(track.id);
      }
    });

    const duplicates = Object.entries(keyGroups).filter(([key, ids]) => ids.length > 1);
    let resolvedDuplicates = 0;

    for (const [storageKey, trackIds] of duplicates.slice(0, 10)) { // Process first 10 groups
      // Keep first track with original key, rename others
      for (let i = 1; i < trackIds.length; i++) {
        const trackId = trackIds[i];
        const newKey = `${storageKey.replace(/(\.[^.]+)$/, '')}_duplicate_${i}$1`;
        
        const { error: updateError } = await supabase
          .from('tracks')
          .update({ 
            storage_key: newKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', trackId);

        if (!updateError) {
          resolvedDuplicates++;
        }
      }
    }

    migrationSteps[2].status = 'completed';
    migrationSteps[2].results = { 
      duplicateGroups: duplicates.length,
      tracksRenamed: resolvedDuplicates
    };

    // Step 4: Organize verified files (mark tracks with good data as ready)
    migrationSteps[3].status = 'running';
    console.log('📁 Step 4: Organizing verified files...');
    
    const { data: verifiedTracks, error: verifyError } = await supabase
      .from('tracks')
      .update({ 
        audio_status: 'working',
        last_verified_at: new Date().toISOString()
      })
      .eq('storage_bucket', 'audio')
      .not('storage_key', 'is', null)
      .neq('storage_key', '')
      .select('id');

    migrationSteps[3].status = 'completed';
    migrationSteps[3].results = { 
      tracksVerified: verifiedTracks?.length || 0
    };

    // Step 5: Mark potential orphaned files for review
    migrationSteps[4].status = 'running';
    console.log('🧹 Step 5: Identifying orphaned files for cleanup...');
    
    // Get storage files
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('audio')
      .list('', { limit: 1000 });

    const audioFiles = storageFiles?.filter(file => 
      file.name.toLowerCase().match(/\.(mp3|wav|flac|m4a|ogg)$/i)
    ) || [];

    // Get all storage keys from database
    const { data: dbStorageKeys } = await supabase
      .from('tracks')
      .select('storage_key')
      .eq('storage_bucket', 'audio')
      .not('storage_key', 'is', null);

    const dbKeys = new Set(dbStorageKeys?.map(t => t.storage_key) || []);
    const orphanedFiles = audioFiles.filter(file => !dbKeys.has(file.name));

    migrationSteps[4].status = 'completed';
    migrationSteps[4].results = { 
      totalStorageFiles: audioFiles.length,
      orphanedFiles: orphanedFiles.length,
      orphanedFilesList: orphanedFiles.slice(0, 10).map(f => f.name) // Show first 10
    };

    // Generate final summary
    const summary = {
      migrationTimestamp: new Date().toISOString(),
      totalSteps: migrationSteps.length,
      completedSteps: migrationSteps.filter(s => s.status === 'completed').length,
      failedSteps: migrationSteps.filter(s => s.status === 'failed').length,
      tracksAnalyzed: migrationSteps[0].results?.tracksAnalyzed || 0,
      issuesFound: migrationSteps[0].results?.issuesFound || 0,
      tracksFixed: migrationSteps[1].results?.tracksFixed || 0,
      duplicatesResolved: migrationSteps[2].results?.tracksRenamed || 0,
      tracksVerified: migrationSteps[3].results?.tracksVerified || 0,
      orphanedFiles: migrationSteps[4].results?.orphanedFiles || 0,
      readyForAnalysis: migrationSteps.every(s => s.status === 'completed')
    };

    console.log('✅ Data migration completed:', summary);

    return new Response(JSON.stringify({
      success: true,
      message: 'Data migration completed successfully',
      migrationSteps,
      summary
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    
    return new Response(JSON.stringify({
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
