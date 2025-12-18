import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { audioManager } from '@/utils/audioManager';

interface AudioTrack {
  src: string;
  name: string;
  genre: string;
  artist: string;
  therapeuticGoal: string;
  estimatedBPM: number;
}

interface VideoSource {
  src: string;
}

interface LandingPagePlayerProps {
  onPlaybackStateChange: (isPlaying: boolean) => void;
  onCurrentTrackChange: (track: AudioTrack | null) => void;
  onVideoPlaybackRateChange: (rate: number) => void;
  onVideoChange: (videoIndex: number) => void;
  isPlaying: boolean;
  isMuted: boolean;
}

const TRACK_DURATION = 35000; // 35 seconds
const CROSSFADE_DURATION = 2000; // 2 seconds

// Direct URLs for audio tracks - now with expanded video rotation
const CURATED_PLAYLIST = [
  {
    audioUrl: '/audio/hail-queen-astrid.mp3',
    videoPath: '/videos/landing-01.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'Hail Queen Astrid',
    estimatedBPM: 75
  },
  // Note: "You're So Lovable" removed - file doesn't exist in public/audio
  {
    audioUrl: '/audio/the-spartan-age.mp3',
    videoPath: '/videos/landing-03.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Spartan Age',
    estimatedBPM: 75
  },
  {
    audioUrl: '/audio/The_Seventh_Wonder_New_Age_Focus_2.mp3',
    videoPath: '/videos/landing-04.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Seventh Wonder',
    estimatedBPM: 72
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/just-how-you-like-it-country-pop-radio-cut.mp3',
    videoPath: '/videos/landing-03.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Country Pop',
    artist: 'Van Wild',
    name: 'Just How You Like It',
    estimatedBPM: 95
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/venha-ao-meu-jardim-samba-bossa-nova-2.mp3',
    videoPath: '/videos/landing-04.mp4',
    therapeuticGoal: 'Pain Reduction',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Venha ao Meu Jardim',
    estimatedBPM: 90
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/malaga-classical-focus-part-four-(remastered).mp3',
    videoPath: '/videos/landing-05.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'Classical',
    artist: 'The Scientists',
    name: 'Malaga Classical Focus Part Four',
    estimatedBPM: 70
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/quietude-nocturne-(remastered).mp3',
    videoPath: '/videos/landing-06.mp4',
    therapeuticGoal: 'Deep Rest',
    genre: 'Classical',
    artist: 'Yasmine',
    name: 'Quietude Nocturne',
    estimatedBPM: 60
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/adonis--bossa-nova-samba.mp3',
    videoPath: '/videos/landing-07.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Adonis',
    estimatedBPM: 85
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/tropicana-chill-bossa-nova-big-band-radio-mix.mp3',
    videoPath: '/videos/landing-08.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Tropicana Chill',
    estimatedBPM: 88
  },
  {
    audioUrl: '/audio/the-prayer-of-the-oud.mp3',
    videoPath: '/videos/landing-09.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Prayer of the Oud',
    estimatedBPM: 68
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Im%20on%20your%20team%20INDIE%20POP%20VERSION%203.mp3',
    videoPath: '/videos/landing-10.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'Indie Pop',
    artist: 'Van Wild',
    name: 'I\'m on Your Team',
    estimatedBPM: 115
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/All%20I_ve%20ever%20wanted%20country%20Radio%20Mix%20for%20ML.mp3',
    videoPath: '/videos/landing-11.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Country',
    artist: 'Van Wild',
    name: 'All I\'ve Ever Wanted',
    estimatedBPM: 100
  },
  {
    audioUrl: '/audio/blanca-blanqueando.mp3',
    videoPath: '/videos/landing-12.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Blanca Blanqueando',
    estimatedBPM: 90
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Como%20con%20tu%20sombra%20samba%20bossa%20nova.mp3',
    videoPath: '/videos/landing-13.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Serene Samba',
    artist: 'Yasmine',
    name: 'Como con Tu Sombra',
    estimatedBPM: 87
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/hold%20on%20child%20EDM%20HIIT.mp3',
    videoPath: '/videos/landing-14.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'EDM',
    artist: 'Yasmine',
    name: 'Hold on Child',
    estimatedBPM: 135
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/we%20were%20born%20to%20come%20alive%20radio%20cut%20version%20yaz%20based%20vox%20(1).mp3',
    videoPath: '/videos/landing-15.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'Pop',
    artist: 'Van Wild',
    name: 'We Were Born to Come Alive',
    estimatedBPM: 124
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/deja%20vu%20vanwild%20new%20age%20mix%20(1).mp3',
    videoPath: '/videos/landing-16.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Pop',
    artist: 'Van Wild',
    name: 'Deja Vu',
    estimatedBPM: 112
  },
  {
    audioUrl: '/audio/nocturnes-chamber-orchestra.mp3',
    videoPath: '/videos/landing-17.mp4',
    therapeuticGoal: 'Deep Rest',
    genre: 'Classical',
    artist: 'The Scientists',
    name: 'Nocturnes for Chamber Orchestra',
    estimatedBPM: 65
  },
  {
    audioUrl: '/audio/your-love-big-band.mp3',
    videoPath: '/videos/landing-18.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Big Band',
    artist: 'The Scientists',
    name: 'Your Love',
    estimatedBPM: 95
  },
  {
    audioUrl: '/audio/barcelona-classical-focus.mp3',
    videoPath: '/videos/landing-19.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'Classical',
    artist: 'The Scientists',
    name: 'Barcelona Classical Focus',
    estimatedBPM: 72
  },
  {
    audioUrl: '/audio/baroque-sonata-a-major.mp3',
    videoPath: '/videos/landing-20.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'Classical',
    artist: 'The Scientists',
    name: 'Baroque Sonata in A Major',
    estimatedBPM: 68
  },
  {
    audioUrl: '/audio/to-what-shall-i-compare-thee.mp3',
    videoPath: '/videos/landing-21.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'French Folk',
    artist: 'Yasmine',
    name: 'To What Shall I Compare Thee',
    estimatedBPM: 85
  },
  {
    audioUrl: '/audio/the-age-of-wonder.mp3',
    videoPath: '/videos/landing-22.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Age of Wonder',
    estimatedBPM: 70
  },
  {
    audioUrl: '/audio/the-lover-movement-1.mp3',
    videoPath: '/videos/landing-23.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Classical',
    artist: 'The Scientists',
    name: 'The Lover Movement 1',
    estimatedBPM: 65
  },
  {
    audioUrl: '/audio/the-wonder-of-reverie.mp3',
    videoPath: '/videos/landing-24.mp4',
    therapeuticGoal: 'Deep Rest',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Wonder of Reverie',
    estimatedBPM: 60
  },
  {
    audioUrl: '/audio/focus-on-air-focus-world.mp3',
    videoPath: '/videos/landing-25.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'Ambient',
    artist: 'The Scientists',
    name: 'Focus on Air',
    estimatedBPM: 72
  },
  {
    audioUrl: '/audio/solfeggio-frequencies.mp3',
    videoPath: '/videos/landing-26.mp4',
    therapeuticGoal: 'Deep Rest',
    genre: 'Sound Healing',
    artist: 'The Scientists',
    name: 'Solfeggio Frequencies',
    estimatedBPM: 60
  },
  {
    audioUrl: '/audio/cinematic-hz.mp3',
    videoPath: '/videos/landing-27.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'Cinematic',
    artist: 'The Scientists',
    name: 'Cinematic Hz',
    estimatedBPM: 75
  },
  {
    audioUrl: '/audio/maltese-acoustics-spatial-expansion.mp3',
    videoPath: '/videos/landing-28.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Spatial Audio',
    artist: 'The Scientists',
    name: 'Maltese Acoustics',
    estimatedBPM: 68
  },
  {
    audioUrl: '/audio/o-vis-aeternitatis.mp3',
    videoPath: '/videos/landing-29.gif',
    therapeuticGoal: 'Deep Rest',
    genre: 'Choral',
    artist: 'The Scientists',
    name: 'O Vis Aeternitatis',
    estimatedBPM: 58
  },
  {
    audioUrl: '/audio/resonance-in-altered-frequencies.mp3',
    videoPath: '/videos/landing-30.gif',
    therapeuticGoal: 'Relaxation',
    genre: 'Experimental',
    artist: 'The Scientists',
    name: 'Resonance in Altered Frequencies',
    estimatedBPM: 65
  },
  {
    audioUrl: '/audio/i-run-to-you-club-mix.mp3',
    videoPath: '/videos/landing-31.gif',
    therapeuticGoal: 'Energy Boost',
    genre: 'Club',
    artist: 'Van Wild',
    name: 'I Run to You',
    estimatedBPM: 128
  },
  {
    audioUrl: '/audio/a-summer-day-acoustic-pop.mp3',
    videoPath: '/videos/landing-32.gif',
    therapeuticGoal: 'Mood Boost',
    genre: 'Acoustic Pop',
    artist: 'Van Wild',
    name: 'A Summer Day',
    estimatedBPM: 95
  },
  {
    audioUrl: '/audio/es-una-necesidad-bachata.mp3',
    videoPath: '/videos/landing-33.gif',
    therapeuticGoal: 'Energy Boost',
    genre: 'Bachata',
    artist: 'Yasmine',
    name: 'Es Una Necesidad',
    estimatedBPM: 120
  },
  {
    audioUrl: '/audio/te-comparare-verano-remix.mp3',
    videoPath: '/videos/landing-34.gif',
    therapeuticGoal: 'Mood Boost',
    genre: 'Latin Pop',
    artist: 'Yasmine',
    name: 'Te Compararé con un Día de Verano',
    estimatedBPM: 110
  },
  {
    audioUrl: '/audio/spinosa-dreams-remix.mp3',
    videoPath: '/videos/landing-35.gif',
    therapeuticGoal: 'Relaxation',
    genre: 'Electronic',
    artist: 'The Scientists',
    name: 'Spinosa Dreams',
    estimatedBPM: 90
  },
  {
    audioUrl: '/audio/architect-of-my-strength.mp3',
    videoPath: '/videos/landing-36.gif',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'Affirmation',
    artist: 'The Scientists',
    name: 'The Architect of My Strength',
    estimatedBPM: 70
  },
  {
    audioUrl: '/audio/elysian-fields-house.mp3',
    videoPath: '/videos/landing-37.gif',
    therapeuticGoal: 'Energy Boost',
    genre: 'House',
    artist: 'The Scientists',
    name: 'Elysian Fields',
    estimatedBPM: 125
  },
  {
    audioUrl: '/audio/i-love-you-remix.mp3',
    videoPath: '/videos/landing-38.gif',
    therapeuticGoal: 'Mood Boost',
    genre: 'Pop Remix',
    artist: 'Van Wild',
    name: 'I Love You',
    estimatedBPM: 118
  },
  {
    audioUrl: '/audio/the-mystery-swells-radio-mix.mp3',
    videoPath: '/videos/landing-39.gif',
    therapeuticGoal: 'Relaxation',
    genre: 'Indie',
    artist: 'Van Wild',
    name: 'The Mystery Swells',
    estimatedBPM: 85
  }
];

