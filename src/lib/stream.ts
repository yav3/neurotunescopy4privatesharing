import { API_BASE } from "./env";

export function buildStreamUrl(trackId: string, filePath?: string) {
  // Prefer ID routing; encode file paths if your API still accepts them.
  if (trackId) return `${API_BASE}/stream/${encodeURIComponent(trackId)}`;
  if (filePath) return `${API_BASE}/stream?file=${encodeURIComponent(filePath)}`;
  throw new Error("Missing track identifier");
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