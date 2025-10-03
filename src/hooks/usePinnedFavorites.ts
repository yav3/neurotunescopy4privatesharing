import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';

interface PinnedItem {
  id: string;
  name: string;
  image: string;
  type: 'goal' | 'track';
  usageCount?: number;
  lastUsed?: Date;
}

export function usePinnedFavorites() {
  const { user } = useAuthContext();
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPinnedItems([]);
      setLoading(false);
      return;
    }

    loadPinnedFavorites();
  }, [user]);

  const loadPinnedFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get manually pinned goals
      const { data: pinnedGoalsData } = await supabase
        .from('pinned_goals')
        .select('goal_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Get frequently used goals from listening sessions
      const { data: sessionData } = await supabase
        .from('listening_sessions')
        .select('dominant_genres, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get favorite tracks
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select('track_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const pinned: PinnedItem[] = [];

      // Add manually pinned goals first
      if (pinnedGoalsData && pinnedGoalsData.length > 0) {
        pinnedGoalsData.forEach(pinnedGoal => {
          const goal = THERAPEUTIC_GOALS.find(g => g.id === pinnedGoal.goal_id);
          if (goal) {
            pinned.push({
              id: goal.id,
              name: goal.name,
              image: goal.artwork,
              type: 'goal',
              lastUsed: new Date(pinnedGoal.created_at)
            });
          }
        });
      }

      // Process session data to find most used goals (only if we need more)
      if (sessionData && sessionData.length > 0) {
        const genreCount: Record<string, { count: number; lastUsed: Date }> = {};
        
        sessionData.forEach(session => {
          if (session.dominant_genres && Array.isArray(session.dominant_genres)) {
            session.dominant_genres.forEach(genre => {
              if (!genreCount[genre]) {
                genreCount[genre] = { count: 0, lastUsed: new Date(session.created_at) };
              }
              genreCount[genre].count++;
              const sessionDate = new Date(session.created_at);
              if (sessionDate > genreCount[genre].lastUsed) {
                genreCount[genre].lastUsed = sessionDate;
              }
            });
          }
        });

        // Convert to array and sort by usage
        const sortedGenres = Object.entries(genreCount)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 3); // Top 3 most used

        // Map genres to therapeutic goals (skip if already manually pinned)
        sortedGenres.forEach(([genre, data]) => {
          const goal = THERAPEUTIC_GOALS.find(g => 
            g.musicBuckets.some(bucket => bucket.toLowerCase().includes(genre.toLowerCase()))
          );

          if (goal && !pinned.some(p => p.id === goal.id)) {
            pinned.push({
              id: goal.id,
              name: goal.name,
              image: goal.artwork,
              type: 'goal',
              usageCount: data.count,
              lastUsed: data.lastUsed
            });
          }
        });
      }

      // Add favorite tracks if we have room
      if (favoritesData && favoritesData.length > 0 && pinned.length < 5) {
        // Fetch track details for favorites - use curated_tracks table
        const trackIds = favoritesData.slice(0, 5 - pinned.length).map(f => f.track_id.toString());
        
        const { data: tracksData } = await supabase
          .from('curated_tracks')
          .select('id, original_filename, curated_storage_key')
          .in('id', trackIds);

        if (tracksData) {
          tracksData.forEach(track => {
            pinned.push({
              id: track.id.toString(),
              name: track.original_filename || 'Favorite Track',
              image: track.curated_storage_key || '',
              type: 'track'
            });
          });
        }
      }

      setPinnedItems(pinned);
    } catch (error) {
      console.error('Error loading pinned favorites:', error);
      setPinnedItems([]);
    } finally {
      setLoading(false);
    }
  };

  const togglePinGoal = async (goalId: string) => {
    if (!user) return;

    try {
      // Check if goal is already pinned
      const { data: existingPin } = await supabase
        .from('pinned_goals')
        .select('id')
        .eq('user_id', user.id)
        .eq('goal_id', goalId)
        .single();

      if (existingPin) {
        // Unpin
        await supabase
          .from('pinned_goals')
          .delete()
          .eq('user_id', user.id)
          .eq('goal_id', goalId);
      } else {
        // Pin
        await supabase
          .from('pinned_goals')
          .insert({
            user_id: user.id,
            goal_id: goalId
          });
      }

      // Reload favorites
      await loadPinnedFavorites();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const isGoalPinned = (goalId: string) => {
    return pinnedItems.some(item => item.id === goalId && item.type === 'goal');
  };

  return {
    pinnedItems,
    loading,
    refresh: loadPinnedFavorites,
    togglePinGoal,
    isGoalPinned
  };
}
