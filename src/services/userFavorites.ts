import { supabase } from '@/integrations/supabase/client';
import type { Track } from '@/types';

export interface UserFavorite {
  id: string;
  user_id: string;
  track_id: string;
  track_title?: string;
  track_data?: any;
  created_at: string;
}

export class UserFavoritesService {
  static async addFavorite(track: Track): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User must be authenticated to save favorites' };
      }

      // Generate a consistent numeric ID from the string track ID
      const trackIdHash = this.generateTrackHash(track.id);

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          track_id: trackIdHash
        });

      if (error) {
        console.error('Error adding favorite:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { success: false, error: 'Failed to add favorite' };
    }
  }

  static async removeFavorite(trackId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User must be authenticated' };
      }

      // Generate consistent hash for track ID lookup
      const trackIdHash = this.generateTrackHash(trackId);

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', trackIdHash);

      if (error) {
        console.error('Error removing favorite:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: 'Failed to remove favorite' };
    }
  }

  static async getUserFavorites(): Promise<UserFavorite[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }

      // Convert track_id from number to string to match interface
      const formattedFavorites = favorites?.map(fav => ({
        ...fav,
        track_id: fav.track_id.toString()
      })) || [];

      return formattedFavorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  /**
   * Get all favorites from all users (requires public read access or admin role)
   * Useful for analytics and admin dashboards
   */
  static async getAllFavorites(): Promise<UserFavorite[]> {
    try {
      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all favorites:', error);
        return [];
      }

      // Convert track_id from number to string to match interface
      const formattedFavorites = favorites?.map(fav => ({
        ...fav,
        track_id: fav.track_id.toString()
      })) || [];

      return formattedFavorites;
    } catch (error) {
      console.error('Error fetching all favorites:', error);
      return [];
    }
  }

  static async isFavorite(trackId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      // Generate consistent hash for track ID lookup
      const trackIdHash = this.generateTrackHash(trackId);

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', trackIdHash)
        .maybeSingle();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a consistent numeric hash from string track ID
   * Using a better hash function to reduce collisions
   */
  private static generateTrackHash(trackId: string): number {
    let hash = 5381; // Use djb2 hash algorithm for better distribution
    for (let i = 0; i < trackId.length; i++) {
      hash = ((hash << 5) + hash) + trackId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Ensure positive number and add length component to further reduce collisions
    return Math.abs(hash) + trackId.length * 1000000;
  }

  private static async getLocalFavorites(): Promise<UserFavorite[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const stored = localStorage.getItem(`user_favorites_${user.id.substring(0, 8)}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static async recordListeningHistory(track: Track, durationSeconds: number = 0, completed: boolean = false): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return; // Only record for authenticated users
      }

      // Store listening history in user-specific localStorage for now
      const historyKey = `user_listening_history_${user.id.substring(0, 8)}`;
      const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      const historyEntry = {
        id: crypto.randomUUID(),
        user_id: user.id,
        track_id: track.id,
        track_title: track.title,
        track_data: {
          storage_bucket: track.storage_bucket,
          storage_key: track.storage_key,
          goal: track.goal,
          therapeutic_use: track.therapeutic_use,
          genre: track.genre
        },
        listened_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        completed
      };

      const updated = [historyEntry, ...existing.slice(0, 99)]; // Keep last 100
      localStorage.setItem(historyKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error recording listening history:', error);
    }
  }
}