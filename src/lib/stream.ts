// Direct Supabase Edge Functions URL for streaming
const FUNCTIONS_BASE = "https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1";

export function buildStreamUrl(trackId: string, filePath?: string) {
  // Use dedicated stream Edge Function - ID only routing
  if (trackId) return `${FUNCTIONS_BASE}/stream/${encodeURIComponent(trackId)}`;
  throw new Error("Missing track identifier - stream function requires track ID");
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