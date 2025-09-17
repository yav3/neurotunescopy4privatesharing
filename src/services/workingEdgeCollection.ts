import { supabase } from "@/integrations/supabase/client";

export interface WorkingEdgeTrack {
  track_id: string;
  storage_bucket: string;
  storage_key: string;
  title: string;
  reliability_score: number;
  play_count: number;
}

export class WorkingEdgeCollectionService {
  // Race condition protection for concurrent calls
  private static pendingAdds = new Set<string>();
  private static addRequestQueue = new Map<string, Promise<boolean>>();
  
  // Get reliable tracks for fallback
  static async getWorkingTracks(
    genre?: string,
    therapeutic_goal?: string,
    limit: number = 10
  ): Promise<WorkingEdgeTrack[]> {
    try {
      console.log('🎵 Fetching working edge tracks:', { genre, therapeutic_goal, limit });
      
      const { data, error } = await supabase.rpc('get_working_edge_tracks', {
        _genre: genre,
        _therapeutic_goal: therapeutic_goal,
        _limit: limit
      });

      if (error) {
        console.error('❌ Error fetching working edge tracks:', error);
        return [];
      }

      console.log(`✅ Retrieved ${data?.length || 0} working edge tracks`);
      return data || [];
    } catch (error) {
      console.error('❌ Failed to fetch working edge tracks:', error);
      return [];
    }
  }

  // Add a track to working collection when it successfully plays
  static async addToWorkingCollection(
    trackId: string, 
    reliabilityScore: number = 1.0
  ): Promise<boolean> {
    // Prevent concurrent calls for same track
    if (this.pendingAdds.has(trackId)) {
      console.log(`🎵 Already adding track ${trackId} to working collection, skipping`);
      return this.addRequestQueue.get(trackId) || Promise.resolve(false);
    }

    // Create and store the promise to prevent concurrent calls
    const addPromise = this._performAdd(trackId, reliabilityScore);
    this.addRequestQueue.set(trackId, addPromise);
    this.pendingAdds.add(trackId);

    try {
      const result = await addPromise;
      return result;
    } finally {
      // Cleanup after completion
      this.pendingAdds.delete(trackId);
      this.addRequestQueue.delete(trackId);
    }
  }

  private static async _performAdd(trackId: string, reliabilityScore: number): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('add_to_working_collection', {
        _track_id: trackId,
        _reliability_score: reliabilityScore
      });

      if (error) {
        // Don't spam logs for schema errors - they're expected during development
        if (error.code === '42703') {
          console.log(`🎵 Schema mismatch for working collection (expected during development)`);
          return false;
        }
        console.error('❌ Error adding track to working collection:', error);
        return false;
      }

      console.log(`✅ Added track ${trackId} to working collection`);
      return data || false;
    } catch (error) {
      console.error('❌ Failed to add track to working collection:', error);
      return false;
    }
  }

  // Update play statistics when a track from working collection is played
  static async updatePlayStats(trackId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_working_edge_play_stats', {
        _track_id: trackId
      });

      if (error) {
        console.error('❌ Error updating play stats:', error);
        return;
      }

      console.log(`✅ Updated play stats for track ${trackId}`);
    } catch (error) {
      console.error('❌ Failed to update play stats:', error);
    }
  }

  // Convert working edge track to track format expected by audio store
  static convertToTrackFormat(workingTrack: WorkingEdgeTrack): any {
    return {
      id: workingTrack.track_id,
      title: workingTrack.title,
      storage_bucket: workingTrack.storage_bucket,
      storage_key: workingTrack.storage_key,
      reliability_score: workingTrack.reliability_score,
      from_working_collection: true
    };
  }
}