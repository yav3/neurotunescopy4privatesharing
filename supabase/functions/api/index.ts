// Supabase Edge Function (Deno) — accepts both "/api/*" and "/*"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Handler = (req: Request, ctx: { params: Record<string, string> }) => Promise<Response> | Response;

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function withCors(res: Response) {
  const h = new Headers(res.headers);
  h.set("access-control-allow-origin", "*");
  h.set("access-control-allow-methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS");
  h.set("access-control-allow-headers", "authorization,content-type,range,x-client-info,apikey");
  h.set("access-control-expose-headers", "accept-ranges,content-length,content-type,content-range");
  return new Response(res.body, { status: res.status, headers: h });
}

// Strip a single leading "/api" if present; also collapse multiple slashes.
function normalizePath(url: URL): string {
  let p = url.pathname.replace(/\/{2,}/g, "/");
  p = p.startsWith("/api/") ? p.slice(4) : p; // "/api/foo" -> "/foo"
  p = p === "/api" ? "/" : p;                // exactly "/api" -> "/"
  return p;
}

// Supabase admin client
function sb() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

// Simple router
const routes = new Map<string, Handler>();

// Health
routes.set("GET /health", () => json({ ok: true, ts: Date.now(), service: "NeuroTunes API" }));

// Tracks Search endpoint
routes.set("GET /tracks/search", async (req) => {
  const url = new URL(req.url);
  const goal = url.searchParams.get("goal") ?? "";
  const valence_min = Number(url.searchParams.get("valence_min") ?? 0);
  const arousal_max = Number(url.searchParams.get("arousal_max") ?? 1);
  const dominance_min = Number(url.searchParams.get("dominance_min") ?? 0);
  const camelot_allow = url.searchParams.get("camelot_allow")?.split(',').filter(Boolean) ?? [];
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 200);
  
  console.log('🔍 Track search request:', { goal, valence_min, arousal_max, dominance_min, camelot_allow, limit });
  
  const supabase = sb();
  
  // Apply goal-based defaults
  let vmin = valence_min;
  let amax = arousal_max;
  
  if (goal === "focus_up") { 
    vmin = Math.max(vmin, 0.70); 
    amax = Math.min(amax, 0.50); 
  }
  if (goal === "anxiety_down" || goal === "sleep") { 
    vmin = Math.max(vmin, 0.65); 
    amax = Math.min(amax, 0.45); 
  }
  if (goal === "mood_up" || goal === "pain_down") { 
    vmin = Math.max(vmin, 0.80); 
  }

  let query = supabase
    .from('music_tracks')
    .select(`
      id,
      title,
      artist,
      file_path,
      storage_key,
      valence,
      acousticness,
      energy,
      bpm,
      key_signature
    `)
    .gte('valence', vmin)
    .lte('energy', amax)
    .eq('upload_status', 'completed')
    .limit(limit);

  if (camelot_allow.length > 0) {
    query = query.in('key_signature', camelot_allow);
  }

  const { data: tracks, error } = await query;

  if (error) {
    console.error('❌ Track search error:', error);
    return json({ ok: false, error: error.message }, { status: 500 });
  }

  // Transform to expected format with defensive deduplication
  const seen = new Set<string>();
  const formatted = [];
  
  for (const track of tracks || []) {
    if (seen.has(track.id)) continue;
    seen.add(track.id);
    
    formatted.push({
      unique_id: track.id,
      title: track.title,
      artist: track.artist,
      file_path: track.file_path || track.storage_key,
      camelot_key: track.key_signature || "1A",
      bpm: track.bpm,
      vad: {
        valence: track.valence || 0.5,
        arousal: track.energy || 0.5,
        dominance: track.acousticness || 0.5
      },
      audio_status: "working"
    });
  }

  console.log(`✅ Found ${formatted.length} tracks for goal: ${goal}`);
  return json(formatted);
});

