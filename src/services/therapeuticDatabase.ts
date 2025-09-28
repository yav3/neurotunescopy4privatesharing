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
  console.log(`🎯 ENHANCED TRACK SELECTION: Fetching ${count} diverse tracks with favorites for goal: ${goal}`);
  
  try {
    // Get current user for personalization
    let userId: string | undefined;
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch (error) {
      console.log('No authenticated user, using basic selection');
    }

    // Use enhanced track selection service
    const { EnhancedTrackSelectionService } = await import('@/services/enhancedTrackSelection');
    const enhancedTracks = await EnhancedTrackSelectionService.getEnhancedTracks(goal, count, userId);
    
    if (enhancedTracks.length === 0) {
      return { tracks: [], error: 'No tracks found' };
    }

    // Convert to expected Track interface if needed
    const convertedTracks: Track[] = enhancedTracks.map((track) => ({
      id: track.id,
      title: track.title,
      storage_bucket: track.storage_bucket || (track as any).bucket,
      storage_key: track.storage_key || track.id,
      audio_status: track.audio_status || 'working' as const,
      stream_url: track.stream_url || (track as any).url,
      artist: track.artist,
      bpm: track.bpm,
      bpm_est: track.bpm_est,
      energy_level: track.energy_level,
      valence: track.valence,
      arousal: track.arousal,
      dominance: track.dominance,
      energy: track.energy,
      camelot_key: track.camelot_key,
      duration_seconds: track.duration_seconds || (track as any).duration,
      play_count: track.play_count,
      therapeutic_effectiveness: track.therapeutic_effectiveness,
      genre: track.genre
    }));

    console.log(`✅ Enhanced selection: ${convertedTracks.length} diverse tracks for goal: ${goal}`);
    return { tracks: convertedTracks };

  } catch (error) {
    console.error('❌ Error in enhanced track selection, falling back to simple:', error);
    
    // Fallback to simple storage service
    try {
      const { SimpleStorageService } = await import('@/services/simpleStorageService');
      const simpleTracks = await SimpleStorageService.getTracksFromCategory(goal, count);
      
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

      return { tracks: convertedTracks };
    } catch (fallbackError) {
      return { 
        tracks: [], 
        error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error' 
      };
    }
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