export const routes = {
  health: () => `/health`,
  playlist: () => `/playlist`,
  debugStorage: () => `/debug/storage`,
  stream: (id: string) => `/stream?id=${encodeURIComponent(id)}`,
  buildSession: () => `/session/build`,
  startSession: () => `/sessions/start`,
  progressSession: () => `/sessions/progress`,
  completeSession: () => `/sessions/complete`,
} as const;