// src/lib/env.ts
const raw =
  (typeof import.meta !== "undefined"
    ? (import.meta as any).env?.VITE_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

const origin = /^https?:\/\//.test(raw)
  ? raw
  : (typeof window !== "undefined" ? window.location.origin : "");

export const API_BASE = origin.replace(/\/+$/, "");

console.log("[API_BASE]", API_BASE);