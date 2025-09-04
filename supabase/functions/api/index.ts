// supabase/functions/api/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

// util: req id
const rid = () =>
  Math.random().toString(16).slice(2, 10) +
  Math.random().toString(16).slice(2, 10);

// small helpers
const log = (id: string, msg: string, extra: Record<string, unknown> = {}) =>
  console.log(JSON.stringify({ rid: id, msg, ...extra }));

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
const DEFAULT_BUCKET = Deno.env.get('BUCKET') ?? 'audio';

console.log('🔧 Environment check:', {
  hasUrl: !!SUPABASE_URL,
  hasKey: !!SERVICE_KEY,
  bucket: DEFAULT_BUCKET
});

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

    // Stream diagnostics endpoint
    if (path === '/diag/stream' || path === '/api/diag/stream') {
      return handleStreamDiag(req);
    }

    // Storage debug endpoint
    if (path === '/debug/storage' || path === '/api/debug/storage') {
      return handleStorageDebugRequest(req);
    }

    // Admin audit endpoint
    if (path === '/audit/verify' || path === '/api/audit/verify') {
      return handleAuditVerifyRequest(req);
    }

    // Admin batch audit endpoint
    if (path === '/admin/audit' || path === '/api/admin/audit') {
      return handleAdminAuditRequest(req);
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
    const conditions: string[] = [];
    for (const w of searchWords) {
      // Add array containment checks for CS columns
      for (const c of colsCS) {
        conditions.push(`${c}.cs.{${w}}`);
      }
      // Add ILIKE checks for text columns  
      for (const c of colsILIKE) {
        conditions.push(`${c}.ilike.%${w}%`);
      }
    }
    return conditions.length ? conditions.join(",") : "";
  };

  // One query runner that uses ONLY range() for paging (no .limit())
  const run = async (colsCS: string[], colsILIKE: string[]) => {
    const orConditions = rawGoal.trim() ? buildOr(colsCS, colsILIKE) : "";
    let q = supabase
      .from("tracks")
      .select("id,title,genre,mood,storage_key,audio_status,bpm", { count: "exact" })
      .eq("audio_status", "working")  // Only return working tracks
      .eq("storage_bucket", "audio")  // Only return tracks from audio bucket
      .not("camelot", "is", null)     // Only tracks with Camelot keys (247 tracks)
      .is("last_error", null)         // Exclude tracks with ObjectNotFound errors
      .not("storage_key","is",null)
      .neq("storage_key","")
      // Use a stable column to sort; 'id' is safest across schemas
      .order("id", { ascending: true })
      .range(offset, to);

    // Apply OR filtering if we have conditions
    if (orConditions) {
      q = q.or(orConditions);
    }

    // Apply BPM filtering for anxiety relief
    if (rawGoal === 'anxiety-relief') {
      // For anxiety relief, only include tracks with BPM under 90 (calming tempo)
      q = q.or('bpm.is.null,bpm.lt.90');
      console.log('🧘 Applied anxiety-relief BPM filter: <90 BPM or null');
    } else {
      console.log(`🎵 Processing goal: ${rawGoal}`);
    }

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
  const id = rid();
  const supabase = sb();
  const url = new URL(req.url);
  const trackId = url.searchParams.get('id') || '';

  log(id, 'stream:start', { trackId, path: url.pathname, method: req.method });

  if (!trackId) {
    log(id, 'stream:missing_id');
    return json({ ok: false, error: 'MissingId' }, 400);
  }

  // DB lookup
  const t0 = Date.now();
  const { data: row, error } = await supabase
    .from('tracks')
    .select('storage_bucket, storage_key, title')
    .eq('id', trackId)
    .maybeSingle();
  log(id, 'stream:db_lookup', {
    ms: Date.now() - t0,
    found: !!row,
    error: error?.message ?? null,
    bucket: row?.storage_bucket ?? null,
    key: row?.storage_key ?? null,
  });

  if (error || !row) {
    return json({ ok: false, error: 'TrackNotFound', id: trackId }, 404);
  }
  
  if (!row.storage_key) {
    // Self-heal: Mark as missing
    await supabase.from('tracks').update({
      audio_status: 'missing',
      last_verified_at: new Date().toISOString(),
      last_error: 'MissingStorageKey'
    }).eq('id', trackId);
    
    return json({ ok: false, error: 'MissingStorageKey', id: trackId }, 404);
  }

  const bucket = row.storage_bucket || (Deno.env.get('BUCKET') ?? 'audio');

  // Multi-bucket sign - try original bucket first, then fallback
  const buckets = [bucket, bucket === 'audio' ? 'neuralpositivemusic' : 'audio'];
  let signed: any = null;
  let workingBucket = bucket;
  
  const t1 = Date.now();
  for (const tryBucket of buckets) {
    const attempt = await supabase.storage.from(tryBucket).createSignedUrl(row.storage_key, 1800);
    log(id, 'stream:sign_attempt', {
      bucket: tryBucket,
      ok: !!attempt.data?.signedUrl,
      error: attempt.error?.message ?? null,
    });
    
    if (attempt.data?.signedUrl && !attempt.error) {
      signed = attempt;
      workingBucket = tryBucket;
      break;
    }
  }
  
  log(id, 'stream:sign', {
    ms: Date.now() - t1,
    ok: !!signed?.data?.signedUrl,
    originalBucket: bucket,
    workingBucket,
    key: row.storage_key,
    signError: signed?.error?.message ?? null,
  });

  if (!signed?.data?.signedUrl) {
    // Self-heal: Mark as missing with specific error
    await supabase.from('tracks').update({
      audio_status: 'missing',
      last_verified_at: new Date().toISOString(),
      last_error: `ObjectNotFound:tried_buckets:[${buckets.join(',')}]:${row.storage_key}`
    }).eq('id', trackId);
    
    return json(
      { ok: false, error: 'ObjectNotFound', buckets_tried: buckets, key: row.storage_key, id: trackId },
      404
    );
  }

  // Self-heal: Update bucket if we found it in a different location
  if (workingBucket !== bucket) {
    log(id, 'stream:bucket_correction', {
      originalBucket: bucket,
      correctedBucket: workingBucket,
      trackId,
    });
    
    await supabase.from('tracks').update({
      storage_bucket: workingBucket,
      audio_status: 'working',
      last_verified_at: new Date().toISOString(),
      last_error: null
    }).eq('id', trackId);
  }

  // HEAD to validate object before proxying (super cheap, super useful)
  const t2 = Date.now();
  const head = await fetch(signed.data.signedUrl, { method: 'HEAD' });
  log(id, 'stream:head', {
    ms: Date.now() - t2,
    status: head.status,
    ct: head.headers.get('content-type'),
    ar: head.headers.get('accept-ranges'),
    len: head.headers.get('content-length'),
  });

  if (head.status >= 400) {
    // Self-heal: Mark as missing with HEAD failure status
    await supabase.from('tracks').update({
      audio_status: 'missing',
      last_verified_at: new Date().toISOString(),
      last_error: `SignedUrlHeadFailed:${head.status}`
    }).eq('id', trackId);
    
    return json(
      {
        ok: false,
        error: 'SignedUrlHeadFailed',
        status: head.status,
        bucket,
        key: row.storage_key,
        id: trackId,
      },
      404
    );
  }

  // Success: Mark as working
  await supabase.from('tracks').update({
    audio_status: 'working',
    last_verified_at: new Date().toISOString(),
    last_error: null
  }).eq('id', trackId);

  // Proxy with Range support
  const range = req.headers.get('range');
  const upstream = await fetch(signed.data.signedUrl, {
    method: req.method,
    headers: range ? { Range: range } : {},
  });

  const h = new Headers(upstream.headers);
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Accept-Ranges', 'bytes');
  h.set('Cache-Control', 'public, max-age=3600');
  if (!h.get('Content-Type') && row.storage_key.toLowerCase().endsWith('.mp3')) {
    h.set('Content-Type', 'audio/mpeg');
  }

  log(id, 'stream:proxy', { status: upstream.status });
  return new Response(req.method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    headers: h,
  });
}

