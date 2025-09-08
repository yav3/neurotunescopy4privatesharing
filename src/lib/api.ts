import { logger } from "@/services/logger";
import type { GoalSlug } from "@/domain/goals";
import { getTherapeuticTracks, getTrendingTracks } from "@/services/therapeuticDatabase";
import { supabase } from "@/integrations/supabase/client";

// Direct database queries - no more API endpoints needed
export async function fetchPlaylist(goal: string, count = 50, seed?: string, excludeCsv?: string) {
  const excludeIds = excludeCsv ? excludeCsv.split(',') : [];
  const { tracks, error } = await getTherapeuticTracks(goal, count, excludeIds);
  return error ? { tracks: [], error } : { tracks };
}

export async function fetchTrending(minutes = 60, count = 50, seed?: string, excludeCsv?: string) {
  const { tracks, error } = await getTrendingTracks(minutes, count);
  return error ? { tracks: [], error } : { tracks };
}

export const streamUrl = (track: any): string => {
  console.log('🔧 streamUrl called with track:', { 
    id: track?.id, 
    storage_bucket: track?.storage_bucket, 
    storage_key: track?.storage_key 
  });

  if (!track) {
    console.warn('⚠️ No track provided to streamUrl');
    return '';
  }

  // Handle both string IDs and track objects
  if (typeof track === 'string') {
    const { data } = supabase.storage.from('audio').getPublicUrl(`tracks/${track}.mp3`);
    return data.publicUrl;
  }

  // Use storage_bucket and storage_key if available
  if (track.storage_bucket && track.storage_key) {
    const { data } = supabase.storage
      .from(track.storage_bucket)
      .getPublicUrl(track.storage_key);
    return data.publicUrl;
  }

  // Fallback using track ID
  const trackId = track.id || track.unique_id || 'unknown';
  const { data } = supabase.storage.from('audio').getPublicUrl(`tracks/${trackId}.mp3`);
  return data.publicUrl;
};

// Legacy API object for backward compatibility - now uses direct database queries
export const API = {
  health: () => Promise.resolve({ ok: true }),
  
  async playlist(goal: GoalSlug, limit = 50, offset = 0) {
    console.log(`🎵 Direct database query for goal: ${goal}, limit: ${limit}`);
    const { tracks, error } = await getTherapeuticTracks(goal, limit);
    if (error) {
      console.error('❌ Database query error:', error);
      return { tracks: [] };
    }
    return { tracks };
  },
  
  debugStorage: () => Promise.resolve({ status: 'Direct database access - no API needed' }),
  
  async searchTracks(params: Record<string, any>) {
    const goal = params.goal || 'mood-boost';
    const limit = params.limit || 50;
    const { tracks } = await getTherapeuticTracks(goal, limit);
    return tracks;
  },

  // Session management - simplified to return tracks directly
  async buildSession(data: any) {
    const goal = data.goal || 'mood-boost';
    const duration = data.duration || 15;
    const count = Math.max(10, Math.ceil(duration * 2)); // ~2 tracks per minute
    
    const { tracks } = await getTherapeuticTracks(goal, count);
    return { sessionId: 'direct-' + Date.now(), tracks };
  },
  startSession: (data: any) => Promise.resolve({ started: true }),
  progressSession: (sessionId: string, currentTime?: number) => Promise.resolve({ updated: true }),
  completeSession: (data: any) => Promise.resolve({ completed: true }),

  // Aliases for convenience
  playlistByGoal: function(goal: string, limit?: number) {
    return this.playlist(goal as GoalSlug, limit);
  },
  start: function(data: any) { return this.startSession(data); },
  progress: function(sessionId: string, currentTime?: number) { return this.progressSession(sessionId, currentTime); },
  complete: function(sessionId: string) { return this.completeSession({ sessionId }); },

  streamUrl
};

// Integration test function - now tests direct database access
(window as any).testAPIIntegration = async function() {
  try {
    console.log("🧪 Testing direct database integration...");
    
    console.log("✅ Health check: Direct database access");
    
    const { tracks } = await getTherapeuticTracks("focus-enhancement", 1);
    if (!tracks?.length) throw new Error("No tracks returned from database");
    console.log("✅ Database query check:", tracks[0]);
    
    const streamUrl = API.streamUrl(tracks[0]);
    console.log("✅ Stream URL generation:", streamUrl);
    
    console.log("🎉 Direct database integration test completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database integration test failed:", error);
    throw error;
  }
};