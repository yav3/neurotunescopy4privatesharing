import { API } from "./api";

// URL validation request deduplication
const pendingValidations = new Map<string, Promise<boolean>>();

export function buildStreamUrl(trackId: string): string {
  return API.streamUrl(trackId);
}

export async function headOk(url: string, timeoutMs = 5000) {
  // Return existing request if already validating this URL
  if (pendingValidations.has(url)) {
    console.log(`🔄 Reusing existing validation for: ${url.split('/').pop()}`);
    return pendingValidations.get(url)!;
  }

  const validationPromise = performHeadCheck(url, timeoutMs);
  pendingValidations.set(url, validationPromise);
  
  // Clean up when done
  validationPromise.finally(() => {
    pendingValidations.delete(url);
  });
  
  return validationPromise;
}

async function performHeadCheck(url: string, timeoutMs = 5000): Promise<boolean> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "HEAD", signal: ac.signal });
    const result = res.ok;
    console.log(`${result ? '✅' : '❌'} URL validation for: ${url.split('/').pop()}`);
    return result;
  } catch (error) {
    console.log(`❌ URL validation failed for: ${url.split('/').pop()}`, error);
    return false;
  } finally {
    clearTimeout(t);
  }
}