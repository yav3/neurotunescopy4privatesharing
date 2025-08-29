// src/lib/env.ts - Fix API_BASE construction
const supabaseUrl = "https://pbtgvcjniayedqlajjzz.supabase.co";

export const API_BASE = `${supabaseUrl}/functions/v1/api`;

console.log("[API_BASE]", API_BASE);