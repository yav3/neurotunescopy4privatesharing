import { supabase } from "@/integrations/supabase/client";

// Camelot Wheel harmonic mixing system
export class CamelotSystem {
  // Camelot wheel mapping
  private static readonly CAMELOT_WHEEL = {
    '1A': ['12A', '2A', '1B'],
    '2A': ['1A', '3A', '2B'],
    '3A': ['2A', '4A', '3B'],
    '4A': ['3A', '5A', '4B'],
    '5A': ['4A', '6A', '5B'],
    '6A': ['5A', '7A', '6B'],
    '7A': ['6A', '8A', '7B'],
    '8A': ['7A', '9A', '8B'],
    '9A': ['8A', '10A', '9B'],
    '10A': ['9A', '11A', '10B'],
    '11A': ['10A', '12A', '11B'],
    '12A': ['11A', '1A', '12B'],
    '1B': ['12B', '2B', '1A'],
    '2B': ['1B', '3B', '2A'],
    '3B': ['2B', '4B', '3A'],
    '4B': ['3B', '5B', '4A'],
    '5B': ['4B', '6B', '5A'],
    '6B': ['5B', '7B', '6A'],
    '7B': ['6B', '8B', '7A'],
    '8B': ['7B', '9B', '8A'],
    '9B': ['8B', '10B', '9A'],
    '10B': ['9B', '11B', '10A'],
    '11B': ['10B', '12B', '11A'],
    '12B': ['11B', '1B', '12A']
  };

  /**
   * Get harmonic neighbors for a Camelot key
   */
  static getNeighbors(camelotKey: string): string[] {
    return this.CAMELOT_WHEEL[camelotKey as keyof typeof this.CAMELOT_WHEEL] || [];
  }

  /**
   * Get harmonic neighbors using database function
   */
  static async getNeighborsFromDB(camelotKey: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_camelot_neighbors', { input_camelot: camelotKey });

      if (error) {
        console.error('Error getting Camelot neighbors:', error);
        return this.getNeighbors(camelotKey); // Fallback to local
      }

      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      return this.getNeighbors(camelotKey); // Fallback to local
    }
  }

  /**
   * Find tracks with compatible Camelot keys
   */
  static async findCompatibleTracks(currentKey: string, limit = 10): Promise<any[]> {
    try {
      const neighbors = await this.getNeighborsFromDB(currentKey);
      const allKeys = [currentKey, ...neighbors];

      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('audio_status', 'working')
        .in('camelot_key', allKeys)
        .limit(limit);

      if (error) {
        console.error('Error finding compatible tracks:', error);
        return [];
      }

      return tracks || [];
    } catch (error) {
      console.error('Error in findCompatibleTracks:', error);
      return [];
    }
  }

  /**
   * Get the next harmonic track in sequence
   */
  static async getNextHarmonicTrack(currentTrack: any): Promise<any | null> {
    if (!currentTrack?.camelot_key) {
      console.warn('Current track has no Camelot key');
      return null;
    }

    const compatibleTracks = await this.findCompatibleTracks(currentTrack.camelot_key, 50);
    
    // Filter out the current track
    const nextTracks = compatibleTracks.filter(track => track.id !== currentTrack.id);
    
    if (nextTracks.length === 0) {
      return null;
    }

    // Prioritize tracks with exact key match, then neighbors
    const neighbors = await this.getNeighborsFromDB(currentTrack.camelot_key);
    
    const exactMatches = nextTracks.filter(track => track.camelot_key === currentTrack.camelot_key);
    const neighborMatches = nextTracks.filter(track => neighbors.includes(track.camelot_key));
    
    const prioritized = [...exactMatches, ...neighborMatches];
    
    // Return random track from prioritized list
    return prioritized[Math.floor(Math.random() * prioritized.length)] || nextTracks[0];
  }

  /**
   * Validate if two tracks are harmonically compatible
   */
  static async areCompatible(track1Key: string, track2Key: string): Promise<boolean> {
    const neighbors = await this.getNeighborsFromDB(track1Key);
    return track1Key === track2Key || neighbors.includes(track2Key);
  }

  /**
   * Get all tracks grouped by Camelot key
   */
  static async getTracksByKey(): Promise<Record<string, any[]>> {
    try {
      const { data: tracks, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('audio_status', 'working')
        .not('camelot_key', 'is', null);

      if (error) {
        console.error('Error getting tracks by key:', error);
        return {};
      }

      const grouped: Record<string, any[]> = {};
      tracks?.forEach(track => {
        const key = track.camelot_key;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(track);
      });

      return grouped;
    } catch (error) {
      console.error('Error in getTracksByKey:', error);
      return {};
    }
  }
}