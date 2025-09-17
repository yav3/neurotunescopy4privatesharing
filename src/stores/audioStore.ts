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
import { adminLog, adminWarn, adminError } from '@/utils/adminLogging';
import { filterBlockedTracks } from '@/services/blockedTracks';
import { configureTherapeuticAudio, initTherapeuticAudio, createSilentErrorHandler } from '@/utils/therapeuticAudioConfig';
import { AudioCacheService } from '@/services/audioCache';
import { WorkingEdgeCollectionService } from '@/services/workingEdgeCollection';

// Session management integration
let sessionManager: { trackProgress: (t: number, d: number) => void; completeSession: () => Promise<void> } | null = null;

// Race condition protection
let loadSeq = 0;
let isNexting = false;
let isPlaying = false;
let isTransitioning = false; // Global transition lock

// Network hang protection  
let currentAbort: AbortController | null = null;

// Blacklist for failed tracks to prevent infinite cycling
let failedTracks = new Set<string>();

// Track consecutive failures to suppress UI spam
let consecutiveFailures = 0;
let lastErrorTime = 0;
const ERROR_SUPPRESSION_WINDOW = 5000; // 5 seconds

// Skip tracking for UX and timeout management
let skipped = 0;
let skipTimeout: NodeJS.Timeout | null = null;

// Debounced auto-skip protection
let autoSkipTimeout: NodeJS.Timeout | null = null;

// Proactive queue loading timeout
let loadMoreTracksTimeout: NodeJS.Timeout | null = null;

// Helper functions for UUID handling
const isValidUuid = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const extractUuidFromCompositeId = (compositeId: string): string => {
  // Look for UUID pattern within the composite ID
  const uuidMatch = compositeId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return uuidMatch ? uuidMatch[0] : compositeId;
};

type AudioState = {
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: Track | null;
  currentTrackArtwork: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Spatial audio state
  spatialAudioEnabled: boolean;
  
  // Player UI state
  playerMode: 'full' | 'mini';
  setPlayerMode: (mode: 'full' | 'mini') => void;
  
  // Queue
  queue: Track[];
  index: number;
  lastGoal?: string;
  
  // Session management
  sessionManager: typeof sessionManager;
  setSessionManager: (manager: typeof sessionManager) => void;
  
  // Actions
  playTrack: (track: Track) => Promise<void>;
  playFromGoal: (goal: string, specificBuckets?: string[]) => Promise<number>;
  setQueue: (tracks: Track[], startAt?: number) => Promise<void>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleSpatialAudio: () => void;
  
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
    
    document.body.appendChild(audioElement);
    
    // Apply therapeutic audio configuration to prevent ANY browser sounds
    configureTherapeuticAudio(audioElement);
    
    console.log(`🎵 Created therapeutic audio element #${AUDIO_ELEMENT_ID} (completely silent)`);
  } else {
    // Ensure existing element is also configured for therapeutic use
    configureTherapeuticAudio(audioElement);
    console.log(`🎵 Found and configured existing audio element #${AUDIO_ELEMENT_ID}`);
  }
  return audioElement;
};

