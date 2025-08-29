// src/lib/env.ts
const raw =
  (typeof import.meta !== "undefined"
    ? (import.meta as any).env?.VITE_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

export const API_BASE =
  (/^https?:\/\//.test(raw) ? raw : (typeof window !== "undefined" ? window.location.origin : "")).replace(/\/+$/,"");