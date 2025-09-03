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
  const rawGoal = (url.searchParams.get("goal") || "").toString();
  const limit  = Math.max(1, Math.min(parseInt(url.searchParams.get("limit")  || "50", 10), 200));
  const offset = Math.max(0,       parseInt(url.searchParams.get("offset") || "0",  10));
  const to = offset + limit - 1;

  console.log(`🎵 /playlist goal="${rawGoal}" limit=${limit} offset=${offset}`);

  // Words to match (your alias map feeds wordsFor)
  const searchWords = wordsFor(rawGoal);

  // Build an OR string with chosen operator per column list
  const buildOr = (colsCS: string[], colsILIKE: string[]) => {
    const a: string[] = [];
    for (const w of searchWords) {
      for (const c of colsCS)   a.push(`${c}.cs.{${w}}`);
      for (const c of colsILIKE)a.push(`${c}.ilike.%${w}%`);
    }
    return a.length ? `(${a.join(",")})` : "";
  };

  // One query runner that uses ONLY range() for paging (no .limit())
  const run = async (colsCS: string[], colsILIKE: string[]) => {
    const orExpr = rawGoal.trim() ? buildOr(colsCS, colsILIKE) : "";
    let q = supabase
      .from("tracks")
      .select("id,title,genre,mood,storage_key", { count: "exact" })
      .not("storage_key","is",null)
      .neq("storage_key","")
      // Use a stable column to sort; 'id' is safest across schemas
      .order("id", { ascending: true })
      .range(offset, to);

    if (orExpr) q = q.or(orExpr);
    return q;
  };

  // Try array/jsonb matches first; fall back to pure ILIKE if schema doesn't support cs.{}
  const plans: Array<[string[], string[]]> = [
    // Plan A: arrays/jsonb present → cs.{word} on tags-like cols + ilike on mood/genre
    [["tags","therapeutic_use","emotion_tags"], ["mood","genre"]],
    // Plan B: everything via ILIKE (if tags-like aren't arrays)
    [[], ["mood","genre","tags","therapeutic_use","emotion_tags"]],
    // Plan C: minimal filter (mood/genre only)
    [[], ["mood","genre"]],
    // Plan D: no filter → just return playable tracks
    [[], []],
  ];

  for (const [csCols, ilikeCols] of plans) {
    const { data, error } = await run(csCols, ilikeCols);
    if (!error) {
      const tracks = data ?? [];
      console.log(`✅ /playlist using cs=[${csCols.join(",")}] ilike=[${ilikeCols.join(",")}] -> ${tracks.length}`);
      console.log('📊 Sample track data:', tracks.slice(0, 2));
      console.log('🔍 Raw response being sent:', JSON.stringify({ tracks: tracks.slice(0, 1), total: tracks.length, nextOffset: offset + tracks.length }));
      return new Response(
        JSON.stringify({ tracks, total: tracks.length, nextOffset: offset + tracks.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    // Schema/operator mismatch? Try the next plan.
    console.warn(`/playlist plan cs=[${csCols.join(",")}] ilike=[${ilikeCols.join(",")}] failed: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ ok:false, error: "PlaylistQueryFailed" }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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