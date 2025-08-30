// deno-lint-ignore-file no-explicit-any
import { Hono } from "https://deno.land/x/hono@v4.2.7/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.2.7/middleware.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Hono();
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "Range"],
  allowMethods: ["GET", "HEAD", "POST", "OPTIONS"],
  exposeHeaders: ["Accept-Ranges", "Content-Length", "Content-Type", "Content-Range"]
}));

// Supabase admin client
function sb() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

/** Health endpoint */
app.get("/api/health", (c) =>
  c.json({ ok: true, time: new Date().toISOString(), service: "NeuroTunes API" })
);

/** ✅ Playlist endpoint */
app.get("/api/playlist", async (c) => {
  const goal = c.req.query("goal") ?? "";
  const limit = Math.min(Number(c.req.query("limit") ?? 50), 200);
  const offset = Math.max(Number(c.req.query("offset") ?? 0), 0);
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
    return c.json({ ok: false, error: error.message }, 500);
  }

  console.log(`✅ Found ${tracks?.length || 0} tracks (${count} total) for goal: ${goal}`);
  return c.json({ tracks: tracks || [], total: count ?? 0, nextOffset: to + 1 });
});

/** Build session endpoint */
app.post("/api/session/build", async (c) => {
  const { goal = "", durationMin = 15, intensity = 3, limit = 50 } = await c.req.json().catch(() => ({}));
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
    return c.json({ ok: false, error: error.message }, 500);
  }

  const sessionId = crypto.randomUUID();
  
  console.log(`✅ Built session ${sessionId} with ${tracks?.length || 0} tracks (limited to ${trackLimit})`);
  return c.json({ sessionId, tracks: tracks || [] });
});

