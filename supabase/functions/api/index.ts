// Supabase Edge Function (Deno) — accepts both "/api/*" and "/*"
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

// Helper function to parse Camelot key from tags
function parseCamelotFromTags(tags: string[]): string | null {
  if (!tags || !Array.isArray(tags)) return null;
  
  for (const tag of tags) {
    const camelotMatch = tag.match(/Camelot:(\d+[AB])/);
    if (camelotMatch) {
      return camelotMatch[1];
    }
  }
  return null;
}

// Helper function to parse musical key from tags
function parseKeyFromTags(tags: string[]): string | null {
  if (!tags || !Array.isArray(tags)) return null;
  
  for (const tag of tags) {
    const keyMatch = tag.match(/Key:([A-G][b#]?m?)/);
    if (keyMatch) {
      return keyMatch[1];
    }
  }
  return null;
}

// Tracks Search endpoint - Now using tracks table with Camelot data
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
    vmin = Math.max(vmin, 0.75); 
  }

  // Query the tracks table with all the musical key data
  let query = supabase
    .from('tracks')
    .select(`
      id,
      title,
      artist,
      file_path,
      storage_key,
      valence,
      dominance,
      arousal,
      bpm,
      tags,
      audio_status
    `)
    .gte('valence', vmin)
    .lte('arousal', amax)
    .eq('audio_status', 'working')
    .limit(limit * 2); // Get more to account for Camelot filtering

  const { data: tracks, error } = await query;

  if (error) {
    console.error('❌ Track search error:', error);
    return json({ ok: false, error: error.message }, { status: 500 });
  }

  // Transform and filter with Camelot key parsing
  const seen = new Set<string>();
  const formatted = [];
  
  for (const track of tracks || []) {
    if (seen.has(track.id.toString())) continue;
    seen.add(track.id.toString());
    
    const camelotKey = parseCamelotFromTags(track.tags);
    
    // Apply Camelot filtering if specified
    if (camelot_allow.length > 0 && (!camelotKey || !camelot_allow.includes(camelotKey))) {
      continue;
    }
    
    formatted.push({
      unique_id: track.id.toString(),
      title: track.title,
      artist: track.artist,
      file_path: track.file_path || track.storage_key,
      camelot_key: camelotKey || "1A",
      bpm: track.bpm,
      vad: {
        valence: track.valence || 0.5,
        arousal: track.arousal || 0.5,
        dominance: track.dominance || 0.5
      },
      audio_status: "working"
    });
    
    // Stop when we have enough tracks
    if (formatted.length >= limit) break;
  }

  console.log(`✅ Found ${formatted.length} tracks for goal: ${goal} (${camelot_allow.length > 0 ? `filtered by Camelot: ${camelot_allow.join(',')}` : 'no Camelot filter'})`);
  return json(formatted);
});

