/**
 * Validate track <-> storage mapping by UUID, then analyze audio and write results.
 * Requires: Node 18+, ffmpeg/ffprobe installed (or ffprobe-static), and these envs:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   DEFAULT_BUCKET=neuralpositivemusic      # change if needed
 *   CANONICAL_PREFIX=tracks                 # prefer "tracks/<uuid>.mp3"
 */

import { createClient } from '@supabase/supabase-js';
import pLimit from 'p-limit';
import { execa } from 'execa';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

// ---------- Config ----------
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pbtgvcjniayedqlajjzz.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DEFAULT_BUCKET = process.env.DEFAULT_BUCKET || 'neuralpositivemusic';
const CANONICAL_PREFIX = process.env.CANONICAL_PREFIX || 'tracks';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '6', 10);
const DRY_RUN = process.env.DRY_RUN === '1';

// ---------- Supabase ----------
const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// ---------- Helpers ----------
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function signedUrl(bucket: string, key: string, seconds = 120): Promise<string | null> {
  const { data, error } = await sb.storage.from(bucket).createSignedUrl(key, seconds);
  return error || !data?.signedUrl ? null : data.signedUrl;
}

async function headOk(url: string): Promise<{ ok: boolean; ct?: string; len?: string }> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return { ok: r.ok, ct: r.headers.get('content-type') || undefined, len: r.headers.get('content-length') || undefined };
  } catch {
    return { ok: false };
  }
}

function canonicalKeyFor(id: string, ext = 'mp3') { return `${CANONICAL_PREFIX}/${id}.${ext}`; }

async function ensureCanonicalPath(bucket: string, id: string, currentKey: string | null) {
  // prefer tracks/<uuid>.mp3 if it already exists (or move if allowed)
  const canonical = canonicalKeyFor(id, 'mp3');
  const canonUrl = await signedUrl(bucket, canonical);
  if (canonUrl) return { bucket, key: canonical, moved: false }; // canonical exists

  if (!currentKey) return null;

  // if current key exists, keep it (or move it to canonical if you want)
  const url = await signedUrl(bucket, currentKey);
  if (url) {
    // Optional move to canonical:
    // if (!DRY_RUN) await sb.storage.from(bucket).move(currentKey, canonical);
    // return { bucket, key: canonical, moved: true };
    return { bucket, key: currentKey, moved: false };
  }

  return null;
}

async function downloadToTemp(url: string): Promise<{ file: string }> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'nt-a-'));
  const file = path.join(tmp, 'audio');
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download failed ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(file, buf);
  return { file };
}

async function ffprobe(fileOrUrl: string) {
  // execa will find ffprobe in PATH; add ffprobe-static if needed
  const { stdout } = await execa('ffprobe', [
    '-v','error','-print_format','json',
    '-show_format','-show_streams', fileOrUrl
  ]);
  const j = JSON.parse(stdout);
  const aStream = (j.streams||[]).find((s:any)=>s.codec_type==='audio') || {};
  const fmt = j.format || {};
  return {
    format: fmt.format_name,
    duration_sec: fmt.duration ? Number(fmt.duration) : undefined,
    sample_rate_hz: aStream.sample_rate ? Number(aStream.sample_rate) : undefined,
    channels: aStream.channels ? Number(aStream.channels) : undefined,
    bitrate_kbps: (fmt.bit_rate ? Math.round(Number(fmt.bit_rate)/1000) : undefined),
  };
}

async function loudnessLUFS(fileOrUrl: string): Promise<number | undefined> {
  // estimate integrated LUFS via ffmpeg ebur128 filter; quick & coarse
  try {
    const { stderr } = await execa('ffmpeg', [
      '-nostats','-i', fileOrUrl, '-filter_complex','ebur128=peak=true', '-f','null','-'
    ], { stderr: 'pipe' });
    const m = /I:\\s*(-?\\d+\\.\\d+)\\s*LUFS/.exec(stderr);
    return m ? Number(m[1]) : undefined;
  } catch {
    return undefined;
  }
}

async function md5Hex(filePath: string): Promise<string> {
  const buf = await fs.readFile(filePath);
  return crypto.createHash('md5').update(buf).digest('hex');
}

// Optional hooks for BPM / musical key (plug your favorite lib here)
async function estimateBPM(_file: string): Promise<number | undefined> { return undefined; }
async function estimateKey(_file: string): Promise<string | undefined> { return undefined; }