/** Debug storage access */
app.get("/api/debug/storage", async (c) => {
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
  
  return c.json({
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

/** Session telemetry */
app.post("/api/sessions/start", async (c) => {
  const { trackId } = await c.req.json();
  const sessionId = crypto.randomUUID();
  
  console.log(`🎵 Started session ${sessionId} for track ${trackId}`);
  return c.json({ sessionId });
});

app.post("/api/sessions/progress", async (c) => {
  const { sessionId, t } = await c.req.json();
  console.log(`📊 Session ${sessionId} progress: ${t}s`);
  
  return c.json({ ok: true });
});

app.post("/api/sessions/complete", async (c) => {
  const { sessionId } = await c.req.json();
  console.log(`✅ Session ${sessionId} completed`);
  
  return c.json({ ok: true });
});

/** Stream/Play endpoint - STREAM FILES BY ID WITH DIAGNOSIS */
app.on(["GET","HEAD"], "/api/stream/:id", async (c) => {
  const trace = crypto.randomUUID();
  const j = (status: number, code: string, extra: Record<string, unknown> = {}) =>
    c.json({ ok: false, code, trace, ...extra }, status);

  try {
    const id = c.req.param("id");
    console.log(`🎵 Stream request [${trace}]: ${id}`);
    
    if (!id) return j(400, "MissingId");

    const supabase = sb();
    const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";

    // 1) DB → storage_key
    const { data: row, error: qErr } = await supabase
      .from("music_tracks")
      .select("storage_key, file_path, title")
      .eq("id", id)
      .maybeSingle();
    
    if (qErr || !row) {
      console.log(`❌ Track not found [${trace}]: ${id}`);
      return j(404, "TrackNotFound", { id });
    }

    const storageKey = row.storage_key || row.file_path;
    if (!storageKey) {
      console.log(`❌ No storage key [${trace}]: ${id}`);
      return j(404, "TrackNotFound", { id, reason: "no_storage_key" });
    }

    // 2) Storage → signed URL
    const signed = await supabase.storage.from(bucket).createSignedUrl(storageKey, 1800);
    if (!signed.data?.signedUrl) {
      console.error(`❌ Object not found [${trace}]:`, { bucket, key: storageKey, err: signed.error?.message });
      return j(404, "ObjectNotFound", { bucket, key: storageKey, err: signed.error?.message });
    }

    // 3) Upstream fetch
    const range = c.req.header("range");
    const method = c.req.method;
    const upstreamUrl = signed.data.signedUrl;
    
    console.log(`🎵 Proxying [${trace}]: ${method} ${storageKey}`);
    
    const up = await fetch(upstreamUrl, { 
      method, 
      headers: range ? { Range: range } : {} 
    });
    
    if (up.status >= 400) {
      console.error(`❌ Upstream error [${trace}]:`, { 
        bucket, 
        key: storageKey, 
        upstreamStatus: up.status,
        upstreamUrl: upstreamUrl.substring(0, 100) + "..."
      });
      return j(up.status, "UpstreamError", { 
        bucket, 
        key: storageKey, 
        upstreamStatus: up.status 
      });
    }

    // Success: pass through audio with proper headers
    const headers = new Headers();
    
    // CORS headers
    headers.set("Access-Control-Allow-Origin", Deno.env.get("WEB_ORIGIN") ?? "*");
    headers.set("Access-Control-Allow-Headers", "Range, Content-Type, Accept");
    headers.set("Access-Control-Expose-Headers", "Accept-Ranges, Content-Range, Content-Length, Content-Type, Cache-Control");
    
    // Audio streaming headers
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");
    
    // Copy important headers from upstream
    const upstreamCT = up.headers.get("Content-Type");
    headers.set("Content-Type", upstreamCT || "audio/mpeg");
    
    const passHeaders = ["Content-Range", "Content-Length", "ETag", "Last-Modified"];
    for (const h of passHeaders) {
      const v = up.headers.get(h);
      if (v) headers.set(h, v);
    }

    console.log(`✅ Stream success [${trace}]: ${up.status} ${storageKey}`);
    
    return new Response(method === "HEAD" ? null : up.body, { 
      status: up.status, 
      headers 
    });
    
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(`❌ Unhandled error [${trace}]:`, error.message);
    return j(500, "Unhandled", { message: error.message });
  }
});

/** HEAD endpoint for stream validation by ID */
app.on("HEAD", "/api/stream/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Missing track ID" }, 400);

  const supabase = sb();
  const { data: track, error } = await supabase
    .from('music_tracks')
    .select('file_path, storage_key, title')
    .eq('id', id)
    .single();

  if (error || !track) {
    console.log(`❌ Track not found: ${id}`);
    return c.body(null, 404);
  }

  // Return proper headers for HEAD request
  c.header("Accept-Ranges", "bytes");
  c.header("Content-Type", "audio/mpeg");
  c.header("Cache-Control", "public, max-age=60");
  return c.body(null, 200);
});

/** Stream from Storage via file path */
app.on(["GET", "HEAD"], "/api/stream", async (c) => {
  const file = c.req.query("file");
  console.log(`🎵 Stream request - file: "${file}"`);
  
  if (!file) {
    console.error('❌ Missing file parameter');
    return c.text("Missing 'file'", 400);
  }

  console.log(`🎵 Streaming file: ${file}`);

  const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";
  console.log(`🪣 Using bucket: ${bucket}`);
  
  const supabase = sb();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(file, 1800);
  
  if (error) {
    console.error('❌ Storage error:', error);
    return c.text(error.message, 404);
  }
  
  if (!data?.signedUrl) {
    console.error('❌ No signed URL returned');
    return c.text("Could not generate signed URL", 404);
  }
  
  console.log(`✅ Generated signed URL: ${data.signedUrl.substring(0, 100)}...`);

  const range = c.req.header("range");
  console.log(`📊 Range header: ${range || 'none'}`);
  
  const upstream = await fetch(data.signedUrl, { 
    method: c.req.method, 
    headers: range ? { Range: range } : {} 
  });
  
  console.log(`📥 Upstream response: ${upstream.status} ${upstream.statusText}`);
  console.log(`📊 Content-Type: ${upstream.headers.get('content-type')}`);
  console.log(`📊 Content-Length: ${upstream.headers.get('content-length')}`);

  const headers = new Headers(upstream.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Accept-Ranges", "bytes");
  
  if (!headers.get("Content-Type") && file.toLowerCase().endsWith(".mp3")) {
    headers.set("Content-Type", "audio/mpeg");
  }

  return new Response(c.req.method === "HEAD" ? null : upstream.body, { 
    status: upstream.status, 
    headers 
  });
});

/** JSON 404 with exact path debugging */
app.notFound((c) => c.json({ ok: false, error: "NotFound", path: c.req.path }, 404));

export default app;