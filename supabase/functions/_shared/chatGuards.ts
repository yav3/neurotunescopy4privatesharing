// Shared anti-abuse guards for public AI chat edge functions.
// Provides: origin allowlist, input caps, DB-backed per-IP rate limiting.
//
// IMPORTANT: This is not authentication. It only raises the cost of casual
// scripted abuse on the public lead-conversion widgets (sales/trial/support).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Limits (per IP, per function) -----------------------------------------
export const HOURLY_CAP = 10;
export const DAILY_CAP = 20;

// --- Input caps ------------------------------------------------------------
export const MAX_MESSAGES = 10;
export const MAX_CONTENT_CHARS = 2000;
export const MAX_TOTAL_CHARS = 12000;

// --- Origin allowlist ------------------------------------------------------
// Hosts that may call these endpoints from a browser. We accept any subdomain
// match plus lovable preview / sandbox hosts. Non-browser callers (no Origin
// header) are allowed so server-to-server testing still works.
const ALLOWED_HOST_SUFFIXES = [
  "neurotunes.app",
  "neuralpositive.com",
  "lovable.app",
  "lovable.dev",
  "lovableproject.com",
  "localhost",
  "127.0.0.1",
];

export function isOriginAllowed(req: Request): boolean {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  if (!origin) return true; // no browser origin → server-to-server, allow
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return ALLOWED_HOST_SUFFIXES.some(
      (s) => host === s || host.endsWith(`.${s}`),
    );
  } catch {
    return false;
  }
}

// --- Client IP -------------------------------------------------------------
export function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

// --- Message validation ----------------------------------------------------
export type ChatMessage = { role: string; content: string };

export function validateMessages(
  raw: unknown,
): { ok: true; messages: ChatMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) return { ok: false, error: "messages must be an array" };
  if (raw.length === 0) return { ok: false, error: "messages is empty" };

  const trimmed = raw.slice(-MAX_MESSAGES) as unknown[];
  let total = 0;
  const out: ChatMessage[] = [];
  for (const m of trimmed) {
    if (!m || typeof m !== "object") {
      return { ok: false, error: "invalid message shape" };
    }
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "invalid role" };
    }
    if (typeof content !== "string") {
      return { ok: false, error: "content must be string" };
    }
    if (content.length > MAX_CONTENT_CHARS) {
      return { ok: false, error: "message too long" };
    }
    total += content.length;
    if (total > MAX_TOTAL_CHARS) {
      return { ok: false, error: "conversation too long" };
    }
    out.push({ role, content });
  }
  return { ok: true, messages: out };
}

// --- DB-backed rate limiter ------------------------------------------------
let _admin: ReturnType<typeof createClient> | null = null;
function admin() {
  if (_admin) return _admin;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Supabase service credentials missing");
  _admin = createClient(url, key, { auth: { persistSession: false } });
  return _admin;
}

/**
 * Returns { ok: true } when under both hourly and daily caps and records the
 * hit, otherwise { ok: false, retryAfterSeconds }.
 * Fails-open on DB errors so a transient outage cannot take chat offline —
 * the per-process Map limiter below still applies as a backstop.
 */
export async function checkRateLimit(
  ip: string,
  functionName: string,
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number; reason: string }> {
  if (ip === "unknown") {
    // No reliable identifier — fall back to in-memory limiter only.
    return memoryLimiter(ip, functionName);
  }

  try {
    const sb = admin();
    const sinceDay = new Date(Date.now() - 24 * 3600_000).toISOString();
    const sinceHour = new Date(Date.now() - 3600_000).toISOString();

    const { data, error } = await sb
      .from("chat_rate_limits")
      .select("created_at")
      .eq("ip_address", ip)
      .eq("function_name", functionName)
      .gte("created_at", sinceDay);

    if (error) {
      console.warn("rate-limit query failed, falling back:", error.message);
      return memoryLimiter(ip, functionName);
    }

    const rows = data ?? [];
    if (rows.length >= DAILY_CAP) {
      return { ok: false, retryAfterSeconds: 3600, reason: "daily cap reached" };
    }
    const hourly = rows.filter((r) => r.created_at >= sinceHour).length;
    if (hourly >= HOURLY_CAP) {
      return { ok: false, retryAfterSeconds: 600, reason: "hourly cap reached" };
    }

    // Record this hit (fire-and-forget; ignore insert errors).
    sb.from("chat_rate_limits")
      .insert({ ip_address: ip, function_name: functionName })
      .then(({ error: e }) => {
        if (e) console.warn("rate-limit insert failed:", e.message);
      });

    return { ok: true };
  } catch (e) {
    console.warn("rate-limit unexpected error:", (e as Error).message);
    return memoryLimiter(ip, functionName);
  }
}

// --- In-memory backstop limiter (used when DB unavailable or IP=unknown) ---
const mem = new Map<string, { count: number; resetAt: number }>();
const MEM_WINDOW_MS = 60_000;
const MEM_MAX = 20;
function memoryLimiter(
  ip: string,
  fn: string,
): { ok: true } | { ok: false; retryAfterSeconds: number; reason: string } {
  const key = `${fn}:${ip}`;
  const now = Date.now();
  const r = mem.get(key);
  if (!r || now > r.resetAt) {
    mem.set(key, { count: 1, resetAt: now + MEM_WINDOW_MS });
    return { ok: true };
  }
  if (r.count >= MEM_MAX) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((r.resetAt - now) / 1000),
      reason: "burst limit",
    };
  }
  r.count++;
  return { ok: true };
}

// --- Convenience: run all checks, return Response on failure ---------------
export async function preflightChat(
  req: Request,
  functionName: string,
): Promise<
  | { ok: true; ip: string; messages: ChatMessage[] }
  | { ok: false; response: Response }
> {
  if (!isOriginAllowed(req)) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const ip = getClientIP(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const validated = validateMessages((body as { messages?: unknown })?.messages);
  if (!validated.ok) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: validated.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const limit = await checkRateLimit(ip, functionName);
  if (!limit.ok) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          reason: limit.reason,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": String(limit.retryAfterSeconds),
          },
        },
      ),
    };
  }

  return { ok: true, ip, messages: validated.messages };
}
