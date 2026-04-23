/**
 * In-memory rate limiter for Supabase Edge Functions.
 *
 * NOTE: state resets on cold start and is per-worker-instance.
 * For stricter limits, move to a DB-backed RPC (see send-auth-email).
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, RateLimitRecord>();

  return function check(key: string): boolean {
    const now = Date.now();
    const record = store.get(key);

    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) return false;

    record.count++;
    return true;
  };
}

/** Extract the best available client IP from edge request headers. */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
