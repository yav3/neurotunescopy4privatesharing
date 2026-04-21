# Security Policy

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email **security@neurotunes.app** with:
- Description of the vulnerability and affected component
- Steps to reproduce
- Potential impact
- Any suggested mitigations

We will acknowledge within 48 hours and aim to release a patch within 14 days for critical issues.

---

## Security Audit — April 2026

A full-stack security audit was completed on 2026-04-21 covering all Supabase Edge Functions, the React/Vite frontend, and the CI/CD surface.

### Critical Findings (Fixed)

| # | Finding | File | Fix Applied |
|---|---------|------|-------------|
| C1 | **Unauthenticated password reset** — any caller could reset any user's password | `set-user-password/index.ts` | Requires `super_admin` JWT via `has_role()` RPC; 10-email cap; 12-char min; generic errors; locked CORS |
| C2 | **Hardcoded Supabase credentials** — live URL and anon key JWT committed to source | `src/integrations/supabase/client.ts`, `.env` | Replaced with `import.meta.env` vars + runtime guard; `.env` removed from git history tracking |
| C3 | **Phishing via server-sent emails** — caller could supply arbitrary redirect URLs embedded in official NeuroTunes emails | `send-auth-email/index.ts` | Server generates all links via Supabase Admin API; user-supplied link fields rejected |

### High Severity Findings (Fixed)

| # | Finding | File | Fix Applied |
|---|---------|------|-------------|
| H1 | **Origin header injection** — `generate-magic-link` used the request `Origin` header to build email links | `generate-magic-link/index.ts` | Hardcoded `PRODUCTION_URL = "https://neurotunes.app"` |
| H2 | **Unauthenticated Stripe checkout** — `create-checkout-session` accepted any `priceId` from any caller | `create-checkout-session/index.ts` | Requires auth JWT; `customer_email` derived from token; `ALLOWED_STRIPE_PRICE_IDS` allowlist env var |
| H3 | **SSRF / IP spoofing** — `validate-signup` trusted a caller-supplied `clientIp` in a URL fetch | `validate-signup/index.ts` | Ignores body IP; reads from `cf-connecting-ip`/`x-forwarded-for` only; added IP format validation |
| H4 | **Unguarded admin operations** — `data-migration`, `fix-storage-mismatches`, `storage-audit` performed service-role operations without auth | Multiple | Added `super_admin` JWT guard to all three |

### Medium Severity Findings (Fixed)

| # | Finding | File | Fix Applied |
|---|---------|------|-------------|
| M1 | **HTML injection in internal emails** — user-controlled strings interpolated raw into HTML email bodies | `capture-lead/index.ts`, `submit-site-assessment/index.ts` | Added `esc()` HTML-escape helper covering all 5 special chars; applied to all user-controlled fields |
| M2 | **Verbose error leakage** — internal error messages (including stack traces) returned to callers | `storage-access/index.ts`, `storage-list/index.ts`, `api/index.ts` | Replaced with generic `"Internal server error"` / `"Failed to fetch tracks"` messages |
| M3 | **Dev server exposed on all interfaces** — Vite bound to `::` (all interfaces) with `secure: false` proxy | `vite.config.ts` | Binds to `localhost` in dev mode only; `secure` flag conditional on mode |
| M4 | **Dev auth bypass without build-time guard** — `DEV_MODE_BYPASS` could be enabled by editing one line | `src/hooks/useAuth.ts` | Now gated by `import.meta.env.DEV && VITE_DEV_AUTH_BYPASS === 'true'`; Vite tree-shakes `DEV` to `false` in prod |
| M5 | **HTTP used for ip-api calls** — `ip-api.com` fetched over plain HTTP | `validate-signup/index.ts`, `security-incident-logger/index.ts` | Switched to `https://ip-api.com` |

### Low Severity Findings (Fixed)

| # | Finding | File | Fix Applied |
|---|---------|------|-------------|
| L1 | **PII in edge function logs** — email addresses logged in plaintext to Supabase log streams | `consumer-trial-chat/index.ts`, `capture-lead/index.ts` | Removed email addresses from log lines; ticket numbers retained for traceability |
| L2 | **Debug screenshot committed** — `debug-screenshot.png` (876 KB) tracked by git, potentially exposing admin/login UI | `debug-screenshot.png` | Removed from git index; added to `.gitignore` |
| L3 | **Wildcard CORS on admin endpoints** — several admin-only functions returned `Access-Control-Allow-Origin: *` | Multiple admin functions | Locked to `https://neurotunes.app` |

---

### Pending Manual Actions

These require out-of-band steps by the engineering team and **cannot** be completed via code alone:

1. **Rotate all Supabase keys** — The `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` that existed in git history (pre-audit) should be treated as compromised. Rotate both in the Supabase dashboard and update all deployment secrets.

2. **Purge git history of committed `.env`** — Running `git rm --cached .env` stops future commits but the credentials remain in git history. Use `git filter-repo` or BFG Repo Cleaner to scrub the history, then force-push and require all contributors to re-clone.

3. **Set `ALLOWED_STRIPE_PRICE_IDS` env var** — The checkout function now validates against this env var. Populate it in Supabase Edge Function secrets with the comma-separated list of valid Stripe price IDs (e.g. `price_xxx,price_yyy`).

4. **Add CSP headers** — A `Content-Security-Policy` header should be added at the CDN/hosting layer (e.g. Vercel/Netlify config or Supabase Edge middleware) to restrict script and frame sources.

5. **Review `normalize-storage-files` function** — This function was not audited in this sprint. It should be reviewed for auth guards and error handling before next release.

6. **Enable Supabase's built-in `verify_jwt = true`** on all Edge Functions that don't explicitly handle public access. Currently only functions rewritten in this sprint enforce this consistently.

---

### CORS Policy Reference

Post-audit CORS policy by function category:

| Category | `Access-Control-Allow-Origin` |
|----------|-------------------------------|
| Public endpoints (storage-access, storage-list, api) | `*` |
| Admin-only functions (set-user-password, generate-magic-link, data-migration, fix-storage-mismatches, storage-audit) | `https://neurotunes.app` |
| Checkout / billing | `https://neurotunes.app` |

---

## Dependency Security

Run `npm audit` regularly. At time of audit, no critical CVEs were present in production dependencies. Deno edge function imports should pin to specific versions (e.g. `@supabase/supabase-js@2.56.1`) to prevent supply-chain drift.
