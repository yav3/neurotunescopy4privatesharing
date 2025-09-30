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

      // Check if already favorited to prevent duplicates
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', trackIdHash)
        .maybeSingle();

      if (existing) {
        console.log('🤍 Track already favorited, skipping');
        return { success: true };
      }

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

      console.log('🤍 Successfully favorited track:', track.id);
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
   * Generate a unique numeric hash from string track ID
   * Uses improved hashing with better collision resistance
   */
  private static generateTrackHash(trackId: string): number {
    // Use FNV-1a hash algorithm for better distribution
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < trackId.length; i++) {
      hash ^= trackId.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    // Ensure positive number and add additional uniqueness
    const uniqueHash = Math.abs(hash >>> 0) + (trackId.length * 10000000);
    
    // Add first/last char codes for extra collision resistance
    const firstChar = trackId.charCodeAt(0) * 100000;
    const lastChar = trackId.charCodeAt(trackId.length - 1) * 10000;
    
    return uniqueHash + firstChar + lastChar;
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