// ---------- DIAG (same checks, returns JSON instead of audio) ----------
async function handleStreamDiag(req: Request): Promise<Response> {
  const id = rid();
  const supabase = sb();
  const url = new URL(req.url);
  const trackId = url.searchParams.get('id') || '';

  const out: Record<string, unknown> = { rid: id, id: trackId, path: url.pathname };
  if (!trackId) return json({ ok: false, error: 'MissingId', ...out }, 400);

  // DB
  const t0 = Date.now();
  const { data: row, error } = await supabase
    .from('tracks')
    .select('storage_bucket, storage_key, title')
    .eq('id', trackId)
    .maybeSingle();
  out.db_ms = Date.now() - t0;
  out.db_found = !!row;
  out.db_error = error?.message ?? null;
  out.bucket = row?.storage_bucket ?? Deno.env.get('BUCKET') ?? 'audio';
  out.key = row?.storage_key ?? null;

  if (error || !row) return json({ ok: false, error: 'TrackNotFound', ...out }, 404);
  if (!row.storage_key) return json({ ok: false, error: 'MissingStorageKey', ...out }, 404);

  // SIGN
  const bucket = out.bucket as string;
  const t1 = Date.now();
  const signed = await supabase.storage.from(bucket).createSignedUrl(row.storage_key, 120);
  out.sign_ms = Date.now() - t1;
  out.sign_ok = !!signed.data?.signedUrl;
  out.sign_error = signed.error?.message ?? null;

  if (!signed.data?.signedUrl) {
    return json({ ok: false, error: 'ObjectNotFound', ...out }, 404);
  }

  // HEAD
  const t2 = Date.now();
  const head = await fetch(signed.data.signedUrl, { method: 'HEAD' });
  out.head_ms = Date.now() - t2;
  out.head_status = head.status;
  out.head_ct = head.headers.get('content-type');
  out.head_ar = head.headers.get('accept-ranges');
  out.head_len = head.headers.get('content-length');

  return json({ ok: head.status < 400, ...out });
}

