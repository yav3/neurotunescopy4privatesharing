import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BlockedTrack {
  id: string;
  user_id: string;
  track_id: number;
  blocked_at: string;
}

/**
 * Block a track for the current user
 */
export const blockTrack = async (trackId: string, trackTitle?: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to block tracks');
      return false;
    }

    // Convert trackId to consistent hash
    const trackIdHash = createTrackHash(trackId);

    // Check if already blocked
    const { data: existing } = await supabase
      .from('blocked_tracks')
      .select('id')
      .eq('user_id', user.id)
        .eq('track_id', trackIdHash)
      .single();

    if (existing) {
      toast.info('Track is already blocked');
      return true;
    }

    // Add to blocked tracks
    const { error } = await supabase
      .from('blocked_tracks')
      .insert({
        user_id: user.id,
        track_id: trackIdHash,
        blocked_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error blocking track:', error);
      toast.error('Failed to block track');
      return false;
    }

    toast.success(trackTitle ? `Blocked "${trackTitle}"` : 'Track blocked successfully');
    return true;
  } catch (error) {
    console.error('Error blocking track:', error);
    toast.error('Failed to block track');
    return false;
  }
};

/**
 * Unblock a track for the current user
 */
export const unblockTrack = async (trackId: string, trackTitle?: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to unblock tracks');
      return false;
    }

    // Convert trackId to consistent hash
    const trackIdHash = createTrackHash(trackId);

    const { error } = await supabase
      .from('blocked_tracks')
      .delete()
      .eq('user_id', user.id)
      .eq('track_id', trackIdHash);

    if (error) {
      console.error('Error unblocking track:', error);
      toast.error('Failed to unblock track');
      return false;
    }

    toast.success(trackTitle ? `Unblocked "${trackTitle}"` : 'Track unblocked successfully');
    return true;
  } catch (error) {
    console.error('Error unblocking track:', error);
    toast.error('Failed to unblock track');
    return false;
  }
};

/**
 * Get all blocked track hash IDs for the current user
 */
export const getBlockedTrackHashes = async (): Promise<number[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('blocked_tracks')
      .select('track_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching blocked tracks:', error);
      return [];
    }

    return data?.map(item => item.track_id) || [];
  } catch (error) {
    console.error('Error fetching blocked tracks:', error);
    return [];
  }
};

/**
 * Check if a track is blocked for the current user
 */
export const isTrackBlocked = async (trackId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    // Convert trackId to consistent hash
    const trackIdHash = createTrackHash(trackId);

    const { data, error } = await supabase
      .from('blocked_tracks')
      .select('id')
      .eq('user_id', user.id)
      .eq('track_id', trackIdHash)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
};

/**
 * Create a hash from track ID for consistent blocking
 */
const createTrackHash = (trackId: string): number => {
  let hash = 0;
  for (let i = 0; i < trackId.length; i++) {
    const char = trackId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Filter out blocked tracks from a track list
 */
export const filterBlockedTracks = async (tracks: any[]): Promise<any[]> => {
  try {
    const blockedHashes = await getBlockedTrackHashes();
    if (blockedHashes.length === 0) return tracks;

    const filtered = tracks.filter(track => {
      const trackHash = createTrackHash(track.id);
      return !blockedHashes.includes(trackHash);
    });
    
    if (filtered.length !== tracks.length) {
      console.log(`🚫 Filtered out ${tracks.length - filtered.length} blocked tracks`);
    }
    
    return filtered;
  } catch (error) {
    console.error('Error filtering blocked tracks:', error);
    return tracks; // Return original tracks if filtering fails
  }
};