import { useState, useEffect } from 'react';
import { UserFavoritesService, type UserFavorite } from '@/services/userFavorites';
import type { Track } from '@/types';
import { useAuthContext } from '@/components/auth/AuthProvider';

export const useUserFavorites = () => {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const userFavorites = await UserFavoritesService.getUserFavorites();
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const addFavorite = async (track: Track): Promise<{ success: boolean; error?: string }> => {
    const result = await UserFavoritesService.addFavorite(track);
    if (result.success) {
      await loadFavorites(); // Reload to get updated list
    }
    return result;
  };

  const removeFavorite = async (trackId: string): Promise<{ success: boolean; error?: string }> => {
    const result = await UserFavoritesService.removeFavorite(trackId);
    if (result.success) {
      await loadFavorites(); // Reload to get updated list
    }
    return result;
  };

  const isFavorite = (trackId: string): boolean => {
    return favorites.some(f => f.track_id === trackId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refetch: loadFavorites
  };
};