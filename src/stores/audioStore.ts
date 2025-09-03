import { create } from "zustand";
import { buildStreamUrl } from "@/lib/stream";
import { API } from "@/lib/api";
import type { Track } from "@/types";
import { TherapeuticEngine, type TherapeuticGoal, type SessionConfig } from "@/services/therapeuticEngine";
import { toGoalSlug } from '@/domain/goals';
import { AUDIO_ELEMENT_ID } from '@/player/constants';

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
// Runtime guard to detect multiple audio elements
if (typeof window !== "undefined") {
  const existing = document.querySelectorAll("audio");
  if (existing.length > 1) {
    console.error("[audio] Multiple <audio> elements detected:", existing);
  }
}

let audioElement: HTMLAudioElement | null = null;

const ensureAudioElement = (): HTMLAudioElement => {
  if (audioElement && document.body.contains(audioElement)) return audioElement;
  
  // Clean up any existing audio elements first
  document.querySelectorAll("audio").forEach(el => {
    if (el.id !== AUDIO_ELEMENT_ID) {
      console.warn("[audio] Removing duplicate audio element:", el.id || "no-id");
      el.remove();
    }
  });
  
  audioElement = document.getElementById(AUDIO_ELEMENT_ID) as HTMLAudioElement;
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = AUDIO_ELEMENT_ID;
    audioElement.preload = "metadata";
    audioElement.crossOrigin = "anonymous";
    audioElement.style.display = "none";
    document.body.appendChild(audioElement);
    console.log(`🎵 Created unified audio element #${AUDIO_ELEMENT_ID}`);
  }
  return audioElement;
};

export const useAudioStore = create<AudioState>((set, get) => {
  let eventListenersAdded = false;
  
  // Initialize audio element and events
  const initAudio = () => {
    const audio = ensureAudioElement();
    
    console.log('🎵 Audio element initialized:', audio.id, 'src:', audio.src);
    
    // Only add event listeners once
    if (!eventListenersAdded) {
      const handlePlay = () => {
        console.log('🎵 Audio play event fired');
        set({ isPlaying: true });
      };
      
      const handlePause = () => {
        console.log('🎵 Audio pause event fired'); 
        set({ isPlaying: false });
      };
      
      const handleEnded = () => {
        console.log('🎵 Audio ended event fired');
        set({ isPlaying: false });
        
        // 🔄 MIRROR BACKEND: Complete session when queue ends
        const { queue, index } = get();
        const isLastTrack = index >= queue.length - 1;
        
        if (isLastTrack && sessionManager) {
          console.log('🎵 Session completed - last track finished');
          sessionManager.completeSession().catch(console.error);
        }
        
        get().next();
      };
      
      const handleTimeUpdate = () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;
        
        set({ currentTime });
        
        // 🔄 MIRROR BACKEND: Track session progress
        if (sessionManager && duration > 0) {
          sessionManager.trackProgress(currentTime, duration);
        }
      };
      
      const handleLoadedMetadata = () => {
        console.log('🎵 Audio metadata loaded, duration:', audio.duration);
        set({ duration: audio.duration || 0 });
      };
      
      const handleError = (e: Event) => {
        console.error('🎵 Audio error:', e);
        set({ isPlaying: false, error: "Playback failed" });
      };
      
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("error", handleError);
      
      eventListenersAdded = true;
      console.log('🎵 Event listeners added to audio element');
    }
    
    return audio;
  };

  const loadTrack = async (track: Track) => {
    const audio = initAudio();
    set({ isLoading: true, error: undefined });
    
    try {
      console.log('🎵 Loading track:', track.title, 'ID:', track.id);
      const url = buildStreamUrl(track.id);
      console.log('🎵 Stream URL built:', url);
      
      // Test if the stream URL is accessible
      console.log('🎵 Testing stream URL accessibility...');
      try {
        const testResponse = await fetch(url, { method: 'HEAD' });
        console.log('🎵 Stream URL test result:', testResponse.status, testResponse.statusText);
        if (!testResponse.ok) {
          throw new Error(`Stream URL not accessible: ${testResponse.status} ${testResponse.statusText}`);
        }
      } catch (error) {
        console.error('🎵 Stream URL test failed:', error);
        throw error;
      }
      
      audio.src = url;
      console.log('🎵 Audio src set, attempting to load...');
      
      await audio.load();
      console.log('🎵 Track loaded successfully:', track.title);
      set({ currentTrack: track, isLoading: false });
    } catch (error) {
      console.error('🎵 Load track failed:', error);
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
      await get().play();
    },

    playFromGoal: async (goal: string) => {
      set({ isLoading: true, error: undefined });
      try {
        console.log('🎵 Starting therapeutic session for goal:', goal);
        
        // Fetch tracks from API
        const goalSlug = toGoalSlug(goal);
        const response = await API.playlist(goalSlug);
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
        
        // Auto-play the first track after setting queue
        await get().play();
        
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

    play: async () => {
      const { currentTrack, queue } = get();
      console.log('🎵 Play called - currentTrack:', currentTrack?.title, 'queue length:', queue.length);
      
      if (!currentTrack && queue.length === 0) {
        console.log('🎵 No track to play - queue is empty and no current track');
        set({ error: "No track selected to play" });
        return;
      }
      
      const audio = initAudio();
      console.log('🎵 Audio element state - src:', audio.src, 'readyState:', audio.readyState, 'paused:', audio.paused);
      
      if (!audio.src && currentTrack) {
        console.log('🎵 No audio source, loading current track:', currentTrack.title);
        await loadTrack(currentTrack);
      } else if (!audio.src && queue.length > 0) {
        console.log('🎵 No audio source, loading first track from queue:', queue[0].title);
        await loadTrack(queue[0]);
      } else if (!audio.src) {
        set({ error: "No audio track available to play" });
        return;
      }
      
      try {
        console.log('🎵 Attempting to play audio...');
        await audio.play();
        console.log('🎵 Play successful');
        set({ error: undefined });
      } catch (error: any) {
        console.error('🎵 Play failed:', error);
        set({ error: "Click play to start music (browser autoplay restriction)" });
      }
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
        await get().play();
      }
    },

    prev: async () => {
      const { queue, index } = get();
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        set({ index: prevIndex });
        await loadTrack(queue[prevIndex]);
        await get().play();
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