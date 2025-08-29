import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Track store implementation - adapt to your database
interface Track {
  id: number;
  title: string;
  storage_path?: string;
  file_path?: string;
}

export async function getTrackById(trackId: number): Promise<Track | null> {
  const { data, error } = await supabase
    .from('music_tracks')
    .select('id, title, file_path')
    .eq('id', trackId)
    .maybeSingle();
   
  if (error) {
    console.warn(`Error fetching track ${trackId}:`, error);
    return null;
  }
  
  if (!data) {
    console.warn(`Track ${trackId} not found`);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    storage_path: data.file_path,
    file_path: data.file_path
  };
}

export async function patchTrackStoragePath(trackId: number, resolvedKey: string): Promise<void> {
  const { error } = await supabase
    .from('music_tracks')
    .update({ file_path: resolvedKey })
    .eq('id', trackId);
    
  if (error) {
    console.error(`Failed to update track ${trackId} storage path:`, error);
  } else {
    console.log(`Updated track ${trackId} with storage path: ${resolvedKey}`);
  }
}

export async function getTracksByGoal(goal: string): Promise<{ tracks: any[] }> {
  // Map goals to therapeutic conditions and audio features
  const goalToConditions = {
    'focus': {
      condition: 'focus',
      energyRange: [0.4, 0.7],
      valenceRange: [0.4, 0.8],
      preferredGenres: ['classical', 'instrumental', 'acoustic']
    },
    'relax': {
      condition: 'anxiety',
      energyRange: [0.1, 0.4],
      valenceRange: [0.6, 0.9],
      preferredGenres: ['jazz', 'classical', 'folk']
    },
    'sleep': {
      condition: 'insomnia', 
      energyRange: [0.0, 0.3],
      valenceRange: [0.3, 0.7],
      preferredGenres: ['classical', 'acoustic', 'instrumental']
    },
    'energy': {
      condition: 'depression',
      energyRange: [0.5, 1.0],
      valenceRange: [0.7, 1.0],
      preferredGenres: ['jazz', 'electronic', 'indie']
    }
  }
  
  const criteria = goalToConditions[goal] || goalToConditions['focus']
  
  // Build query for tracks matching the goal
  let query = supabase
    .from('music_tracks')
    .select('*')
    .eq('upload_status', 'completed')
  
  // Add energy filters if available
  if (criteria.energyRange) {
    query = query.gte('energy', criteria.energyRange[0]).lte('energy', criteria.energyRange[1])
  }
  
  // Add valence filters if available
  if (criteria.valenceRange) {
    query = query.gte('valence', criteria.valenceRange[0]).lte('valence', criteria.valenceRange[1])
  }
  
  // Add genre filter
  if (criteria.preferredGenres.length > 0) {
    query = query.in('genre', criteria.preferredGenres)
  }
  
  const { data: tracks, error } = await query.limit(15)
  
  if (error) {
    console.error('Error fetching tracks by goal:', error)
    return { tracks: [] }
  }
  
  return { tracks: tracks || [] }
}

export const tracksStore = {
  getTrackById,
  patchTrackStoragePath,
  getTracksByGoal
}