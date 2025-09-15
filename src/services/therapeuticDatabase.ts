import { supabase } from "@/integrations/supabase/client";
import type { TherapeuticGoal } from "@/types/music";

export interface Track {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  bpm?: number;
  bpm_est?: number;
  energy_level?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  energy?: number;
  audio_status?: "working" | "bad" | "unknown" | "missing";
  storage_bucket?: string;
  storage_key?: string;
  stream_url?: string;
  camelot_key?: string;
  duration_seconds?: number;
  play_count?: number;
  therapeutic_effectiveness?: number;
}

export async function getTherapeuticTracks(
  goal: string, 
  count: number = 50, 
  excludeIds: string[] = []
): Promise<{ tracks: Track[]; error?: string }> {
  console.log(`🎯 SIMPLE STORAGE ACCESS: Fetching ${count} tracks for goal: ${goal}`);
  
  try {
    // Use simple storage service
    const { SimpleStorageService } = await import('@/services/simpleStorageService');
    const simpleTracks = await SimpleStorageService.getTracksFromCategory(goal, count);
    
    if (simpleTracks.length === 0) {
      return { tracks: [], error: 'No tracks found' };
    }

    // Convert simple tracks to Track interface expected by this function
    const convertedTracks: Track[] = simpleTracks.map((track) => ({
      id: track.id,
      title: track.title,
      storage_bucket: track.bucket,
      storage_key: track.id,
      audio_status: 'working' as const,
      stream_url: track.url,
      artist: track.artist,
      bpm: track.bpm,
      duration_seconds: track.duration
    }));

    console.log(`✅ Returning ${convertedTracks.length} tracks for goal: ${goal}`);
    return { tracks: convertedTracks };

  } catch (error) {
    console.error('❌ Error in simple storage access:', error);
    return { 
      tracks: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function getTrendingTracks(
  minutes: number = 60,
  count: number = 50
): Promise<{ tracks: Track[]; error?: string }> {
  console.log(`🔥 SIMPLE STORAGE ACCESS: Fetching ${count} trending tracks`);
  
  try {
    const { SimpleStorageService } = await import('@/services/simpleStorageService');
    const simpleTracks = await SimpleStorageService.getTracksFromCategory('mood-boost', count);
    
    const convertedTracks: Track[] = simpleTracks.map((track) => ({
      id: track.id,
      title: track.title,
      storage_bucket: track.bucket,
      storage_key: track.id,
      audio_status: 'working' as const,
      stream_url: track.url,
      artist: track.artist,
      bpm: track.bpm,
      duration_seconds: track.duration
    }));

    console.log(`✅ Returning ${convertedTracks.length} trending tracks`);
    return { tracks: convertedTracks };
  } catch (error) {
    console.error('❌ Error in trending tracks:', error);
    return { tracks: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}