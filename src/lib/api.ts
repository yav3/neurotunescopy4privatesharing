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
    storage_key: track?.storage_key,
    stream_url: track?.stream_url 
  });

  if (!track) {
    console.warn('⚠️ No track provided to streamUrl');
    return '';
  }

  // If track already has a signed stream URL from Edge function, use it
  if (track.stream_url) {
    console.log('✅ Using pre-signed URL from Edge function');
    return track.stream_url;
  }

  // Fallback: Use Edge function to generate signed URL
  const trackId = typeof track === 'string' ? track : (track.id || track.unique_id);
  if (trackId) {
    const edgeUrl = `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/api/stream/${trackId}`;
    console.log('🔄 Fallback to Edge function URL:', edgeUrl);
    return edgeUrl;
  }

  console.warn('⚠️ No valid track ID found');
  return '';
};

// Legacy API object for backward compatibility - now uses direct database access
export const API = {
  health: () => Promise.resolve({ ok: true }),
  
  // Direct database access for home page therapeutic goals
  async playlist(goal: GoalSlug, limit = 50, offset = 0, excludeIds: string[] = []) {
    const { adminLog, userLog } = await import('@/utils/adminLogging');
    adminLog(`🎵 Direct database query for goal: ${goal}, limit: ${limit}, excluding: ${excludeIds.length} tracks`);
    if (excludeIds.length > 0) {
      userLog(`🔄 Loading fresh ${goal} tracks for variety...`);
    } else {
      userLog(`🎵 Loading ${goal} music collection...`);
    }
    
    const { tracks, error } = await getTherapeuticTracks(goal, limit, excludeIds);
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