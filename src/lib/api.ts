import { supabase } from '@/integrations/supabase/client';

// Use different base URL for development vs production
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5000'; // Backend server port in development

const headers = { "content-type": "application/json" };

async function j<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const text = await r.text();
    console.error(`API Error ${r.status}:`, text);
    throw new Error(`${r.status} ${text}`);
  }
  return r.json();
}

// New unified API client with real event triggers
export const API = {
  // Health checks
  health: () => fetch(`${API_BASE_URL}/api/healthz`).then(j),
  db: () => fetch(`${API_BASE_URL}/api/readyz`).then(j),
  storage: () => fetch(`${API_BASE_URL}/api/stream-health`).then(j),

  // Music catalog  
  featured: () => fetch(`${API_BASE_URL}/api/catalog/featured`).then(j),
  playlistByGoal: (goal: string) =>
    fetch(`${API_BASE_URL}/api/playlist?goal=${encodeURIComponent(goal)}`).then(j),

  // Sessions/telemetry
  startSession: (trackId: string) =>
    fetch(`${API_BASE_URL}/api/sessions/start`, { 
      method: "POST", 
      headers, 
      body: JSON.stringify({ trackId }) 
    }).then(j),
    
  progress: (sessionId: string, t: number) =>
    navigator.sendBeacon?.(`${API_BASE_URL}/api/sessions/progress`, 
      new Blob([JSON.stringify({ sessionId, t })], { type: "application/json" }))
    || fetch(`${API_BASE_URL}/api/sessions/progress`, { 
      method: "POST", 
      headers, 
      body: JSON.stringify({ sessionId, t }) 
    }),
    
  complete: (sessionId: string) =>
    fetch(`${API_BASE_URL}/api/sessions/complete`, { 
      method: "POST", 
      headers, 
      body: JSON.stringify({ sessionId }) 
    }).then(j),
};

export const streamUrl = (fileOrId: string) => 
  `${API_BASE_URL}/api/stream/path/${encodeURIComponent(fileOrId)}`;

// Legacy APIs - keep for backward compatibility
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
      // Map moods to actual genres in the database
      const moodToGenreMap: Record<string, string[]> = {
        focus: ['classical', 'instrumental', 'baroque'],
        chill: ['jazz', 'folk', 'contemporary'],
        sleep: ['classical', 'baroque', 'instrumental'],
        energy: ['electronica', 'rock', 'dance']
      };

      const preferredGenres = moodToGenreMap[mood] || ['acoustic'];
      let tracks = [];

      // Get tracks from each preferred genre
      for (const genreType of preferredGenres) {
        const genreTracks = await trackAPI.getTracksByGenre(genreType, 8);
        tracks.push(...genreTracks);
      }

      // If still no tracks, get from electronica (largest genre)
      if (tracks.length === 0) {
        tracks = await trackAPI.getTracksByGenre('electronica', 15);
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