// ---------- Core per-track job ----------
async function processTrack(row: { id: string; storage_bucket: string | null; storage_key: string | null; audio_status: string | null }) {
  const id = row.id;
  const bucket = row.storage_bucket || DEFAULT_BUCKET;

  console.log(`Processing track ${id}...`);

  // 1) Resolve mapping
  const resolved = await ensureCanonicalPath(bucket, id, row.storage_key);
  if (!resolved) {
    if (!DRY_RUN) await sb.from('tracks').update({
      audio_status: 'missing', last_verified_at: new Date().toISOString(),
      last_error: `ObjectNotFound:${bucket}:${row.storage_key || 'none'}`
    }).eq('id', id);
    return { id, status: 'missing' as const };
  }

  const url = await signedUrl(resolved.bucket, resolved.key, 180);
  if (!url) {
    if (!DRY_RUN) await sb.from('tracks').update({
      audio_status: 'missing', last_verified_at: new Date().toISOString(),
      last_error: `SignFailed:${resolved.bucket}:${resolved.key}`
    }).eq('id', id);
    return { id, status: 'missing' as const };
  }

  const head = await headOk(url);
  if (!head.ok) {
    if (!DRY_RUN) await sb.from('tracks').update({
      audio_status: 'missing', last_verified_at: new Date().toISOString(),
      last_error: `HeadFailed:${resolved.bucket}:${resolved.key}`
    }).eq('id', id);
    return { id, status: 'missing' as const };
  }

  // 2) Persist resolved path (and mark working/unknown for analysis)
  if (!DRY_RUN) {
    await sb.from('tracks').update({
      storage_bucket: resolved.bucket, storage_key: resolved.key,
      audio_status: 'working', last_verified_at: new Date().toISOString(),
      last_error: null, analysis_status: 'pending'
    }).eq('id', id);
  }

  // 3) Download for analysis (or probe via URL directly where possible)
  // ffprobe can read URLs; for md5/lufs we'll download to temp for reliability
  let tmpFile: string | null = null;
  try {
    const { file } = await downloadToTemp(url);
    tmpFile = file;

    const meta = await ffprobe(file);
    const lufs = await loudnessLUFS(file);
    const md5  = await md5Hex(file);
    const bpm  = await estimateBPM(file);
    const key  = await estimateKey(file);

    if (!DRY_RUN) {
      await sb.from('tracks').update({
        format: meta.format,
        duration_sec: meta.duration_sec,
        sample_rate_hz: meta.sample_rate_hz,
        channels: meta.channels,
        bitrate_kbps: meta.bitrate_kbps,
        loudness_lufs: lufs,
        md5_hex: md5,
        bpm_est: bpm ?? null,
        musical_key_est: key ?? null,
        analysis_status: 'complete',
        last_analyzed_at: new Date().toISOString()
      }).eq('id', id);
    }

    console.log(`✅ Completed: ${id} -> ${resolved.key}`);
    return { id, status: 'complete' as const, key: resolved.key };
  } catch (e: any) {
    console.error(`❌ Error processing ${id}:`, e.message);
    if (!DRY_RUN) {
      await sb.from('tracks').update({
        analysis_status: 'error',
        last_analyzed_at: new Date().toISOString(),
        last_error: `AnalysisError:${e?.message || e}`
      }).eq('id', id);
    }
    return { id, status: 'error' as const, error: e?.message || String(e) };
  } finally {
    if (tmpFile) {
      try { await fs.unlink(tmpFile); await fs.rmdir(path.dirname(tmpFile)); } catch {}
    }
  }
}

// ---------- Driver ----------
async function main() {
  const limit = pLimit(CONCURRENCY);

  console.log('🎵 Starting comprehensive track validation and analysis...');
  console.log(`Config: DRY_RUN=${DRY_RUN}, CONCURRENCY=${CONCURRENCY}, DEFAULT_BUCKET=${DEFAULT_BUCKET}`);

  // Pull candidates: unknown/missing (validate), and 'working' without analysis (analyze)
  const { data: rows1 } = await sb.from('tracks')
    .select('id,storage_bucket,storage_key,audio_status')
    .in('audio_status', ['unknown','missing'])
    .order('id', { ascending: true })
    .limit(20000);

  const { data: rows2 } = await sb.from('tracks')
    .select('id,storage_bucket,storage_key,audio_status,analysis_status')
    .eq('audio_status','working')
    .or('analysis_status.is.null,analysis_status.eq.pending')
    .order('id', { ascending: true })
    .limit(20000);

  const rows = ([] as any[]).concat(rows1 || [], rows2 || []);
  console.log(`📊 Processing ${rows.length} tracks... (concurrency=${CONCURRENCY}, dry=${DRY_RUN})`);

  if (rows.length === 0) {
    console.log('✨ No tracks need processing!');
    return;
  }

  let ok=0, miss=0, err=0;
  const tasks = rows.map(r => limit(()=>processTrack(r).then(res=>{
    if (res.status==='complete') ok++;
    else if (res.status==='missing') miss++;
    else err++;
    return res;
  })));

  const results = await Promise.all(tasks);
  
  const summary = { 
    total: rows.length, 
    complete: ok, 
    missing: miss, 
    error: err,
    timestamp: new Date().toISOString()
  };
  
  console.log('\n🎯 FINAL RESULTS:');
  console.log(JSON.stringify(summary, null, 2));
  
  // Write detailed report
  const reportFile = `analysis_report_${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}.json`;
  await fs.writeFile(reportFile, JSON.stringify({summary, results}, null, 2));
  console.log(`📄 Detailed report saved: ${reportFile}`);
  
  // Show quick stats
  const { data: stats } = await sb.from('tracks')
    .select('audio_status,analysis_status', { count: 'exact' });
    
  const statusCounts = (stats || []).reduce((acc: any, row: any) => {
    const audioStatus = row.audio_status || 'unknown';
    const analysisStatus = row.analysis_status || 'pending';
    acc[audioStatus] = (acc[audioStatus] || 0) + 1;
    acc[`analysis_${analysisStatus}`] = (acc[`analysis_${analysisStatus}`] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📈 Current database status:');
  console.log(JSON.stringify(statusCounts, null, 2));
}

if (!SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

main().catch(e => { 
  console.error('❌ Fatal error:', e); 
  process.exit(1); 
});
