import { supabase } from "@/integrations/supabase/client";
import type { TherapeuticGoal } from "@/types/music";

// VAD profiles for each therapeutic goal (matching backend logic)
const VAD_PROFILES = {
  'focus-enhancement': {
    valence: { min: 0.5, max: 0.8, target: 0.6 },
    arousal: { min: 0.6, max: 0.8, target: 0.7 },
    dominance: { min: 0.5, max: 0.8, target: 0.6 },
    bpm_min: 78,
    bpm_max: 100
  },
  'stress-reduction': {
    valence: { min: 0.4, max: 0.7, target: 0.6 },
    arousal: { min: 0.2, max: 0.5, target: 0.3 },
    dominance: { min: 0.3, max: 0.6, target: 0.4 },
    bpm_min: 60,
    bpm_max: 80
  },
  'mood-boost': {
    valence: { min: 0.6, max: 0.9, target: 0.8 },
    arousal: { min: 0.5, max: 0.8, target: 0.7 },
    dominance: { min: 0.5, max: 0.8, target: 0.7 },
    bpm_min: 90,
    bpm_max: 130
  },
  'anxiety-relief': {
    valence: { min: 0.4, max: 0.7, target: 0.6 },
    arousal: { min: 0.1, max: 0.4, target: 0.2 },
    dominance: { min: 0.3, max: 0.6, target: 0.4 },
    bpm_min: 50,
    bpm_max: 75
  },
  'meditation-support': {
    valence: { min: 0.3, max: 0.6, target: 0.5 },
    arousal: { min: 0.1, max: 0.3, target: 0.2 },
    dominance: { min: 0.2, max: 0.5, target: 0.3 },
    bpm_min: 40,
    bpm_max: 70
  }
};

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
  camelot_key?: string;
  duration_seconds?: number;
  play_count?: number;
  therapeutic_effectiveness?: number;
}

// VAD scoring function (matching backend logic)
function calculateVADScore(track: Track, profile: any, goalType: string): { score: number; v: number; a: number; d: number } {
  const v = track.valence ?? (track.energy_level ? (track.energy_level - 1) / 9 * 0.8 + 0.1 : 0.5);
  const a = track.arousal ?? track.energy ?? (track.energy_level ? (track.energy_level - 1) / 9 : 0.5);
  const d = track.dominance ?? 0.5;
  const bpm = track.bpm ?? track.bpm_est ?? 60;

  // BPM filtering
  if (bpm < profile.bpm_min || bpm > profile.bpm_max) return { score: -1, v, a, d };

  // Calculate VAD score
  const vScore = 1 - Math.abs(v - profile.valence.target);
  const aScore = 1 - Math.abs(a - profile.arousal.target);
  const dScore = 1 - Math.abs(d - profile.dominance.target);
  
  const score = (vScore + aScore + dScore) / 3;
  return { score, v, a, d };
}

