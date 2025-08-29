export const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const formatDuration = (seconds?: number): string => {
  if (!seconds || !Number.isFinite(seconds)) return '0:00'
  return formatTime(seconds)
}

export const formatBPM = (bpm: number): string => {
  return `${Math.round(bpm)} BPM`
}

export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`
}

export const formatEvidenceScore = (score?: number): string => {
  if (!score) return 'N/A'
  return `${Math.round(score * 100)}%`
}

export const formatFrequencyRange = (band: string): string => {
  const ranges = {
    delta: '0.5-4Hz',
    theta: '4-8Hz',
    alpha: '8-13Hz',
    beta: '13-30Hz',
    gamma: '30-100Hz'
  }
  return ranges[band as keyof typeof ranges] || 'Unknown'
}

export const formatConditionName = (condition: string): string => {
  return condition
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export const formatNumber = (num: number, decimals: number = 2): string => {
  return Number(num).toFixed(decimals)
}

export const formatRelativeTime = (date: string): string => {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}