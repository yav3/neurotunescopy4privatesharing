export const routes = {
  health: () => `/api/health`,
  playlist: () => `/api/playlist`,
  debugStorage: () => `/api/debug/storage`,
  stream: (id: string) => `/api/v1/stream/${encodeURIComponent(id)}`,
  directStream: (id: string) => `/api/stream/${encodeURIComponent(id)}`,
  buildSession: () => `/api/session/build`,
  startSession: () => `/api/sessions/start`,
  progressSession: () => `/api/sessions/progress`,
  completeSession: () => `/api/sessions/complete`,
  searchTracks: () => `/api/tracks/search`,
} as const;