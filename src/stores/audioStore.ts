import { create } from "zustand";
import { buildStreamUrl } from "@/lib/stream";
import { API } from "@/lib/api";
import type { Track } from "@/types";
import { TherapeuticEngine, type TherapeuticGoal, type SessionConfig } from "@/services/therapeuticEngine";

// Session management integration
let sessionManager: { trackProgress: (t: number, d: number) => void; completeSession: () => Promise<void> } | null = null;

export const setSessionManager = (manager: typeof sessionManager) => {
  sessionManager = manager;
};

type AudioState = {
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Queue
  queue: Track[];
  index: number;
  
  // Actions
  playTrack: (track: Track) => Promise<void>;
  playFromGoal: (goal: string) => Promise<number>;
  setQueue: (tracks: Track[], startAt?: number) => Promise<void>;
  play: () => void;
  pause: () => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  
  // Internal
  setPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  error?: string;
  setError: (error?: string) => void;
};

// Single audio element
let audioElement: HTMLAudioElement | null = null;

const getAudioElement = (): HTMLAudioElement => {
  if (audioElement && document.body.contains(audioElement)) return audioElement;
  
  audioElement = document.getElementById("audio-player") as HTMLAudioElement;
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = "audio-player";
    audioElement.preload = "metadata";
    audioElement.crossOrigin = "anonymous";
    audioElement.style.display = "none";
    document.body.appendChild(audioElement);
  }
  return audioElement;
};

