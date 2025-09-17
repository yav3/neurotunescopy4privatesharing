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

      // For now, store favorites in localStorage since the DB table creation is pending
      const existingFavorites = await this.getLocalFavorites();
      const newFavorite: UserFavorite = {
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
        created_at: new Date().toISOString()
      };

      const updated = [...existingFavorites.filter(f => f.track_id !== track.id), newFavorite];
      localStorage.setItem(`user_favorites_${user.id.substring(0, 8)}`, JSON.stringify(updated));

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

      const existingFavorites = await this.getLocalFavorites();
      const updated = existingFavorites.filter(f => f.track_id !== trackId);
      localStorage.setItem(`user_favorites_${user.id.substring(0, 8)}`, JSON.stringify(updated));

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

      return await this.getLocalFavorites();
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  static async isFavorite(trackId: string): Promise<boolean> {
    try {
      const favorites = await this.getUserFavorites();
      return favorites.some(f => f.track_id === trackId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
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