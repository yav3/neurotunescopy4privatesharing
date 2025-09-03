// deno-lint-ignore-file no-explicit-any
import { Hono } from "https://deno.land/x/hono@v3.10.4/mod.ts";
import { cors } from "https://deno.land/x/hono@v3.10.4/middleware.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Hono();
app.use("/*", cors({
  origin: Deno.env.get("WEB_ORIGIN") ?? "*",
  allowMethods: ["GET","HEAD","POST","OPTIONS"],
  allowHeaders: ["Content-Type","Authorization","Range"],
  exposeHeaders: ["Accept-Ranges","Content-Length","Content-Type","Content-Range"],
}));

function sb() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

/** Health on all likely paths */
app.on(["GET","HEAD"], "/api/health", c => c.json({ ok:true, time:new Date().toISOString() }));
app.on(["GET","HEAD"], "/health", c => c.json({ ok:true, time:new Date().toISOString() }));

/** Playlist - only return tracks with verified storage */
app.post("/api/playlist", async c => {
  const { goal = "", limit = 50, offset = 0 } = await c.req.json().catch(() => ({}));
  console.log('🎵 Playlist request for goal:', goal, 'limit:', limit, 'offset:', offset);
  
  const s = sb();
  
  // Get tracks and verify their storage keys exist
  let query = s
    .from("tracks")
    .select("id,title,artist,album,genre,mood,energy_level,bpm,duration_seconds,file_path,file_name,storage_bucket,storage_key,arousal,valence,dominance")
    .eq('audio_status', 'working')
    .not("storage_key", "is", null);
    
  // Apply goal-based filtering  
  if (goal) {
    const normalizedGoal = goal.toLowerCase().trim();
    if (normalizedGoal.includes('focus')) {
      query = query.gte('valence', 0.4).lte('arousal', 0.7);
    } else if (normalizedGoal.includes('anxiety') || normalizedGoal.includes('sleep')) {
      query = query.gte('valence', 0.6).lte('arousal', 0.4);
    } else if (normalizedGoal.includes('mood')) {
      query = query.gte('valence', 0.7).gte('arousal', 0.5);
    }
  }
    
  const { data: allTracks, error } = await query.limit(200);
  
  if (error) {
    console.error('❌ Database error:', error);
    return c.json({ ok: false, error: error.message }, 500);
  }

  // Verify storage keys exist and filter to working tracks
  const verifiedTracks = [];
  const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";
  
  for (const track of allTracks || []) {
    try {
      const trackBucket = track.storage_bucket || bucket;
      const { data } = await s.storage.from(trackBucket).list("", { 
        limit: 1, 
        search: track.storage_key,
        sortBy: { column: "name", order: "asc" }
      });
      
      if (data?.find(file => file.name === track.storage_key)) {
        verifiedTracks.push(track);
        if (verifiedTracks.length >= limit) break;
      }
    } catch (e) {
      console.warn(`❌ Storage check failed for ${track.id}:`, e);
    }
  }

  console.log(`✅ Found ${verifiedTracks.length} verified tracks for goal: ${goal}`);
  return c.json({ 
    tracks: verifiedTracks.slice(offset, offset + limit), 
    total: verifiedTracks.length,
    nextOffset: Math.min(offset + limit, verifiedTracks.length)
  });
});

/** ✅ Stream by id (deterministic) */
app.on(["GET","HEAD"], "/api/stream", async c => {
  const id = c.req.query("id");
  if (!id) return c.text("Missing 'id'", 400);

  const s = sb();
  const { data: row, error } = await s.from("tracks")
    .select("storage_bucket, storage_key, title")
    .eq("id", id).maybeSingle();

  if (error || !row) return c.json({ ok:false, error:"TrackNotFound", id }, 404);
  if (!row.storage_key) return c.json({ ok:false, error:"MissingStorageKey", id }, 404);

  const bucket = row.storage_bucket ?? (Deno.env.get("BUCKET") ?? "neuralpositivemusic");
  const signed = await s.storage.from(bucket).createSignedUrl(row.storage_key, 1800);
  if (!signed.data?.signedUrl)
    return c.json({ ok:false, error: signed.error?.message ?? "ObjectNotFound", bucket, key: row.storage_key, id }, 404);

  const range = c.req.header("range");
  const upstream = await fetch(signed.data.signedUrl, { method:c.req.method, headers: range ? { Range: range } : {} });

  const h = new Headers(upstream.headers);
  h.set("Access-Control-Allow-Origin", Deno.env.get("WEB_ORIGIN") ?? "*");
  h.set("Accept-Ranges", "bytes");
  if (!h.get("Content-Type") && row.storage_key.toLowerCase().endsWith(".mp3")) h.set("Content-Type","audio/mpeg");

  return new Response(c.req.method === "HEAD" ? null : upstream.body, { status: upstream.status, headers: h });
});

/** 🔧 One-shot repair endpoint to fix bad rows fast */
app.post("/api/admin/repair-track", async c => {
  const { id } = await c.req.json().catch(()=>({}));
  if (!id) return c.text("Missing id", 400);
  
  const s = sb();
  const { data: t } = await s.from("tracks").select("id,title,file_name,storage_bucket,storage_key").eq("id", id).maybeSingle();
  if (!t) return c.json({ ok:false, error:"TrackNotFound" }, 404);

  const buckets = (Deno.env.get("BUCKETS") ?? Deno.env.get("BUCKET") ?? "neuralpositivemusic")
    .split(",").map(x=>x.trim());
  const q = (t.file_name ?? t.title ?? "").toLowerCase().replace(/\.[^.]+$/,"").slice(0,24);

  for (const b of buckets) {
    const { data: list } = await s.storage.from(b).list("", { limit:1000, search:q });
    const hit = (list ?? []).find(o => o.name.toLowerCase().includes(q.slice(0,12)));
    if (hit) {
      await s.from("tracks").update({ storage_bucket:b, storage_key:hit.name }).eq("id", id);
      return c.json({ ok:true, bucket:b, key:hit.name });
    }
  }
  return c.json({ ok:false, error:"NoMatch", tried:buckets, query:q }, 404);
});

/** Debug storage access */
app.get("/api/debug/storage", async c => {
  const s = sb();
  
  const envCheck = {
    SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    BUCKET: Deno.env.get("BUCKET") ?? "neuralpositivemusic",
    WEB_ORIGIN: Deno.env.get("WEB_ORIGIN")
  };
  
  const { data: buckets, error: bucketsError } = await s.storage.listBuckets();
  const bucket = Deno.env.get("BUCKET") ?? "neuralpositivemusic";
  const { data: files, error: filesError } = await s.storage.from(bucket).list();
  
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
app.post("/api/sessions/start", async c => {
  const { trackId } = await c.req.json().catch(() => ({}));
  const sessionId = crypto.randomUUID();
  console.log(`🎵 Started session ${sessionId} for track ${trackId}`);
  return c.json({ sessionId });
});

app.post("/api/sessions/progress", async c => {
  const { sessionId, t } = await c.req.json().catch(() => ({}));
  console.log(`📊 Session ${sessionId} progress: ${t}s`);
  return c.json({ ok: true });
});

app.post("/api/sessions/complete", async c => {
  const { sessionId } = await c.req.json().catch(() => ({}));
  console.log(`✅ Session ${sessionId} completed`);
  return c.json({ ok: true });
});

/** JSON 404 that tells you the exact wrong path */
app.notFound(c => c.json({ ok:false, error:"NotFound", path:c.req.path }, 404));

export default app;