export async function getTherapeuticTracks(
  goal: string, 
  count: number = 50, 
  excludeIds: string[] = []
): Promise<{ tracks: Track[]; error?: string }> {
  try {
    const { adminLog, userLog } = await import('@/utils/adminLogging');
    
    adminLog(`🎵 Fetching ${count} tracks for goal: ${goal}`);
    userLog(`🎵 Loading music for ${goal}...`);
    
    const profile = VAD_PROFILES[goal as keyof typeof VAD_PROFILES] || VAD_PROFILES['mood-boost'];
    adminLog('📊 Using VAD profile:', profile);
    
    // Build the query
    let query = supabase
      .from('tracks')
      .select('*')
      .eq('audio_status', 'working')
      .not('id', 'is', null);

    // For focus goals, ONLY serve tracks with "focus" in the title
    if (goal === 'focus-enhancement') {
      query = query.ilike('title', '%focus%');
      adminLog('🎯 Focus filter: Only tracks with "focus" in title');
    }

    // Add BPM filtering at database level for performance
    if (profile.bpm_min && profile.bpm_max) {
      query = query
        .gte('bpm', profile.bpm_min)
        .lte('bpm', profile.bpm_max);
      adminLog(`📊 BPM filter: ${profile.bpm_min} - ${profile.bpm_max}`);
    }

    // Exclude specified tracks
    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      adminLog(`🎵 Excluding ${excludeIds.length} recently played tracks`);
    }

    // Get more tracks than needed for filtering
    query = query.limit(count * 3);

    const { data: tracks, error } = await query;

    if (error) {
      console.error('❌ Database query error:', error);
      return { tracks: [], error: error.message };
    }

    if (!tracks || tracks.length === 0) {
      console.warn('⚠️ No tracks found for goal:', goal);
      return { tracks: [] };
    }

    adminLog(`📊 Retrieved ${tracks.length} tracks from database`);

    // Apply VAD scoring and filtering
    const scored = tracks
      .map(track => ({ track: track as Track, score: calculateVADScore(track as Track, profile, goal) }))
      .filter(item => item.score.score >= 0)
      .sort((a, b) => b.score.score - a.score.score)
      .slice(0, count);

    const finalTracks = scored.map(item => item.track) as Track[];
    
    adminLog(`✅ Filtered to ${finalTracks.length} high-quality tracks`);
    adminLog('🎵 Sample tracks:', finalTracks.slice(0, 3).map(t => ({ title: t.title, bpm: t.bpm, score: calculateVADScore(t, profile, goal).score })));
    
    userLog(`✅ Found ${finalTracks.length} tracks perfect for your session`);
    
    return { tracks: finalTracks };

  } catch (error) {
    console.error('❌ Error fetching therapeutic tracks:', error);
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
  try {
    console.log(`🔥 Fetching ${count} random trending tracks with bucket priority`);
    
    // First priority: Get tracks from the 'audio' bucket
    const { data: audioTracks, error: audioError } = await supabase
      .from('tracks')
      .select('*')
      .eq('audio_status', 'working')
      .not('id', 'is', null)
      .not('storage_key', 'is', null)
      .eq('storage_bucket', 'audio')
      .ilike('storage_key', 'tracks/%'); // Only tracks in the tracks folder

    if (audioError) {
      console.error('❌ Audio bucket query error:', audioError);
      return { tracks: [], error: audioError.message };
    }

    console.log(`📦 Found ${audioTracks?.length || 0} tracks in 'audio' bucket`);

    let allTracks = [...(audioTracks || [])];

    // If we need more tracks to reach the requested count, get from neuralpositivemusic bucket
    if (allTracks.length < count) {
      console.log(`🔄 Need ${count - allTracks.length} more tracks, fetching from 'neuralpositivemusic' bucket`);
      
      const { data: neuralTracks, error: neuralError } = await supabase
        .from('tracks')
        .select('*')
        .eq('audio_status', 'working')
        .not('id', 'is', null)
        .not('storage_key', 'is', null)
        .eq('storage_bucket', 'neuralpositivemusic')
        .ilike('storage_key', 'tracks/%'); // Only tracks in the tracks folder

      if (neuralError) {
        console.warn('⚠️ Neural bucket query failed:', neuralError);
      } else {
        console.log(`📦 Found ${neuralTracks?.length || 0} tracks in 'neuralpositivemusic' bucket`);
        allTracks = [...allTracks, ...(neuralTracks || [])];
      }
    }

    if (allTracks.length === 0) {
      console.warn('⚠️ No tracks found in either storage bucket');
      return { tracks: [] };
    }

    console.log(`📦 Total available tracks: ${allTracks.length} (audio: ${audioTracks?.length || 0}, neural: ${allTracks.length - (audioTracks?.length || 0)})`);

    // Randomly shuffle the tracks using Fisher-Yates shuffle
    const shuffledTracks = [...allTracks];
    for (let i = shuffledTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
    }

    // Take the requested count
    const randomTracks = shuffledTracks.slice(0, count);
    
    // Count tracks by bucket for logging
    const audioBucketCount = randomTracks.filter(t => t.storage_bucket === 'audio').length;
    const neuralBucketCount = randomTracks.filter(t => t.storage_bucket === 'neuralpositivemusic').length;
    
    console.log(`✅ Retrieved ${randomTracks.length} randomly selected trending tracks`);
    console.log(`📊 Bucket distribution: audio=${audioBucketCount}, neural=${neuralBucketCount}`);
    console.log(`🎵 Sample tracks:`, randomTracks.slice(0, 3).map(t => ({ 
      title: t.title, 
      storage_bucket: t.storage_bucket,
      storage_key: t.storage_key?.substring(0, 50) + '...' 
    })));
    
    return { tracks: randomTracks as Track[] };

  } catch (error) {
    console.error('❌ Error fetching trending tracks:', error);
    return { 
      tracks: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}