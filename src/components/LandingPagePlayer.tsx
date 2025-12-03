import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/The-Spartan-Age-(1).mp3',
    videoPath: '/videos/landing-01.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Spartan Age',
    estimatedBPM: 75
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/The%20Seventh%20Wonder%20New%20Age%20Focus%202.mp3',
    videoPath: '/videos/landing-02.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Seventh Wonder',
    estimatedBPM: 72
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/just-how-you-like-it-country-pop-radio-cut.mp3',
    videoPath: '/videos/landing-06.mp4',
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
    audioUrl: '/audio/just-how-you-like-it-kpop.mp3',
    videoPath: '/videos/landing-03.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'K-Pop',
    artist: 'Van Wild',
    name: 'Just How You Like It',
    estimatedBPM: 95
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/quietude-nocturne-(remastered).mp3',
    videoPath: '/videos/landing-07.mp4',
    therapeuticGoal: 'Deep Rest',
    genre: 'Classical',
    artist: 'Yasmine',
    name: 'Quietude Nocturne',
    estimatedBPM: 60
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/adonis--bossa-nova-samba.mp3',
    videoPath: '/videos/landing-08.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Adonis',
    estimatedBPM: 85
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/tropicana-chill-bossa-nova-big-band-radio-mix.mp3',
    videoPath: '/videos/landing-01.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Tropicana Chill',
    estimatedBPM: 88
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/The%20prayer%20of%20the%20oud%20%20new%20age%20focus.mp3',
    videoPath: '/videos/landing-02.mp4',
    therapeuticGoal: 'Focus Enhancement',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Prayer of the Oud',
    estimatedBPM: 68
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Im%20on%20your%20team%20INDIE%20POP%20VERSION%203.mp3',
    videoPath: '/videos/landing-40.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'Indie Pop',
    artist: 'Van Wild',
    name: 'I\'m on Your Team',
    estimatedBPM: 115
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/All%20I_ve%20ever%20wanted%20country%20Radio%20Mix%20for%20ML.mp3',
    videoPath: '/videos/landing-38.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Country',
    artist: 'Van Wild',
    name: 'All I\'ve Ever Wanted',
    estimatedBPM: 100
  },
  {
    audioUrl: '/audio/blanca-blanqueando.mp3',
    videoPath: '/videos/landing-41.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Bossa Nova',
    artist: 'Yasmine',
    name: 'Blanca Blanqueando',
    estimatedBPM: 90
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Como%20con%20tu%20sombra%20samba%20bossa%20nova.mp3',
    videoPath: '/videos/landing-07.mp4',
    therapeuticGoal: 'Relaxation',
    genre: 'Serene Samba',
    artist: 'Yasmine',
    name: 'Como con Tu Sombra',
    estimatedBPM: 87
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/hold%20on%20child%20EDM%20HIIT.mp3',
    videoPath: '/videos/landing-08.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'EDM',
    artist: 'Yasmine',
    name: 'Hold on Child',
    estimatedBPM: 135
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/we%20were%20born%20to%20come%20alive%20radio%20cut%20version%20yaz%20based%20vox%20(1).mp3',
    videoPath: '/videos/landing-02.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'Pop',
    artist: 'Van Wild',
    name: 'We Were Born to Come Alive',
    estimatedBPM: 124
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Chef%20de%20Voce%20Um%20Hino%20Indie%20Pop%20remix%20DJ%20Chris%20and%20Fresh%20Edward.mp3',
    videoPath: '/videos/landing-03.mp4',
    therapeuticGoal: 'Energy Boost',
    genre: 'House',
    artist: 'DJ CHRIS',
    name: 'Chef de Voce Um Hino',
    estimatedBPM: 128
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/reggaeton%20meets%20tropical%20house%20dj%20elissa%20(3).mp3',
    videoPath: '/videos/landing-04.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'House/Reggaeton',
    artist: 'DJ Chris & Yasmine',
    name: 'Reggaeton Meets Tropical House',
    estimatedBPM: 118
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Ondas%20No%20Mar%20reggaeton%20%20(1).mp3',
    videoPath: '/videos/landing-05.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Pop/House',
    artist: 'DJ CHRIS & Van Wild',
    name: 'Ondas No Mar',
    estimatedBPM: 116
  },
  {
    audioUrl: '/audio/ondas-no-mar-samba.mp3',
    videoPath: '/videos/landing-39.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Samba',
    artist: 'Yasmine',
    name: 'Ondas No Mar',
    estimatedBPM: 105
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/deja%20vu%20vanwild%20new%20age%20mix%20(1).mp3',
    videoPath: '/videos/landing-07.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Pop',
    artist: 'Van Wild',
    name: 'Deja Vu',
    estimatedBPM: 112
  },
  {
    audioUrl: '/audio/nocturnes-chamber-orchestra.mp3',
    videoPath: '/videos/landing-42.mp4',
    therapeuticGoal: 'Deep Rest',
    genre: 'Classical',
    artist: 'The Scientists',
    name: 'Nocturnes for Chamber Orchestra',
    estimatedBPM: 65
  },
  {
    audioUrl: '/audio/your-love-big-band.mp3',
    videoPath: '/videos/landing-09.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Big Band',
    artist: 'The Scientists',
    name: 'Your Love',
    estimatedBPM: 95
  }
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const [activeAudioRef, setActiveAudioRef] = useState<1 | 2>(1);
  const trackTimerRef = useRef<NodeJS.Timeout>();

  // CRITICAL: On mount, stop ALL existing audio elements to prevent double playback
  useEffect(() => {
    console.log('🧹 LandingPagePlayer mount: cleaning up any existing audio');
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach((audio) => {
      if (audio !== audioRef1.current && audio !== audioRef2.current) {
        audio.pause();
        audio.src = '';
        audio.volume = 0;
      }
    });
    
    // Also clear any window references
    if ((window as any).__landingActiveAudio) {
      const oldAudio = (window as any).__landingActiveAudio;
      if (oldAudio && oldAudio !== audioRef1.current && oldAudio !== audioRef2.current) {
        oldAudio.pause();
        oldAudio.src = '';
      }
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
      // Build curated tracks with direct video paths
      const audioTracks = CURATED_PLAYLIST.map(track => {
        console.log(`🎵 Loading track: ${track.name} → 🎬 ${track.videoPath}`);
        return {
          src: track.audioUrl,
          name: track.name,
          genre: track.genre,
          artist: track.artist,
          therapeuticGoal: track.therapeuticGoal,
          estimatedBPM: track.estimatedBPM
        };
      });
      
      // Build video array matching the track order with local video paths
      const videoFiles = CURATED_PLAYLIST.map(track => ({
        src: track.videoPath
      }));
      
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
  const playNextTrack = useCallback(() => {
    console.log('🎯 playNextTrack called - isPlaying:', isPlaying, '| tracks.length:', tracks.length);
    
    if (tracks.length === 0) {
      console.log('❌ Cannot play next track: no tracks loaded');
      return;
    }
    
    if (!isPlaying) {
      console.log('❌ Cannot play next track: isPlaying is false');
      return;
    }

    // CRITICAL: Stop ALL audio IMMEDIATELY before doing anything else
    console.log('🔇 STOPPING ALL AUDIO IMMEDIATELY');
    if (audioRef1.current) {
      audioRef1.current.pause();
      audioRef1.current.src = '';
      audioRef1.current.currentTime = 0;
      audioRef1.current.volume = 0;
    }
    if (audioRef2.current) {
      audioRef2.current.pause();
      audioRef2.current.src = '';
      audioRef2.current.currentTime = 0;
      audioRef2.current.volume = 0;
    }

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    const nextVideoIndex = nextIndex;
    const playbackRate = getPlaybackRate(nextTrack.estimatedBPM);
    
    console.log(`🔄 Advancing to track [${nextIndex + 1}/${tracks.length}]:`, nextTrack.name);
    
    // Always use audioRef1 for simplicity - we've stopped everything
    const nextAudio = audioRef1.current;

    if (!nextAudio) {
      console.error('❌ Audio ref is null');
      return;
    }

    // Set up and play the next track
    nextAudio.src = nextTrack.src;
    nextAudio.volume = isMuted ? 0 : 0.6;
    nextAudio.currentTime = 0;
    
    nextAudio.play().then(() => {
      console.log('✅ Next track playing:', nextTrack.name);
    }).catch(err => {
      console.error('❌ Next track play failed:', err);
    });

    // Update state
    setCurrentTrackIndex(nextIndex);
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
  }, [isPlaying, tracks, videos, currentTrackIndex, isMuted, onCurrentTrackChange, onVideoPlaybackRateChange, onVideoChange]);

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
      
      if (!currentAudio?.src && !isInitializingRef.current) {
        // First play - set up audio and video
        isInitializingRef.current = true;
        hasStartedPlaybackRef.current = true;
        const firstTrack = tracks[0];
        const firstVideo = videos[0];
        if (currentAudio && firstVideo) {
          console.log('🎵 Starting first playback:', firstTrack.name);
          
          // CRITICAL: Ensure BOTH audio elements are completely silent and reset before starting
          // This prevents any "intro music" overlap from preloaded content or stale state
          if (audioRef1.current) {
            audioRef1.current.pause();
            audioRef1.current.src = '';
            audioRef1.current.currentTime = 0;
            audioRef1.current.volume = 0;
          }
          if (audioRef2.current) {
            audioRef2.current.pause();
            audioRef2.current.src = '';
            audioRef2.current.currentTime = 0;
            audioRef2.current.volume = 0;
          }
          console.log('🔇 Reset ALL audio elements to prevent overlap');
          
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
          
          // Trigger video via callback
          const playbackRate = getPlaybackRate(firstTrack.estimatedBPM);
          onVideoPlaybackRateChange(playbackRate);
          onVideoChange(0);
          
          // Attempt to play audio
          const attemptPlay = async () => {
            try {
              await currentAudio.play();
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
            } catch (err) {
              console.error('❌ Play failed:', err);
              // Retry after a short delay
              setTimeout(async () => {
                try {
                  await currentAudio.play();
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
                } catch (e) {
                  console.error('❌ Retry failed:', e);
                  onPlaybackStateChange(false);
                  isInitializingRef.current = false;
                  hasStartedPlaybackRef.current = false; // Allow retry
                }
              }, 100);
            }
          };
          
          attemptPlay();
        }
      } else if (currentAudio?.src && currentAudio.paused && !isInitializingRef.current) {
        // Resume playback - only if actually paused and not initializing
        hasStartedPlaybackRef.current = true;
        
        // Also ensure the other audio is stopped
        if (otherAudio && !otherAudio.paused) {
          console.log('⚠️ Other audio was still playing during resume, stopping it');
          otherAudio.pause();
          otherAudio.src = '';
        }
        
        console.log('▶️ Resuming playback...');
        currentAudio?.play()
          .then(() => {
            console.log('✅ Audio resumed successfully');
            onPlaybackStateChange(true);
            // Resume 35-second timer if not already running
            if (!trackTimerRef.current) {
              trackTimerRef.current = setTimeout(() => {
                console.log('⏰ 35-second timer expired, advancing to next track');
                playNextTrack();
              }, TRACK_DURATION);
            }
          })
          .catch(err => {
            console.error('❌ Audio resume failed:', err);
            onPlaybackStateChange(false);
            hasStartedPlaybackRef.current = false;
          });
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

  // Cleanup - CRITICAL: Fully stop and clear all audio to prevent double playback
  useEffect(() => {
    // Store refs locally so cleanup can access them even after unmount
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;
    const timerRef = trackTimerRef;
    
    return () => {
      console.log('🧹 LandingPagePlayer cleanup: AGGRESSIVELY stopping all audio');
      
      // Clear timer first
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      
      // Stop audio using stored refs
      if (audio1) {
        audio1.pause();
        audio1.src = '';
        audio1.currentTime = 0;
        audio1.volume = 0;
      }
      
      if (audio2) {
        audio2.pause();
        audio2.src = '';
        audio2.currentTime = 0;
        audio2.volume = 0;
      }
      
      // NUCLEAR OPTION: Find and stop ALL audio elements on the page
      const allAudioElements = document.querySelectorAll('audio');
      allAudioElements.forEach((audio) => {
        console.log('🔇 Force stopping audio element');
        audio.pause();
        audio.src = '';
        audio.volume = 0;
      });
      
      // Clear global references
      (window as any).__landingActiveAudio = null;
      (window as any).__skipLandingTrack = null;
      
      // Reset the playback started flag
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
