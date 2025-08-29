// deno-lint-ignore-file no-explicit-any
import { Hono } from "https://deno.land/x/hono@v3.10.4/mod.ts";
import { cors } from "https://deno.land/x/hono@v3.10.4/middleware.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Hono();

// CORS
app.use(
  "/*",
  cors({
    origin: Deno.env.get("WEB_ORIGIN") ?? "*",
    allowMethods: ["GET", "HEAD", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Range"],
    exposeHeaders: ["Accept-Ranges", "Content-Length", "Content-Type", "Content-Range"],
  })
);

// Supabase admin client
function sb() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

// ---- /api sub-router ----
const api = new Hono();

// Health
api.get("/health", (c) =>
  c.json({ ok: true, time: new Date().toISOString(), service: "NeuroTunes API" })
);

// Playlist by goal
api.get("/v1/playlist", async (c) => {
  const goal = c.req.query("goal") ?? "";
  console.log(`🎯 Loading playlist for goal: ${goal}`);
  
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
  
  const { data: tracks, error } = await query.limit(15);
  
  if (error) {
    console.error('❌ Database error:', error);
    return c.json({ ok: false, error: error.message }, 500);
  }

  console.log(`✅ Found ${tracks?.length || 0} tracks for goal: ${goal}`);
  return c.json({ tracks: tracks || [] });
});

// Build session (simple example)
api.post("/v1/session/build", async (c) => {
  const { goal = "", durationMin = 15, intensity = 3 } = await c.req.json().catch(() => ({}));
  console.log(`🏗️ Building session:`, { goal, durationMin, intensity });
  
  const supabase = sb();
  
  // Get tracks using same logic as playlist
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
  
  const { data: tracks, error } = await query.limit(Math.ceil(durationMin / 3));
  
  if (error) {
    console.error('❌ Session build error:', error);
    return c.json({ ok: false, error: error.message }, 500);
  }

  // Create session record
  const sessionId = crypto.randomUUID();
  
  console.log(`✅ Built session ${sessionId} with ${tracks?.length || 0} tracks`);
  return c.json({ sessionId, tracks: tracks || [] });
});

// Session telemetry
api.post("/v1/sessions/start", async (c) => {
  const { trackId } = await c.req.json();
  const sessionId = crypto.randomUUID();
  
  console.log(`🎵 Started session ${sessionId} for track ${trackId}`);
  return c.json({ sessionId });
});

api.post("/v1/sessions/progress", async (c) => {
  const { sessionId, t } = await c.req.json();
  console.log(`📊 Session ${sessionId} progress: ${t}s`);
  
  return c.json({ ok: true });
});

api.post("/v1/sessions/complete", async (c) => {
  const { sessionId } = await c.req.json();
  console.log(`✅ Session ${sessionId} completed`);
  
  return c.json({ ok: true });
});

// Stream from Storage via signed URL (GET/HEAD + Range)
api.on(["GET", "HEAD"], "/stream", async (c) => {
  const file = c.req.query("file");
  if (!file) return c.text("Missing 'file'", 400);

  console.log(`🎵 Streaming file: ${file}`);

  const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";
  const supabase = sb();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(file, 120);
  if (error || !data?.signedUrl) {
    console.error('❌ Storage error:', error);
    return c.text(error?.message ?? "Not found", 404);
  }

  const range = c.req.header("range");
  const upstream = await fetch(data.signedUrl, { method: c.req.method, headers: range ? { Range: range } : {} });

  const headers = new Headers(upstream.headers);
  headers.set("Access-Control-Allow-Origin", Deno.env.get("WEB_ORIGIN") ?? "*");
  headers.set("Accept-Ranges", "bytes");
  return new Response(c.req.method === "HEAD" ? null : upstream.body, { status: upstream.status, headers });
});

// Attach at root (function already lives at /api/* externally)
app.route("/", api);

// JSON 404 (helps you see wrong paths fast)
app.notFound((c) => c.json({ ok: false, error: "NotFound", path: c.req.path }, 404));

export default app;