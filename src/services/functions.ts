const SUPABASE_URL = 'https://pbtgvcjniayedqlajjzz.supabase.co';
console.log('🔧 Using hardcoded Supabase URL for Lovable compatibility');
export const FN_BASE = `${new URL(SUPABASE_URL).origin}/functions/v1`; // https://.../functions/v1

export async function listStoragePage({
  bucket = 'samba',
  prefix = 'tracks',
  limit = 500,
  offset = 0,
  strict = true,
  adminKey,
}: {
  bucket?: string;
  prefix?: string;
  limit?: number;
  offset?: number;
  strict?: boolean;
  adminKey?: string;
}) {
  const qs = new URLSearchParams({
    bucket,
    prefix,
    limit: String(limit),
    offset: String(offset),
    strict: strict ? '1' : '0'
  });
  
  const url = `${FN_BASE}/storage-list?${qs}`;
  const r = await fetch(url, {
    headers: {
      ...(adminKey ? { 'x-admin-key': adminKey } : {})
    }
  });
  
  const body = await r.json().catch(() => ({}));
  if (!r.ok || body?.ok === false) {
    throw new Error(body?.error || `HTTP ${r.status}`);
  }
  
  return body as {
    ok: true;
    results: any[];
    has_more?: boolean;
    next_offset?: number;
  };
}

export async function buildManifest({
  bucket = 'samba',
  prefix = 'tracks',
  page = 500,
  adminKey,
  maxPages = 20,
}: {
  bucket?: string;
  prefix?: string;
  page?: number;
  adminKey?: string;
  maxPages?: number;
}) {
  const all: any[] = [];
  let offset = 0;
  
  for (let i = 0; i < maxPages; i++) {
    const pageRes = await listStoragePage({
      bucket,
      prefix,
      limit: page,
      offset,
      strict: true,
      adminKey
    });
    
    all.push(...pageRes.results);
    
    if (!pageRes.has_more && (pageRes.results.length < page)) break;
    offset = pageRes.next_offset ?? (offset + pageRes.results.length);
    if (!pageRes.results.length) break;
  }
  
  // Return a compact manifest
  return all.map(r => ({
    bucket,
    key: r.storage_key,
    url: r.url,               // 24h signed
    ok: r.audio_ok,
    ct: r.content_type || null
  }));
}