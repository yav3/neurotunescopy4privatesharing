#!/usr/bin/env -S node --no-warnings
/**
 * Portable API route checker
 * Node 18+ (built-in fetch)
 *
 * Usage (TS w/ npx tsx):
 *   npx tsx check-routes.ts --base https://YOUR-FUNCTIONS-URL --dir src
 *
 * Or compile to JS and run with node:
 *   tsc check-routes.ts --target es2020 --module commonjs
 *   node check-routes.js --base https://YOUR-FUNCTIONS-URL --dir src
 */

import { promises as fs } from "fs";
import * as path from "path";

type Options = {
  base: string;            // API base, e.g. https://xyz.supabase.co/functions/v1 or https://...functions.supabase.co
  dir: string;             // directory to scan (default: src)
  ignore: string[];        // glob-ish substrings to ignore
  csv?: string;            // optional output CSV path
  concurrency: number;     // concurrent probes
  methods: string[];       // methods to try
  timeoutMs: number;       // per-request timeout
};

const DEFAULTS: Options = {
  base:
    process.env.VITE_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE ||
    "",
  dir: "src",
  ignore: ["node_modules", "dist", "build", ".next", ".vercel", ".output"],
  csv: undefined,
  concurrency: 16,
  methods: ["GET"], // HEAD often blocked; 405 treated as "exists" if used
  timeoutMs: 8000,
};

const ARG = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);

function coerceOptions(): Options {
  const opts: Options = { ...DEFAULTS };
  if (ARG.base) opts.base = String(ARG.base);
  if (!opts.base) {
    console.error(
      "❌ Missing --base. Example: --base https://<PROJECT>.functions.supabase.co (or set VITE_API_BASE_URL/NEXT_PUBLIC_API_BASE_URL)"
    );
    process.exit(1);
  }
  if (ARG.dir) opts.dir = String(ARG.dir);
  if (ARG.ignore) opts.ignore = String(ARG.ignore).split(",");
  if (ARG.csv) opts.csv = String(ARG.csv);
  if (ARG.concurrency) opts.concurrency = Math.max(1, Number(ARG.concurrency));
  if (ARG.methods) opts.methods = String(ARG.methods).split(",").map((m) => m.toUpperCase());
  if (ARG.timeoutMs) opts.timeoutMs = Math.max(1000, Number(ARG.timeoutMs));
  return opts;
}

// --- file scanning ----------------------------------------------------------

async function walk(dir: string, ignore: string[], acc: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (ignore.some((skip) => p.includes(skip))) continue;
    if (e.isDirectory()) {
      await walk(p, ignore, acc);
    } else if (/\.(t|j)sx?$|\.mjs$|\.cjs$|\.json$/.test(e.name)) {
      acc.push(p);
    }
  }
  return acc;
}

