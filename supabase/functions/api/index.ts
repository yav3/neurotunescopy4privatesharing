// deno-lint-ignore-file no-explicit-any
import { Hono } from "https://deno.land/x/hono@v4.2.7/mod.ts";
import { cors } from "https://deno.land/x/hono@v4.2.7/middleware.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Hono();
app.use("*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization", "Range"],
  allowMethods: ["GET", "HEAD", "POST", "OPTIONS"],
  exposeHeaders: ["Accept-Ranges", "Content-Length", "Content-Type", "Content-Range"]
}));

// Add direct routes instead of sub-router to fix routing issues

// Supabase admin client
function sb() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

// Direct routes - no sub-router to avoid mounting issues
app.get("/api/health", (c) =>
  c.json({ ok: true, time: new Date().toISOString(), service: "NeuroTunes API" })
);

// Playlist by goal  
app.get("/api/v1/playlist", async (c) => {
  const goal = c.req.query("goal") ?? "";
  const limit = Math.min(Number(c.req.query("limit") ?? 50), 200);
  const offset = Math.max(Number(c.req.query("offset") ?? 0), 0);
  console.log('🎵 Playlist request for goal:', goal, 'limit:', limit, 'offset:', offset);
  
  const supabase = sb();
  
  // Map goals to conditions and build query
  const goalToConditions: Record<string, any> = {
    'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
  };
  
  const criteria = goalToConditions[goal] || goalToConditions['focus'];
  
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
  
  if (criteria.genres.length > 0) {
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

// Build session (simple example)
app.post("/api/v1/session/build", async (c) => {
  const { goal = "", durationMin = 15, intensity = 3, limit = 50 } = await c.req.json().catch(() => ({}));
  console.log(`🏗️ Building session:`, { goal, durationMin, intensity, limit });
  
  const supabase = sb();
  
  // Get tracks using same logic as playlist with limit
  const goalToConditions: Record<string, any> = {
    'focus': { energy: [0.4, 0.7], valence: [0.4, 0.8], genres: ['classical', 'instrumental', 'acoustic'] },
    'relax': { energy: [0.1, 0.4], valence: [0.6, 0.9], genres: ['jazz', 'classical', 'folk'] },
    'sleep': { energy: [0.0, 0.3], valence: [0.3, 0.7], genres: ['classical', 'acoustic', 'instrumental'] },
    'energy': { energy: [0.5, 1.0], valence: [0.7, 1.0], genres: ['jazz', 'electronic', 'indie'] }
  };
  
  const criteria = goalToConditions[goal] || goalToConditions['focus'];
  
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
  
  if (criteria.genres.length > 0) {
    query = query.in('genre', criteria.genres);
  }
  
  // Apply limit to prevent flooding
  const trackLimit = Math.min(Number(limit) || 50, 200);
  const { data: tracks, error } = await query.limit(trackLimit);
  
  if (error) {
    console.error('❌ Session build error:', error);
    return c.json({ ok: false, error: error.message }, 500);
  }

  // Create session record
  const sessionId = crypto.randomUUID();
  
  console.log(`✅ Built session ${sessionId} with ${tracks?.length || 0} tracks (limited to ${trackLimit})`);
  return c.json({ sessionId, tracks: tracks || [] });
});

// Debug storage access
app.get("/api/debug/storage", async (c) => {
  const supabase = sb();
  
  // Check environment variables
  const envCheck = {
    SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    BUCKET: Deno.env.get("BUCKET") ?? "neuralpositivemusic",
    WEB_ORIGIN: Deno.env.get("WEB_ORIGIN")
  };
  
  // Try to list buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  // Try to list files in the main bucket
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

// Session telemetry
app.post("/api/v1/sessions/start", async (c) => {
  const { trackId } = await c.req.json();
  const sessionId = crypto.randomUUID();
  
  console.log(`🎵 Started session ${sessionId} for track ${trackId}`);
  return c.json({ sessionId });
});

app.post("/api/v1/sessions/progress", async (c) => {
  const { sessionId, t } = await c.req.json();
  console.log(`📊 Session ${sessionId} progress: ${t}s`);
  
  return c.json({ ok: true });
});

app.post("/api/v1/sessions/complete", async (c) => {
  const { sessionId } = await c.req.json();
  console.log(`✅ Session ${sessionId} completed`);
  
  return c.json({ ok: true });
});

// Stream from Storage via file path (reverted from ID-based)
app.on(["GET", "HEAD"], "/api/stream", async (c) => {
  const file = c.req.query("file");
  if (!file) return c.text("Missing 'file'", 400);

  console.log(`🎵 Streaming file: ${file}`);

  const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";
  const supabase = sb();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(file, 1800);
  
  if (error || !data?.signedUrl) {
    console.error('❌ Storage error:', error);
    return c.text(error?.message ?? "Not found", 404);
  }

  const range = c.req.header("range");
  const upstream = await fetch(data.signedUrl, { method: c.req.method, headers: range ? { Range: range } : {} });

  const headers = new Headers(upstream.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Accept-Ranges", "bytes");
  
  // Set content type for MP3 files
  if (!headers.get("Content-Type") && file.toLowerCase().endsWith(".mp3")) {
    headers.set("Content-Type", "audio/mpeg");
  }

  return new Response(c.req.method === "HEAD" ? null : upstream.body, { 
    status: upstream.status, 
    headers 
  });
});

// JSON 404 (helps you see wrong paths fast)
app.notFound((c) => c.json({ ok: false, error: "NotFound", path: c.req.path }, 404));

export default app;