// ---------- ADMIN BATCH AUDIT ----------
async function handleAdminAuditRequest(req: Request): Promise<Response> {
  // Check admin authorization
  const adminKey = Deno.env.get('ADMIN_KEY');
  const authHeader = req.headers.get('x-admin-key') || req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!adminKey || !authHeader || authHeader !== adminKey) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const id = rid();
  const supabase = sb();
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 1000);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0'));
  const dry = url.searchParams.get('dry') === '1';

  log(id, 'audit:start', { limit, offset, dry });

  try {
    // Get batch of tracks to audit
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('id, storage_bucket, storage_key, audio_status')
      .not('storage_key', 'is', null)
      .neq('storage_key', '')
      .range(offset, offset + limit - 1)
      .order('id');

    if (error) {
      log(id, 'audit:db_error', { error: error.message });
      return json({ error: 'Database query failed' }, 500);
    }

    let working = 0;
    let missing = 0;
    const updates: Array<{ id: string; status: string }> = [];

    // Check each track
    for (const track of tracks || []) {
      const bucket = track.storage_bucket || DEFAULT_BUCKET;
      
      try {
        // Sign and HEAD check
        const signed = await supabase.storage.from(bucket).createSignedUrl(track.storage_key, 120);
        if (!signed.data?.signedUrl) {
          missing++;
          updates.push({ id: track.id, status: 'missing' });
          continue;
        }

        const head = await fetch(signed.data.signedUrl, { method: 'HEAD' });
        if (head.status < 400) {
          working++;
          updates.push({ id: track.id, status: 'working' });
        } else {
          missing++;
          updates.push({ id: track.id, status: 'missing' });
        }
      } catch (err) {
        missing++;
        updates.push({ id: track.id, status: 'missing' });
      }
    }

    // Apply updates if not dry run
    if (!dry && updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('tracks')
          .update({ audio_status: update.status })
          .eq('id', update.id);
      }
    }

    log(id, 'audit:complete', { total: tracks?.length || 0, working, missing, dry });

    return json({
      rid: id,
      total: tracks?.length || 0,
      working,
      missing,
      dry,
      processed: updates.length
    });

  } catch (error) {
    log(id, 'audit:error', { error: error.message });
    return json({ error: 'Audit failed' }, 500);
  }
}

// Storage debug endpoint - shows sample storage info
async function handleStorageDebugRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  try {
    const supabase = sb();
    
    // Get sample tracks with storage info
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('id, title, storage_bucket, storage_key, audio_status')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Debug query error:', error);
      return json({ error: 'Database query failed' }, 500);
    }

    return json({
      total_tracks: tracks?.length || 0,
      tracks: tracks || [],
      storage_buckets: ['audio', 'neuralpositivemusic'],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.log('❌ Storage debug error:', error);
    return json({ error: 'Debug request failed' }, 500);
  }
}

// Admin-only audit endpoint - verifies storage integrity
async function handleAuditVerifyRequest(req: Request): Promise<Response> {
  // Check admin authorization
  const adminKey = Deno.env.get('ADMIN_KEY');
  const authHeader = req.headers.get('Authorization');
  
  if (!adminKey || !authHeader || authHeader !== `Bearer ${adminKey}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const supabase = sb();
    
    // Get tracks with missing or invalid storage
    const { data: brokenTracks, error } = await supabase
      .rpc('find_broken_tracks');

    if (error) {
      console.log('❌ Audit query error:', error);
      return json({ error: 'Audit query failed' }, 500);
    }

    // Get tracks marked as working but might be broken
    const { data: suspiciousTracks, error: suspiciousError } = await supabase
      .from('tracks')
      .select('id, title, storage_bucket, storage_key, audio_status')
      .eq('audio_status', 'working')
      .or('storage_key.is.null,storage_key.eq.,storage_bucket.is.null')
      .limit(50);

    if (suspiciousError) {
      console.log('❌ Suspicious tracks query error:', suspiciousError);
    }

    return json({
      audit_timestamp: new Date().toISOString(),
      broken_tracks: brokenTracks || [],
      suspicious_tracks: suspiciousTracks || [],
      recommendations: [
        'Update audio_status to "missing" for tracks without storage_key',
        'Verify storage bucket accessibility', 
        'Check for orphaned storage files'
      ]
    });
    
  } catch (error) {
    console.log('❌ Audit verify error:', error);
    return json({ error: 'Audit verification failed' }, 500);
  }
}