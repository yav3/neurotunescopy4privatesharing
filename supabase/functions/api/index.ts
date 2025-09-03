import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Goal aliases for tolerant matching
const alias: Record<string, string[]> = {
  "anxiety-relief": ["anxiety", "calm", "relax", "anxiety_down"],
  "focus-enhancement": ["focus", "concentration", "study", "focus_up"],
  "sleep-preparation": ["sleep", "deep sleep", "delta"],
  "mood-boost": ["mood", "happy", "uplift"],
  "stress-reduction": ["stress", "relaxation"],
  "meditation-support": ["meditation", "mindfulness", "theta"],
};

function wordsFor(goal: string): string[] {
  const g = goal.toLowerCase().trim().replace(/[_\s]+/g, "-");
  return [g, ...(alias[g] ?? [])];
}

Deno.serve(async (req) => {
  const { method } = req;
  const url = new URL(req.url);
  
  console.log(`📝 ${method} ${url.pathname}`);

  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Route to appropriate handler - support both /api prefix and direct paths
    if (url.pathname === '/health' || url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (url.pathname === '/playlist' || url.pathname === '/api/playlist' || url.pathname === '/v1/playlist' || url.pathname === '/api/v1/playlist') {
      return handlePlaylistRequest(req);
    }
    
    if (url.pathname === '/stream' || url.pathname === '/api/stream') {
      return handleStreamRequest(req);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
    
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handlePlaylistRequest(req: Request): Promise<Response> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const goal = url.searchParams.get('goal') || '';
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  console.log(`🎵 Playlist request for goal: ${goal} limit: ${limit} offset: ${offset}`);

  // Get search words for the goal
  const searchWords = wordsFor(goal);
  
  // Build OR expression for flexible goal matching using actual table columns
  const orConditions = searchWords.flatMap(word => [
    `mood.ilike.%${word}%`,
    `genre.ilike.%${word}%`,
    `therapeutic_use.cs.{${word}}`,
    `emotion_tags.cs.{${word}}`,
    `eeg_targets.cs.{${word}}`
  ]).join(',');

  // Query tracks with verified storage keys and flexible goal matching
  let query = supabase
    .from('tracks')
    .select('*')
    .not('storage_key', 'is', null)
    .neq('storage_key', '');

  // Only add goal filtering if goal is provided
  if (goal && goal.trim()) {
    query = query.or(orConditions);
  }

  const { data: tracks, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Database error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const verifiedTracks = tracks || [];
  console.log(`✅ Found ${verifiedTracks.length} verified tracks for goal: ${goal}`);

  return new Response(
    JSON.stringify({
      tracks: verifiedTracks,
      total: verifiedTracks.length,
      nextOffset: offset + verifiedTracks.length
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleStreamRequest(req: Request): Promise<Response> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const url = new URL(req.url);
  const trackId = url.searchParams.get('id');

  if (!trackId) {
    return new Response('Missing track ID', { status: 400, headers: corsHeaders });
  }

  // Get track metadata
  const { data: row, error } = await supabase
    .from('tracks')
    .select('storage_bucket, storage_key, title')
    .eq('id', trackId)
    .maybeSingle();

  if (error || !row) {
    console.error(`Track not found: ${trackId}`);
    return new Response(
      JSON.stringify({ ok: false, error: "TrackNotFound", id: trackId }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!row.storage_key) {
    console.error(`Missing storage key for track: ${trackId}`);
    return new Response(
      JSON.stringify({ ok: false, error: "MissingStorageKey", id: trackId }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const bucket = row.storage_bucket || 'neuralpositivemusic';
  const signed = await supabase.storage.from(bucket).createSignedUrl(row.storage_key, 1800);

  if (!signed.data?.signedUrl) {
    console.error(`Failed to generate signed URL for ${row.storage_key} in ${row.storage_bucket}`);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: "ObjectNotFound", 
        bucket: row.storage_bucket, 
        key: row.storage_key, 
        id: trackId 
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  // Proxy the stream
  const range = req.headers.get('range');
  const upstream = await fetch(signed.data.signedUrl, {
    method: req.method,
    headers: range ? { Range: range } : {}
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Accept-Ranges', 'bytes');
  
  if (!responseHeaders.get('Content-Type') && row.storage_key.toLowerCase().endsWith('.mp3')) {
    responseHeaders.set('Content-Type', 'audio/mpeg');
  }

  return new Response(
    req.method === 'HEAD' ? null : upstream.body,
    { status: upstream.status, headers: responseHeaders }
  );
}