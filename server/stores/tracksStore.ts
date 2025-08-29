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
    .single();
  
  if (error || !data) {
    console.warn(`Track ${trackId} not found:`, error);
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