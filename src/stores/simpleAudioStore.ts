import { create } from "zustand";
import { AUDIO_ELEMENT_ID } from '@/player/constants';
import { DirectStoragePlayer, type DirectTrack } from '@/services/directStoragePlayer';

type SimpleAudioState = {
  // Playback state
  isPlaying: boolean;
  isLoading: boolean;
  currentTrack: DirectTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Player UI state - ALWAYS show player when track is available
  playerMode: 'full' | 'mini';
  setPlayerMode: (mode: 'full' | 'mini') => void;
  
  // Queue
  queue: DirectTrack[];
  index: number;
  lastBuckets?: string[];
  
  // Actions
  playTrack: (track: DirectTrack) => Promise<void>;
  playFromBuckets: (buckets: string[]) => Promise<number>;
  setQueue: (tracks: DirectTrack[], startAt?: number) => Promise<void>;
  play: () => void;
  pause: () => void;
  stop: () => void;
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

let audioElement: HTMLAudioElement | null = null;

const ensureAudioElement = (): HTMLAudioElement => {
  if (audioElement && document.body.contains(audioElement)) return audioElement;
  
  // Clean up any existing audio elements
  document.querySelectorAll("audio").forEach(el => {
    if (el.id !== AUDIO_ELEMENT_ID) {
      el.remove();
    }
  });
  
  audioElement = document.getElementById(AUDIO_ELEMENT_ID) as HTMLAudioElement;
  if (!audioElement) {
    audioElement = document.createElement("audio");
    audioElement.id = AUDIO_ELEMENT_ID;
    audioElement.preload = "metadata";
    document.body.appendChild(audioElement);
    console.log(`🎵 Created audio element #${AUDIO_ELEMENT_ID}`);
  }
  return audioElement;
};

export const useSimpleAudioStore = create<SimpleAudioState>((set, get) => {
  let eventListenersAdded = false;
  
  const initAudio = () => {
    const audio = ensureAudioElement();
    
    if (!eventListenersAdded) {
      // Auto-next on track end
      audio.addEventListener('ended', () => {
        console.log('🎵 Track ended - going to next');
        set({ isPlaying: false });
        get().next();
      });
      
      // Error handling
      audio.addEventListener('error', (event) => {
        console.error('🎵 Audio error:', audio.error);
        set({ isPlaying: false, error: 'Playback error' });
        toast.error('Track failed to play, skipping...');
        get().next();
      });
      
      // State tracking
      audio.addEventListener('play', () => {
        console.log('🎵 Audio play event');
        set({ isPlaying: true, error: undefined });
      });
      
      audio.addEventListener('pause', () => {
        console.log('🎵 Audio pause event');
        set({ isPlaying: false });
      });
      
      // Time tracking
      audio.addEventListener('timeupdate', () => {
        set({ currentTime: audio.currentTime });
      });
      
      audio.addEventListener('loadedmetadata', () => {
        console.log('🎵 Audio metadata loaded, duration:', audio.duration);
        set({ duration: audio.duration || 0 });
      });
      
      audio.addEventListener('canplay', () => {
        console.log('🎵 Audio can play');
        set({ isLoading: false });
      });
      
      audio.addEventListener('loadstart', () => {
        console.log('🎵 Audio load start');
        set({ isLoading: true });
      });
      
      eventListenersAdded = true;
      console.log('🎵 Audio event listeners added');
    }
    
    return audio;
  };

  return {
    // Initial state - ALWAYS show player in mini mode when track exists
    isPlaying: false,
    isLoading: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    playerMode: 'mini', // Default to mini so player always shows
    queue: [],
    index: 0,
    
    setPlayerMode: (mode) => set({ playerMode: mode }),
    
    async playTrack(track: DirectTrack) {
      console.log('🎵 Playing track directly:', track.title, track.url);
      const audio = initAudio();
      
      set({ 
        currentTrack: track, 
        isLoading: true, 
        error: undefined,
        playerMode: 'mini' // ALWAYS show player when playing
      });
      
      try {
        audio.src = track.url;
        audio.volume = get().volume;
        await audio.play();
      } catch (error) {
        console.error('🎵 Play error:', error);
        set({ error: 'Failed to play track', isLoading: false });
        toast.error('Failed to play track');
      }
    },
    
    async playFromBuckets(buckets: string[]) {
      console.log('🎵 Loading tracks from buckets:', buckets);
      set({ isLoading: true, lastBuckets: buckets });
      
      try {
        const tracks = await DirectStoragePlayer.getTracksFromBuckets(buckets);
        
        if (tracks.length === 0) {
          toast.error('No tracks found in selected categories');
          set({ isLoading: false });
          return 0;
        }
        
        await get().setQueue(tracks, 0);
        toast.success(`Loaded ${tracks.length} tracks`);
        return tracks.length;
        
      } catch (error) {
        console.error('🎵 Error loading from buckets:', error);
        toast.error('Failed to load tracks');
        set({ isLoading: false });
        return 0;
      }
    },
    
    async setQueue(tracks: DirectTrack[], startAt = 0) {
      console.log('🎵 Setting queue:', tracks.length, 'tracks, starting at:', startAt);
      set({ 
        queue: tracks, 
        index: startAt,
        playerMode: 'mini' // ALWAYS show player when queue is set
      });
      
      if (tracks.length > 0 && startAt < tracks.length) {
        await get().playTrack(tracks[startAt]);
      }
    },
    
    play() {
      const audio = ensureAudioElement();
      audio.play().catch(error => {
        console.error('🎵 Play failed:', error);
        toast.error('Playback failed');
      });
    },
    
    pause() {
      const audio = ensureAudioElement();
      audio.pause();
    },
    
    stop() {
      const audio = ensureAudioElement();
      audio.pause();
      audio.currentTime = 0;
      set({ currentTrack: null, isPlaying: false, currentTime: 0 });
    },
    
    async next() {
      const { queue, index } = get();
      const nextIndex = index + 1;
      
      if (nextIndex < queue.length) {
        console.log('🎵 Going to next track:', nextIndex);
        set({ index: nextIndex });
        await get().playTrack(queue[nextIndex]);
      } else {
        console.log('🎵 End of queue');
        toast.info('End of playlist');
      }
    },
    
    async prev() {
      const { queue, index } = get();
      const prevIndex = index - 1;
      
      if (prevIndex >= 0) {
        console.log('🎵 Going to previous track:', prevIndex);
        set({ index: prevIndex });
        await get().playTrack(queue[prevIndex]);
      }
    },
    
    seek(time: number) {
      const audio = ensureAudioElement();
      audio.currentTime = time;
      set({ currentTime: time });
    },
    
    setVolume(volume: number) {
      const audio = ensureAudioElement();
      audio.volume = volume;
      set({ volume });
    },
    
    // Internal setters
    setPlaying: (playing) => set({ isPlaying: playing }),
    setLoading: (loading) => set({ isLoading: loading }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    setError: (error) => set({ error }),
  };
});