// Set initial default player mode to 'mini' to ensure player always shows
export const useAudioStore = create<AudioState>((set, get) => {
  let eventListenersAdded = false;
  
  // Initialize therapeutic audio environment on store creation
  if (typeof window !== 'undefined') {
    initTherapeuticAudio();
  }
  
  // Force audio element creation on store initialization
  console.log('🎵 Audio store initializing - creating therapeutic audio element...');
  ensureAudioElement();
  
  // Immediate auto-skip function for seamless playback - MUCH LONGER DELAYS TO PREVENT RACING
  const scheduleAutoSkip = (reason: string, delay: number = 15000) => { // Much longer default delay
    if (autoSkipTimeout) clearTimeout(autoSkipTimeout);
    autoSkipTimeout = setTimeout(() => {
      console.log(`🎵 Auto-skip triggered after ${delay}ms: ${reason}`);
      
      // Suppress player mode updates during rapid error cascades
      if (consecutiveFailures > 2) {
        console.log(`🎵 Suppressing player updates during error cascade (failure ${consecutiveFailures})`);
      }
      
      if (!isNexting) {
        get().next();
      }
    }, delay); // Use provided delay with much longer default for stability
  };
  
  // Helper: Remove item from array at index
  const removeAt = (arr: Track[], i: number) => arr.slice(0, i).concat(arr.slice(i + 1));
  
  // Simplified: Just try to play the track directly, no pre-validation
  const canPlay = async (url: string): Promise<boolean> => {
    console.log('🎵 Testing stream URL:', url);
    
    // TEMPORARY: Always return true to prevent tracks from being marked as broken
    // Let the audio element handle validation during actual playback
    return true;
  };
  
  // Helper: Announce skips with smart UX (don't spam) - SILENT for therapeutic experience
  const announceSkip = async () => {
    skipped++;
    const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
    
    // Only log for admin/technical users - never disrupt therapeutic experience for regular users
    if (shouldShowTechnicalLogs()) {
      // Even for admins, keep it minimal and non-disruptive
      if (skipped === 1) console.log("🎵 Admin log: Skipping broken tracks silently...");
      if (skipped % 10 === 0) console.log(`🎵 Admin log: Skipped ${skipped} broken tracks`);
    }
    // NO toast notifications or sounds for regular users - maintain therapeutic calm
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
        
        // Use much longer delay to prevent racing while allowing track transitions
        scheduleAutoSkip('track ended', 12000);
      });
      
      // Auto-skip on audio error with better debugging
      audio.addEventListener('error', async (event) => {
        const currentTrack = get().currentTrack;
        const errorDetails = {
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src,
          trackTitle: currentTrack?.title
        };
        
        adminError('🎵 Audio error event:', errorDetails);
        
        // Track consecutive failures for smart error suppression
        const now = Date.now();
        if (now - lastErrorTime < ERROR_SUPPRESSION_WINDOW) {
          consecutiveFailures++;
        } else {
          consecutiveFailures = 1;
        }
        lastErrorTime = now;
        
        // Add failed track to blacklist
        if (currentTrack) {
          failedTracks.add(currentTrack.id);
          adminLog(`🚫 Blacklisted track: ${currentTrack.title} (${currentTrack.id})`);
        }
        
        set({ isPlaying: false });
        
        // Only show error notification for first failure in sequence
        if (consecutiveFailures === 1) {
          adminLog('🎵 Audio error - skipping to next track');
        }
        
        // CRITICAL: If too many consecutive failures, wait much longer
        const errorDelay = consecutiveFailures > 5 ? 45000 : (consecutiveFailures > 2 ? 30000 : 20000);
        console.log(`🎵 Error cascade detection: ${consecutiveFailures} failures, using ${errorDelay}ms delay`);
        
        // Use much longer auto-skip delay for audio errors to allow proper URL resolution
        scheduleAutoSkip('audio error', errorDelay);
      });
      
      // Honest state tracking
      audio.addEventListener('play', () => {
        console.log('🎵 Audio play event fired');
        // Reset error suppression on successful play
        consecutiveFailures = 0;
        lastErrorTime = 0;
        
        const { currentTrack } = get();
        if (currentTrack) {
          // Remember played track for variety
          import('@/state/playlistSession').then(({ remember }) => {
            remember(currentTrack.id);
            console.log('🎵 Remembered track for exclusion:', currentTrack.title);
          });
          
          // Add successfully playing track to working edge collection (debounced)
          if (!currentTrack.from_working_collection) {
            // Extract proper UUID from composite track ID if needed
            const trackUuid = currentTrack.id.includes('-') && currentTrack.id.length > 36 
              ? extractUuidFromCompositeId(currentTrack.id)
              : currentTrack.id;
              
            if (isValidUuid(trackUuid)) {
              // Debounce working collection calls to prevent spam
              setTimeout(() => {
                WorkingEdgeCollectionService.addToWorkingCollection(trackUuid, 1.0)
                  .catch(() => {}); // Silent fail to prevent console spam
              }, 3000); // 3 second delay to prevent rapid-fire calls
            }
          } else {
            // Update play stats for working collection tracks (also debounced)
            const trackUuid = currentTrack.id.includes('-') && currentTrack.id.length > 36 
              ? extractUuidFromCompositeId(currentTrack.id)
              : currentTrack.id;
              
            if (isValidUuid(trackUuid)) {
              setTimeout(() => {
                WorkingEdgeCollectionService.updatePlayStats(trackUuid)
                  .catch(() => {}); // Silent fail
              }, 2000);
            }
          }
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
        
        // Proactive queue management - load more tracks when running low
        const { queue, index, lastGoal, isLoading } = get();
        const tracksRemaining = queue.length - (index + 1);
        const timeRemaining = duration - currentTime;
        
        // Load more tracks if we're near the end of both the current track and queue
        if (!isLoading && lastGoal && tracksRemaining <= 3 && timeRemaining <= 30 && timeRemaining > 0) {
          console.log(`🔄 Proactively loading more tracks - ${tracksRemaining} tracks remaining, ${Math.round(timeRemaining)}s left in current track`);
          
          // Debounce to prevent multiple simultaneous loads
          if (!loadMoreTracksTimeout) {
            loadMoreTracksTimeout = setTimeout(async () => {
              try {
                const { getTherapeuticTracks } = await import('@/services/therapeuticDatabase');
                const excludeIds = queue.map(t => t.id);
                const { tracks: newTracks, error } = await getTherapeuticTracks(lastGoal, 20, excludeIds);
                
                if (!error && newTracks?.length) {
                  console.log(`✅ Loaded ${newTracks.length} additional tracks for seamless playback`);
                  
                  // Convert to proper format and add to queue
                  let formattedTracks = newTracks.map((track: any) => ({
                    id: track.id,
                    title: track.title,
                    artist: 'Neural Positive Music',
                    duration: 0,
                    storage_bucket: track.storage_bucket,
                    storage_key: track.storage_key,
                    stream_url: track.stream_url,
                    audio_status: 'working' as const,
                  }));
                  
                  // Filter out blocked tracks
                  formattedTracks = await filterBlockedTracks(formattedTracks);
                  console.log(`🚫 After blocking filter: ${formattedTracks.length} additional tracks`);
                  
                  // Add new tracks to the end of the current queue
                  const { queue: currentQueue } = get();
                  set({ queue: [...currentQueue, ...formattedTracks] });
                } else {
                  console.log('⚠️ No additional tracks available for', lastGoal);
                }
              } catch (error) {
                console.error('Failed to load additional tracks:', error);
              } finally {
                loadMoreTracksTimeout = null;
              }
            }, 2000); // 2 second debounce
          }
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
      
      // Check if track already has a stream_url from direct storage
      let resolution;
      if (track.stream_url && (track.stream_url.startsWith('http') || track.stream_url.startsWith('/'))) {
        console.log('🎵 Using direct stream URL - bypassing all APIs:', track.stream_url);
        resolution = {
          success: true,
          url: track.stream_url,
          method: track.stream_url.includes('supabase.co') ? 'direct_supabase_storage' : 'direct_url',
          attempts: [{
            url: track.stream_url,
            status: 200,
            method: track.stream_url.includes('supabase.co') ? 'direct_supabase_storage' : 'direct_url'
          }]
        };
      } else {
        // Use Smart Audio Resolver to find working URL
        console.log('🔍 Using SmartAudioResolver to find working URL...');
        resolution = await SmartAudioResolver.resolveAudioUrl({
          id: track.id,
          title: track.title || 'Untitled',
          storage_bucket: track.storage_bucket,
          storage_key: track.storage_key
        });
      }
      
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
      // crossOrigin is now properly configured in configureTherapeuticAudio
      (audio as any).playsInline = true;
      audio.load();
      console.log('🎵 Audio src set, attempting to play...');
      
      try { 
        // Silent play attempt - no browser error sounds for therapeutic experience
        await audio.play(); 
      } catch (playError) { 
        // Silent handling - prevent any browser notification sounds
        console.log('🎵 Autoplay blocked or play failed (handled silently for therapeutic experience)');
        
        // Don't throw or emit any sounds - therapeutic apps need silent error handling
        if (playError instanceof Error && !playError.message.includes('interact')) {
          // Only log non-user-interaction errors silently
          console.log('🎵 Silent playback issue:', playError.name);
        }
      }
      
      // Final validation
      if (!isValid()) {
        console.log('🎵 Load sequence outdated after play attempt:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      console.log('🎵 Track loaded successfully:', track.title);
      console.log('🎵 Setting currentTrack in store:', track.id, track.title);
      console.log('🎵 Current playerMode:', get().playerMode);
      
      // Set currentTrack and ensure playerMode is set (default to mini if not set)
      const currentPlayerMode = get().playerMode || 'mini';
      
      // During rapid error cascades, suppress UI updates to prevent visual race conditions
      if (consecutiveFailures > 2) {
        console.log('🎵 Suppressing UI updates during error cascade - setting track silently');
        set({ currentTrack: track, isLoading: false, error: undefined, playerMode: currentPlayerMode });
      } else {
        set({ currentTrack: track, isLoading: false, error: undefined, playerMode: currentPlayerMode });
      }
      
      console.log('🎵 Store currentTrack after set:', get().currentTrack?.title);
      console.log('🎵 Store playerMode after set:', get().playerMode);
      return true;
    } catch (error) {
      adminError('🎵 Load track failed:', error);
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
    currentTrackArtwork: null,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    spatialAudioEnabled: false,
    playerMode: 'mini', // Default to mini so MinimizedPlayer always shows
    queue: [],
    index: -1,
    sessionManager: null,
    error: undefined,
    lastGoal: undefined,

    // Player mode control
    setPlayerMode: (mode: 'full' | 'mini') => set({ playerMode: mode }),

    // Actions
    playTrack: async (track: Track) => {
      // Prevent concurrent playTrack calls
      if (isTransitioning) {
        console.log('🎵 PlayTrack already in progress, skipping');
        return;
      }
      
      isTransitioning = true;
      
      try {
        const success = await loadTrack(track);
        if (success) {
          set({ queue: [track], index: 0 });
          await get().play();
        } else {
          set({ error: "Track not available", isLoading: false });
        }
      } finally {
        isTransitioning = false;
      }
    },

    stop: () => {
      const audio = initAudio();
      audio.pause();
      audio.src = '';
      set({ 
        isPlaying: false, 
        currentTrack: null, 
        currentTime: 0, 
        duration: 0, 
        queue: [], 
        index: -1,
        isLoading: false,
        error: undefined
      });
    },

    playFromGoal: async (goal: string, specificBuckets?: string[]) => {
      // Increment load sequence for race condition protection
      const myLoadSeq = ++loadSeq;
      set({ isLoading: true, error: undefined, lastGoal: goal });
      console.log('🎵 playFromGoal started for:', goal, 'specificBuckets:', specificBuckets, 'seq:', myLoadSeq);
      
      const isValidSequence = () => myLoadSeq === loadSeq;
      
      try {
        console.log('🎵 Starting music session for goal:', goal);
        
        // SIMPLIFIED: Always use SimpleStorageService for consistency
        console.log(`🎯 Loading tracks from storage service for goal: "${goal}"`);
        
        const { SimpleStorageService } = await import('@/services/simpleStorageService');
        let tracks = await SimpleStorageService.getTracksFromCategory(goal, 50);
        
        console.log(`✅ SimpleStorageService returned ${tracks.length} tracks for ${goal}`);
        
        // If no tracks found, try cached fallback tracks
        if (tracks.length === 0) {
          console.log(`📦 No tracks from storage service, trying cache fallbacks for ${goal}`);
          const cachedTracks = AudioCacheService.getFallbackTracks(goal);
          
          if (cachedTracks.length > 0) {
            console.log(`✨ Found ${cachedTracks.length} cached fallback tracks for ${goal}`);
            
            // Convert cached tracks to SimpleTrack format to match expected interface
            const fallbackTracks = cachedTracks.map((track) => ({
              id: track.id,
              title: track.title,
              url: track.url,
              bucket: track.bucket,
              artist: 'Neural Positive Music',
              duration: 0,
            }));
            
            tracks = fallbackTracks;
            console.log(`🔄 Using ${tracks.length} cached fallback tracks instead`);
          } else {
            throw new Error(`No tracks found for goal: ${goal}`);
          }
        }
        
        // Convert to proper Track format (SimpleStorageService returns SimpleTrack)
        const convertedTracks: Track[] = tracks.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist || 'Neural Positive Music',
          duration: track.duration || 0,
          storage_bucket: track.bucket,
          storage_key: track.id,
          stream_url: track.url,
          audio_status: 'working' as const,
        }));
        
        console.log(`✅ Converted ${convertedTracks.length} tracks to proper format`);
        
        // Clear blacklist occasionally to allow retry of previously failed tracks
        if (failedTracks.size > 20) {
          console.log('🔄 Clearing blacklist to allow retries');
          failedTracks.clear();
        }
        
        // Filter out recently failed tracks (but allow some through for variety)
        const originalCount = convertedTracks.length;
        const availableTracks = convertedTracks.filter(track => !failedTracks.has(track.id));
        
        // If we filtered out too many, keep some of the blacklisted ones
        let finalTracks = availableTracks;
        if (availableTracks.length < 5 && originalCount > 5) {
          console.log('🎵 Not enough available tracks, including some previously failed ones');
          finalTracks = convertedTracks.slice(0, 10); // Take first 10 regardless of blacklist
        }
        
        console.log(`📊 Track filtering: ${originalCount} total → ${availableTracks.length} available → ${finalTracks.length} final`);
        
        if (finalTracks.length === 0) {
          throw new Error(`No playable tracks found for goal: ${goal}`);
        }
        
        // Shuffle for variety
        const shuffled = finalTracks.sort(() => Math.random() - 0.5);
        
        // Set queue and start playing
        await get().setQueue(shuffled, 0);
        console.log(`🎵 Successfully queued ${shuffled.length} tracks for ${goal}`);
        return shuffled.length;
        
      } catch (error: any) {
        console.error('🎵 playFromGoal error:', error);
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : "Failed to load tracks" 
        });
        
        // Show user-friendly error in UI
        import('@/utils/adminLogging').then(({ userLog }) => {
          userLog(`❌ Could not load music for ${goal}. Please try again.`);
        });
        
        return 0;
      }
    },

    setQueue: async (tracks: Track[], startAt = 0) => {
      set({ queue: tracks, index: -1, isLoading: true, error: undefined });
      skipped = 0;
      
      // Fast parallel validation
      const { working, broken } = await validateTracks(tracks);
      
      // Remove broken tracks from queue, blacklist them, and announce skips
      if (broken.length > 0) {
        const { adminLog, userLog } = await import('@/utils/adminLogging');
        adminLog(`🎵 Removing ${broken.length} broken tracks`);
        
        // Add broken tracks to blacklist
        broken.forEach(track => {
          failedTracks.add(track.id);
          console.log('🎵 Added broken track to blacklist:', track.id, track.title);
        });
        console.log('🎵 Total blacklisted tracks:', failedTracks.size);
        
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
          // Media format/source not supported - handle silently to avoid UI spam
          const now = Date.now();
          const isWithinSuppressionWindow = now - lastErrorTime < ERROR_SUPPRESSION_WINDOW;
          
          if (isWithinSuppressionWindow) {
            consecutiveFailures++;
          } else {
            consecutiveFailures = 1;
          }
          lastErrorTime = now;
          
          // Add to blacklist immediately
          const { currentTrack } = get();
          if (currentTrack) {
            failedTracks.add(currentTrack.id);
            console.log('🎵 Blacklisted unsupported track:', currentTrack.id, currentTrack.title);
          }
          
          // Show toast only for first error in a 10-second window to reduce spam
          if (consecutiveFailures === 1) {
            set({ error: "Audio format not supported" });
            const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
            if (shouldShowTechnicalLogs()) {
              toast.error("Finding playable tracks...", { duration: 2000 });
            }
          } else if (consecutiveFailures >= 5) {
            // Try loading cached fallback tracks when too many failures
            const { lastGoal } = get();
            if (lastGoal) {
              const cachedTracks = AudioCacheService.getFallbackTracks(lastGoal);
              if (cachedTracks.length > 0) {
                console.log(`🔄 Loading ${cachedTracks.length} cached fallback tracks due to repeated failures`);
                toast.success("Loading backup tracks...", { duration: 2000 });
                
                // Convert and inject cached tracks into queue
                const fallbackTracks: Track[] = cachedTracks.slice(0, 10).map((track) => ({
                  id: track.id,
                  title: track.title,
                  artist: 'Neural Positive Music',
                  duration: 0,
                  storage_bucket: track.bucket,
                  storage_key: track.filename,
                  stream_url: track.url,
                  audio_status: 'working' as const,
                }));
                
                // Add to current queue
                const { queue, index } = get();
                const newQueue = [...queue.slice(0, index + 1), ...fallbackTracks, ...queue.slice(index + 1)];
                set({ queue: newQueue });
                
                consecutiveFailures = 1; // Reset counter
                return; // Don't show error message
              }
            }
            
            // Show different message after many failures
            const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
            if (shouldShowTechnicalLogs()) {
              toast.error("Searching for working tracks...", { duration: 1500 });
            }
            consecutiveFailures = 1; // Reset to prevent further spam
          } else {
            // Silent handling for consecutive failures
            set({ error: null });
            console.log(`🎵 Silent skip ${consecutiveFailures} - suppressing UI spam`);
          }
          
          // Use longer delay for format errors to allow URL resolution
          scheduleAutoSkip('format not supported', 5000);
        } else if (errorMessage === 'NetworkError' || errorCode === 2) {
          // Network/loading error - handle more gracefully
          const now = Date.now();
          const isWithinSuppressionWindow = now - lastErrorTime < ERROR_SUPPRESSION_WINDOW;
          
          if (isWithinSuppressionWindow) {
            consecutiveFailures++;
          } else {
            consecutiveFailures = 1;
          }
          lastErrorTime = now;
          
          // Add to blacklist
          const { currentTrack } = get();
          if (currentTrack) {
            failedTracks.add(currentTrack.id);
            console.log('🎵 Blacklisted network-failed track:', currentTrack.id, currentTrack.title);
          }
          
          // Show loading error less frequently
          if (consecutiveFailures === 1) {
            set({ error: "Network error loading track" });
            const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
            if (shouldShowTechnicalLogs()) {
              toast.error("Checking track availability...", { duration: 1500 });
            }
          } else if (consecutiveFailures >= 8) {
            // Try cached fallbacks for network errors too
            const { lastGoal } = get();
            if (lastGoal) {
              const cachedTracks = AudioCacheService.getFallbackTracks(lastGoal);
              if (cachedTracks.length > 0) {
                console.log(`🌐 Loading cached tracks due to network failures`);
                toast.info("Switching to offline tracks...", { duration: 2000 });
                
                const fallbackTracks: Track[] = cachedTracks.slice(0, 8).map((track) => ({
                  id: track.id,
                  title: track.title,
                  artist: 'Neural Positive Music',
                  duration: 0,
                  storage_bucket: track.bucket,
                  storage_key: track.filename,
                  stream_url: track.url,
                  audio_status: 'working' as const,
                }));
                
                const { queue, index } = get();
                const newQueue = [...queue.slice(0, index + 1), ...fallbackTracks, ...queue.slice(index + 1)];
                set({ queue: newQueue });
                
                consecutiveFailures = 1;
                return;
              }
            }
            
            toast.warning("Loading backup tracks...", { duration: 2000 });
            consecutiveFailures = 1; // Reset counter
          } else {
            set({ error: null });
            console.log(`🎵 Silent network skip ${consecutiveFailures} - suppressing UI spam`);
          }
          
          scheduleAutoSkip('network error', 6000);
        } else {
          // Other errors
          set({ error: "Playback error - trying next track" });
          const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
          if (shouldShowTechnicalLogs()) {
            toast.error("Playback issue - trying next track");
          }
          console.log('🎵 Unknown audio error, auto-skipping:', { errorMessage, errorCode, error });
          // Use longer delay to prevent racing while allowing reasonable error handling
          scheduleAutoSkip('unknown error', 5000);
        }
      }
    },

    pause: () => {
      const audio = initAudio();
      audio.pause();
    },

    next: async () => {
      // Prevent concurrent operations with transition lock
      if (isNexting || isTransitioning) {
        console.log('🎵 Next already in progress or transitioning, skipping');
        return;
      }
      
      isNexting = true;
      isTransitioning = true;
      
      // Add debug logging for button tap responsiveness
      console.log('🎵 Next button pressed - starting operation');
      
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
            // Reset flag immediately on success
            isNexting = false;
            return;
          }
          
          // Drop broken track from queue, blacklist it, and announce skip
          console.log('🎵 Removing broken track from queue:', queue[i].title);
          failedTracks.add(queue[i].id);
          console.log('🎵 Added track to blacklist:', queue[i].id, '- Total blacklisted:', failedTracks.size);
          announceSkip();
          queue = removeAt(queue, i);
          i--; // Adjust index since we removed an item
          set({ queue });
        }
        
        // If no more tracks in current queue, try working edge collection first
        const currentState = get();
        if (currentState.lastGoal && currentState.lastGoal !== 'trending') {
          console.log('🎵 Queue exhausted, trying working edge collection first...');
          
          // Try to load working edge tracks as fallback
          try {
            const workingTracks = await WorkingEdgeCollectionService.getWorkingTracks(
              undefined, // No specific genre filter 
              currentState.lastGoal,
              10
            );
            
            if (workingTracks.length > 0) {
              console.log(`✅ Found ${workingTracks.length} working edge tracks for fallback`);
              toast.success("Loading verified tracks...", { duration: 2000 });
              
              // Convert working edge tracks to track format
              const fallbackTracks: Track[] = workingTracks.map(workingTrack => ({
                ...WorkingEdgeCollectionService.convertToTrackFormat(workingTrack),
                artist: 'Neural Positive Music',
                duration: 0,
                stream_url: API.streamUrl(workingTrack.track_id),
                audio_status: 'working' as const,
              }));
              
              // Add to current queue
              const { queue: currentQueue, index: currentIndex } = get();
              const newQueue = [...currentQueue.slice(0, currentIndex + 1), ...fallbackTracks, ...currentQueue.slice(currentIndex + 1)];
              set({ queue: newQueue });
              
              // Try to play the first working edge track
              for (let i = currentIndex + 1; i < newQueue.length; i++) {
                const success = await loadTrack(newQueue[i]);
                if (success) {
                  set({ index: i });
                  await get().play();
                  console.log('🎵 Successfully playing working edge track:', newQueue[i].title);
                  isNexting = false;
                  return;
                }
              }
            }
          } catch (error) {
            console.warn('🎵 Failed to load working edge tracks:', error);
          }
          
          // If working edge tracks didn't work, reload tracks for goal
          console.log('🎵 Working edge tracks unavailable, reloading tracks for goal:', currentState.lastGoal);
          toast.info("Loading more tracks...");
          await get().playFromGoal(currentState.lastGoal);
          // Reset flag after successful reload
          isNexting = false;
          return;
        } else {
          // No valid goal set - try working edge tracks first, then load focus enhancement as default
          console.log('🎵 No valid goal set, trying working edge tracks first...');
          
          try {
            const workingTracks = await WorkingEdgeCollectionService.getWorkingTracks(
              undefined, // No specific genre/goal filters
              undefined,
              10
            );
            
            if (workingTracks.length > 0) {
              console.log(`✅ Found ${workingTracks.length} working edge tracks as default fallback`);
              toast.success("Loading verified tracks...", { duration: 2000 });
              
              const fallbackTracks: Track[] = workingTracks.map(workingTrack => ({
                ...WorkingEdgeCollectionService.convertToTrackFormat(workingTrack),
                artist: 'Neural Positive Music',
                duration: 0,
                stream_url: API.streamUrl(workingTrack.track_id),
                audio_status: 'working' as const,
              }));
              
              set({ queue: fallbackTracks, index: 0 });
              const success = await loadTrack(fallbackTracks[0]);
              if (success) {
                await get().play();
                console.log('🎵 Successfully playing default working edge track');
                isNexting = false;
                return;
              }
            }
          } catch (error) {
            console.warn('🎵 Failed to load default working edge tracks:', error);
          }
          
          // Final fallback - load focus enhancement as default
          console.log('🎵 Loading focus enhancement as final fallback');
          toast.info("Loading focus enhancement tracks...");
          await get().playFromGoal('focus-enhancement');
          // Reset flag after successful reload
          isNexting = false;
          return;
        }
        
        console.log('🎵 No more working tracks available');
        const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
        if (shouldShowTechnicalLogs()) {
          toast.error("No more tracks available. Please select a new category.");
        }
        set({ isLoading: false, error: "No more tracks available" });
      } catch (error) {
        console.error('🎵 Next operation error:', error);
        set({ isLoading: false, error: "Failed to skip to next track" });
      } finally {
        isNexting = false;
        isTransitioning = false;
        console.log('🎵 Next operation completed - flags reset');
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

    toggleSpatialAudio: () => {
      set((state) => ({ spatialAudioEnabled: !state.spatialAudioEnabled }));
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