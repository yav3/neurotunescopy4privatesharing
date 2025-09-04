import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Step 1: Get all storage files
    console.log('🔍 Scanning audio storage bucket...');
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('audio')
      .list('', { limit: 1000 });

    if (storageError) {
      throw new Error(`Storage scan failed: ${storageError.message}`);
    }

    const audioFiles = storageFiles?.filter(file => 
      file.name.toLowerCase().match(/\.(mp3|wav|flac|m4a|ogg)$/i)
    ) || [];

    console.log(`📁 Found ${audioFiles.length} audio files in storage`);

    // Step 2: Get only tracks from audio storage bucket
    const { data: dbTracks, error: dbError } = await supabase
      .from('tracks')
      .select('id, title, storage_key, storage_bucket, audio_status, file_path, original_title')
      .eq('storage_bucket', 'audio');

    if (dbError) {
      throw new Error(`Database query failed: ${dbError.message}`);
    }

    console.log(`🗃️ Found ${dbTracks?.length || 0} tracks in database`);

    // Step 3: Cross-reference and build mapping
    const storageMap = new Map(audioFiles.map(file => [file.name.toLowerCase(), file]));
    const unmatchedFiles = [...audioFiles];
    const matchedTracks = [];
    const unmatchedTracks = [];
    const updates = [];

    for (const track of dbTracks || []) {
      let matched = false;
      let bestMatch = null;
      let matchType = '';

      // Try exact storage_key match first
      if (track.storage_key && storageMap.has(track.storage_key.toLowerCase())) {
        bestMatch = storageMap.get(track.storage_key.toLowerCase());
        matchType = 'exact_storage_key';
        matched = true;
      }

      // Try title-based matching
      if (!matched && track.title) {
        const titleVariants = [
          `${track.title}.mp3`,
          `${track.title}.wav`,
          `${track.title}.flac`,
          track.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.mp3',
          track.title.toLowerCase().replace(/\s+/g, '_') + '.mp3'
        ];

        for (const variant of titleVariants) {
          if (storageMap.has(variant.toLowerCase())) {
            bestMatch = storageMap.get(variant.toLowerCase());
            matchType = 'title_match';
            matched = true;
            break;
          }
        }
      }

      // Try fuzzy matching
      if (!matched) {
        const trackTitle = (track.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        let bestScore = 0;
        
        for (const file of audioFiles) {
          const fileName = file.name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, '');
          const score = calculateSimilarity(trackTitle, fileName);
          
          if (score > 0.7 && score > bestScore) {
            bestMatch = file;
            bestScore = score;
            matchType = `fuzzy_match_${Math.round(score * 100)}%`;
            matched = true;
          }
        }
      }

      if (matched && bestMatch) {
        matchedTracks.push({
          trackId: track.id,
          title: track.title,
          currentStorageKey: track.storage_key,
          newStorageKey: bestMatch.name,
          matchType,
          needsUpdate: track.storage_key !== bestMatch.name || track.audio_status !== 'working'
        });

        // Prepare update if needed
        if (track.storage_key !== bestMatch.name || track.audio_status !== 'working') {
          updates.push({
            id: track.id,
            storage_key: bestMatch.name,
            audio_status: 'working',
            storage_bucket: 'audio'
          });
        }

        // Remove from unmatched list
        const index = unmatchedFiles.findIndex(f => f.name === bestMatch.name);
        if (index > -1) unmatchedFiles.splice(index, 1);
      } else {
        unmatchedTracks.push({
          trackId: track.id,
          title: track.title,
          currentStorageKey: track.storage_key,
          currentStatus: track.audio_status
        });
      }
    }

    // Step 4: Apply updates if requested
    let updatesApplied = 0;
    const { applyUpdates = false } = await req.json().catch(() => ({}));

    if (applyUpdates && updates.length > 0) {
      console.log(`🔧 Applying ${updates.length} updates...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('tracks')
          .update({
            storage_key: update.storage_key,
            audio_status: update.audio_status,
            storage_bucket: update.storage_bucket
          })
          .eq('id', update.id);

        if (!updateError) {
          updatesApplied++;
        } else {
          console.error(`Failed to update track ${update.id}:`, updateError);
        }
      }
    }

    // Step 5: Generate comprehensive report
    const report = {
      summary: {
        totalStorageFiles: audioFiles.length,
        totalDatabaseTracks: dbTracks?.length || 0,
        matchedTracks: matchedTracks.length,
        unmatchedTracks: unmatchedTracks.length,
        unmatchedFiles: unmatchedFiles.length,
        updatesNeeded: updates.length,
        updatesApplied: updatesApplied
      },
      matches: matchedTracks,
      unmatchedTracks: unmatchedTracks.slice(0, 20), // Limit for response size
      unmatchedFiles: unmatchedFiles.slice(0, 20).map(f => ({
        name: f.name,
        size: f.metadata?.size,
        lastModified: f.updated_at
      })),
      updates: applyUpdates ? [] : updates.slice(0, 10) // Show preview unless applied
    };

    console.log('✅ Analysis complete:', report.summary);

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      summary: { error: true }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Similarity calculation using Levenshtein distance
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0) return 0;
  if (b.length === 0) return 0;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,     // deletion
        matrix[j][i - 1] + 1,     // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }

  const maxLen = Math.max(a.length, b.length);
  return (maxLen - matrix[b.length][a.length]) / maxLen;
}