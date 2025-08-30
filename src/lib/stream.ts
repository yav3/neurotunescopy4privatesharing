// Direct Supabase Edge Functions URL for streaming
const FUNCTIONS_BASE = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1";

export function buildStreamUrl(trackId: string): string {
  // Validate that trackId is a proper UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trackId);
  
  if (!isUUID) {
    console.error('❌ buildStreamUrl called with non-UUID:', trackId);
    throw new Error(`Invalid track ID format: "${trackId}". Expected UUID format.`);
  }
  
  return `${FUNCTIONS_BASE}/stream/${encodeURIComponent(trackId)}`;
}

export async function headOk(url: string, timeoutMs = 5000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "HEAD", signal: ac.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}