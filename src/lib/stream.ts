import { API } from "./api";

export function buildStreamUrl(trackId: string): string {
  return API.streamUrl(trackId);
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