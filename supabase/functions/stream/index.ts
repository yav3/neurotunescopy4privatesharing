// deno-lint-ignore-file no-explicit-any
// Edge Function: /stream/:id
// - Looks up DB row by track ID
// - Signs storage path (or uses public) and PROXIES the bytes
// - Supports HEAD, GET, Range
// - Adds strict CORS

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // needed if bucket is private
const BUCKET = Deno.env.get("AUDIO_BUCKET") ?? "neuralpositivemusic"; // <-- your bucket

// CORS: put your real origins here
const ALLOWED_ORIGINS = new Set<string>([
  "https://6da1ca3b-63ee-4fbc-bf5f-e2e73b1237a1.sandbox.lovable.dev",
  "https://id-preview--6da1ca3b-63ee-4fbc-bf5f-e2e73b1237a1.lovable.app",
  "https://neurotunesai.lovable.app",
  "http://localhost:3000",
  "http://localhost:5173",
]);

// Use service role if available (private bucket), else anon (public bucket)
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

// --- Utilities ---------------------------------------------------------------

function corsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  const allow =
    origin && ALLOWED_ORIGINS.has(origin)
      ? origin
      : "*"; // if you want to be stricter, replace "*" with "" and 403 unknown origins

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
    "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
    "Access-Control-Expose-Headers":
      "Accept-Ranges, Content-Range, Content-Length, Content-Type, Cache-Control",
    Vary: "Origin",
  };
}

function notFound(req: Request, msg = "Not Found") {
  return new Response(msg, { status: 404, headers: corsHeaders(req) });
}
function bad(req: Request, msg = "Bad Request") {
  return new Response(msg, { status: 400, headers: corsHeaders(req) });
}
function serverErr(req: Request, msg = "Server Error") {
  return new Response(msg, { status: 500, headers: corsHeaders(req) });
}

// MIME fallback if upstream forgets
function guessContentType(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "m4a":
    case "aac":
      return "audio/aac";
    case "flac":
      return "audio/flac";
    case "ogg":
      return "audio/ogg";
    default:
      return "application/octet-stream";
  }
}

// Signed URL (private) or public URL (public bucket)
async function getPlayableUrl(filePath: string): Promise<string> {
  console.log(`🎵 Getting playable URL for: ${filePath}`);
  
  // Try signed first (works for both private and public buckets)
  const ttlSeconds = 60 * 60; // 1 hour
  const signed = await supabase.storage.from(BUCKET).createSignedUrl(filePath, ttlSeconds);
  if (!signed.error && signed.data?.signedUrl) {
    console.log(`✅ Created signed URL for: ${filePath}`);
    return signed.data.signedUrl;
  }

  console.log(`⚠️ Signed URL failed for ${filePath}:`, signed.error?.message);

  // Fallback: public URL (if bucket is public)
  const pub = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  if (pub.data?.publicUrl) {
    console.log(`✅ Using public URL for: ${filePath}`);
    return pub.data.publicUrl;
  }

  throw new Error(`Cannot sign or expose URL for ${filePath}`);
}

// Proxy a fetch() (including Range) and relay headers/status/body
async function proxyFile(req: Request, upstreamUrl: string, method: "HEAD" | "GET") {
  const range = req.headers.get("Range") ?? undefined;
  console.log(`🎵 Proxying ${method} request${range ? ` with Range: ${range}` : ''}`);

  const upstream = await fetch(upstreamUrl, {
    method,
    headers: {
      ...(range ? { Range: range } : {}),
      // Safari sometimes benefits from Accept set; optional.
      Accept: "audio/*, */*",
    },
  });

  console.log(`📥 Upstream ${method} response: ${upstream.status} ${upstream.statusText}`);

  // If upstream fails, bubble it through
  if (!upstream.ok && upstream.status !== 206) {
    const txt = await upstream.text().catch(() => "");
    console.error(`❌ Upstream ${method} failed: ${upstream.status} ${txt.slice(0, 200)}`);
    return new Response(
      `Upstream ${method} ${upstream.status}\n${txt.slice(0, 500)}`,
      { status: upstream.status, headers: corsHeaders(req) },
    );
  }

  // Copy important headers
  const h = new Headers(corsHeaders(req));
  // Ensure required playback headers exist
  const upstreamCT = upstream.headers.get("Content-Type");
  h.set("Content-Type", upstreamCT ?? guessContentType(upstreamUrl));

  const pass = [
    "Accept-Ranges",
    "Content-Range",
    "Content-Length",
    "Cache-Control",
    "ETag",
    "Last-Modified",
  ];
  for (const k of pass) {
    const v = upstream.headers.get(k);
    if (v) h.set(k, v);
  }

  // Ensure Accept-Ranges is set for audio streaming
  if (!h.has("Accept-Ranges")) {
    h.set("Accept-Ranges", "bytes");
  }

  console.log(`✅ Proxying response with Content-Type: ${h.get("Content-Type")}`);

  // Stream body for GET; empty for HEAD
  if (method === "GET") return new Response(upstream.body, { status: upstream.status, headers: h });
  return new Response(null, { status: upstream.status, headers: h });
}

// DB lookup: id -> file_path (adapted for music_tracks table)
async function resolveFilePath(trackId: string): Promise<string | null> {
  console.log(`🔍 Looking up track: ${trackId}`);
  
  // Use music_tracks table with file_path and storage_key columns
  const { data, error } = await supabase
    .from("music_tracks")
    .select("file_path, storage_key, title")
    .eq("id", trackId)
    .maybeSingle();

  if (error) {
    console.error(`❌ DB lookup error for track ${trackId}:`, error);
    throw error;
  }
  
  if (!data) {
    console.log(`❌ Track not found: ${trackId}`);
    return null;
  }

  // Prefer file_path, fallback to storage_key
  const filePath = data.file_path || data.storage_key;
  console.log(`✅ Found track "${data.title}" with file path: ${filePath}`);
  
  return filePath;
}

// --- Router ------------------------------------------------------------------

serve(async (req) => {
  try {
    console.log(`🎵 Stream request: ${req.method} ${req.url}`);
    
    // Preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(req) });
    }

    // Expect /stream/:id
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    // Edge function mountpoint is /stream/* already, but handle both forms:
    const idx = parts.findIndex((p) => p === "stream");
    const id = parts[(idx >= 0 ? idx + 1 : parts.length - 1)] ?? "";

    console.log(`🎵 Extracted track ID: ${id}`);

    if (!id) return bad(req, "Missing track id");

    // Resolve DB → storage path
    const filePath = await resolveFilePath(id);
    if (!filePath) return notFound(req, "Track not found");

    // Build playable URL and proxy
    const playable = await getPlayableUrl(filePath);

    if (req.method === "HEAD") {
      return await proxyFile(req, playable, "HEAD");
    }
    if (req.method === "GET") {
      return await proxyFile(req, playable, "GET");
    }
    return bad(req, "Method not allowed");
  } catch (e: any) {
    console.error("STREAM_ERROR", e?.message ?? e);
    return serverErr(req, "Stream server error");
  }
});