// All 47 landing videos - cycle through these independently of audio tracks
const ALL_LANDING_VIDEOS = [
  '/videos/landing-01.mp4', '/videos/landing-02.mp4', '/videos/landing-03.mp4',
  '/videos/landing-04.mp4', '/videos/landing-05.mp4', '/videos/landing-06.mp4',
  '/videos/landing-07.mp4', '/videos/landing-08.mp4', '/videos/landing-09.mp4',
  '/videos/landing-10.mp4', '/videos/landing-11.mp4', '/videos/landing-12.mp4',
  '/videos/landing-13.mp4', '/videos/landing-14.mp4', '/videos/landing-15.mp4',
  '/videos/landing-16.mp4', '/videos/landing-17.mp4', '/videos/landing-18.mp4',
  '/videos/landing-19.mp4', '/videos/landing-20.mp4', '/videos/landing-21.mp4',
  '/videos/landing-22.mp4', '/videos/landing-23.mp4', '/videos/landing-24.mp4',
  '/videos/landing-25.mp4', '/videos/landing-26.mp4', '/videos/landing-27.mp4',
  '/videos/landing-28.mp4', '/videos/landing-29.gif', '/videos/landing-30.gif',
  '/videos/landing-31.gif', '/videos/landing-32.gif', '/videos/landing-33.gif',
  '/videos/landing-34.gif', '/videos/landing-35.gif', '/videos/landing-36.gif',
  '/videos/landing-37.gif', '/videos/landing-38.gif', '/videos/landing-39.gif',
  '/videos/landing-40.gif', '/videos/landing-41.gif', '/videos/landing-42.gif',
  '/videos/landing-43.gif', '/videos/landing-44.gif', '/videos/landing-45.gif',
  '/videos/landing-46.mp4', '/videos/landing-47.mp4'
];

