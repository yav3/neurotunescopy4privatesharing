export const routes = {
  health: () => `/health`,
  playlist: () => `/api/playlist`,
  debugStorage: () => `/api/debug/storage`,
  stream: (id: string) => `/api/stream?id=${encodeURIComponent(id)}`,
  buildSession: () => `/api/session/build`,
  startSession: () => `/api/sessions/start`,
  progressSession: () => `/api/sessions/progress`,
  completeSession: () => `/api/sessions/complete`,
} as const;