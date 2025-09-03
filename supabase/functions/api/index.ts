// supabase/functions/api/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

// ---- CORS (include methods + expose headers for streaming/HEAD) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Type, Content-Length',
};

// ---- Goal aliases for tolerant matching ----
const alias: Record<string, string[]> = {
  'anxiety-relief':     ['anxiety','calm','relax','anxiety_down'],
  'focus-enhancement':  ['focus','concentration','study','focus_up'],
  'sleep-preparation':  ['sleep','deep sleep','delta'],
  'mood-boost':         ['mood','happy','uplift'],
  'stress-reduction':   ['stress','relaxation'],
  'meditation-support': ['meditation','mindfulness','theta'],
};

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const DEFAULT_BUCKET = Deno.env.get('BUCKET') ?? 'neuralpositivemusic';

function wordsFor(goal: string): string[] {
  const g = goal.toLowerCase().trim().replace(/[_\s]+/g, '-');
  return [g, ...(alias[g] ?? [])];
}

function sb() {
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error('Missing SUPABASE_URL or SERVICE_ROLE key');
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false }});
}

Deno.serve(async (req) => {
  const { method } = req;
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/{2,}/g, '/'); // normalize
  console.log(`📝 ${method} ${path}`);

  // CORS preflight
  if (method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    // Health on common paths
    if (path === '/' || path === '/health' || path === '/api/health') {
      return json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // Playlist on all likely paths
    if (['/playlist','/api/playlist','/v1/playlist','/api/v1/playlist'].includes(path)) {
      return handlePlaylistRequest(req);
    }

    // Stream on both forms
    if (path === '/stream' || path === '/api/stream') {
      return handleStreamRequest(req);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (err) {
    console.error('API Error:', err);
    return json({ error: 'Internal Server Error' }, 500);
  }
});

// ---------- Helpers ----------
function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ---------- Handlers ----------
async function handlePlaylistRequest(req: Request): Promise<Response> {
  const supabase = sb();
  const url = new URL(req.url);
  const rawGoal = (url.searchParams.get('goal') || '').toString();
  const limit  = Math.max(1, Math.min(parseInt(url.searchParams.get('limit')  || '50', 10), 200));
  const offset = Math.max(0,       parseInt(url.searchParams.get('offset') || '0',  10));
  const to = offset + limit - 1;

  console.log(`🎵 /playlist goal="${rawGoal}" limit=${limit} offset=${offset}`);

  // Build word list once (slug + aliases)
  const searchWords = wordsFor(rawGoal);

  // Helper to run the query with a given set of columns for OR
  const run = async (cols: string[]) => {
    const orExpr =
      cols.length && rawGoal.trim()
        ? '(' + cols.flatMap(col => searchWords.map(w => `${col}.ilike.%${w}%`)).join(',') + ')'
        : '';

    let q = supabase
      .from('tracks')
      .select('id,title,goal,storage_key', { count: 'exact' })
      .not('storage_key','is',null)
      .neq('storage_key','')
      // IMPORTANT: use ONLY range() for paging
      .order('id', { ascending: true })
      .range(offset, to);

    if (orExpr) q = q.or(orExpr);

    return q;
  };

  // Try progressively smaller column sets to avoid "column does not exist" errors
  const columnPlans: string[][] = [
    ['goal','mood','genre','tags'],
    ['goal','mood','genre'],
    ['goal','genre'],
    ['goal'],
    [], // no filter (just return recent playable tracks)
  ];

  for (const cols of columnPlans) {
    const { data, error } = await run(cols);
    if (!error) {
      const tracks = data ?? [];
      console.log(`✅ /playlist using cols=[${cols.join(',')}] -> ${tracks.length} tracks`);
      return new Response(
        JSON.stringify({ tracks, total: tracks.length, nextOffset: offset + tracks.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Log and try the next plan if it looks like a schema mismatch
    console.warn(`/playlist plan [${cols.join(',')}]: ${error.message}`);
  }

  // If all plans failed, return the last error explicitly
  return new Response(
    JSON.stringify({ ok:false, error: 'PlaylistQueryFailed' }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleStreamRequest(req: Request): Promise<Response> {
  const supabase = sb();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) return new Response('Missing track ID', { status: 400, headers: corsHeaders });

  const { data: row, error } = await supabase
    .from('tracks')
    .select('storage_bucket, storage_key, title')
    .eq('id', id)
    .maybeSingle();

  if (error || !row)       return json({ ok:false, error:'TrackNotFound', id }, 404);
  if (!row.storage_key)    return json({ ok:false, error:'MissingStorageKey', id }, 404);

  const bucket = row.storage_bucket || DEFAULT_BUCKET;
  const signed = await supabase.storage.from(bucket).createSignedUrl(row.storage_key, 1800);
  if (!signed.data?.signedUrl) {
    console.error(`Sign failed ${bucket}:${row.storage_key}`);
    return json({ ok:false, error:'ObjectNotFound', bucket, key: row.storage_key, id }, 404);
  }

  // Proxy stream with Range; add cache & expose headers for browsers
  const range = req.headers.get('range');
  const upstream = await fetch(signed.data.signedUrl, { method: req.method, headers: range ? { Range: range } : {} });

  const h = new Headers(upstream.headers);
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Accept-Ranges', 'bytes');
  h.set('Cache-Control', 'public, max-age=3600');
  if (!h.get('Content-Type') && row.storage_key.toLowerCase().endsWith('.mp3')) h.set('Content-Type','audio/mpeg');

  return new Response(req.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers: h });
}