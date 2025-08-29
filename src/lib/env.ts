// src/lib/env.ts
const raw =
  (typeof import.meta !== "undefined"
    ? (import.meta as any).env?.VITE_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

// For Supabase edge functions, construct the proper URL
const supabaseUrl = (typeof import.meta !== "undefined" 
  ? (import.meta as any).env?.VITE_SUPABASE_URL 
  : process.env.VITE_SUPABASE_URL) || "";

const origin = raw || (supabaseUrl ? `${supabaseUrl}/functions/v1` : "");

export const API_BASE = origin.replace(/\/+$/, "").endsWith("/api")
  ? origin.replace(/\/+$/, "")
  : origin.replace(/\/+$/, "") + "/api";

console.log("[API_BASE]", API_BASE);