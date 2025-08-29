// Single source of truth for API base (works on Lovable, Replit, Railway, Vercel)
export const API_BASE = (() => {
  const v =
    (typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

  if (!/^https?:\/\//.test(v)) {
    throw new Error(
      `API base misconfigured: '${v}'. Set VITE_API_BASE_URL or NEXT_PUBLIC_API_BASE_URL to an absolute https URL, e.g. https://api.yourdomain.com`
    );
  }
  return v.replace(/\/+$/, "");
})();

console.log("[API_BASE]", API_BASE);