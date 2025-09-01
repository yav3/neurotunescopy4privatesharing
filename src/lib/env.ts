// Single source of truth for API base with strict validation
export const API_BASE = (() => {
  const raw =
    (typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

  if (!/^https?:\/\//.test(raw)) {
    throw new Error(
      `VITE_API_BASE_URL must include protocol (http:// or https://). Got: '${raw}'`
    );
  }
  
  // Strip trailing slash to prevent double slashes
  const cleaned = raw.replace(/\/+$/, "");
  console.log("[API_BASE]", cleaned);
  return cleaned;
})();

// Validation on module load
if (!API_BASE) {
  throw new Error("API_BASE is empty after validation");
}