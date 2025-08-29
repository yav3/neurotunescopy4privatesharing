// Single source of truth for the API base
export const API_BASE = (() => {
  // Vite or Next.js public env
  const v =
    (typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

  if (!/^https?:\/\//.test(v)) {
    throw new Error(
      `API base misconfigured: '${v}'. Set VITE_API_BASE_URL or NEXT_PUBLIC_API_BASE_URL to e.g. https://api.yourdomain.com`
    );
  }
  return v.replace(/\/+$/, "");
})();

console.log('🌍 API_BASE configured as:', API_BASE)