export const LandingPagePlayer = ({
  onPlaybackStateChange,
  onCurrentTrackChange,
  onVideoPlaybackRateChange,
  onVideoChange,
  isPlaying,
  isMuted
}: LandingPagePlayerProps) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [videos, setVideos] = useState<VideoSource[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrackIndexRef = useRef(0); // Ref for timer callbacks to access current value
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoIndexRef = useRef(0); // Video cycles independently of audio
  
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const [activeAudioRef, setActiveAudioRef] = useState<1 | 2>(1);
  const trackTimerRef = useRef<NodeJS.Timeout>();

  // Register main audio element with AudioManager on mount
  useEffect(() => {
    console.log('🧹 LandingPagePlayer mount');
    if (audioRef1.current) {
      audioManager.registerMainAudio(audioRef1.current);
    }
  }, []);

  // Expose the currently active audio element globally so the video layer can sync to it
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    (window as any).__landingActiveAudio = currentAudio || null;
  }, [activeAudioRef]);

  // Fetch media on mount
  useEffect(() => {
    const fetchMedia = async () => {
      // Build curated tracks (audio only)
      const audioTracks = CURATED_PLAYLIST.map(track => {
        console.log(`🎵 Loading track: ${track.name}`);
        return {
          src: track.audioUrl,
          name: track.name,
          genre: track.genre,
          artist: track.artist,
          therapeuticGoal: track.therapeuticGoal,
          estimatedBPM: track.estimatedBPM
        };
      });
      
      // Build video array from ALL_LANDING_VIDEOS (cycles independently)
      const videoFiles = ALL_LANDING_VIDEOS.map(src => ({ src }));
      console.log(`🎬 Loaded ${videoFiles.length} videos for cycling`);
      
      setTracks(audioTracks);
      setVideos(videoFiles);
      
      if (audioTracks.length > 0) {
        console.log('🎵 Setting initial track:', audioTracks[0]);
        onCurrentTrackChange(audioTracks[0]);
      }
    };

    fetchMedia();
  }, []);

  // Calculate video playback rate from BPM (very slow for calm, fast for energetic: 0.4x-1.3x)
  const getPlaybackRate = (bpm: number): number => {
    const normalizedBPM = Math.max(60, Math.min(120, bpm));
    return 0.4 + ((normalizedBPM - 60) / 60) * 0.9;
  };

  // Start next track - IMMEDIATELY stop previous to prevent overlap
  // Use ref for track index to avoid stale closures in setTimeout
  const playNextTrack = useCallback(() => {
    // Use ref to get current value (avoids stale closure issue with setTimeout)
    const currentIdx = currentTrackIndexRef.current;
    console.log('🎯 playNextTrack called - isPlaying:', isPlaying, '| tracks.length:', tracks.length, '| currentIdx:', currentIdx);
    
    if (tracks.length === 0) {
      console.log('❌ Cannot play next track: no tracks loaded');
      return;
    }
    
    if (!isPlaying) {
      console.log('❌ Cannot play next track: isPlaying is false');
      return;
    }

    // Stop current audio before playing next
    if (audioRef1.current) {
      audioRef1.current.pause();
    }

    const nextIndex = (currentIdx + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    // Video cycles independently through all 47 videos
    const currentVidIdx = currentVideoIndexRef.current;
    const nextVideoIndex = (currentVidIdx + 1) % ALL_LANDING_VIDEOS.length;
    const playbackRate = getPlaybackRate(nextTrack.estimatedBPM);
    
    console.log(`🔄 Advancing to track [${nextIndex + 1}/${tracks.length}]:`, nextTrack.name, `| Video [${nextVideoIndex + 1}/${ALL_LANDING_VIDEOS.length}]`);
    
    // Always use audioRef1 for simplicity - we've stopped everything
    const nextAudio = audioRef1.current;

    if (!nextAudio) {
      console.error('❌ Audio ref is null');
      return;
    }

    // Set up and play the next track via AudioManager
    nextAudio.src = nextTrack.src;
    nextAudio.volume = isMuted ? 0 : 0.6;
    nextAudio.currentTime = 0;
    
    audioManager.play(nextAudio, 'main').then((success) => {
      if (success) {
        console.log('✅ Next track playing:', nextTrack.name);
      } else {
        console.error('❌ Next track play failed');
      }
    });

    // Update state AND refs for both audio and video indices
    currentTrackIndexRef.current = nextIndex;
    currentVideoIndexRef.current = nextVideoIndex;
    setCurrentTrackIndex(nextIndex);
    setCurrentVideoIndex(nextVideoIndex);
    setActiveAudioRef(1); // Always use ref 1 now
    onCurrentTrackChange(nextTrack);
    onVideoPlaybackRateChange(playbackRate);
    onVideoChange(nextVideoIndex);

    // Set 35-second timer for next track
    if (trackTimerRef.current) {
      clearTimeout(trackTimerRef.current);
    }
    trackTimerRef.current = setTimeout(() => {
      console.log('⏰ 35-second timer expired, advancing to next track');
      playNextTrack();
    }, TRACK_DURATION);
  }, [isPlaying, tracks, isMuted, onCurrentTrackChange, onVideoPlaybackRateChange, onVideoChange]);

  // Track if we're currently initializing to prevent double-play
  const isInitializingRef = useRef(false);
  // Track if audio has been started (to prevent re-triggering on dependency changes)
  const hasStartedPlaybackRef = useRef(false);

  // Handle play/pause - directly triggered from user interaction
  // CRITICAL: Only depend on isPlaying to prevent re-triggering on other state changes
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    const otherAudio = activeAudioRef === 1 ? audioRef2.current : audioRef1.current;
    
    // Guard: Don't attempt playback if tracks not loaded yet
    if (tracks.length === 0 || videos.length === 0) {
      console.log('⏳ Waiting for media to load...');
      return;
    }
    
    if (isPlaying) {
      // CRITICAL: Only initialize once - prevent double playback when dependencies change
      if (hasStartedPlaybackRef.current) {
        console.log('🔒 Playback already started, skipping re-initialization');
        return;
      }
      
      if (!isInitializingRef.current) {
        // First play - set up audio and video
        isInitializingRef.current = true;
        hasStartedPlaybackRef.current = true;
        // Start from track 0 (The Spartan Age) - the displayed track
        const startIndex = 0;
        const firstTrack = tracks[startIndex];
        const firstVideo = videos[startIndex];
        if (currentAudio && firstVideo) {
          console.log('🎵 Starting first playback:', firstTrack.name);
          
          // Stop intro audio via AudioManager
          audioManager.stopIntro();
          
          // Clear any existing timers
          if (trackTimerRef.current) {
            clearTimeout(trackTimerRef.current);
            trackTimerRef.current = undefined;
          }
          
          // Now set up the first track on the active audio element
          currentAudio.muted = false;
          currentAudio.src = firstTrack.src;
          currentAudio.volume = isMuted ? 0 : 0.6;
          currentAudio.crossOrigin = 'anonymous';
          currentAudio.preload = 'auto';
          
          // Set the track and video indices to startIndex (both state and ref)
          currentTrackIndexRef.current = startIndex;
          currentVideoIndexRef.current = startIndex;
          setCurrentTrackIndex(startIndex);
          setCurrentVideoIndex(startIndex);
          
          // Trigger video via callback
          const playbackRate = getPlaybackRate(firstTrack.estimatedBPM);
          onVideoPlaybackRateChange(playbackRate);
          onVideoChange(startIndex);
          
          // Attempt to play audio via AudioManager
          const attemptPlay = async () => {
            const success = await audioManager.play(currentAudio, 'main');
            if (success) {
              console.log('✅ Audio playing successfully');
              
              // Set 35-second timer for next track
              if (trackTimerRef.current) {
                clearTimeout(trackTimerRef.current);
              }
              trackTimerRef.current = setTimeout(() => {
                console.log('⏰ 35-second timer expired, advancing to next track');
                playNextTrack();
              }, TRACK_DURATION);
              console.log('⏰ 35-second timer set');
              
              onPlaybackStateChange(true);
              onCurrentTrackChange(firstTrack);
              console.log('🎬 Video playback rate:', playbackRate, 'BPM:', firstTrack.estimatedBPM);
              isInitializingRef.current = false;
            } else {
              console.error('❌ Play failed, retrying...');
              // Retry after a short delay
              setTimeout(async () => {
                const retrySuccess = await audioManager.play(currentAudio, 'main');
                if (retrySuccess) {
                  console.log('✅ Playing after retry');
                  
                  // Set 35-second timer for next track
                  if (trackTimerRef.current) {
                    clearTimeout(trackTimerRef.current);
                  }
                  trackTimerRef.current = setTimeout(() => {
                    console.log('⏰ 35-second timer expired, advancing to next track');
                    playNextTrack();
                  }, TRACK_DURATION);
                  
                  onPlaybackStateChange(true);
                  onCurrentTrackChange(firstTrack);
                  isInitializingRef.current = false;
                } else {
                  console.error('❌ Retry failed');
                  onPlaybackStateChange(false);
                  isInitializingRef.current = false;
                  hasStartedPlaybackRef.current = false; // Allow retry
                }
              }, 100);
            }
          };
          
          attemptPlay();
        }
      }
    } else {
      console.log('⏸️ Pausing playback...');
      // Pause BOTH audio elements to be safe
      audioRef1.current?.pause();
      audioRef2.current?.pause();
      hasStartedPlaybackRef.current = false; // Reset so next play can initialize
      if (trackTimerRef.current) {
        clearTimeout(trackTimerRef.current);
        trackTimerRef.current = undefined;
      }
    }
  // CRITICAL: Only depend on isPlaying - other changes should NOT re-trigger playback
  }, [isPlaying, tracks.length, videos.length]);

  // Handle mute
  useEffect(() => {
    if (audioRef1.current) audioRef1.current.volume = isMuted ? 0 : 0.6;
    if (audioRef2.current) audioRef2.current.volume = isMuted ? 0 : 0.6;
  }, [isMuted]);

  // Skip to next track
  useEffect(() => {
    (window as any).__skipLandingTrack = () => {
      console.log('⏭️ Skip button clicked');
      if (trackTimerRef.current) {
        clearTimeout(trackTimerRef.current);
        trackTimerRef.current = undefined;
      }
      playNextTrack();
    };
  }, [playNextTrack]);

  // Cleanup
  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;
    const timerRef = trackTimerRef;
    
    return () => {
      console.log('🧹 LandingPagePlayer cleanup');
      
      // Clear timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      
      // Stop audio
      if (audio1) {
        audio1.pause();
        audio1.src = '';
      }
      if (audio2) {
        audio2.pause();
        audio2.src = '';
      }
      
      // Clear global references
      (window as any).__skipLandingTrack = null;
      hasStartedPlaybackRef.current = false;
    };
  }, []);

  return (
    <>
      <audio ref={audioRef1} crossOrigin="anonymous" preload="auto" />
      <audio ref={audioRef2} crossOrigin="anonymous" preload="auto" />
    </>
  );
};