export const useAudioStore = create<AudioState>((set, get) => {
  let audio: HTMLAudioElement;
  
  // Initialize audio element and events
  const initAudio = () => {
    if (audio) return audio;
    
    audio = getAudioElement();
    
    audio.addEventListener("play", () => set({ isPlaying: true }));
    audio.addEventListener("pause", () => set({ isPlaying: false }));
    audio.addEventListener("ended", () => {
      set({ isPlaying: false });
      
      // 🔄 MIRROR BACKEND: Complete session when queue ends
      const { queue, index } = get();
      const isLastTrack = index >= queue.length - 1;
      
      if (isLastTrack && sessionManager) {
        console.log('🎵 Session completed - last track finished');
        sessionManager.completeSession().catch(console.error);
      }
      
      get().next();
    });
    audio.addEventListener("timeupdate", () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || 0;
      
      set({ currentTime });
      
      // 🔄 MIRROR BACKEND: Track session progress
      if (sessionManager && duration > 0) {
        sessionManager.trackProgress(currentTime, duration);
      }
    });
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration || 0 });
    });
    audio.addEventListener("error", () => {
      set({ isPlaying: false, error: "Playback failed" });
    });
    
    return audio;
  };

  const loadTrack = async (track: Track) => {
    const audio = initAudio();
    set({ isLoading: true, error: undefined });
    
    try {
      const url = buildStreamUrl(track.id);
      audio.src = url;
      await audio.load();
      set({ currentTrack: track, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load track", isLoading: false });
    }
  };

  return {
    // Initial state
    isPlaying: false,
    isLoading: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    queue: [],
    index: -1,

    // Actions
    playTrack: async (track: Track) => {
      await loadTrack(track);
      set({ queue: [track], index: 0 });
      get().play();
    },

    playFromGoal: async (goal: string) => {
      set({ isLoading: true, error: undefined });
      try {
        console.log('🎵 Starting therapeutic session for goal:', goal);
        
        // Fetch tracks from API
        const response = await API.playlist({ goal });
        console.log('🎵 API response received:', response?.tracks?.length, 'tracks');
        
        if (!response?.tracks?.length) {
          throw new Error(`No tracks available for goal "${goal}"`);
        }

        // Convert API response to MusicTrack format for therapeutic engine
        const musicTracks = response.tracks.map((t: any) => ({
          id: t.id,
          title: t.title || "",
          artist: t.genre || "Unknown",
          genre: t.genre || "",
          duration: 0, // Will be set when track loads
          // VAD and Camelot data from API
          energy: t.energy || 0.5,
          valence: t.valence || 0.5,
          acousticness: t.acousticness || 0.5,
          danceability: t.danceability || 0.5,
          instrumentalness: t.instrumentalness || 0.5,
          loudness: t.loudness || -10,
          speechiness: t.speechiness || 0.1,
          bpm: t.bpm
        }));

        console.log('🎵 Converted to therapeutic format:', musicTracks.length, 'tracks');

        // Apply therapeutic ordering using VAD and Camelot wheel
        const goalMapping: Record<string, TherapeuticGoal> = {
          'focus': 'focus_enhancement',
          'focus enhancement': 'focus_enhancement',
          'focus_enhancement': 'focus_enhancement',
          'relax': 'stress_reduction', 
          'stress reduction': 'stress_reduction',
          'stress_reduction': 'stress_reduction',
          'sleep': 'sleep_preparation',
          'sleep preparation': 'sleep_preparation',
          'sleep_preparation': 'sleep_preparation',
          'energy': 'mood_boost',
          'mood boost': 'mood_boost',
          'mood_boost': 'mood_boost',
          'anxiety relief': 'anxiety_relief',
          'anxiety_relief': 'anxiety_relief',
          'meditation support': 'meditation_support',
          'meditation_support': 'meditation_support',
          'pain management': 'pain_management',
          'pain_management': 'pain_management'
        };
        
        const therapeuticGoal = goalMapping[goal.toLowerCase()] || 'focus_enhancement';
        const sessionConfig: SessionConfig = {
          goal: therapeuticGoal,
          duration: 15, // Default 15 minute session
          intensityLevel: 3 // Medium intensity
        };

        console.log('🧠 Creating therapeutic session with config:', sessionConfig);
        
        // Use TherapeuticEngine for proper VAD and Camelot ordering
        const therapeuticSession = await TherapeuticEngine.createSession(sessionConfig, musicTracks);
        
        console.log('✅ Therapeutic session created with', therapeuticSession.tracks.length, 'properly ordered tracks');
        
        // Convert back to Track format for audio store
        const orderedTracks: Track[] = therapeuticSession.tracks.map(t => ({
          id: t.id,
          title: t.title,
          artist: t.artist || t.genre || "Unknown",
          duration: t.duration || 0
        }));

        if (!orderedTracks.length) throw new Error(`No suitable tracks for therapeutic goal "${goal}"`);
        
        await get().setQueue(orderedTracks, 0);
        set({ isLoading: false });
        
        console.log('🎵 Therapeutic playlist set with VAD/Camelot ordering:', orderedTracks.length, 'tracks');
        return orderedTracks.length;
      } catch (error: any) {
        console.error('❌ Therapeutic playFromGoal error:', error);
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    setQueue: async (tracks: Track[], startAt = 0) => {
      const validIndex = Math.max(0, Math.min(startAt, tracks.length - 1));
      set({ queue: tracks, index: validIndex });
      
      if (tracks[validIndex]) {
        await loadTrack(tracks[validIndex]);
      }
    },

    play: () => {
      const audio = initAudio();
      audio.play().catch(() => {
        set({ error: "Playback failed" });
      });
    },

    pause: () => {
      const audio = initAudio();
      audio.pause();
    },

    next: async () => {
      const { queue, index } = get();
      const nextIndex = index + 1;
      if (nextIndex < queue.length) {
        set({ index: nextIndex });
        await loadTrack(queue[nextIndex]);
        get().play();
      }
    },

    prev: async () => {
      const { queue, index } = get();
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        set({ index: prevIndex });
        await loadTrack(queue[prevIndex]);
        get().play();
      }
    },

    seek: (time: number) => {
      const audio = initAudio();
      audio.currentTime = time;
    },

    setVolume: (volume: number) => {
      const audio = initAudio();
      audio.volume = volume;
      set({ volume });
    },

    // Internal setters
    setPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setCurrentTime: (time: number) => set({ currentTime: time }),
    setDuration: (duration: number) => set({ duration: duration }),
    setError: (error?: string) => set({ error }),
  };
});

// Simplified action exports for backward compatibility
export const playFromGoal = async (goal: string) => {
  return await useAudioStore.getState().playFromGoal(goal);
};

export const playTrackNow = async (track: Track) => {
  await useAudioStore.getState().playTrack(track);
};