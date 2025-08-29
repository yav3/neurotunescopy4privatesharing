// src/lib/env.ts
const raw =
  (typeof import.meta !== "undefined"
    ? (import.meta as any).env?.VITE_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

const origin = /^https?:\/\//.test(raw)
  ? raw
  : (typeof window !== "undefined" ? window.location.origin : "");

const base = origin.replace(/\/+$/, "");
export const API_BASE = base.endsWith("/api") ? base : `${base}/api`; // exactly one /api
console.log("[API_BASE]", API_BASE);