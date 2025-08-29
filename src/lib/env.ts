// Single source of truth for the API base
const raw = (typeof import.meta !== 'undefined' 
  ? (import.meta as any).env?.VITE_API_BASE_URL 
  : process.env.NEXT_PUBLIC_API_BASE_URL) || ''

export const API_BASE = (/^https?:\/\//.test(raw) 
  ? raw 
  : 'https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/api').replace(/\/+$/, '')

console.log('🌍 API_BASE configured as:', API_BASE)