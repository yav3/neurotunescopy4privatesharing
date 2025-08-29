// Single source of truth for the API base
export const API_BASE = (() => {
  // For development, use the current origin (localhost:3000 -> localhost:5000)
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return origin.replace(':3000', ':5000').replace(':5173', ':5000')
    }
    // In production, assume API is on same origin
    return origin
  }
  
  // Server-side fallback
  return process.env.API_BASE_URL || 'http://localhost:5000'
})()

console.log('🌍 API_BASE configured as:', API_BASE)