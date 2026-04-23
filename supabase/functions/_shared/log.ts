/**
 * Structured JSON logger for Supabase Edge Functions.
 * Matches the pattern used in api/index.ts so all functions emit
 * a consistent log schema queryable via Supabase log explorer.
 */

export const log = (rid: string, msg: string, extra: Record<string, unknown> = {}) =>
  console.log(JSON.stringify({ rid, msg, ...extra }));

export const logError = (rid: string, msg: string, err: unknown, extra: Record<string, unknown> = {}) =>
  console.error(JSON.stringify({
    rid,
    msg,
    error: err instanceof Error ? err.message : String(err),
    ...extra,
  }));

export const rid = () =>
  Math.random().toString(16).slice(2, 10) +
  Math.random().toString(16).slice(2, 10);
