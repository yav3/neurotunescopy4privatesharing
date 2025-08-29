import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Track {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  duration?: number;
  audio_url?: string;
  // Audio features
  valence?: number;
  energy?: number;
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
  loudness?: number;
  speechiness?: number;
  bpm?: number;
}

interface PlayerState {
  // Playback state
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Queue management
  queue: Track[];
  currentIndex: number;
  
  // Favorites and user data
  favorites: Set<string>;
  recentlyPlayed: Track[];
  
  // Playlist state
  currentPlaylist: Track[];
  playlistName: string;
  
  // Actions
  setCurrentTrack: (track: Track) => void;
  togglePlay: () => void;
  pause: () => void;
  play: () => void;
  stop: () => void;
  stopPlayback: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  
  // Queue actions
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // Playlist actions
  playPlaylist: (tracks: Track[], playlistName?: string) => void;
  
  // Favorites actions
  toggleFavorite: (trackId: string) => Promise<void>;
  isFavorite: (trackId: string) => boolean;
  loadUserFavorites: () => Promise<void>;
  
  // Recent tracks
  addToRecentlyPlayed: (track: Track) => void;
  
  // User session tracking
  logListeningSession: (track: Track, duration: number) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  
  queue: [],
  currentIndex: -1,
  
  favorites: new Set(),
  recentlyPlayed: [],
  
  currentPlaylist: [],
  playlistName: '',
  
  // Playback actions
  setCurrentTrack: (track) => {
    set({ currentTrack: track });
    get().addToRecentlyPlayed(track);
  },
  
  togglePlay: () => {
    const { isPlaying } = get();
    set({ isPlaying: !isPlaying, isPaused: isPlaying });
  },
  
  pause: () => set({ isPlaying: false, isPaused: true }),
  play: () => set({ isPlaying: true, isPaused: false }),
  stop: () => set({ isPlaying: false, isPaused: false, currentTime: 0 }),
  stopPlayback: () => set({ 
    isPlaying: false, 
    isPaused: false, 
    currentTime: 0,
    currentTrack: null 
  }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  
  // Queue management
  addToQueue: (track) => {
    const { queue } = get();
    set({ queue: [...queue, track] });
  },
  
  removeFromQueue: (index) => {
    const { queue } = get();
    const newQueue = queue.filter((_, i) => i !== index);
    set({ queue: newQueue });
  },
  
  clearQueue: () => set({ queue: [], currentIndex: -1 }),
  
  playNext: () => {
    const { queue, currentIndex, currentPlaylist } = get();
    const playlist = queue.length > 0 ? queue : currentPlaylist;
    
    if (playlist.length === 0) return;
    
    const nextIndex = currentIndex + 1;
    if (nextIndex < playlist.length) {
      const nextTrack = playlist[nextIndex];
      set({ 
        currentTrack: nextTrack, 
        currentIndex: nextIndex,
        isPlaying: true,
        isPaused: false 
      });
      get().addToRecentlyPlayed(nextTrack);
    }
  },
  
  playPrevious: () => {
    const { queue, currentIndex, currentPlaylist } = get();
    const playlist = queue.length > 0 ? queue : currentPlaylist;
    
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const prevTrack = playlist[prevIndex];
      set({ 
        currentTrack: prevTrack, 
        currentIndex: prevIndex,
        isPlaying: true,
        isPaused: false 
      });
      get().addToRecentlyPlayed(prevTrack);
    }
  },
  
  // Playlist actions
  playPlaylist: (tracks, playlistName = '') => {
    if (tracks.length === 0) return;
    
    const firstTrack = tracks[0];
    set({
      currentPlaylist: tracks,
      playlistName,
      currentTrack: firstTrack,
      currentIndex: 0,
      isPlaying: true,
      isPaused: false,
      queue: [] // Clear queue when playing new playlist
    });
    get().addToRecentlyPlayed(firstTrack);
  },
  
  // Favorites
  loadUserFavorites: async () => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('track_id')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      const favoriteIds = new Set(data?.map(fav => fav.track_id.toString()) || []);
      set({ favorites: favoriteIds });
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  },

  toggleFavorite: async (trackId) => {
    const { favorites } = get();
    const isFavorited = favorites.has(trackId);
    
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('track_id', parseInt(trackId));

        if (error) throw error;

        const newFavorites = new Set(favorites);
        newFavorites.delete(trackId);
        set({ favorites: newFavorites });
      } else {
        // Add to favorites - RLS will validate user_id matches auth.uid()
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        
        const { error } = await supabase
          .from('user_favorites')
          .insert({ 
            track_id: parseInt(trackId),
            user_id: user.id 
          });

        if (error) throw error;

        const newFavorites = new Set(favorites);
        newFavorites.add(trackId);
        set({ favorites: newFavorites });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  },

  isFavorite: (trackId) => {
    const { favorites } = get();
    return favorites.has(trackId);
  },
  
  // Recently played
  addToRecentlyPlayed: (track) => {
    const { recentlyPlayed } = get();
    const newRecentlyPlayed = [track, ...recentlyPlayed.filter(t => t.id !== track.id)];
    
    // Keep only last 50 tracks
    if (newRecentlyPlayed.length > 50) {
      newRecentlyPlayed.splice(50);
    }
    
    set({ recentlyPlayed: newRecentlyPlayed });
  },
  
  // Logging
  logListeningSession: async (track, duration) => {
    try {
      await supabase.from('listening_sessions').insert({
        patient_id: null, // Will be set when user auth is implemented
        session_date: new Date().toISOString(),
        session_duration_minutes: Math.round(duration / 60),
        tracks_played: 1,
        dominant_genres: track.genre ? [track.genre] : [],
        mood_progression: {
          start_mood: 'neutral',
          end_mood: 'positive',
          valence_avg: track.valence || 0.5
        }
      });
    } catch (error) {
      console.error('Error logging listening session:', error);
    }
  }
}));
