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

      // Ensure track_id is stored as bigint (number)
      const trackId = typeof track.id === 'string' ? parseInt(track.id, 10) : track.id;
      
      if (isNaN(trackId)) {
        console.error('Invalid track ID:', track.id);
        return { success: false, error: 'Invalid track ID' };
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          track_id: trackId
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

      // Ensure track_id is converted to number for comparison
      const numericTrackId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId;
      
      if (isNaN(numericTrackId)) {
        console.error('Invalid track ID for removal:', trackId);
        return { success: false, error: 'Invalid track ID' };
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('track_id', numericTrackId);

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

  static async isFavorite(trackId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      // Ensure track_id is converted to number for comparison
      const numericTrackId = typeof trackId === 'string' ? parseInt(trackId, 10) : trackId;
      
      if (isNaN(numericTrackId)) {
        return false;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', numericTrackId)
        .maybeSingle();

      return !error && !!data;
    } catch (error) {
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