// Playlist endpoint - Updated to use tracks table
routes.set("POST /playlist", async (req) => {
  const { goal = "", limit = 50, offset = 0 } = await req.json().catch(() => ({}));
  console.log('🎵 Playlist request for goal:', goal, 'limit:', limit, 'offset:', offset);
  
  const supabase = sb();
  
  // Map therapeutic goals to conditions - updated for tracks table schema
  const goalToConditions: Record<string, any> = {
    'focus_up': { arousal: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'anxiety_down': { arousal: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { arousal: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'mood_up': { arousal: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] },
    'pain_down': { arousal: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] }
  };
  
  const normalizedGoal = goal.toLowerCase().trim();
  const criteria = goalToConditions[normalizedGoal] || goalToConditions['focus_up'];
  
  let query = supabase
    .from('tracks')
    .select('*', { count: "exact" })
    .eq('audio_status', 'working');
    
  if (criteria.arousal) {
    query = query.gte('arousal', criteria.arousal[0]).lte('arousal', criteria.arousal[1]);
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

  // Add Camelot parsing to playlist tracks and ensure UUIDs are returned
  const enrichedTracks = (tracks || []).map(track => ({
    ...track,
    id: track.id.toString(), // Ensure UUID is string for consistency
    camelot_key: parseCamelotFromTags(track.tags),
    musical_key: parseKeyFromTags(track.tags)
  }));

  console.log(`✅ Found ${enrichedTracks.length} tracks (${count} total) for goal: ${goal}`);
  return json({ tracks: enrichedTracks, total: count ?? 0, nextOffset: to + 1 });
});

// Build session endpoint - Updated to use tracks table
routes.set("POST /session/build", async (req) => {
  const { goal = "", durationMin = 15, intensity = 3, limit = 50 } = await req.json().catch(() => ({}));
  console.log(`🏗️ Building session:`, { goal, durationMin, intensity, limit });
  
  const supabase = sb();
  
  const goalToConditions: Record<string, any> = {
    'focus_up': { arousal: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'anxiety_down': { arousal: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { arousal: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'mood_up': { arousal: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] },
    'pain_down': { arousal: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] }
  };
  
  const normalizedGoal = goal.toLowerCase().trim();
  const criteria = goalToConditions[normalizedGoal] || goalToConditions['focus_up'];
  
  let query = supabase
    .from('tracks')
    .select('*')
    .eq('audio_status', 'working');
    
  if (criteria.arousal) {
    query = query.gte('arousal', criteria.arousal[0]).lte('arousal', criteria.arousal[1]);
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

  // Enrich tracks with Camelot data for harmonic recommendations and ensure UUIDs
  const enrichedTracks = (tracks || []).map(track => ({
    ...track,
    id: track.id.toString(), // Ensure UUID is string for consistency
    camelot_key: parseCamelotFromTags(track.tags),
    musical_key: parseKeyFromTags(track.tags)
  }));

  const sessionId = crypto.randomUUID();
  
  console.log(`✅ Built session ${sessionId} with ${enrichedTracks.length} tracks (limited to ${trackLimit})`);
  return json({ sessionId, tracks: enrichedTracks });
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

// Audio streaming endpoint - Updated to use tracks table
routes.set("GET /stream", async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return json({ error: "Missing track ID parameter" }, { status: 400 });
  }
  
  console.log(`🎵 Stream request for track: ${id}`);
  
  // Validate track exists in tracks table using UUID
  const supabase = sb();
  
  // Validate UUID format
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUUID) {
    console.error('❌ Invalid UUID format:', id);
    return json({ error: "Invalid track ID format" }, { status: 400 });
  }
  
  const { data: track, error } = await supabase
    .from('tracks')
    .select('id, title, file_path, storage_key, file_name')
    .eq('id', id)
    .eq('audio_status', 'working')
    .maybeSingle();
    
  if (error || !track) {
    console.error('❌ Track not found:', id, error);
    return json({ error: "Track not found" }, { status: 404 });
  }
  
  // Get the actual file path from storage_key, file_path, or file_name
  const fileName = track.storage_key || track.file_path || track.file_name;
  if (!fileName) {
    console.error('❌ No file path found for track:', track);
    return json({ error: "Track file path not found" }, { status: 404 });
  }
  
  console.log(`🎵 Streaming file: ${fileName} for track: ${track.title}`);
  
  try {
    // Get the file from Supabase Storage - try multiple buckets
    let fileData, storageError;
    const buckets = ['audio', 'neuralpositivemusic', 'music'];
    
    for (const bucket of buckets) {
      console.log(`🎵 Trying bucket: ${bucket} for file: ${fileName}`);
      const result = await supabase.storage
        .from(bucket)
        .download(fileName);
        
      if (!result.error && result.data) {
        fileData = result.data;
        console.log(`✅ Found file in bucket: ${bucket}`);
        break;
      } else {
        console.log(`❌ Not found in bucket ${bucket}:`, result.error?.message);
      }
    }
      
    if (!fileData) {
      console.error('❌ File not found in any storage bucket:', fileName);
      return json({ error: "File not found in storage" }, { status: 404 });
    }
    
    // Stream the audio file with proper headers
    return new Response(fileData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Content-Length": fileData.size.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Range, x-client-info, apikey",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (streamError) {
    console.error('❌ Stream error:', streamError);
    return json({ error: "Failed to stream audio file" }, { status: 500 });
  }
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