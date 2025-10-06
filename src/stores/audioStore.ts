import { create } from "zustand";
import { streamUrl } from "@/lib/api";
import { API } from "@/lib/api";
import { SmartAudioResolver } from '@/utils/smartAudioResolver';
import type { Track } from "@/types";
import { TherapeuticGoalMapper } from '@/utils/therapeuticMapper';
import { filterTracksForGoal, sortByTherapeuticEffectiveness } from '@/utils/therapeuticFiltering';
import type { GoalSlug } from '@/config/therapeuticGoals';
import { AUDIO_ELEMENT_ID, getAudioElementId } from '@/player/constants';
import { toast } from "sonner";
import { adminLog, adminWarn, adminError } from '@/utils/adminLogging';
import { filterBlockedTracks } from '@/services/blockedTracks';
import { configureTherapeuticAudio, initTherapeuticAudio, createSilentErrorHandler } from '@/utils/therapeuticAudioConfig';
import { ScreenWakeLock } from '@/utils/screenWakeLock';
import { MediaSessionService } from '@/services/mediaSession';
import { AudioCacheService } from '@/services/audioCache';
import { WorkingEdgeCollectionService } from '@/services/workingEdgeCollection';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseService } from '@/services/supabase';

// Session tracking data
interface ListeningSession {
  sessionId: string;
  startTime: Date;
  tracksPlayed: Track[];
  totalDuration: number;
  skipCount: number;
  dominantGenres: string[];
}

let currentSession: ListeningSession | null = null;

// Session tracking functions
const startListeningSession = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Don't track sessions for anonymous users
    
    currentSession = {
      sessionId: crypto.randomUUID(),
      startTime: new Date(),
      tracksPlayed: [],
      totalDuration: 0,
      skipCount: 0,
      dominantGenres: []
    };
    
    console.log('🎵 Started new listening session:', currentSession.sessionId);
  } catch (error) {
    console.error('Failed to start listening session:', error);
  }
};

const trackPlayedTrack = (track: Track, duration: number, wasSkipped: boolean = false) => {
  if (!currentSession) return;
  
  currentSession.tracksPlayed.push(track);
  currentSession.totalDuration += duration;
  
  if (wasSkipped) {
    currentSession.skipCount++;
  }
  
  // Add genre to dominant genres
  if (track.genre && !currentSession.dominantGenres.includes(track.genre)) {
    currentSession.dominantGenres.push(track.genre);
  }
};

const completeListeningSession = async () => {
  if (!currentSession) return;
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const sessionDurationMinutes = Math.floor(currentSession.totalDuration / 60);
    const skipRate = currentSession.tracksPlayed.length > 0 
      ? currentSession.skipCount / currentSession.tracksPlayed.length 
      : 0;
    
    // Only save sessions with meaningful data
    if (sessionDurationMinutes > 0 || currentSession.tracksPlayed.length > 0) {
      // Map genre to frequency band
      const mapGenreToFrequencyBand = (genre: string): 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' => {
        const genreMap: Record<string, 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'> = {
          'classical': 'delta',
          'ambient': 'theta', 
          'jazz': 'alpha',
          'rock': 'beta',
          'electronic': 'gamma'
        };
        return genreMap[genre.toLowerCase()] || 'alpha';
      };
      
      const frequencyBand = mapGenreToFrequencyBand(currentSession.dominantGenres[0] || 'alpha');
      
      console.log('📊 About to track therapeutic session:', {
        trackId: currentSession.tracksPlayed[0]?.id?.toString() || '',
        totalDuration: currentSession.totalDuration,
        frequencyBand,
        userId: user.id,
        tracksPlayedCount: currentSession.tracksPlayed.length,
        skipCount: currentSession.skipCount,
        dominantGenres: currentSession.dominantGenres
      });

      await SupabaseService.trackTherapeuticSession(
        currentSession.tracksPlayed[0]?.id?.toString() || '',
        currentSession.totalDuration,
        frequencyBand,
        user.id,
        {
          tracksPlayed: currentSession.tracksPlayed,
          skipCount: currentSession.skipCount,
          dominantGenres: currentSession.dominantGenres,
          totalDuration: currentSession.totalDuration
        }
      );
      
      console.log('✅ Successfully tracked therapeutic session');
      console.log('🎵 Completed listening session:', {
        sessionId: currentSession.sessionId,
        duration: sessionDurationMinutes,
        tracks: currentSession.tracksPlayed.length,
        skipRate: Math.round(skipRate * 100)
      });
    }
    
    currentSession = null;
  } catch (error) {
    console.error('Failed to complete listening session:', error);
    currentSession = null;
  }
};

// Session management integration
let sessionManager: { trackProgress: (t: number, d: number) => void; completeSession: () => Promise<void> } | null = null;

// Race condition protection
let loadSeq = 0;
let isNexting = false;
let isPlaying = false;
let isTransitioning = false; // Global transition lock
let lastNextCall = 0;
const MIN_NEXT_INTERVAL = 100; // Reduced for better responsiveness

// Recovery mechanism to reset stuck flags
const resetTransitionFlags = () => {
  if (isNexting || isTransitioning) {
    console.log('🔧 Resetting stuck transition flags');
    isNexting = false;
    isTransitioning = false;
  }
};

// Auto-reset stuck flags after 3 seconds
setInterval(() => {
  const now = Date.now();
  if ((isNexting || isTransitioning) && (now - lastNextCall > 3000)) {
    console.warn('🔧 Auto-resetting stuck transition flags after 3s timeout');
    resetTransitionFlags();
  }
}, 1000);

// Network hang protection  
let currentAbort: AbortController | null = null;