// Playlist endpoint
routes.set("POST /playlist", async (req) => {
  const { goal = "", limit = 50, offset = 0 } = await req.json().catch(() => ({}));
  console.log('🎵 Playlist request for goal:', goal, 'limit:', limit, 'offset:', offset);
  
  const supabase = sb();
  
  // Map goals to conditions and build query - expanded mapping
  const goalToConditions: Record<string, any> = {
    'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'focus enhancement': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'stress reduction': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'anxiety relief': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'anxiety_relief': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'sleep preparation': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] },
    'mood boost': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] },
    'mood_boost': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
  };
  
  const normalizedGoal = goal.toLowerCase().trim();
  const criteria = goalToConditions[normalizedGoal] || goalToConditions['focus'];
  
  let query = supabase
    .from('music_tracks')
    .select('*', { count: "exact" })
    .eq('upload_status', 'completed');
    
  if (criteria.energy) {
    query = query.gte('energy', criteria.energy[0]).lte('energy', criteria.energy[1]);
  }
  
  if (criteria.valence) {
    query = query.gte('valence', criteria.valence[0]).lte('valence', criteria.valence[1]);
  }
  
  if (criteria.genres && criteria.genres.length > 0) {
    query = query.in('genre', criteria.genres);
  }
  
  const to = offset + limit - 1;
  const { data: tracks, error, count } = await query.range(offset, to);
  
  if (error) {
    console.error('❌ Database error:', error);
    return json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log(`✅ Found ${tracks?.length || 0} tracks (${count} total) for goal: ${goal}`);
  return json({ tracks: tracks || [], total: count ?? 0, nextOffset: to + 1 });
});

// Build session endpoint
routes.set("POST /session/build", async (req) => {
  const { goal = "", durationMin = 15, intensity = 3, limit = 50 } = await req.json().catch(() => ({}));
  console.log(`🏗️ Building session:`, { goal, durationMin, intensity, limit });
  
  const supabase = sb();
  
  const goalToConditions: Record<string, any> = {
    'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'focus enhancement': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'stress reduction': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'anxiety relief': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'anxiety_relief': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'sleep preparation': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] },
    'mood boost': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] },
    'mood_boost': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
  };
  
  const normalizedGoal = goal.toLowerCase().trim();
  const criteria = goalToConditions[normalizedGoal] || goalToConditions['focus'];
  
  let query = supabase
    .from('music_tracks')
    .select('*')
    .eq('upload_status', 'completed');
    
  if (criteria.energy) {
    query = query.gte('energy', criteria.energy[0]).lte('energy', criteria.energy[1]);
  }
  
  if (criteria.valence) {
    query = query.gte('valence', criteria.valence[0]).lte('valence', criteria.valence[1]);
  }
  
  if (criteria.genres && criteria.genres.length > 0) {
    query = query.in('genre', criteria.genres);
  }
  
  const trackLimit = Math.min(Number(limit) || 50, 200);
  const { data: tracks, error } = await query.limit(trackLimit);
  
  if (error) {
    console.error('❌ Session build error:', error);
    return json({ ok: false, error: error.message }, { status: 500 });
  }

  const sessionId = crypto.randomUUID();
  
  console.log(`✅ Built session ${sessionId} with ${tracks?.length || 0} tracks (limited to ${trackLimit})`);
  return json({ sessionId, tracks: tracks || [] });
});

// Debug storage access
routes.set("GET /debug/storage", async () => {
  const supabase = sb();
  
  const envCheck = {
    SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    BUCKET: Deno.env.get("BUCKET") ?? "neuralpositivemusic",
    WEB_ORIGIN: Deno.env.get("WEB_ORIGIN")
  };
  
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";
  const { data: files, error: filesError } = await supabase.storage.from(bucket).list();
  
  return json({
    environment: envCheck,
    buckets: {
      count: buckets?.length ?? 0,
      list: buckets?.map(b => ({ name: b.name, public: b.public })) ?? [],
      error: bucketsError?.message
    },
    files: {
      bucket: bucket,
      count: files?.length ?? 0,
      sample: files?.slice(0, 5) ?? [],
      error: filesError?.message
    },
    timestamp: new Date().toISOString()
  });
});