// Regexes to find endpoints in common libs
const RX = {
  // fetch("/api/foo"), fetch(`...`)
  fetch: /\bfetch\s*\(\s*([`'"])(.+?)\1/gs,

  // new Request("/api/foo", ...)
  newRequest: /\bnew\s+Request\s*\(\s*([`'"])(.+?)\1/gs,

  // axios.get("/api/x"), axios.post(`...`)
  axios: /\baxios\.(get|post|put|delete|patch|head)\s*\(\s*([`'"])(.+?)\2/gs,

  // ky("...") / ky.get("..."), ky.post("...")
  ky: /\bky(?:\.(get|post|put|delete|patch|head))?\s*\(\s*([`'"])(.+?)\2/gs,

  // useSWR("/api/foo", ...)
  useSWR: /\buseSWR\s*\(\s*([`'"])(.+?)\1/gs,

  // apiFetch("/api/..")
  apiFetch: /\bapiFetch\s*\(\s*([`'"])(.+?)\1/gs,
};

// Extract candidate paths/URLs from file text
function extractCandidates(code: string): string[] {
  const found = new Set<string>();
  function capAll(r: RegExp, idx = 2) {
    for (const m of code.matchAll(r)) {
      const val = m[idx];
      if (val) found.add(String(val));
    }
  }
  capAll(RX.fetch, 2);
  capAll(RX.newRequest, 2);
  // axios: url is group 3
  for (const m of code.matchAll(RX.axios)) found.add(m[3]);
  // ky: url is group 3
  for (const m of code.matchAll(RX.ky)) found.add(m[3]);
  capAll(RX.useSWR, 2);
  capAll(RX.apiFetch, 2);

  // Also catch crude templates like `${API_BASE}/api/foo`
  // This is best-effort; static only.
  const tmpl = /\$\{\s*API_BASE\s*\}\/?([a-zA-Z0-9_\-./?&=#%:+]+)?/g;
  for (const m of code.matchAll(tmpl)) {
    const sfx = m[1] || "";
    found.add("/" + sfx.replace(/^\/+/, ""));
  }

  return [...found];
}

function normalizeUrl(base: string, raw: string): string | null {
  const trimmed = raw.trim();
  if (/^data:|^blob:/.test(trimmed)) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed; // absolute
  if (trimmed.startsWith("//")) return "https:" + trimmed; // protocol-relative
  // Relative path: must start with slash for API
  const slash = trimmed.startsWith("/") ? trimmed : "/" + trimmed;
  return base.replace(/\/+$/, "") + slash;
}

// --- probing ---------------------------------------------------------------

type ProbeResult = {
  url: string;
  method: string;
  status: number | "NETWORK";
  ok: boolean;
  exists: boolean; // true if not 404/410/NETWORK
  ms: number;
};

async function probe(url: string, method: string, timeoutMs: number): Promise<ProbeResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const t0 = performance.now();
  try {
    const res = await fetch(url, {
      method,
      signal: ctrl.signal,
      redirect: "manual",
    });
    const ms = Math.round(performance.now() - t0);
    clearTimeout(t);
    // consider route exists if not 404 or 410 (gone)
    const exists = ![404, 410].includes(res.status);
    return { url, method, status: res.status, ok: res.ok, exists, ms };
  } catch {
    clearTimeout(t);
    const ms = Math.round(performance.now() - t0);
    return { url, method, status: "NETWORK", ok: false, exists: false, ms };
  }
}

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (it: T) => Promise<void>
) {
  const q = [...items];
  const runners: Promise<void>[] = [];
  for (let i = 0; i < Math.min(limit, q.length); i++) {
    runners.push(
      (async function consume() {
        while (q.length) {
          const it = q.shift()!;
          await worker(it);
        }
      })()
    );
  }
  await Promise.all(runners);
}

// --- main ------------------------------------------------------------------

async function main() {
  const opts = coerceOptions();
  console.log(`🔎 Scanning "${opts.dir}" for API calls…`);
  const files = await walk(path.resolve(opts.dir), opts.ignore);
  const candidates = new Set<string>();

  for (const f of files) {
    const code = await fs.readFile(f, "utf8");
    for (const c of extractCandidates(code)) candidates.add(c);
  }

  // Filter out obvious non-API (assets, .mp3, .png, etc.)
  const rawList = [...candidates].filter(
    (s) => !/\.(png|jpg|jpeg|gif|svg|webp|mp3|wav|ogg|css|woff2?|ttf|pdf)(\?|$)/i.test(s)
  );

  // Normalize against base
  const urls = new Set<string>();
  for (const r of rawList) {
    const u = normalizeUrl(opts.base, r);
    if (u) urls.add(u);
  }

  if (urls.size === 0) {
    console.log("ℹ️ No candidate API URLs found. Check your patterns or directory.");
    process.exit(0);
  }

  console.log(`🧪 Probing ${urls.size} unique URL(s) x methods [${opts.methods.join(", ")}]…\n`);

  const results: ProbeResult[] = [];
  const work: Array<{ url: string; method: string }> = [];

  for (const url of urls) {
    for (const m of opts.methods) work.push({ url, method: m });
  }

  await runWithConcurrency(work, opts.concurrency, async ({ url, method }) => {
    const r = await probe(url, method, opts.timeoutMs);
    results.push(r);
    const badge =
      r.status === 200
        ? "200"
        : typeof r.status === "number"
        ? String(r.status)
        : r.status;
    const flag = r.exists ? "✅" : "❌";
    console.log(`${flag} [${method}] ${badge} ${url} (${r.ms}ms)`);
  });

  // Summarize by URL: if any method says exists, we consider it exists
  const byUrl = new Map<
    string,
    { url: string; exists: boolean; worstStatus: number | "NETWORK"; samples: ProbeResult[] }
  >();

  for (const r of results) {
    const cur = byUrl.get(r.url) || { url: r.url, exists: false, worstStatus: 200, samples: [] };
    cur.exists = cur.exists || r.exists;
    cur.samples.push(r);

    const s = r.status;
    // define "worst" for display: NETWORK > 5xx > 4xx > 3xx > 2xx
    function rank(x: number | "NETWORK") {
      if (x === "NETWORK") return 5;
      if (x >= 500) return 4;
      if (x >= 400) return 3;
      if (x >= 300) return 2;
      return 1; // 2xx
    }
    if (rank(s) > rank(cur.worstStatus)) cur.worstStatus = s;

    byUrl.set(r.url, cur);
  }

  const missing = [...byUrl.values()].filter((v) => !v.exists);
  const present = [...byUrl.values()].filter((v) => v.exists);

  console.log("\n— Summary —");
  console.log(`✅ Exists: ${present.length}`);
  console.log(`❌ Missing (404/410/NETWORK): ${missing.length}`);

  if (missing.length) {
    console.log("\n❌ Missing routes (fix these):");
    for (const m of missing) {
      console.log(
        `  - ${m.url}  (worst: ${m.worstStatus})  methods: ${m.samples
          .map((s) => s.method + ":" + s.status)
          .join(", ")}`
      );
    }
  }

  if (opts.csv) {
    const lines = [
      "url,method,status,exists,ms",
      ...results.map(
        (r) => `"${r.url}",${r.method},${r.status === "NETWORK" ? "NETWORK" : r.status},${r.exists},${r.ms}`
      ),
    ];
    await fs.writeFile(opts.csv, lines.join("\n"), "utf8");
    console.log(`\n📝 Wrote CSV: ${opts.csv}`);
  }

  // Non-zero exit if missing, so CI can fail fast
  if (missing.length) process.exit(2);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});