// Track failure counts instead of permanent blacklist
let trackFailureCounts = new Map<string, number>();
const MAX_TRACK_FAILURES = 8;

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
  play: () => Promise<void>;
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
  
  // Always clean up ALL other audio elements to prevent multiple playback
  const currentElementId = getAudioElementId();
  document.querySelectorAll("audio").forEach(el => {
    if (el.id !== currentElementId) {
      console.warn(`[audio] Stopping and removing audio element: ${el.id}`);
      el.pause();
      el.currentTime = 0;
      el.src = '';
      el.remove();
    }
  });
  
  audioElement = document.getElementById(currentElementId) as HTMLAudioElement;
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = currentElementId;
    console.log(`🎵 Creating new user-specific audio element: ${currentElementId}`);
    
    document.body.appendChild(audioElement);
    
    // Apply therapeutic audio configuration to prevent ANY browser sounds
    configureTherapeuticAudio(audioElement);
    
    // Add crossOrigin attribute to prevent CORS issues
    audioElement.crossOrigin = 'anonymous';
    
    console.log(`🎵 Created therapeutic audio element #${currentElementId} (user-isolated and silent)`);
  } else {
    // Ensure existing element is also configured for therapeutic use
    configureTherapeuticAudio(audioElement);
    
    // Ensure crossOrigin is set on existing elements too  
    if (!audioElement.crossOrigin) {
      audioElement.crossOrigin = 'anonymous';
      console.log(`🎵 Added crossOrigin to existing audio element`);
    }
    
    console.log(`🎵 Found and configured existing user-specific audio element #${currentElementId}`);
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
  const initialAudio = ensureAudioElement();
  
  // Sync initial state with audio element
  setTimeout(() => {
    const audio = document.getElementById(getAudioElementId()) as HTMLAudioElement;
    if (audio) {
      const actuallyPlaying = !audio.paused && !audio.ended && audio.currentTime > 0;
      if (actuallyPlaying) {
        console.log('🔧 Initial state sync: audio is playing, updating store');
        set({ isPlaying: true });
      }
    }
  }, 100);
  
  // Immediate auto-skip function for seamless playback
  const scheduleAutoSkip = (reason: string, delay: number = 3000) => {
    if (autoSkipTimeout) clearTimeout(autoSkipTimeout);
    autoSkipTimeout = setTimeout(() => {
      console.log(`🎵 Auto-skip triggered after ${delay}ms: ${reason}`);
      
      // Only auto-skip if we have multiple tracks in queue
      const { queue, index } = get();
      if (queue.length <= 1) {
        console.log('🎵 Only one track in queue, not auto-skipping');
        return;
      }
      
      // Critical fix: Check all transition flags before proceeding
      if (isNexting || isTransitioning) {
        console.log('🎵 Auto-skip blocked - transition already in progress');
        return;
      }
      
      // Rate limiting check
      const now = Date.now();
      if (now - lastNextCall < MIN_NEXT_INTERVAL) {
        console.log('🎵 Auto-skip rate limited - too frequent');
        return;
      }
      
      console.log('🎵 Auto-skip proceeding with next()');
      get().next();
    }, delay);
  };

  // Background queue management - automatically fetch more tracks when queue gets low
  const maintainQueueBuffer = async () => {
    const { queue, index, lastGoal, isLoading } = get();
    const remainingTracks = queue.length - index - 1;
    
    // Don't fetch if already loading or no goal set
    if (isLoading || !lastGoal) return;
    
    // Fetch more tracks when we have 8 or fewer remaining
    if (remainingTracks <= 8) {
      console.log('🎵 Background: Queue buffer low, fetching more tracks');
      
      try {
        const excludeIds = queue.map(t => t.id.toString());
        const { tracks: newTracks } = await API.playlist(lastGoal as GoalSlug, 25, 0, excludeIds);
        
        if (newTracks && newTracks.length > 0) {
          const convertedTracks: Track[] = newTracks.map((track: any) => ({
            id: track.id,
            title: track.title,
            artist: track.artist || 'Neural Positive Music',
            duration: track.duration || 0,
            storage_bucket: track.storage_bucket || 'audio',
            storage_key: track.storage_key,
            stream_url: track.stream_url,
            audio_status: track.audio_status || 'working',
          }));
          
          const newQueue = [...queue, ...convertedTracks];
          set({ queue: newQueue });
          console.log('🎵 Background: Added', convertedTracks.length, 'tracks to queue, total:', newQueue.length);
        }
      } catch (error) {
        console.error('🎵 Background: Failed to fetch more tracks:', error);
      }
    }
  };

  // Start background queue monitoring
  if (typeof window !== 'undefined') {
    const queueMonitorInterval = setInterval(maintainQueueBuffer, 15000); // Check every 15 seconds
    
    // Only cleanup interval on actual page unload, not navigation
    window.addEventListener('beforeunload', () => {
      clearInterval(queueMonitorInterval);
      // Complete session on actual page unload
      if (sessionManager) {
        sessionManager.completeSession();
      }
      completeListeningSession();
    });
    
    // Preserve playback across route changes by preventing pagehide cleanup
    window.addEventListener('pagehide', (event) => {
      if (event.persisted) {
        // Page is being cached (back/forward), don't cleanup
        console.log('🎵 Page cached - preserving audio playback');
      } else {
        // Page is actually being unloaded
        console.log('🎵 Page unloaded - completing session');
        if (sessionManager) {
          sessionManager.completeSession();
        }
        completeListeningSession();
      }
    });
  }
  
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
    
    // Always clean up ALL extra audio elements to prevent simultaneous playback
    const allAudioElements = document.querySelectorAll('audio');
    if (allAudioElements.length > 1) {
      console.warn('🚨 Multiple audio elements detected!', allAudioElements.length);
      const currentElementId = getAudioElementId();
      allAudioElements.forEach((el, i) => {
        if (el.id !== currentElementId) {
          console.warn('🗑️ Removing extra audio element:', el.id || `unnamed-${i}`);
          el.pause();
          el.src = '';
          el.remove();
        }
      });
    }
    
    // Critical fix: Only add event listeners once per audio element
    if (!eventListenersAdded) {
      console.log('🎵 Adding event listeners to audio element (one time only)');
      
      // Mark as added immediately to prevent race conditions
      eventListenersAdded = true;
      // Auto-next on track end
      audio.addEventListener('ended', async () => {
        console.log('🎵 Audio ended - scheduling auto-next');
        set({ isPlaying: false });
        
        // Ensure no other audio elements are playing
        document.querySelectorAll('audio').forEach(el => {
          if (el !== audio && !el.paused) {
            console.warn('🚨 Found another playing audio element, stopping it:', el.id || 'unnamed');
            el.pause();
          }
        });
        
        // Auto-advance to next track when current track ends (continuous play)
        // The next() function will handle queue refilling and session completion
        if (!isNexting) {
          console.log('🎵 Track ended naturally, advancing to next track');
          get().next();
        }
      });
      
      // Auto-skip on audio error with better debugging and session refresh
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
        
        // Check if this might be an authentication error
        const isAuthError = audio.error?.code === 4 || // MEDIA_ELEMENT_ERROR: MEDIA_ERR_SRC_NOT_SUPPORTED (often 403/401)
                           audio.networkState === 3;    // NETWORK_NO_SOURCE (network failure)
        
        if (isAuthError && currentTrack) {
          adminLog('🔐 Potential auth error detected, attempting session refresh...');
          
          try {
            // Try to refresh the session
            const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (session && !refreshError) {
              adminLog('✅ Session refreshed successfully, retrying track...');
              
              // Reset failure count for this track since it was an auth issue
              trackFailureCounts.delete(currentTrack.id);
              
              // Retry the same track after a brief delay
              setTimeout(() => {
                if (get().currentTrack?.id === currentTrack.id) {
                  adminLog('🔄 Retrying track after session refresh...');
                  const audio = ensureAudioElement();
                  if (audio) {
                    audio.load(); // Reload the track with fresh auth
                    audio.play().catch(console.error);
                  }
                }
              }, 2000);
              
              return; // Don't proceed with normal error handling
            } else {
              adminError('❌ Session refresh failed:', refreshError);
            }
          } catch (refreshErr) {
            adminError('❌ Session refresh error:', refreshErr);
          }
        }
        
        // Track consecutive failures for smart error suppression
        const now = Date.now();
        if (now - lastErrorTime < ERROR_SUPPRESSION_WINDOW) {
          consecutiveFailures++;
        } else {
          consecutiveFailures = 1;
        }
        lastErrorTime = now;
        
        // Track failure count instead of permanent blacklist
        if (currentTrack) {
          const failures = (trackFailureCounts.get(currentTrack.id) || 0) + 1;
          trackFailureCounts.set(currentTrack.id, failures);
          adminLog(`⚠️ Track failure ${failures}/${MAX_TRACK_FAILURES}: ${currentTrack.title} (${currentTrack.id})`);
          
          if (failures >= MAX_TRACK_FAILURES) {
            adminLog(`🚫 Track exhausted retry attempts: ${currentTrack.title}`);
          }
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
        
        // Setup media session for background playback and device controls
        if (currentTrack) {
          MediaSessionService.setupMediaSession(
            {
              title: currentTrack.title,
              artist: currentTrack.artist || 'NeuroTunes',
              artwork: get().currentTrackArtwork || undefined
            },
            {
              play: () => get().play(),
              pause: () => get().pause(),
              previoustrack: () => get().prev(),
              nexttrack: () => get().next(),
              seekto: (details) => {
                if (details.seekTime !== undefined) {
                  get().seek(details.seekTime);
                }
              }
            }
          );
        }
        
        set({ isPlaying: true });
      });
      
      audio.addEventListener('pause', () => {
        console.log('🎵 Audio pause event fired - analyzing cause:', {
          ended: audio.ended,
          currentTime: audio.currentTime,
          duration: audio.duration,
          readyState: audio.readyState,
          networkState: audio.networkState,
          paused: audio.paused,
          buffered: audio.buffered.length > 0 ? `${audio.buffered.start(0)}-${audio.buffered.end(0)}` : 'none'
        });
        set({ isPlaying: false });
      });
      
      // Additional monitoring for unexpected stops
      audio.addEventListener('stalled', () => {
        console.warn('⚠️ Audio stalled - network loading halted');
      });

      audio.addEventListener('waiting', () => {
        console.log('⏳ Audio waiting - insufficient data for playback');
      });

      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Audio can play through - buffering complete');
      });

      audio.addEventListener('suspend', () => {
        console.log('⏹️ Audio loading suspended - browser stopped downloading');
      });

      audio.addEventListener('abort', () => {
        console.log('🚫 Audio loading aborted - fetch was cancelled');
      });

      audio.addEventListener('emptied', () => {
        console.log('🔄 Audio emptied - media element reset');
      });

      audio.addEventListener('loadstart', () => {
        console.log('🚀 Audio load started');
      });

      audio.addEventListener('progress', () => {
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const bufferedPercent = (bufferedEnd / audio.duration) * 100;
          console.log(`📊 Audio buffering progress: ${Math.round(bufferedPercent)}%`);
        }
      });
      
      // Time and metadata tracking
      audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration || 0;
        
        // Sync playing state with actual audio element state to prevent UI desync
        const actuallyPlaying = !audio.paused && !audio.ended && currentTime > 0;
        const storeState = get();
        
        // Critical fix: Also ensure currentTrack exists when audio is playing
        if (actuallyPlaying && !storeState.currentTrack && storeState.queue.length > 0) {
          const expectedTrack = storeState.queue[storeState.index];
          console.log('🔧 Restoring lost currentTrack:', expectedTrack?.title);
          set({ 
            currentTrack: expectedTrack,
            isPlaying: actuallyPlaying, 
            currentTime,
            duration 
          });
        } else if (actuallyPlaying !== storeState.isPlaying) {
          console.log('🔧 State sync: audio playing =', actuallyPlaying, 'store =', storeState.isPlaying);
          set({ isPlaying: actuallyPlaying, currentTime, duration });
        } else {
          set({ currentTime, duration });
        }
        
        // Update media session position for seek bar in device controls
        if (duration > 0 && actuallyPlaying) {
          MediaSessionService.updatePositionState(duration, currentTime);
        }
        
        // Track session progress
        if (sessionManager && duration > 0) {
          sessionManager.trackProgress(currentTime, duration);
        }
        
        // Proactive queue management - load more tracks when running low
        const { queue, index, lastGoal, isLoading } = get();
        const tracksRemaining = queue.length - (index + 1);
        const timeRemaining = duration - currentTime;
        
        // Load more tracks if we're near the end of both the current track and queue  
        if (!isLoading && lastGoal && tracksRemaining <= 5 && timeRemaining <= 60 && timeRemaining > 0) {
          console.log(`🔄 Proactively loading more tracks - ${tracksRemaining} tracks remaining, ${Math.round(timeRemaining)}s left in current track`);
          
          // Debounce to prevent multiple simultaneous loads
          if (!loadMoreTracksTimeout) {
            loadMoreTracksTimeout = setTimeout(async () => {
              try {
                const { getTherapeuticTracks } = await import('@/services/therapeuticDatabase');
                const excludeIds = queue.map(t => t.id);
                const { tracks: newTracks, error } = await getTherapeuticTracks(lastGoal, 30, excludeIds);
                
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
            }, 1000); // 1 second debounce - faster response
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

  // Improved validation to prevent rapid track switching in UI
  const validateTracks = async (tracks: Track[]): Promise<{ working: Track[], broken: Track[] }> => {
    console.log(`🎵 Pre-validating ${tracks.length} tracks to prevent UI shuffling...`);
    
    const working: Track[] = [];
    const broken: Track[] = [];
    
    // Process tracks in smaller batches to prevent overwhelming
    const batchSize = 5;
    for (let i = 0; i < tracks.length; i += batchSize) {
      const batch = tracks.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (track) => {
        // Basic validation
        if (!track.id) {
          return { track, isWorking: false };
        }
        
        // Check if track has been marked as failed too many times
        const failureCount = trackFailureCounts.get(track.id) || 0;
        if (failureCount >= MAX_TRACK_FAILURES) {
          return { track, isWorking: false };
        }
        
        // Quick URL resolution test without actually loading audio
        try {
          const { SmartAudioResolver } = await import('@/utils/smartAudioResolver');
          const resolution = await SmartAudioResolver.resolveAudioUrl({
            id: track.id,
            title: track.title || 'Untitled',
            storage_bucket: track.storage_bucket,
            storage_key: track.storage_key,
            category: '',
            genre: track.genre
          });
          
          return { track, isWorking: resolution.success && !!resolution.url };
        } catch (error) {
          console.log(`🎵 Validation failed for ${track.title}:`, error);
          return { track, isWorking: false };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      batchResults.forEach(({ track, isWorking }) => {
        if (isWorking) {
          working.push(track);
        } else {
          broken.push(track);
          // Pre-mark broken tracks to prevent them from being tried
          trackFailureCounts.set(track.id, MAX_TRACK_FAILURES);
        }
      });
      
      // Stop early if we have enough working tracks
      if (working.length >= 10) {
        console.log(`🎵 Found ${working.length} working tracks, stopping validation early`);
        // Add remaining unchecked tracks as potentially working
        working.push(...tracks.slice(i + batchSize));
        break;
      }
    }
    
    console.log(`✅ Validation complete: ${working.length} working, ${broken.length} broken`);
    
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
      
      // Set currentTrack optimistically for immediate UI update
      set({ currentTrack: track, isLoading: true });
      console.log('🎵 Set currentTrack optimistically:', track.title);
      
      // Early validation
      if (!isValid()) {
        console.log('🎵 Load sequence invalidated early:', mySeq);
        set({ currentTrack: null, isLoading: false });
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
        
        // Extract category from current location if available
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const pathParts = currentPath.split('/');
        const category = pathParts.includes('peaceful-piano') ? 'peaceful-piano' : 
                        pathParts.includes('stress-anxiety-support') ? 'stress-anxiety-support' :
                        pathParts.includes('energy-boost') ? 'energy-boost' :
                        pathParts.includes('focus') ? 'focus' : '';
        
        console.log('🎯 Detected category from URL:', category, 'for track:', track.title);
        
        resolution = await SmartAudioResolver.resolveAudioUrl({
          id: track.id,
          title: track.title || 'Untitled',
          storage_bucket: track.storage_bucket,
          storage_key: track.storage_key,
          category: category,
          genre: track.genre
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
        
        // Try alternative bucket fallback for problematic tracks
        console.log('🔄 Attempting alternative bucket fallbacks...');
        const baseUrl = 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public';
        let fallbackUrl = null;
        
        // Determine alternative bucket based on track content
        // More precise genre detection to prevent cross-contamination
        const titleLower = track.title.toLowerCase();
        
        if (titleLower.includes('sonata') || titleLower.includes('baroque')) {
          const bucket = titleLower.includes('stress') ? 'sonatasforstress' : 'Chopin';
          const simpleTitle = titleLower.replace(/[^a-z0-9]/g, '').substring(0, 30);
          fallbackUrl = `${baseUrl}/${bucket}/${encodeURIComponent(simpleTitle + '.mp3')}`;
          console.log(`🎯 Sonata fallback: ${fallbackUrl}`);
        } else if (titleLower.includes('bluegrass') || titleLower.includes('country') || titleLower.includes('americana')) {
          // Route bluegrass/country tracks to the correct bucket
          const simpleTitle = titleLower.replace(/[^a-z0-9]/g, '').substring(0, 30);
          fallbackUrl = `${baseUrl}/countryandamericana/${encodeURIComponent(simpleTitle + '.mp3')}`;
          console.log(`🎯 Bluegrass/Country fallback: ${fallbackUrl}`);
        } else if (titleLower.includes('new age') && !titleLower.includes('bluegrass') && !titleLower.includes('country')) {
          // Only route to New Age if it doesn't contain bluegrass/country
          const simpleTitle = titleLower.replace(/[^a-z0-9]/g, '').substring(0, 30);
          fallbackUrl = `${baseUrl}/newageworldstressanxietyreduction/${encodeURIComponent(simpleTitle + '.mp3')}`;
          console.log(`🎯 New Age fallback: ${fallbackUrl}`);
        } else if (titleLower.includes('meditation') && !titleLower.includes('bluegrass') && !titleLower.includes('country')) {
          // Only route meditation if it's not bluegrass/country
          const simpleTitle = titleLower.replace(/[^a-z0-9]/g, '').substring(0, 30);
          fallbackUrl = `${baseUrl}/meditation/${encodeURIComponent(simpleTitle + '.mp3')}`;
          console.log(`🎯 Meditation fallback: ${fallbackUrl}`);
        }
        
        if (fallbackUrl) {
          console.log(`🔄 Using fallback URL: ${fallbackUrl}`);
          resolution = { success: true, url: fallbackUrl, method: 'fallback_bucket', attempts: [] };
        } else {
          // Save failure info for debugging
          if (typeof window !== 'undefined') {
            (window as any).lastBrokenTrack = { track, resolution };
          }
          
          set({ 
            error: `Audio file not found. Tried ${resolution.attempts?.length || 0} different locations.`,
            isLoading: false 
          });
          return false;
        }
      }
      
      const url = resolution.url;
      console.log(`✅ Found working URL via ${resolution.method}: ${url}`);
      
      // Final sequence check before setting audio source
      if (!isValid()) {
        console.log('🎵 Load sequence outdated before setting src:', mySeq, 'vs', loadSeq);
        return false;
      }
      
      // Configure audio element for faster playback
      audio.crossOrigin = 'anonymous';  // Enable CORS for Supabase public storage
      audio.preload = "auto";           // Preload full audio for faster start
      (audio as any).playsInline = true;
      
      // Enhanced logging for debug tracking
      console.log('🎵 Setting audio source without pre-testing to avoid CORS issues');
      console.log('📝 Track info:', {
        title: track.title,
        originalLength: track.title.length,
        bucket: track.storage_bucket,
        key: track.storage_key,
        generatedUrl: url.split('/').pop()
      });
      
      // Skip redundant HEAD request - SmartAudioResolver already validated the URL
      console.log('✅ Using pre-validated URL from SmartAudioResolver:', url);
      
      // Clear any previous source first
      audio.removeAttribute('src');
      audio.load();
      
      // Set source and reload
      console.log('🎵 Setting audio.src to:', url);
      audio.src = url;
      console.log('🎵 Audio element state after src set:', {
        src: audio.src,
        readyState: audio.readyState,
        networkState: audio.networkState,
        crossOrigin: audio.crossOrigin,
        preload: audio.preload
      });
      audio.load();
      console.log('🎵 Called audio.load(), readyState now:', audio.readyState);
      
      // Add load event listener to detect successful loading
      const loadPromise = new Promise<boolean>((resolve) => {
        const onCanPlay = () => {
          console.log('🎵 Audio can play - ready for playback');
          cleanupListeners();
          resolve(true);
        };
        
        const onLoadedData = () => {
          console.log('🎵 Audio data loaded, checking if playable');
          // More aggressive: Accept readyState >= 1 (HAVE_METADATA) for faster start
          if (audio.readyState >= 1) {
            console.log('🎵 Audio has metadata loaded, proceeding with faster playback');
            cleanupListeners();
            resolve(true);
          }
        };
        
        const onError = (error: any) => {
          console.log('🎵 Audio load error:', error, 'readyState:', audio.readyState);
          console.log('🎵 Audio error details:', audio.error);
          console.log('🎵 Audio networkState:', audio.networkState, '(0=EMPTY, 1=IDLE, 2=LOADING, 3=NO_SOURCE)');
          console.log('🎵 Audio src at error:', audio.src);
          console.log('🎵 Full audio element state:', {
            src: audio.src,
            currentSrc: audio.currentSrc,
            readyState: audio.readyState,
            networkState: audio.networkState,
            crossOrigin: audio.crossOrigin,
            preload: audio.preload
          });
          cleanupListeners();
          resolve(false);
        };
        
        const cleanupListeners = () => {
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('loadeddata', onLoadedData);
          audio.removeEventListener('error', onError);
        };
        
        audio.addEventListener('canplay', onCanPlay);
        audio.addEventListener('loadeddata', onLoadedData);
        audio.addEventListener('error', onError);
        
        // Faster timeout - 3 seconds for quicker user feedback
        setTimeout(() => {
          console.log('🎵 Audio load timeout - readyState:', audio.readyState);
          // More aggressive: accept HAVE_METADATA (readyState >= 1) for faster playback
          if (audio.readyState >= 1) {
            console.log('🎵 Timeout but metadata available, proceeding anyway');
            cleanupListeners();
            resolve(true);
          } else {
            cleanupListeners();  
            resolve(false);
          }
        }, 3000);
      });
      
      audio.load();
      console.log('🎵 Audio src set, waiting for load...');
      
      const loaded = await loadPromise;
      if (!loaded) {
        console.log('🎵 Audio failed to load, trying alternative approach');
        return false;
      }
      
      // Don't attempt autoplay during initial load to avoid browser blocking
      // Actually DO start playing since this is user-initiated via a click
      console.log('🎵 Audio loaded successfully, attempting immediate autoplay...');
      
      try {
        // Force immediate playback - no waiting
        set({ isPlaying: true });
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        console.log('✅ Immediate auto-play successful after load');
      } catch (playError: any) {
        console.log('🎵 Immediate auto-play blocked (trying again shortly):', playError.name);
        // Retry once after small delay
        setTimeout(async () => {
          try {
            const retryPromise = audio.play();
            if (retryPromise !== undefined) {
              await retryPromise;
            }
            set({ isPlaying: true });
            console.log('✅ Retry auto-play successful');
          } catch (retryError: any) {
            console.log('🎵 Retry also failed, user must manually play:', retryError.name);
            set({ isPlaying: false });
          }
        }, 300);
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
      
      console.log('🎵 About to set currentTrack - before:', get().currentTrack?.title);
      
      // Critical fix: Always set currentTrack atomically to prevent loss
      const newState = { 
        currentTrack: track, 
        isLoading: false, 
        error: undefined, 
        playerMode: currentPlayerMode 
      };
      
      // During rapid error cascades, suppress UI updates to prevent visual race conditions
      if (consecutiveFailures > 2) {
        console.log('🎵 Suppressing UI updates during error cascade - setting track silently');
      }
      
      set(newState);
      
      console.log('🎵 Store currentTrack after set:', get().currentTrack?.title);
      console.log('🎵 Store playerMode after set:', get().playerMode);
      
      // Verify the track is actually set
      setTimeout(() => {
        const verifyTrack = get().currentTrack;
        if (!verifyTrack) {
          console.error('🚨 CRITICAL: currentTrack was cleared after being set!', {
            expectedTrack: track.title,
            actualTrack: verifyTrack,
            timestamp: Date.now()
          });
        } else {
          console.log('✅ currentTrack verified still set:', verifyTrack.title);
        }
      }, 100);
      
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
    playerMode: 'full', // Default to full player
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
        // Debug logging for bucket/content verification
        console.log('🐛 DEBUG playTrack called:', {
          title: track.title,
          bucket: track.storage_bucket,
          url: window.location.pathname,
          expectedGenre: window.location.pathname.includes('sonatas') ? 'Classical Sonatas' : 'Unknown'
        });
        
        // CRITICAL: Stop current audio before loading new track to prevent simultaneous playback
        const audio = initAudio();
        
        // Perform comprehensive audio cleanup before starting new track
        import('@/utils/audioCleanup').then(({ AudioCleanup }) => {
          AudioCleanup.stopAllAudioExcept(audio);
        });
        
        console.log('🎵 Stopping current audio before loading new track');
        audio.pause();
        audio.currentTime = 0;
        
        // Clear the source to fully stop current playback, but keep currentTrack for UI continuity
        const previousTrack = get().currentTrack;
        audio.removeAttribute('src');
        audio.load();
        
        // Update playing state but preserve currentTrack until new track loads
        set({ isPlaying: false, currentTime: 0 });
        
        const success = await loadTrack(track);
        if (success) {
          set({ queue: [track], index: 0 });
          
          // Start a new listening session if none exists
          if (!currentSession) {
            await startListeningSession();
          }
          
          await get().play();
        } else {
          // If loading fails, restore the previous track or clear if none
          set({ currentTrack: previousTrack, error: "Track not available", isLoading: false });
        }
      } finally {
        isTransitioning = false;
      }
    },

    stop: () => {
      console.log('🛑 STOP called - clearing currentTrack');
      console.trace('🛑 Stop called from:');
      
      // Complete any active listening session
      if (currentSession) {
        completeListeningSession();
      }
      
      const audio = initAudio();
      audio.pause();
      audio.src = '';
      
      // Clear media session and release wake lock
      MediaSessionService.clear();
      ScreenWakeLock.release();
      
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
        let tracks;
        
        // If specific buckets are provided, use them directly instead of goal mapping
        if (specificBuckets && specificBuckets.length > 0) {
          console.log(`🎵 Using specific buckets: ${specificBuckets.join(', ')}`);
          tracks = await SimpleStorageService.getTracksFromBuckets(specificBuckets, 50);
        } else {
          console.log(`🎵 Using goal-based bucket mapping for: "${goal}"`);
          tracks = await SimpleStorageService.getTracksFromCategory(goal, 50);
        }
        
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
        
        // Clear failure counts occasionally to allow retry of previously failed tracks
        if (trackFailureCounts.size > 50) {
          console.log('🔄 Clearing failure counts to allow retries');
          trackFailureCounts.clear();
        }
        
        // Filter out tracks that have exceeded failure threshold
        const originalCount = convertedTracks.length;
        const availableTracks = convertedTracks.filter(track => 
          (trackFailureCounts.get(track.id) || 0) < MAX_TRACK_FAILURES
        );
        
        // If we filtered out too many, keep some of the failed ones for retry
        let finalTracks = availableTracks;
        if (availableTracks.length < 5 && originalCount > 5) {
          console.log('🎵 Not enough available tracks, including some previously failed ones');
          finalTracks = convertedTracks.slice(0, 10); // Take first 10 regardless of failure count
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
        
        // Show user-friendly error in UI with more helpful message
        import('@/utils/adminLogging').then(({ userLog }) => {
          if (error.message.includes('No tracks found')) {
            userLog(`❌ No music available for ${goal}. This mode may not be set up yet.`);
          } else if (error.message.includes('buckets')) {
            userLog(`❌ Configuration issue with ${goal}. Please try a different mode.`);
          } else {
            userLog(`❌ Could not load music for ${goal}. Please try again or try a different mode.`);
          }
        });
        
        return 0;
      }
    },

    setQueue: async (tracks: Track[], startAt = 0) => {
      set({ queue: tracks, index: -1, isLoading: true, error: undefined });
      skipped = 0;
      
      // Show loading message to user during validation
      console.log('🎵 Validating tracks to ensure smooth playback...');
      
      // Improved validation to prevent UI shuffling
      const { working, broken } = await validateTracks(tracks);
      
      // Mark broken tracks with high failure count
      if (broken.length > 0) {
        const { adminLog, userLog } = await import('@/utils/adminLogging');
        adminLog(`🎵 Pre-filtered ${broken.length} broken tracks`);
        
        // Mark tracks as failed
        broken.forEach(track => {
          trackFailureCounts.set(track.id, MAX_TRACK_FAILURES);
          console.log('🎵 Pre-marked broken track:', track.id, track.title);
        });
        console.log('🎵 Total failed tracks:', trackFailureCounts.size);
        
        // Don't announce skips during pre-validation to avoid UI spam
        for (let i = 0; i < Math.min(broken.length, 3); i++) {
          skipped++;
        }
        if (broken.length > 3) {
          const { shouldShowTechnicalLogs } = await import('@/utils/adminLogging');
          if (shouldShowTechnicalLogs()) {
            console.log(`Pre-filtered ${broken.length} broken tracks`);
          } else {
            console.log('🎵 Optimized playlist for smooth playback');
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
      
      console.log(`🎵 Loading first track from ${working.length} validated tracks...`);
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
      
      // CRITICAL: Ensure audio is not muted and has proper volume
      if (audio.muted) {
        console.log('🔧 Audio was muted, unmuting...');
        audio.muted = false;
      }
      if (audio.volume === 0) {
        console.log('🔧 Audio volume was 0, setting to 0.8...');
        audio.volume = 0.8;
      }
      
      console.log('🎵 Audio element state - src:', audio.src, 'readyState:', audio.readyState, 'paused:', audio.paused, 'volume:', audio.volume, 'muted:', audio.muted);
      
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
        // CRITICAL: Resume audio context if suspended (browser autoplay policy)
        if (typeof window !== 'undefined' && window.AudioContext) {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioContext.state === 'suspended') {
            console.log('🔧 Audio context is suspended, resuming...');
            await audioContext.resume();
            console.log('✅ Audio context resumed, state:', audioContext.state);
          }
        }
        
        console.log('🎵 Attempting audio.play()...');
        
        // Optimistically set playing state to ensure UI responsiveness
        set({ isPlaying: true, error: undefined });
        
        // Safari fix: Ensure audio is ready before attempting play (reduced timeout)
        if (audio.readyState === 0) {
          console.log('🎵 Safari fix: Audio not ready, loading first...');
          audio.load();
          
          // Wait for Safari to be ready (reduced to 800ms for faster playback)
          await new Promise<void>((resolve) => {
            const onCanPlay = () => {
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              console.log('🎵 Audio ready for Safari playback');
              resolve();
            };
            
            const onError = () => {
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              console.log('🎵 Audio loading error in Safari fix');
              resolve();
            };
            
            audio.addEventListener('canplay', onCanPlay);
            audio.addEventListener('error', onError);
            
            setTimeout(() => {
              audio.removeEventListener('canplay', onCanPlay);
              audio.removeEventListener('error', onError);
              console.log('🎵 Safari fix timeout (800ms)');
              resolve();
            }, 800);
          });
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        
        console.log('✅ Audio.play() successful - track should be playing');
        console.log('🔊 Final audio state: volume =', audio.volume, 'muted =', audio.muted, 'paused =', audio.paused, 'currentTime =', audio.currentTime);
        
        // Request wake lock to prevent screen sleep during playback
        await ScreenWakeLock.request();
        
        // Update media session for background playback and device controls
        MediaSessionService.setPlaybackState('playing');
        
        set({ error: undefined, isPlaying: true });
      } catch (error: any) {
        console.error('🎵 Play failed:', error);
        
        // Reset isPlaying state on any error
        set({ isPlaying: false });
        
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
          
          // Track failure count instead of permanent blacklist
          const { currentTrack } = get();
          if (currentTrack) {
            const failures = (trackFailureCounts.get(currentTrack.id) || 0) + 1;
            trackFailureCounts.set(currentTrack.id, failures);
            console.log('🎵 Track format not supported, failure count:', failures, currentTrack.title);
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
          
        // Use shorter delay for format errors to speed up playback
          // Increased delay to prevent rapid switching
          scheduleAutoSkip('format not supported', 2500);
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
          
          // Track failure count for network issues
          const { currentTrack } = get();
          if (currentTrack) {
            const failures = (trackFailureCounts.get(currentTrack.id) || 0) + 1;
            trackFailureCounts.set(currentTrack.id, failures);
            console.log('🎵 Network error loading track, failure count:', failures, currentTrack.title);
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
          // Increased delay to prevent rapid switching  
          scheduleAutoSkip('unknown error', 2500);
        }
      }
    },

    pause: () => {
      const audio = initAudio();
      console.log('🎵 Pause called - audio paused:', audio.paused);
      audio.pause();
      
      // Release wake lock when pausing to save battery
      ScreenWakeLock.release();
      
      // Update media session state
      MediaSessionService.setPlaybackState('paused');
      
      // Ensure state is synchronized immediately
      set({ isPlaying: false });
    },

    next: async () => {
      console.log('🎵 Skip button pressed - checking state:', {
        isNexting,
        isTransitioning,
        now: Date.now(),
        lastNextCall,
        timeSinceLastCall: Date.now() - lastNextCall
      });

      // Reduced rate limiting for better responsiveness
      const now = Date.now();
      if (now - lastNextCall < MIN_NEXT_INTERVAL) {
        console.log('🎵 Next call rate limited - preventing racing behavior');
        return;
      }
      lastNextCall = now;
      
      // Check for stuck flags and auto-reset them
      if (isNexting || isTransitioning) {
        const timeSinceLastCall = now - lastNextCall;
        if (timeSinceLastCall > 3000) { // If stuck for more than 3 seconds
          console.warn('🔧 Auto-resetting stuck flags - skip button was blocked');
          isNexting = false;
          isTransitioning = false;
        } else {
          console.log('🎵 Next already in progress, skipping');
          return;
        }
      }
      
      isNexting = true;
      isTransitioning = true;
      
      console.log('🎵 Skip operation starting');
      
      try {
        // Clear any pending auto-skip timeouts
        if (autoSkipTimeout) {
          clearTimeout(autoSkipTimeout);
          autoSkipTimeout = null;
        }
        
        let { queue, index } = get();
        console.log('🎵 Current state - index:', index, 'queue length:', queue.length);
        
        // Check if we're at the end of queue and try to fetch more tracks
        if (index >= queue.length - 1) {
          console.log('🎵 At end of queue - attempting to fetch more tracks');
          
          const { lastGoal } = get();
          if (lastGoal) {
            try {
              const excludeIds = queue.map(t => t.id.toString());
              const { tracks: newTracks } = await API.playlist(lastGoal as GoalSlug, 30, 0, excludeIds);
              
              if (newTracks && newTracks.length > 0) {
                console.log('🎵 Fetched', newTracks.length, 'new tracks to continue playback');
                const convertedTracks: Track[] = newTracks.map((track: any) => ({
                  id: track.id,
                  title: track.title,
                  artist: track.artist || 'Neural Positive Music',
                  duration: track.duration || 0,
                  storage_bucket: track.storage_bucket || 'audio',
                  storage_key: track.storage_key,
                  stream_url: track.stream_url,
                  audio_status: track.audio_status || 'working',
                }));
                
                // Add new tracks and update queue
                const newQueue = [...queue, ...convertedTracks];
                set({ queue: newQueue });
                queue = newQueue;
                console.log('🎵 Continuous play enabled - queue extended to', newQueue.length, 'tracks');
                
                // Don't return early - continue to play the next track
              } else {
                console.log('🎵 No more tracks available from API');
                // Complete session when we truly run out of tracks
                if (sessionManager) {
                  console.log('🎵 Completing session - no more tracks to play');
                  sessionManager.completeSession().catch(console.error);
                }
                set({ isLoading: false, error: "No more tracks available" });
                return;
              }
            } catch (error) {
              console.error('🎵 Failed to fetch more tracks:', error);
              // Complete session on error
              if (sessionManager) {
                sessionManager.completeSession().catch(console.error);
              }
              set({ isLoading: false, error: "No more tracks available" });
              return;
            }
          } else {
            console.log('🎵 No goal set - cannot fetch more tracks');
            // Complete session when no goal is set
            if (sessionManager) {
              sessionManager.completeSession().catch(console.error);
            }
            set({ isLoading: false, error: "No more tracks available" });
            return;
          }
        }
        
        // IMMEDIATE UI FEEDBACK - increment index right away for responsiveness
        const nextIndex = index + 1;
        set({ index: nextIndex, currentTrack: queue[nextIndex], isLoading: true });
        console.log('🎵 Immediate UI update - showing next track:', queue[nextIndex].title);
        
        // Load and play the track
        const success = await loadTrack(queue[nextIndex]);
        if (success) {
          await get().play();
          console.log('🎵 Successfully skipped to track:', queue[nextIndex].title);
          set({ isLoading: false });
          return;
        }
        
        // If immediate next track failed, try subsequent tracks
        for (let i = nextIndex + 1; i < queue.length; i++) {
          console.log('🎵 Trying next track at index', i, ':', queue[i].title);
          const success = await loadTrack(queue[i]);
          if (success) {
            set({ index: i });
            await get().play();
            console.log('🎵 Successfully skipped to track:', queue[i].title);
            set({ isLoading: false });
            return;
          }
          
          // Track failure count
          const failures = (trackFailureCounts.get(queue[i].id) || 0) + 1;
          trackFailureCounts.set(queue[i].id, failures);
          
          if (failures >= MAX_TRACK_FAILURES) {
            console.log('🎵 Removing exhausted track from queue:', queue[i].title);
            announceSkip();
            queue = removeAt(queue, i);
            i--; // Adjust index since we removed an item
            set({ queue });
        }
        
        // Check if queue is getting low and try to fetch more tracks (more proactive threshold)
        const { lastGoal } = get(); // Get lastGoal for queue extension
        const remainingTracks = queue.length - index - 1;
        if (remainingTracks <= 5 && lastGoal) {
          console.log('🎵 Queue running low, fetching more tracks for goal:', lastGoal);
          try {
            const excludeIds = queue.map(t => t.id.toString());
            const { tracks: newTracks } = await API.playlist(lastGoal as GoalSlug, 30, 0, excludeIds);
            
            if (newTracks && newTracks.length > 0) {
              console.log('🎵 Added', newTracks.length, 'new tracks to queue');
              const convertedTracks: Track[] = newTracks.map((track: any) => ({
                id: track.id,
                title: track.title,
                artist: track.artist || 'Neural Positive Music',
                duration: track.duration || 0,
                storage_bucket: track.storage_bucket || 'audio',
                storage_key: track.storage_key,
                stream_url: track.stream_url,
                audio_status: track.audio_status || 'working',
              }));
              
              // Add new tracks to the end of the queue
              const newQueue = [...queue, ...convertedTracks];
              set({ queue: newQueue });
              queue = newQueue;
              console.log('🎵 Queue extended with', convertedTracks.length, 'tracks, new total:', newQueue.length);
            }
          } catch (error) {
            console.error('🎵 Failed to fetch more tracks:', error);
          }
        }
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


// Export forward button fix for immediate debugging
export const forceResetPlayerFlags = () => {
  isNexting = false;
  isTransitioning = false;
  lastNextCall = 0;
  console.log('🔧 Force reset all player flags - forward button should work now');
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).forceResetPlayerFlags = forceResetPlayerFlags;
}
