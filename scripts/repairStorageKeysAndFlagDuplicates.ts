#!/usr/bin/env -S node --no-warnings
/**
 * Repairs malformed storage keys in Supabase Storage and updates the DB.
 * Also flags duplicate tracks by normalized basename.
 *
 * Requirements:
 *  - Node 18+
 *  - env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *  - tables: music_tracks(id uuid PK, storage_key text, file_path text, bucket_name text, upload_status text, title text)
 *  - bucket: neuralpositivemusic
 *
 * Usage:
 *   npx tsx scripts/repairStorageKeysAndFlagDuplicates.ts \
 *     --bucket neuralpositivemusic \
 *     --table music_tracks \
 *     --commit \
 *     --csv out/repair_report.csv
 *
 * Defaults:
 *   --dir-key-prefix=""   (if your file_path has a prefix inside the bucket, set it, e.g. "audio/")
 *   --exts=mp3,wav,m4a,flac
 *   dry-run unless --commit provided
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

type Args = {
  bucket: string;
  table: string;
  dirKeyPrefix: string;
  exts: string[];
  commit: boolean;
  csv?: string;
  pageSize: number;
  maxFiles?: number; // for testing
};

const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  })
);

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`❌ Missing env ${name}`);
    process.exit(1);
  }
  return v;
}

function coerceArgs(): Args {
  return {
    bucket: String(argv.bucket || "neuralpositivemusic"),
    table: String(argv.table || "music_tracks"),
    dirKeyPrefix: String(argv["dir-key-prefix"] || ""),
    exts: String(argv.exts || "mp3,wav,m4a,flac")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    commit: Boolean(argv.commit && argv.commit !== "false"),
    csv: argv.csv ? String(argv.csv) : undefined,
    pageSize: Math.max(1000, Number(argv.pageSize || 1000)),
    maxFiles: argv.maxFiles ? Math.max(1, Number(argv.maxFiles)) : undefined,
  };
}

const SUPABASE_URL = getEnv("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const args = coerceArgs();

type TrackRow = {
  id: string;
  storage_key: string | null;
  file_path: string | null;
  bucket_name: string | null;
  upload_status: string | null;
  title?: string | null;
  original_title?: string | null;
};

type RepairRecord = {
  oldKey: string;
  newKey: string;
  action: "move" | "skip";
  dbUpdated: boolean;
  duplicateTag?: string;
  note?: string;
};

function ensureDir(p: string) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function writeCSV(rows: RepairRecord[], outPath: string) {
  ensureDir(outPath);
  const header = "oldKey,newKey,action,dbUpdated,duplicateTag,note\n";
  const lines = rows.map((r) =>
    [
      JSON.stringify(r.oldKey),
      JSON.stringify(r.newKey),
      r.action,
      r.dbUpdated ? "true" : "false",
      r.duplicateTag ? JSON.stringify(r.duplicateTag) : "",
      r.note ? JSON.stringify(r.note) : "",
    ].join(",")
  );
  fs.writeFileSync(outPath, header + lines.join("\n"), "utf8");
}

function hasDotBeforeExt(key: string, exts: string[]): boolean {
  const lower = key.toLowerCase();
  return exts.some((e) => lower.endsWith("." + e));
}

function missingDotButHasExt(key: string, exts: string[]): { ext?: string } {
  const lower = key.toLowerCase();
  for (const e of exts) {
    if (lower.endsWith(e) && !lower.endsWith("." + e)) return { ext: e };
  }
  return {};
}

function normalizeBasenameForDupes(key: string): string {
  // normalize to detect duplicates robustly
  const base = path.basename(key);
  return base
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/_+/g, "_");
}

function insertDotBeforeExt(key: string, ext: string): string {
  // If key already has directories, only touch the basename
  const dir = path.posix.dirname(key);
  let base = path.posix.basename(key);
  // Remove trailing ext without dot then add .ext
  const re = new RegExp(`${ext}$`, "i");
  base = base.replace(re, "." + ext.toLowerCase());
  const fixed = dir === "." ? base : `${dir}/${base}`;
  // Also ensure no accidental double slashes
  return fixed.replace(/\/{2,}/g, "/");
}

async function listAllObjects(bucket: string): Promise<string[]> {
  const keys: string[] = [];
  let page = 0;
  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(args.dirKeyPrefix || "", {
        limit: args.pageSize,
        offset: page * args.pageSize,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      if (item.type === "folder") {
        // recurse folders
        const sub = await listFolder(bucket, item.name);
        keys.push(...sub);
      } else {
        const k = args.dirKeyPrefix ? `${args.dirKeyPrefix}/${item.name}` : item.name;
        keys.push(k);
      }
      if (args.maxFiles && keys.length >= args.maxFiles) return keys.slice(0, args.maxFiles);
    }
    page++;
  }
  return keys;
}

async function listFolder(bucket: string, folder: string): Promise<string[]> {
  const keys: string[] = [];
  let page = 0;
  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: args.pageSize, offset: page * args.pageSize, sortBy: { column: "name", order: "asc" } });
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      const k = `${folder}/${item.name}`;
      if (item.type === "folder") {
        const sub = await listFolder(bucket, k);
        keys.push(...sub);
      } else {
        keys.push(k);
      }
    }
    page++;
  }
  return keys;
}

async function getPublicUrl(bucket: string, key: string): Promise<string> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl;
}

async function updateTrackPaths(oldKey: string, newKey: string, table: string, bucket: string) {
  const { data, error } = await supabase
    .from(table)
    .update({
      storage_key: newKey,
      file_path: newKey,
      upload_status: "completed",
      updated_at: new Date().toISOString(),
    })
    .or(`storage_key.eq.${oldKey},file_path.eq.${oldKey}`)
    .select("id");
  if (error) throw error;
  return (data || []).map((d: any) => d.id);
}

async function markDuplicate(id: string, table: string) {
  const { error } = await supabase
    .from(table)
    .update({ 
      upload_status: "duplicate",
      updated_at: new Date().toISOString()
    })
    .eq("id", id);
  if (error) throw error;
}

async function fetchTracksByKeys(keys: string[], table: string): Promise<TrackRow[]> {
  if (keys.length === 0) return [];
  // Chunk in <= 500
  const out: TrackRow[] = [];
  for (let i = 0; i < keys.length; i += 500) {
    const slice = keys.slice(i, i + 500);
    const { data, error } = await supabase
      .from(table)
      .select("id,storage_key,file_path,bucket_name,upload_status,title,original_title")
      .or(slice.map(k => `storage_key.eq.${k},file_path.eq.${k}`).join(','));
    if (error) throw error;
    out.push(...(data || []));
  }
  return out;
}

async function main() {
  console.log("🔧 Starting storage key repair + duplicate flagging");
  console.log(`   bucket=${args.bucket}, table=${args.table}, prefix="${args.dirKeyPrefix}", exts=[${args.exts.join(",")}]`);
  console.log(args.commit ? "⚠️  COMMIT mode: changes will be applied" : "🧪 Dry-run: no writes");

  // 1) Enumerate all objects in bucket
  console.log("📦 Discovering storage objects...");
  const allKeys = await listAllObjects(args.bucket);
  console.log(`📦 Storage objects discovered: ${allKeys.length}`);

  // 2) Identify malformed keys (missing dot before extension) and compute corrected keys
  const plan: Array<{ oldKey: string; newKey: string }> = [];
  for (const key of allKeys) {
    const miss = missingDotButHasExt(key, args.exts);
    if (miss.ext) {
      plan.push({ oldKey: key, newKey: insertDotBeforeExt(key, miss.ext) });
    }
  }
  console.log(`🛠️  Keys requiring repair: ${plan.length}`);
  
  if (plan.length > 0) {
    console.log("🔍 Sample repairs:");
    plan.slice(0, 5).forEach(p => {
      console.log(`  ${p.oldKey} → ${p.newKey}`);
    });
    if (plan.length > 5) console.log(`  ... and ${plan.length - 5} more`);
  }

  // 3) Fetch DB rows so we can update after move
  console.log("🔍 Fetching database records...");
  const dbRows = await fetchTracksByKeys(allKeys, args.table);
  const dbByKey = new Map<string, TrackRow[]>();
  for (const r of dbRows) {
    const k = (r.storage_key || r.file_path || "").trim();
    if (!k) continue;
    if (!dbByKey.has(k)) dbByKey.set(k, []);
    dbByKey.get(k)!.push(r);
  }
  console.log(`📊 Database records found: ${dbRows.length}`);

  // 4) Execute repairs (move in storage + update DB)
  const report: RepairRecord[] = [];
  let moveCount = 0;
  
  for (let i = 0; i < plan.length; i++) {
    const p = plan[i];
    const rec: RepairRecord = { oldKey: p.oldKey, newKey: p.newKey, action: "move", dbUpdated: false };
    
    if (i % 100 === 0 && i > 0) {
      console.log(`⏳ Progress: ${i}/${plan.length} repairs processed...`);
    }
    
    try {
      if (args.commit) {
        // Use "move" when available (atomic on storage layer)
        const { error: moveErr } = await supabase.storage.from(args.bucket).move(p.oldKey, p.newKey);
        if (moveErr) throw moveErr;
        moveCount++;

        // Update DB rows linked to oldKey
        const updatedIds = await updateTrackPaths(p.oldKey, p.newKey, args.table, args.bucket);
        rec.dbUpdated = updatedIds.length > 0;
        rec.note = `moved + updated ${updatedIds.length} rows`;
      } else {
        rec.note = "dry-run (planned move)";
      }
    } catch (e: any) {
      rec.action = "skip";
      rec.note = `ERROR: ${String(e?.message || e)}`;
    }
    report.push(rec);
  }

  if (args.commit && moveCount > 0) {
    console.log(`✅ Successfully moved ${moveCount} files in storage`);
  }

  // 5) Duplicate detection (by normalized basename) — across *current* objects
  console.log("🔍 Detecting duplicates...");
  const currentKeys = args.commit 
    ? allKeys.filter(k => !plan.some(p => p.oldKey === k)).concat(plan.map(p => p.newKey))
    : allKeys;
    
  const rowsForDupes = await fetchTracksByKeys(currentKeys, args.table);

  const groups = new Map<string, TrackRow[]>();
  for (const r of rowsForDupes) {
    const k = r.storage_key || r.file_path || "";
    if (!k) continue;
    const norm = normalizeBasenameForDupes(k);
    if (!groups.has(norm)) groups.set(norm, []);
    groups.get(norm)!.push(r);
  }

  let dupesFlagged = 0;
  const dupeGroups = Array.from(groups.entries()).filter(([_, rows]) => rows.length > 1);
  
  if (dupeGroups.length > 0) {
    console.log(`🔍 Found ${dupeGroups.length} duplicate groups:`);
    dupeGroups.slice(0, 3).forEach(([norm, rows]) => {
      console.log(`  ${norm}: ${rows.length} tracks`);
    });
    if (dupeGroups.length > 3) console.log(`  ... and ${dupeGroups.length - 3} more groups`);
  }

  for (const [norm, rows] of dupeGroups) {
    // Keep the oldest row (by completed status or first), flag others as duplicate
    const keep = rows.find((r) => (r.upload_status || "").toLowerCase() === "completed") || rows[0];

    for (const r of rows) {
      if (r.id === keep.id) continue;
      const rec: RepairRecord = {
        oldKey: r.storage_key || r.file_path || "",
        newKey: keep.storage_key || keep.file_path || "",
        action: "skip",
        dbUpdated: false,
        duplicateTag: norm,
      };
      if (args.commit) {
        await markDuplicate(r.id, args.table);
        rec.dbUpdated = true;
        rec.note = `flagged duplicate -> kept ${keep.id}`;
      } else {
        rec.note = `dry-run duplicate -> would flag (keep ${keep.id})`;
      }
      report.push(rec);
      dupesFlagged++;
    }
  }

  // 6) Write CSV (optional)
  if (args.csv) {
    writeCSV(report, args.csv);
    console.log(`📝 CSV written: ${args.csv}`);
  }

  // 7) Summary
  const repaired = report.filter((r) => r.action === "move").length;
  const moved = report.filter((r) => r.action === "move" && r.note?.includes("moved")).length;
  const errors = report.filter((r) => (r.note || "").startsWith("ERROR")).length;

  console.log("\n📊 Summary");
  console.log(`${args.commit ? "✅ Committed" : "🧪 Dry-run"} storage key repairs: ${repaired} planned, ${moved} moved`);
  console.log(`Duplicates ${args.commit ? "flagged" : "detected"}: ${dupesFlagged}`);
  console.log(`Errors: ${errors}`);
  
  if (!args.commit && (repaired > 0 || dupesFlagged > 0)) {
    console.log("\n💡 To apply changes, run with --commit flag");
  }
  
  if (errors > 0) {
    console.log("⚠️  Check the CSV report for error details");
  }
}

main().catch((e) => {
  console.error("💥 Fatal:", e);
  process.exit(1);
});