// Session telemetry
routes.set("POST /sessions/start", async (req) => {
  const { trackId } = await req.json().catch(() => ({}));
  const sessionId = crypto.randomUUID();
  
  console.log(`🎵 Started session ${sessionId} for track ${trackId}`);
  return json({ sessionId });
});

routes.set("POST /sessions/progress", async (req) => {
  const { sessionId, t } = await req.json().catch(() => ({}));
  console.log(`📊 Session ${sessionId} progress: ${t}s`);
  
  return json({ ok: true });
});

routes.set("POST /sessions/complete", async (req) => {
  const { sessionId } = await req.json().catch(() => ({}));
  console.log(`✅ Session ${sessionId} completed`);
  
  return json({ ok: true });
});

// Brainwave streaming endpoint
routes.set("POST /v1/stream", async (req) => {
  console.log('🧠 Brainwave stream request received - delegating to brainwave-stream function');
  
  const body = await req.json().catch(() => ({}));
  const { frequency, goal, duration } = body;
  
  // Validate required parameters
  if (!frequency && !goal) {
    return json({ error: 'Missing required parameter: frequency or goal' }, { status: 400 });
  }
  
  // Delegate to dedicated brainwave streaming function
  const streamResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/brainwave-stream`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ frequency, goal, duration })
  });
  
  if (!streamResponse.ok) {
    return json({ error: 'Brainwave stream generation failed' }, { status: 500 });
  }
  
  // Return the streaming response with proper headers
  return new Response(streamResponse.body, {
    status: streamResponse.status,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }
  });
});

// Audio streaming endpoint with proper headers  
routes.set("GET /stream", async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return json({ error: "Missing track ID parameter" }, { status: 400 });
  }
  
  console.log(`🎵 Stream request for track: ${id}`);
  
  // For now, return a placeholder response since actual streaming is handled by /stream function
  // This endpoint validates the ID exists and provides metadata
  const supabase = sb();
  const { data: track, error } = await supabase
    .from('music_tracks')
    .select('id, title, file_path, storage_key')
    .eq('id', id)
    .eq('upload_status', 'completed')
    .single();
    
  if (error || !track) {
    console.error('❌ Track not found:', id, error);
    return json({ error: "Track not found" }, { status: 404 });
  }
  
  // Return stream metadata with proper audio headers
  return new Response(JSON.stringify({
    id: track.id,
    title: track.title,
    streamUrl: `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/stream/${id}`,
    ready: true
  }), {
    headers: {
      "Content-Type": "application/json",
      "Accept-Ranges": "bytes",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Range, x-client-info, apikey",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    }
  });
});

// Debug route list
routes.set("GET /__routes", () =>
  json({ routes: [...routes.keys()].sort() })
);

// Main handler
serve(async (req) => {
  try {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();

    // CORS preflight
    if (method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    const normPath = normalizePath(url);

    // Exact match first
    let key = `${method} ${normPath}`;
    let handler = routes.get(key);

    // Support trailing slash equivalence
    if (!handler) {
      const alt =
        normPath.endsWith("/") && normPath !== "/"
          ? normPath.slice(0, -1)
          : normPath + "/";
      handler = routes.get(`${method} ${alt}`);
      key = `${method} ${alt}`;
    }

    if (!handler) {
      return withCors(
        json(
          {
            error: "Not Found",
            method,
            requested: url.pathname,
            normalized: normPath,
            hint: "Check /__routes to see registered handlers.",
          },
          { status: 404 }
        )
      );
    }

    const res = await handler(req, { params: {} });
    return withCors(res);
  } catch (err) {
    console.error(err);
    return withCors(json({ error: "Internal Error" }, { status: 500 }));
  }
});