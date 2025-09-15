// Simple Track interface - no complex transformations needed
export interface Track {
  id: string;
  title: string;
  url: string;
  bucket: string;
  folder?: string;
  artist?: string;
  duration?: number;
  bpm?: number;
  artwork_url?: string;
}

// Helper to clean filename into readable title
export const cleanTitle = (filename: string): string => {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove file extension
    .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};