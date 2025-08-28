import { supabase } from '@/integrations/supabase/client';

// Track API
export const trackAPI = {
  // Get tracks by mood/genre
  getTracksByMood: async (mood: string, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .ilike('genre', `%${mood}%`)
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tracks by mood:', error);
      return [];
    }
  },

  // Get tracks by genre
  getTracksByGenre: async (genre: string, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('genre', genre)
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return [];
    }
  },

  // Search tracks
  searchTracks: async (query: string, limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .or(`title.ilike.%${query}%,genre.ilike.%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  },

  // Get all tracks
  getAllTracks: async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all tracks:', error);
      return [];
    }
  }
};

// AI DJ API
export const aiDJAPI = {
  // Generate playlist based on mood and preferences
  generatePlaylist: async (mood: string, genre = 'all', preferences = {}) => {
    try {
      // Simple playlist generation based on mood mapping
      const moodToGenreMap: Record<string, string[]> = {
        focus: ['classical', 'ambient', 'instrumental'],
        chill: ['acoustic', 'indie', 'lo-fi'],
        sleep: ['ambient', 'classical', 'nature'],
        energy: ['electronic', 'pop', 'rock', 'edm']
      };

      const preferredGenres = moodToGenreMap[mood] || ['acoustic'];
      let tracks = [];

      // Get tracks from each preferred genre
      for (const genreType of preferredGenres) {
        const genreTracks = await trackAPI.getTracksByGenre(genreType, 10);
        tracks.push(...genreTracks);
      }

      // If no tracks found, get general tracks
      if (tracks.length === 0) {
        tracks = await trackAPI.getAllTracks(20);
      }

      // Shuffle and limit to 15 tracks
      const shuffled = tracks.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 15);

    } catch (error) {
      console.error('Error generating playlist:', error);
      return [];
    }
  },

  // Get mood recommendations
  getMoodRecommendations: async () => {
    return [
      { id: 'focus', label: 'Focus', description: 'Enhance concentration and productivity' },
      { id: 'chill', label: 'Chill', description: 'Relax and unwind' },
      { id: 'sleep', label: 'Sleep', description: 'Peaceful sounds for rest' },
      { id: 'energy', label: 'Energy', description: 'Boost motivation and energy' }
    ];
  }
};

// Emotion tracking API
export const emotionAPI = {
  // Log emotion data
  logEmotion: async (emotion: string, intensity: number, context = {}) => {
    try {
      const { data, error } = await supabase
        .from('cognitive_biomarkers')
        .insert({
          biomarker_type: 'emotion',
          measurement_value: intensity,
          raw_data: {
            emotion,
            context,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging emotion:', error);
      return null;
    }
  },

  // Get emotion history
  getEmotionHistory: async (period = 'week') => {
    try {
      const now = new Date();
      const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      const { data, error } = await supabase
        .from('cognitive_biomarkers')
        .select('*')
        .eq('biomarker_type', 'emotion')
        .gte('measurement_date', startDate.toISOString())
        .order('measurement_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching emotion history:', error);
      return [];
    }
  }
};

// Listening stats API
export const statsAPI = {
  // Get listening statistics
  getListeningStats: async (period = 'week') => {
    try {
      const now = new Date();
      const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      const { data, error } = await supabase
        .from('listening_sessions')
        .select('*')
        .gte('session_date', startDate.toISOString())
        .order('session_date', { ascending: true });

      if (error) throw error;
      
      // Process the data to return useful statistics
      const totalSessions = data?.length || 0;
      const totalMinutes = data?.reduce((sum, session) => sum + (session.session_duration_minutes || 0), 0) || 0;
      const avgSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
      
      return {
        totalSessions,
        totalMinutes,
        avgSessionLength,
        sessions: data || []
      };
    } catch (error) {
      console.error('Error fetching listening stats:', error);
      return {
        totalSessions: 0,
        totalMinutes: 0,
        avgSessionLength: 0,
        sessions: []
      };
    }
  }
};