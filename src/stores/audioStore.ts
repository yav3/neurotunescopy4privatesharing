import { create } from "zustand";
import { streamUrl } from "@/lib/api";
import { API } from "@/lib/api";
import { SmartAudioResolver } from '@/utils/smartAudioResolver';
import type { Track } from "@/types";
import { TherapeuticGoalMapper } from '@/utils/therapeuticMapper';
import { filterTracksForGoal, sortByTherapeuticEffectiveness } from '@/utils/therapeuticFiltering';
import type { GoalSlug } from '@/config/therapeuticGoals';
import { AUDIO_ELEMENT_ID } from '@/player/constants';
import { toast } from "sonner";

// Session management integration
let sessionManager: { trackProgress: (t: number, d: number) => void; completeSession: () => Promise<void> } | null = null;

// Race condition protection
let loadSeq = 0;
let isNexting = false;
let isPlaying = false;
let isTransitioning = false; // Global transition lock

// Network hang protection  
let currentAbort: AbortController | null = null;

// Skip tracking for UX
let skipped = 0;

// Debounced auto-skip protection
let autoSkipTimeout: NodeJS.Timeout | null = null;

const scheduleAutoSkip = (reason: string) => {
  if (autoSkipTimeout) clearTimeout(autoSkipTimeout);
  autoSkipTimeout = setTimeout(() => {
    console.log(`🎵 Auto-skip triggered: ${reason}`);
    if (!isNexting && !isTransitioning) {
      const store = (window as any).useAudioStore?.getState();
      if (store) store.next();
    }
  }, 1000);
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
  console.log('🔧 ensureAudioElement called - current element exists:', !!audioElement);
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
  } else {
    console.log(`🎵 Found existing audio element #${AUDIO_ELEMENT_ID}`);
  }
  return audioElement;
};

