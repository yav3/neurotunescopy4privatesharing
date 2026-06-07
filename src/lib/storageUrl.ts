/**
 * Centralized storage URL resolver.
 *
 * - Public buckets → direct CDN URL (cached, fast).
 * - Private buckets → signed URL via the `storage-access` edge function
 *   (service-role generates a 1-hour signed URL; no anon list/read needed).
 *
 * Update PUBLIC_BUCKETS when a bucket is flipped public/private.
 */
import { supabase } from '@/integrations/supabase/client';

export const PUBLIC_BUCKETS = new Set<string>([
  'albumart',
  'commercials',
  'landingpage',
  'landingpagemusicexcerpts',
  'playlistcards',
  'sheet-music',
  'stravamusicappimages',
  'therapeutic-goal-and-genre-card-images',
]);

const SIGNED_TTL_SECONDS = 3600; // 1 hour — matches storage-access edge function
const REFRESH_SKEW_MS = 5 * 60 * 1000; // refresh 5min before expiry

interface CachedUrl {
  url: string;
  expiresAt: number;
}

const signedCache = new Map<string, CachedUrl>();
const inflight = new Map<string, Promise<string>>();

export function isPublicBucket(bucket: string): boolean {
  return PUBLIC_BUCKETS.has(bucket);
}

/**
 * Resolve a storage object to a usable URL.
 * Public buckets: direct public URL. Private: signed URL (1h, cached).
 */
export async function getStorageUrl(bucket: string, path: string): Promise<string> {
  if (!bucket || !path) return '';

  if (isPublicBucket(bucket)) {
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  const key = `${bucket}/${path}`;
  const cached = signedCache.get(key);
  if (cached && cached.expiresAt - REFRESH_SKEW_MS > Date.now()) {
    return cached.url;
  }

  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    try {
      // 1) Try direct supabase-js signed URL (works when caller has a session
      //    that storage RLS allows). Faster than edge function round-trip.
      const direct = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_TTL_SECONDS);
      if (direct.data?.signedUrl) {
        signedCache.set(key, {
          url: direct.data.signedUrl,
          expiresAt: Date.now() + SIGNED_TTL_SECONDS * 1000,
        });
        return direct.data.signedUrl;
      }

      // 2) Fall back to the storage-access edge function (uses service role,
      //    works for anonymous visitors on the landing/demo pages).
      const { data, error } = await supabase.functions.invoke('storage-access', {
        body: { bucket, path, mode: 'sign', expiresIn: SIGNED_TTL_SECONDS },
      });
      const url: string | undefined = data?.stream_url || data?.signedUrl || data?.url;
      if (error || !url) {
        console.warn(`⚠️ getStorageUrl: failed for ${key}`, error || data);
        return '';
      }
      signedCache.set(key, {
        url,
        expiresAt: Date.now() + SIGNED_TTL_SECONDS * 1000,
      });
      return url;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

/** Batch resolver. */
export async function getStorageUrls(
  bucket: string,
  paths: string[]
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    paths.map(async (p) => [p, await getStorageUrl(bucket, p)] as const)
  );
  return Object.fromEntries(entries);
}

/** Synchronous public-URL helper — only safe for known-public buckets. */
export function getPublicStorageUrl(bucket: string, path: string): string {
  if (!isPublicBucket(bucket)) {
    console.warn(
      `getPublicStorageUrl called on private bucket "${bucket}". ` +
        `Use getStorageUrl() to obtain a signed URL.`
    );
  }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Clear the signed-URL cache (e.g. on sign-out). */
export function clearStorageUrlCache(): void {
  signedCache.clear();
}
