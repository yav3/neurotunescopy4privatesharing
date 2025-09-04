import { create } from "zustand";
import { buildStreamUrl } from "@/lib/stream";
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

// HEAD request throttling
let headFailures = 0;

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
  
  // Helper: Throttled HEAD check with timeout and abort control + Range fallback
  const headCheck = async (url: string, ms = 3000): Promise<boolean> => {
    // After N failures, skip HEAD and let stream self-heal
    if (headFailures >= 3) {
      console.log('🎵 Skipping HEAD check (too many failures), letting stream self-heal');
      return true;
    }
    
    // Cancel any prior probe
    currentAbort?.abort();
    const controller = new AbortController();
    currentAbort = controller;
    
    const timeout = setTimeout(() => controller.abort(), ms);
    
    try {
      const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeout);
      headFailures = response.ok ? 0 : headFailures + 1;
      if (response.ok) return true;
    } catch {
      clearTimeout(timeout);
    }
    
    // Fallback: 1-byte range GET (some CDNs 403 on HEAD)
    try {
      const response = await fetch(url, { 
        method: 'GET', 
        headers: { Range: 'bytes=0-0' },
        signal: controller.signal 
      });
      headFailures = response.ok ? 0 : headFailures + 1;
      return response.ok;
    } catch {
      headFailures++;
      return false;
    } finally {
      // Clean up controller reference
      if (currentAbort === controller) currentAbort = null;
    }
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
        
        await get().next();
      });
      
      // Auto-skip on audio error
      audio.addEventListener('error', async () => {
        console.warn('🎵 Audio error event — skipping to next track');
        set({ isPlaying: false });
        announceSkip();
        await get().next();
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

  const loadTrack = async (track: Track): Promise<boolean> => {
    const mySeq = ++loadSeq;         // capture monotonic token
    const audio = initAudio();
    set({ isLoading: true, error: undefined });
    
    try {
      console.log('🎵 Loading track:', track.title, 'ID:', track.id, 'Storage:', track.storage_key, 'seq:', mySeq);
      
      // Validate track has proper storage info
      if (!track.id || (!track.storage_key && !track.file_path)) {
        console.log('🎵 Track missing required storage info:', { id: track.id, storage_key: track.storage_key, file_path: track.file_path });
        return false;
      }
      
      const url = buildStreamUrl(track.id);
      console.log('🎵 Stream URL built:', url);
      
      // Quick HEAD with timeout (don't hang forever)
      console.log('🎵 Testing stream URL accessibility...');
      const headOk = await headCheck(url, 3000);
      if (!headOk) {
        console.log('🎵 HEAD check failed for:', track.title, 'URL:', url);
        return false;
      }
      
      // If a newer load started, ignore this one
      if (mySeq !== loadSeq) {
        console.log('🎵 Load sequence outdated, ignoring:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      audio.src = url;
      console.log('🎵 Audio src set, attempting to play...');
      
      // .load() is sync; browsers fire async events, so just try to play
      try { 
        await audio.play(); 
      } catch { 
        // gesture needed; fine - this will be handled by user clicking play
        console.log('🎵 Autoplay blocked (expected), waiting for user gesture');
      }
      
      // Still current?
      if (mySeq !== loadSeq) {
        console.log('🎵 Load sequence outdated after play attempt, ignoring:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      console.log('🎵 Track loaded successfully:', track.title);
      set({ currentTrack: track, isLoading: false, error: undefined });
      return true;
    } catch (error) {
      console.error('🎵 Load track failed:', error);
      // If this load is stale we don't touch global state
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
      const validIndex = Math.max(0, Math.min(startAt, tracks.length - 1));
      set({ queue: tracks, index: validIndex, isLoading: true, error: undefined });
      
      // Reset skip counter for new session
      skipped = 0;
      
      let { queue, index } = get();
      for (let i = index; i < queue.length; i++) {
        console.log('🎵 Trying to load track', i + 1, 'of', queue.length, ':', queue[i].title);
        const success = await loadTrack(queue[i]);
        if (success) {
          set({ index: i });
          console.log('🎵 Found working track at index', i, ':', queue[i].title);
          return;
        }
        
        // Drop broken track from this session's queue and announce skip
        console.log('🎵 Removing broken track from queue:', queue[i].title);
        announceSkip();
        queue = removeAt(queue, i);
        i--; // Adjust index since we removed an item
        set({ queue });
      }
      
      set({ isLoading: false, error: "No working tracks found in queue" });
      console.error('🎵 No working tracks found in entire queue');
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
          // Auto-skip to next track
          setTimeout(() => get().next(), 1000);
        } else if (errorMessage === 'NetworkError' || errorCode === 2) {
          // Network/loading error
          set({ error: "Network error loading track" });
          toast.error("Network error - checking next track");
          // Auto-skip to next track  
          setTimeout(() => get().next(), 1000);
        } else {
          // Other errors
          set({ error: "Playback error - trying next track" });
          toast.error("Playback issue - trying next track");
          console.log('🎵 Unknown audio error, auto-skipping:', { errorMessage, errorCode, error });
          // Auto-skip to next track
          setTimeout(() => get().next(), 1000);
        }
      }
    },

    pause: () => {
      const audio = initAudio();
      audio.pause();
    },

    next: async () => {
      let { queue, index } = get();
      
      for (let i = index + 1; i < queue.length; i++) {
        console.log('🎵 Trying next track at index', i, ':', queue[i].title);
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
        i--; // Adjust index since we removed an item
        set({ queue });
      }
      
      // If no more tracks in current queue, try to reload the last goal
      const { lastGoal } = get();
      if (lastGoal) {
        console.log('🎵 Queue exhausted, reloading tracks for goal:', lastGoal);
        await get().playFromGoal(lastGoal);
        return;
      }
      
      console.log('🎵 No more working tracks in queue and no goal to reload');
      set({ isLoading: false, error: "No more tracks available" });
      return;
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