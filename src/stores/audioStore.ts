import { create } from "zustand";
import { streamUrl } from "@/lib/api";
import { API } from "@/lib/api";
import type { Track } from "@/types";
import { TherapeuticEngine, type TherapeuticGoal, type SessionConfig } from "@/services/therapeuticEngine";
import { toGoalSlug } from '@/domain/goals';
import { AUDIO_ELEMENT_ID } from '@/player/constants';
import { toast } from "sonner";

// Session management integration
let sessionManager: { trackProgress: (t: number, d: number) => void; completeSession: () => Promise<void> } | null = null;

// Race condition protection
let loadSeq = 0;
let isNexting = false;
let isPlaying = false;

// Network hang protection  
let currentAbort: AbortController | null = null;

// Skip tracking for UX
let skipped = 0;

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
  lastGoal?: string;
  
  // Session management
  sessionManager: typeof sessionManager;
  setSessionManager: (manager: typeof sessionManager) => void;
  
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
  
  // Helper: Remove item from array at index
  const removeAt = (arr: Track[], i: number) => arr.slice(0, i).concat(arr.slice(i + 1));
  
  // Simplified: Just try to play the track directly, no pre-validation
  const canPlay = async (url: string): Promise<boolean> => {
    console.log('🎵 Testing stream URL:', url);
    return true; // Let the audio element handle validation
  };
  
  // Helper: Announce skips with smart UX (don't spam)
  const announceSkip = () => {
    skipped++;
    if (skipped === 1) toast.info("Skipping broken tracks…");
    if (skipped % 5 === 0) toast.info(`Skipped ${skipped} broken tracks`);
  };
  
  // Initialize audio element and events
  const initAudio = () => {
    const audio = ensureAudioElement();
    
    console.log('🎵 Audio element initialized:', audio.id, 'src:', audio.src);
    
    // Only add event listeners once
    if (!eventListenersAdded) {
      // Auto-next on track end
      audio.addEventListener('ended', async () => {
        console.log('🎵 Audio ended - auto-next');
        set({ isPlaying: false });
        
        // Complete session when queue ends
        const { queue, index } = get();
        const isLastTrack = index >= queue.length - 1;
        
        if (isLastTrack && sessionManager) {
          console.log('🎵 Session completed - last track finished');
          sessionManager.completeSession().catch(console.error);
        }
        
        // Prevent racing by checking if already nexting
        if (!isNexting) {
          await get().next();
        }
      });
      
      // Auto-skip on audio error
      audio.addEventListener('error', async () => {
        console.warn('🎵 Audio error event — skipping to next track');
        set({ isPlaying: false });
        announceSkip();
        // Prevent racing by checking if already nexting
        if (!isNexting) {
          await get().next();
        }
      });
      
      // Honest state tracking
      audio.addEventListener('play', () => {
        console.log('🎵 Audio play event fired');
        set({ isPlaying: true });
      });
      
      audio.addEventListener('pause', () => {
        console.log('🎵 Audio pause event fired');
        set({ isPlaying: false });
      });
      
      // Time and metadata tracking
      audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;
        
        set({ currentTime });
        
        // Track session progress
        if (sessionManager && duration > 0) {
          sessionManager.trackProgress(currentTime, duration);
        }
      });
      
      audio.addEventListener('loadedmetadata', () => {
        console.log('🎵 Audio metadata loaded, duration:', audio.duration);
        set({ duration: audio.duration || 0 });
      });
      
      eventListenersAdded = true;
      console.log('🎵 Bullet-proof event listeners added to audio element');
    }
    
    return audio;
  };

  // Simplified: Skip pre-validation, let tracks fail gracefully during playback
  const validateTracks = async (tracks: Track[]): Promise<{ working: Track[], broken: Track[] }> => {
    console.log(`🎵 Using all ${tracks.length} tracks without pre-validation`);
    
    // Just check for basic track ID
    const working = tracks.filter(track => track.id);
    const broken = tracks.filter(track => !track.id);
    
    if (broken.length > 0) {
      console.log(`🎵 Filtered out ${broken.length} tracks without IDs`);
    }
    
    return { working, broken };
  };

  const loadTrack = async (track: Track): Promise<boolean> => {
    const mySeq = ++loadSeq;
    const audio = initAudio();
    set({ isLoading: true, error: undefined });
    
    try {
      console.log('🎵 Loading track:', track.title, 'ID:', track.id, 'seq:', mySeq);
      
      const url = streamUrl(track.id);
      
      // If a newer load started, ignore this one
      if (mySeq !== loadSeq) {
        console.log('🎵 Load sequence outdated, ignoring:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      audio.src = url;
      audio.crossOrigin = 'anonymous';
      (audio as any).playsInline = true;
      audio.load();
      console.log('🎵 Audio src set, attempting to play...');
      
      try { 
        await audio.play(); 
      } catch { 
        console.log('🎵 Autoplay blocked (expected), waiting for user gesture');
      }
      
      if (mySeq !== loadSeq) {
        console.log('🎵 Load sequence outdated after play attempt, ignoring:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      console.log('🎵 Track loaded successfully:', track.title);
      set({ currentTrack: track, isLoading: false, error: undefined });
      return true;
    } catch (error) {
      console.error('🎵 Load track failed:', error);
      if (mySeq === loadSeq) {
        set({ isLoading: false });
      }
      return false;
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
    sessionManager: null,
    error: undefined,
    lastGoal: undefined,

    // Actions
    playTrack: async (track: Track) => {
      const success = await loadTrack(track);
      if (success) {
        set({ queue: [track], index: 0 });
        await get().play();
      } else {
        set({ error: "Track not available", isLoading: false });
      }
    },

    playFromGoal: async (goal: string) => {
      set({ isLoading: true, error: undefined, lastGoal: goal });
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
      set({ queue: tracks, index: -1, isLoading: true, error: undefined });
      skipped = 0;
      
      // Fast parallel validation
      const { working, broken } = await validateTracks(tracks);
      
      // Remove broken tracks and announce skips
      if (broken.length > 0) {
        console.log(`🎵 Removing ${broken.length} broken tracks`);
        for (let i = 0; i < Math.min(broken.length, 3); i++) {
          announceSkip();
        }
        if (broken.length > 3) {
          toast.info(`Skipped ${broken.length} broken tracks`);
        }
      }
      
      if (working.length === 0) {
        const { lastGoal } = get();
        const isMoodBoost = lastGoal === 'mood-boost' || lastGoal === 'mood_boost' || lastGoal === 'energy-boost';
        
        set({ 
          queue: [], 
          index: -1, 
          isLoading: false, 
          error: isMoodBoost ? "soundcloud-fallback" : "No working tracks found in queue" 
        });
        return;
      }
      
      // Set clean working queue and load first track
      const targetIndex = Math.min(startAt, working.length - 1);
      set({ queue: working, index: targetIndex });
      
      const success = await loadTrack(working[targetIndex]);
      if (!success) {
        set({ isLoading: false, error: "Failed to load first track" });
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
        const success = await loadTrack(currentTrack);
        if (!success) {
          console.log('🎵 Current track failed, finding next working track in queue');
          let { queue, index } = get();
          
          // Try to find a working track starting from current index
          for (let i = index; i < queue.length; i++) {
            const trackToTry = queue[i];
            console.log('🎵 Trying track at index', i, ':', trackToTry.title);
            const trackSuccess = await loadTrack(trackToTry);
            if (trackSuccess) {
              set({ index: i });
              console.log('🎵 Found working track at index', i, ':', trackToTry.title);
              return;
            }
            
            // Remove broken track and announce skip
            console.log('🎵 Removing broken track from queue:', trackToTry.title);
            announceSkip();
            queue = removeAt(queue, i);
            i--; // Adjust index since we removed an item
            set({ queue });
          }
          
          set({ error: "No working tracks available" });
          return;
        }
      } else if (!audio.src && queue.length > 0) {
        console.log('🎵 No audio source, finding working track from queue');
        let { queue, index } = get();
        
        // Try to find a working track starting from current index
        for (let i = index; i < queue.length; i++) {
          const trackToTry = queue[i];
          console.log('🎵 Trying track at index', i, ':', trackToTry.title);
          const trackSuccess = await loadTrack(trackToTry);
          if (trackSuccess) {
            set({ index: i });
            console.log('🎵 Found working track at index', i, ':', trackToTry.title);
            return;
          }
          
          // Remove broken track and announce skip
          console.log('🎵 Removing broken track from queue:', trackToTry.title);
          announceSkip();
          queue = removeAt(queue, i);
          i--; // Adjust index since we removed an item
          set({ queue });
        }
        
        set({ error: "No working tracks available" });
        return;
      } else if (!audio.src) {
        set({ error: "No audio track available to play" });
        return;
      }
      
      try {
        console.log('🎵 Attempting audio.play()...');
        await audio.play();
        console.log('✅ Audio.play() successful - track should be playing');
        set({ error: undefined });
      } catch (error: any) {
        console.error('🎵 Play failed:', error);
        
        // Better error handling based on error type
        const errorMessage = error.name;
        const errorCode = error.code;
        
        if (errorMessage === 'NotAllowedError' || errorMessage === 'AbortError') {
          // Browser autoplay restriction - common and expected
          set({ error: "Click play to start music (browser autoplay restriction)" });
          toast.info("Click the play button to start music");
        } else if (errorMessage === 'NotSupportedError' || errorCode === 4) {
          // Media format/source not supported
          set({ error: "Audio format not supported" });
          toast.error("Track format not supported - trying next track");
          // Auto-skip to next track (debounced)
          if (!isNexting) {
            setTimeout(() => {
              if (!isNexting) get().next();
            }, 1000);
          }
        } else if (errorMessage === 'NetworkError' || errorCode === 2) {
          // Network/loading error
          set({ error: "Network error loading track" });
          toast.error("Network error - checking next track");
          // Auto-skip to next track (debounced)
          if (!isNexting) {
            setTimeout(() => {
              if (!isNexting) get().next();
            }, 1000);
          }
        } else {
          // Other errors
          set({ error: "Playback error - trying next track" });
          toast.error("Playback issue - trying next track");
          console.log('🎵 Unknown audio error, auto-skipping:', { errorMessage, errorCode, error });
          // Auto-skip to next track (debounced)
          if (!isNexting) {
            setTimeout(() => {
              if (!isNexting) get().next();
            }, 1000);
          }
        }
      }
    },

    pause: () => {
      const audio = initAudio();
      audio.pause();
    },

    next: async () => {
      // Prevent concurrent next operations
      if (isNexting) {
        console.log('🎵 Next already in progress, skipping');
        return;
      }
      
      isNexting = true;
      try {
        let { queue, index, lastGoal } = get();
        console.log('🎵 Skip button pressed - current index:', index, 'queue length:', queue.length, 'lastGoal:', lastGoal);
        
        for (let i = index + 1; i < queue.length; i++) {
          console.log('🎵 Trying next track at index', i, ':', queue[i].title);
          const success = await loadTrack(queue[i]);
          if (success) {
            set({ index: i });
            await get().play();
            console.log('🎵 Successfully skipped to track:', queue[i].title);
            return;
          }
          
          // Drop broken track from queue and announce skip
          console.log('🎵 Removing broken track from queue:', queue[i].title);
          announceSkip();
          queue = removeAt(queue, i);
          i--; // Adjust index since we removed an item
          set({ queue });
        }
        
        // If no more tracks in current queue, try to reload the last goal
        const currentState = get();
        if (currentState.lastGoal) {
          console.log('🎵 Queue exhausted, reloading tracks for goal:', currentState.lastGoal);
          toast.info("Loading more tracks...");
          await get().playFromGoal(currentState.lastGoal);
          return;
        }
        
        console.log('🎵 No more working tracks in queue and no goal to reload');
        toast.error("No more tracks available. Please select a new category.");
        set({ isLoading: false, error: "No more tracks available" });
      } finally {
        isNexting = false;
      }
    },

    prev: async () => {
      let { queue, index } = get();
      
      for (let i = index - 1; i >= 0; i--) {
        console.log('🎵 Trying previous track at index', i, ':', queue[i].title);
        const success = await loadTrack(queue[i]);
        if (success) {
          set({ index: i });
          await get().play();
          return;
        }
        
        // Drop broken track from queue and announce skip
        console.log('🎵 Removing broken track from queue:', queue[i].title);
        announceSkip();
        queue = removeAt(queue, i);
        // No need to adjust i since we're walking downward
        set({ queue });
      }
      
      console.log('🎵 No previous working tracks in queue');
      set({ isLoading: false, error: "No previous tracks available" });
      return;
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
    
    // Session management
    setSessionManager: (manager) => {
      sessionManager = manager;
      set({ sessionManager: manager });
    },
  };
});

// Simplified action exports for backward compatibility
export const playFromGoal = async (goal: string) => {
  return await useAudioStore.getState().playFromGoal(goal);
};

export const playTrackNow = async (track: Track) => {
  await useAudioStore.getState().playTrack(track);
};