import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
  { auth: { persistSession: false } }
);

const BUCKET = process.env.SUPABASE_BUCKET || 'neuralpositivemusic';
const PUBLIC_BUCKET = (process.env.PUBLIC_BUCKET ?? 'true') === 'true';

interface ResolveResult {
  key: string | null;
  score: number;
}

let idx: string[] = [];
let lastBuilt = 0;

export async function buildStorageIndex(force = false) {
  const now = Date.now();
  if (!force && idx.length && now - lastBuilt < 10 * 60_000) return;
  idx = await listAll('', []);
  lastBuilt = now;
}

// recursively list folders/files
async function listAll(prefix: string, acc: string[]): Promise<string[]> {
  let offset = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: PAGE, offset, sortBy: { column: 'name', order: 'asc' }
    });
    if (error) throw error;
    if (!data?.length) break;

    for (const e of data) {
      const isDir = !!(e as any).id === false && !e.name?.includes('.');
      // Supabase folders are logical; when name has no dot it's *likely* a folder.
      if (isDir) {
        const nextPrefix = prefix ? `${prefix}/${e.name}` : e.name;
        await listAll(nextPrefix, acc);
      } else {
        const key = prefix ? `${prefix}/${e.name}` : e.name;
        if (key.toLowerCase().endsWith('.mp3')) acc.push(key);
      }
    }
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return acc;
}

function normalizeTokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[_\-\.]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(inst|instr|instrumental)\b/g, 'instrumental')
    .replace(/\bre[\s-]?energize\b/g, 'reenergize')
    .replace(/\b(2010s|2010's)\b/g, '2010s')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

function score(aRaw: string, bRaw: string): number {
  const A = new Set(normalizeTokens(aRaw));
  const B = new Set(normalizeTokens(bRaw));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter++;
  const jaccard = inter / (A.size + B.size - inter);
  return jaccard; // simple & fast; good enough
}

export async function resolveStorageKey(candidate: string): Promise<ResolveResult> {
  await buildStorageIndex();

  // exact first
  const exact = idx.find(k => k.toLowerCase() === candidate.toLowerCase()
                            || k.toLowerCase().endsWith('/' + candidate.toLowerCase())
                            || k.toLowerCase().includes('/' + candidate.toLowerCase() + '.mp3')
                            || k.toLowerCase().endsWith(candidate.toLowerCase() + '.mp3'));
  if (exact) return { key: exact, score: 1 };

  // fuzzy
  let bestKey: string|null = null, best = 0;
  for (const k of idx) {
    const s = score(candidate, k);
    if (s > best) { best = s; bestKey = k; }
  }
  return best >= 0.6 ? { key: bestKey!, score: best } : { key: null, score: best };
}

export function storageUrlFor(key: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
}

export async function getSignedUrlFor(key: string, expiresIn: number): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(key, expiresIn);
  if (error || !data?.signedUrl) throw error ?? new Error('signed url failed');
  return data.signedUrl;
}

export async function getPublicOrSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  if (PUBLIC_BUCKET) {
    return supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
  }
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(key, expiresIn);
  if (error || !data?.signedUrl) throw error ?? new Error('signed url failed');
  return data.signedUrl;
}