export const API_BASE = (() => {
  const raw =
    (typeof import.meta !== "undefined"
      ? (import.meta as any).env?.VITE_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL) || "";
  if (!/^https?:\/\//.test(raw)) throw new Error(`VITE_API_BASE_URL must include protocol`);
  return raw.replace(/\/+$/, ""); // strip trailing slash
})();