import { supabase } from "@/integrations/supabase/client";

export type TherapeuticCategory = 'focus' | 'calm' | 'boost' | 'energize';

export interface TherapeuticBucket {
  name: string;
  bucket: string;
  category: TherapeuticCategory;
  description: string;
}

export const THERAPEUTIC_BUCKETS: TherapeuticBucket[] = [
  {
    name: "Focus & Flow",
    bucket: "NewAgeandWorldFocus",
    category: "focus",
    description: "New Age & World instrumental tracks for deep concentration"
  },
  {
    name: "Calm & Rest",
    bucket: "Nocturnes",
    category: "calm",
    description: "Classical nocturnes for relaxation and gentle calm"
  },
  {
    name: "Mood Boost",
    bucket: "tropicalhouse",
    category: "boost",
    description: "Tropical house rhythms to elevate your mood"
  },
  {
    name: "Energize",
    bucket: "samba",
    category: "energize",
    description: "Samba rhythms for movement and vitality"
  }
];

// Track which categories have been previewed
const PREVIEW_KEY = 'neurotunes_previewed_categories';

export function getPreviewedCategories(): Set<TherapeuticCategory> {
  try {
    const stored = localStorage.getItem(PREVIEW_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function markCategoryPreviewed(category: TherapeuticCategory): void {
  const previewed = getPreviewedCategories();
  previewed.add(category);
  localStorage.setItem(PREVIEW_KEY, JSON.stringify([...previewed]));
}

export function resetPreviews(): void {
  localStorage.removeItem(PREVIEW_KEY);
}

export function canPreviewCategory(category: TherapeuticCategory): boolean {
  return !getPreviewedCategories().has(category);
}

/**
 * Fetch a single preview track from a therapeutic bucket
 */
export async function getPreviewTrackForBucket(bucketName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 50,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Error loading bucket:', bucketName, error);
      return null;
    }

    // Filter for audio files
    const audioFiles = data.filter(file =>
      file.name.endsWith('.mp3') ||
      file.name.endsWith('.wav') ||
      file.name.endsWith('.m4a') ||
      file.name.endsWith('.flac')
    );

    if (audioFiles.length === 0) {
      console.warn('No audio files found in bucket:', bucketName);
      return null;
    }

    // Pick a random track for variety
    const randomTrack = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(randomTrack.name);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to fetch preview track:', error);
    return null;
  }
}
