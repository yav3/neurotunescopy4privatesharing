import { Router } from "express";
import { parse as parseRange } from "range-parser";
import { Readable } from "node:stream";
import { stat, createReadStream } from "node:fs";
import { join, normalize } from "node:path";
import { createClient } from "@supabase/supabase-js";

// Node18+ global fetch is fine
const router = Router();

type Backend = "HTTP" | "SUPABASE" | "FS";
const BACKEND = (process.env.STREAM_BACKEND || "HTTP").toUpperCase() as Backend;

// Guards
function bad(res: any, msg: string, code = 400) {
  return res.status(code).json({ ok: false, error: msg });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Resolve remote URL from params + env
function resolveHttpUrl(req: any): string | null {
  const base = process.env.AUDIO_BASE_URL;
  const { url, path } = req.query;

  if (url && typeof url === "string") {
    try {
      const u = new URL(url);
      // Optional safety: only allow the configured host
      if (base) {
        const allow = new URL(base);
        if (u.host !== allow.host) return null;
      }
      return u.toString();
    } catch {
      return null;
    }
  }
  if (base && typeof path === "string") {
    const u = new URL(base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, ""));
    return u.toString();
  }
  return null;
}

// Preflight (explicit)
router.options("/:id?", (_req, res) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Range");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.status(204).end();
});

// HEAD endpoint (useful for clients to size tracks)
router.head("/:id?", async (req, res) => {
  try {
    if (BACKEND === "HTTP") {
      const u = resolveHttpUrl(req);
      if (!u) return bad(res, "Invalid or disallowed URL");
      const head = await fetch(u, { method: "HEAD" });
      if (!head.ok) return bad(res, `Upstream HEAD ${head.statusText}`, 502);
      const len = head.headers.get("content-length");
      if (len) res.setHeader("Content-Length", len);
      res.setHeader("Accept-Ranges", "bytes");
      res.status(200).end();
      return;
    }

    if (BACKEND === "FS") {
      const root = process.env.AUDIO_ROOT;
      const p = (req.query.path as string) || (req.params.id as string);
      if (!root || !p) return bad(res, "Missing AUDIO_ROOT or path/id");
      const abs = normalize(join(root, p));
      if (!abs.startsWith(normalize(root))) return bad(res, "Path traversal", 403);
      stat(abs, (err, st) => {
        if (err || !st.isFile()) return bad(res, "Not found", 404);
        res.setHeader("Content-Length", st.size);
        res.setHeader("Accept-Ranges", "bytes");
        res.status(200).end();
      });
      return;
    }

    // SUPABASE: we can't know length without downloading; we return 200 and let GET handle ranges.
    res.setHeader("Accept-Ranges", "bytes");
    res.status(200).end();
  } catch (e: any) {
    return bad(res, e?.message || "HEAD error", 500);
  }
});

// GET streaming with Range
router.get("/:id?", async (req, res) => {
  try {
    res.setHeader("Accept-Ranges", "bytes");

    if (BACKEND === "HTTP") {
      const u = resolveHttpUrl(req);
      if (!u) return bad(res, "Invalid or disallowed URL");

      // Try to get size
      const head = await fetch(u, { method: "HEAD" });
      const total = Number(head.headers.get("content-length") || 0);

      const rangeHeader = req.headers.range as string | undefined;
      let start = 0;
      let end = total ? total - 1 : undefined;

      if (rangeHeader && total) {
        const parsed = parseRange(total, rangeHeader);
        if (Array.isArray(parsed) && parsed.length > 0) {
          start = clamp(parsed[0].start, 0, total - 1);
          end = clamp(parsed[0].end ?? total - 1, start, total - 1);
          const upstream = await fetch(u, {
            headers: { Range: `bytes=${start}-${end}` },
          });
          if (upstream.status !== 206 && upstream.status !== 200) {
            return bad(res, `Upstream ${upstream.statusText}`, 502);
          }
          const chunkSize = end - start + 1;
          res.status(206);
          res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
          res.setHeader("Content-Length", chunkSize);
          res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
          Readable.fromWeb(upstream.body as any).pipe(res);
          return;
        }
      }

      // No/invalid range -> full stream
      const upstream = await fetch(u);
      if (!upstream.ok) return bad(res, `Upstream ${upstream.statusText}`, 502);
      if (total) res.setHeader("Content-Length", total);
      res.setHeader("Content-Type", upstream.headers.get("content-type") || "audio/mpeg");
      if (upstream.status === 206) res.status(206);
      Readable.fromWeb(upstream.body as any).pipe(res);
      return;
    }

    if (BACKEND === "FS") {
      const root = process.env.AUDIO_ROOT;
      const p = (req.query.path as string) || (req.params.id as string);
      if (!root || !p) return bad(res, "Missing AUDIO_ROOT or path/id");

      const abs = normalize(join(root, p));
      if (!abs.startsWith(normalize(root))) return bad(res, "Path traversal", 403);

      stat(abs, (err, st) => {
        if (err || !st.isFile()) return bad(res, "Not found", 404);

        const total = st.size;
        const rangeHeader = req.headers.range as string | undefined;

        if (!rangeHeader) {
          res.setHeader("Content-Length", total);
          res.setHeader("Content-Type", "audio/mpeg");
          createReadStream(abs).pipe(res);
          return;
        }

        const parsed = parseRange(total, rangeHeader);
        if (parsed === -1) return bad(res, "Range unsatisfiable", 416);
        if (parsed === -2 || !Array.isArray(parsed)) {
          res.setHeader("Content-Length", total);
          res.setHeader("Content-Type", "audio/mpeg");
          createReadStream(abs).pipe(res);
          return;
        }

        const { start, end } = parsed[0];
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
        res.setHeader("Content-Length", end - start + 1);
        res.setHeader("Content-Type", "audio/mpeg");
        createReadStream(abs, { start, end }).pipe(res);
      });
      return;
    }

    if (BACKEND === "SUPABASE") {
      const { SUPABASE_URL, SUPABASE_SERVICE_ROLE, STORAGE_BUCKET } = process.env;
      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE || !STORAGE_BUCKET) {
        return bad(res, "Supabase envs missing");
      }
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
      const key = (req.query.path as string) || (req.params.id as string);
      if (!key) return bad(res, "Missing path/id");

      // Create signed URL and proxy it with Range
      const { data, error } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(key, 60); // 60s

      if (error || !data?.signedUrl) return bad(res, "Supabase signedUrl error", 502);

      // Reuse HTTP path
      (req.query as any).url = data.signedUrl;
      return router.handle(req, res); // re-enter handler -> HTTP branch above
    }

    return bad(res, "Unknown backend", 500);
  } catch (e: any) {
    return bad(res, e?.message || "Stream error", 500);
  }
});

export default router;