export const useAudioStore = create<AudioState>((set, get) => {
  let eventListenersAdded = false;
  
  // Force audio element creation on store initialization
  console.log('🎵 Audio store initializing - creating audio element...');
  ensureAudioElement();
  
  // Helper: Remove item from array at index
  const removeAt = (arr: Track[], i: number) => arr.slice(0, i).concat(arr.slice(i + 1));
  
  // Simplified: Just try to play the track directly, no pre-validation
  const canPlay = async (url: string): Promise<boolean> => {
    console.log('🎵 Testing stream URL:', url);
    
    // TEMPORARY: Always return true to prevent tracks from being marked as broken
    // Let the audio element handle validation during actual playback
    return true;
  };
  
  // Helper: Announce skips with smart UX (don't spam)
  const announceSkip = async () => {
    skipped++;
    const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
    if (shouldShowTechnicalLogs()) {
      if (skipped === 1) toast.info("Skipping broken tracks…");
      if (skipped % 5 === 0) toast.info(`Skipped ${skipped} broken tracks`);
    } else {
      // Simple user-friendly message for non-admins
      if (skipped === 1) toast.info("Finding the perfect tracks for you...");
    }
  };
  
  // Initialize audio element and events
  const initAudio = () => {
    const audio = ensureAudioElement();
    
    console.log('🎵 Audio element initialized:', audio.id, 'src:', audio.src);
    
    // Only add event listeners once
    if (!eventListenersAdded) {
      // Auto-next on track end
      audio.addEventListener('ended', async () => {
        console.log('🎵 Audio ended - scheduling auto-next');
        set({ isPlaying: false });
        
        // Complete session when queue ends
        const { queue, index } = get();
        const isLastTrack = index >= queue.length - 1;
        
        if (isLastTrack && sessionManager) {
          console.log('🎵 Session completed - last track finished');
          sessionManager.completeSession().catch(console.error);
        }
        
        // Use debounced auto-skip to prevent racing
        scheduleAutoSkip('track ended');
      });
      
      // Auto-skip on audio error
      audio.addEventListener('error', async () => {
        console.warn('🎵 Audio error event — scheduling skip');
        set({ isPlaying: false });
        announceSkip();
        
        // Use debounced auto-skip to prevent racing
        scheduleAutoSkip('audio error');
      });
      
      // Honest state tracking
      audio.addEventListener('play', () => {
        console.log('🎵 Audio play event fired');
        const { currentTrack } = get();
        if (currentTrack) {
          // Remember played track for variety
          import('@/state/playlistSession').then(({ remember }) => {
            remember(currentTrack.id);
            console.log('🎵 Remembered track for exclusion:', currentTrack.title);
          });
        }
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
    const startTime = Date.now();
    const audio = initAudio();
    set({ isLoading: true, error: undefined });
    
    // Enhanced sequence validation with timeout
    const isValid = () => mySeq === loadSeq && (Date.now() - startTime) < 30000;
    
    try {
      console.log('🎵 Loading track:', track.title, 'ID:', track.id, 'seq:', mySeq);
      
      // Early validation
      if (!isValid()) {
        console.log('🎵 Load sequence invalidated early:', mySeq);
        return false;
      }
      
      // Validate track ID first
      if (!track.id || typeof track.id !== 'string' || track.id.trim() === '') {
        console.error('❌ Invalid track ID:', track.id);
        return false;
      }
      
      // Use Smart Audio Resolver to find working URL
      console.log('🔍 Using SmartAudioResolver to find working URL...');
      const resolution = await SmartAudioResolver.resolveAudioUrl({
        id: track.id,
        title: track.title || 'Untitled',
        storage_bucket: track.storage_bucket,
        storage_key: track.storage_key
      });
      
      // Check sequence after async operation
      if (!isValid()) {
        console.log('🎵 Load sequence outdated after resolution:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      console.log('🎯 Resolution result:', resolution);
      
      if (!resolution.success || !resolution.url) {
        console.error('❌ SmartAudioResolver could not find working URL for:', track.title);
        console.log('📝 Track data:', { 
          id: track.id, 
          title: track.title, 
          storage_bucket: track.storage_bucket, 
          storage_key: track.storage_key 
        });
        console.log('📝 Attempted URLs:', resolution.attempts);
        
        // Save failure info for debugging
        if (typeof window !== 'undefined') {
          (window as any).lastBrokenTrack = { track, resolution };
        }
        
        set({ 
          error: `Audio file not found. Tried ${resolution.attempts.length} different locations.`,
          isLoading: false 
        });
        return false;
      }
      
      const url = resolution.url;
      console.log(`✅ Found working URL via ${resolution.method}: ${url}`);
      
      // Final sequence check before setting audio source
      if (!isValid()) {
        console.log('🎵 Load sequence outdated before setting src:', mySeq, 'vs', loadSeq);
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
      
      // Final validation
      if (!isValid()) {
        console.log('🎵 Load sequence outdated after play attempt:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      console.log('🎵 Track loaded successfully:', track.title);
      set({ currentTrack: track, isLoading: false, error: undefined });
      return true;
    } catch (error) {
      console.error('🎵 Load track failed:', error);
      if (isValid()) {
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
        const { adminLog, userLog } = await import('@/utils/adminLogging');
        
        adminLog('🎵 Starting therapeutic session for goal:', goal);
        userLog('🎵 Preparing your therapeutic music session...');
        
        // Use your existing therapeutic goal mapper
        const therapeuticGoal = TherapeuticGoalMapper.findGoal(goal);
        if (!therapeuticGoal) {
          throw new Error(`Unknown therapeutic goal: ${goal}`);
        }
        
        adminLog('🎯 Found therapeutic goal:', therapeuticGoal.name, 'with backend key:', therapeuticGoal.backendKey);
        
        // Use the goal slug for API call (not backendKey, since API expects GoalSlug)
        const goalSlug = therapeuticGoal.slug;
        if (!['anxiety-relief', 'focus-enhancement', 'mood-boost', 'stress-reduction', 'meditation-support'].includes(goalSlug)) {
          throw new Error(`Invalid goal slug: ${goalSlug}`);
        }
        
        // Get recently played tracks to exclude for variety
        const { excludeQS } = await import('@/state/playlistSession');
        const excludeIds = excludeQS().split(',').filter(Boolean);
        adminLog('🎵 Excluding recently played tracks:', excludeIds.length);
        if (excludeIds.length > 0) {
          userLog('🔄 Loading fresh tracks for variety...');
        }
        
        // Use direct database query instead of API endpoint
        const { getTherapeuticTracks } = await import('@/services/therapeuticDatabase');
        const { tracks: dbTracks, error: dbError } = await getTherapeuticTracks(goalSlug, 50, excludeIds);
        
        if (dbError) {
          throw new Error(`Database error: ${dbError}`);
        }
        
        const response = { tracks: dbTracks || [] };
        adminLog('🎵 Database response received:', response?.tracks?.length, 'tracks');
        
        if (!response?.tracks?.length) {
          throw new Error(`No tracks available for goal "${goal}"`);
        }

        // Convert API response to TherapeuticTrack format for filtering
        const therapeuticTracks = response.tracks.map((t: any) => ({
          id: parseInt(t.id) || 0,
          bpm: t.bpm,
          valence: t.valence,
          energy_level: t.energy_level || t.energy,
          musical_key_est: t.musical_key_est || t.key,
          camelot: t.camelot_key || t.camelot,
          // Keep original data for conversion back to Track
          _original: {
            id: String(t.id || t.unique_id),
            unique_id: String(t.unique_id || t.id),
            title: t.title || t.name || "",
            artist: t.artist || t.genre || "Unknown",
            file_path: t.file_path || "",
            storage_bucket: t.storage_bucket,
            storage_key: t.storage_key
          }
        }));

        adminLog('🎵 Converted to therapeutic format:', therapeuticTracks.length, 'tracks');

        // Use your existing filtering system
        if (!['anxiety-relief', 'focus-enhancement', 'mood-boost', 'stress-reduction', 'meditation-support'].includes(goalSlug)) {
          throw new Error(`Invalid goal slug: ${goalSlug}`);
        }
        
        const filteredTracks = filterTracksForGoal(therapeuticTracks, goalSlug as GoalSlug);
        adminLog('🎯 Therapeutically filtered tracks:', filteredTracks.length);
        
        if (!filteredTracks.length) {
          throw new Error(`No tracks match the therapeutic requirements for "${therapeuticGoal.name}"`);
        }

        // Sort by therapeutic effectiveness using your existing system
        const therapeuticallyOrderedTracks = sortByTherapeuticEffectiveness(filteredTracks, goalSlug as GoalSlug);
        adminLog('✅ Tracks ordered by therapeutic effectiveness');

        // Convert back to audio store Track format
        const orderedTracks: Track[] = therapeuticallyOrderedTracks.map(t => ({
          id: (t as any)._original.id,
          title: (t as any)._original.title,
          artist: (t as any)._original.artist,
          duration: 0, // Will be set when track loads
          storage_bucket: (t as any)._original.storage_bucket,
          storage_key: (t as any)._original.storage_key
        }));

        if (!orderedTracks.length) {
          throw new Error(`No suitable tracks for therapeutic goal "${goal}"`);
        }
        
        await get().setQueue(orderedTracks, 0);
        await get().play();
        
        set({ isLoading: false });
        
        adminLog('🎵 Therapeutic playlist set using existing system:', orderedTracks.length, 'tracks');
        adminLog('🧠 Using VAD profile:', therapeuticGoal.vadProfile, 'BPM range:', therapeuticGoal.bpmRange);
        userLog(`✅ Your ${therapeuticGoal.name} session is ready with ${orderedTracks.length} curated tracks`);
        
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
        const { adminLog, userLog } = await import('@/utils/adminLogging');
        adminLog(`🎵 Removing ${broken.length} broken tracks`);
        for (let i = 0; i < Math.min(broken.length, 3); i++) {
          announceSkip();
        }
        if (broken.length > 3) {
          const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
          if (shouldShowTechnicalLogs()) {
            toast.info(`Skipped ${broken.length} broken tracks`);
          } else {
            userLog('🎵 Optimizing your playlist...');
          }
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
          // Use debounced auto-skip to prevent racing
          scheduleAutoSkip('format not supported');
        } else if (errorMessage === 'NetworkError' || errorCode === 2) {
          // Network/loading error
          set({ error: "Network error loading track" });
          toast.error("Network error - checking next track");
          // Use debounced auto-skip to prevent racing
          scheduleAutoSkip('network error');
        } else {
          // Other errors
          set({ error: "Playback error - trying next track" });
          toast.error("Playback issue - trying next track");
          console.log('🎵 Unknown audio error, auto-skipping:', { errorMessage, errorCode, error });
          // Use debounced auto-skip to prevent racing
          scheduleAutoSkip('unknown error');
        }
      }
    },

    pause: () => {
      const audio = initAudio();
      audio.pause();
    },

    next: async () => {
      // Prevent concurrent operations with double lock
      if (isNexting || isTransitioning) {
        console.log('🎵 Next already in progress or system transitioning, skipping');
        return;
      }
      
      isNexting = true;
      isTransitioning = true;
      
      try {
        // Clear any pending auto-skip timeouts
        if (autoSkipTimeout) {
          clearTimeout(autoSkipTimeout);
          autoSkipTimeout = null;
        }
        
        let { queue, index, lastGoal } = get();
        console.log('🎵 Next operation starting - current index:', index, 'queue length:', queue.length, 'lastGoal:', lastGoal);
        
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
        
        // If no more tracks in current queue, try to reload the last goal or load more trending
        const currentState = get();
        if (currentState.lastGoal) {
          console.log('🎵 Queue exhausted, reloading tracks for goal:', currentState.lastGoal);
          toast.info("Loading more tracks...");
          await get().playFromGoal(currentState.lastGoal);
          return;
        } else {
          // No goal set - this might be trending tracks, try to load more
          console.log('🎵 No goal set, attempting to load more trending tracks');
          toast.info("Loading more trending tracks...");
          try {
            const { fetchTrending } = await import('@/lib/api');
            const { tracks, error } = await fetchTrending(60, 50); // Get more trending tracks
            
            if (!error && tracks?.length) {
              // Format tracks for audio store
              const formattedTracks = tracks.map((track: any) => ({
                id: String(track.id),
                title: track.title || 'Untitled',
                artist: track.genre || 'Unknown Artist',
                duration: 0,
                storage_bucket: track.storage_bucket || 'audio',
                storage_key: track.storage_key,
                bpm: track.bpm,
                genre: track.genre
              }));
              
              // Add new tracks to queue and continue playing
              const { queue: currentQueue } = get();
              const newQueue = [...currentQueue, ...formattedTracks];
              set({ queue: newQueue });
              
              // Try to play the next track
              const nextIndex = index + 1;
              if (nextIndex < newQueue.length) {
                const success = await loadTrack(newQueue[nextIndex]);
                if (success) {
                  set({ index: nextIndex });
                  await get().play();
                  console.log('🎵 Successfully loaded more trending tracks');
                  return;
                }
              }
            }
          } catch (error) {
            console.error('Failed to load more trending tracks:', error);
          }
        }
        
        console.log('🎵 No more working tracks available');
        toast.error("No more tracks available. Please select a new category.");
        set({ isLoading: false, error: "No more tracks available" });
      } finally {
        isNexting = false;
        isTransitioning = false;
        console.log('🎵 Next operation completed');
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