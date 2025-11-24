import { useEffect, useState, useRef } from 'react';
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

// Curated playlist with specific tracks tethered to specific videos
const CURATED_PLAYLIST = [
  {
    filename: 'The Spartan New Age.mp3',
    videoFilename: '19700121_0255_6920bf4af3c8819193e99453d6ad674a.mp4',
    therapeuticGoal: 'Focus Enhancement Goal',
    genre: 'New Age',
    artist: 'The Scientists',
    estimatedBPM: 75
  },
  {
    filename: 'Can we cross the line small room Radio.mp3',
    videoFilename: '19700121_0258_6923840584fc8191a6b2658f4caceac4.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Country',
    artist: 'Van Wild',
    estimatedBPM: 80
  },
  {
    filename: 'Expanding universe instrumental.mp3',
    videoFilename: '20251122_0435_01kanep60pf8mr4494225wy94z.mp4',
    therapeuticGoal: 'Relaxation Goal',
    genre: 'Crossover Classical',
    artist: 'Yasmine',
    estimatedBPM: 65
  },
  {
    filename: 'venha-ao-meu-jardim-samba-bossa-nova-2.mp3',
    videoFilename: '20251122_0450_01kanf03azfr5b3gy0328zj5j8.mp4',
    therapeuticGoal: 'Pain Reduction',
    genre: 'Serene Samba',
    artist: 'Yasmine',
    estimatedBPM: 90
  },
  {
    filename: '_DJ CHRIS Versus DJ EDward VOL 4 HOUSE WORLD.mp3',
    videoFilename: '20251123_1505_01kakyxn2mfma8jw0q7bjwax6x.mp4',
    therapeuticGoal: 'Energy Boost Goal',
    genre: 'Tropical House',
    artist: 'DJ CHRIS Versus DJ EDward',
    estimatedBPM: 120
  }
];

// Additional videos to cycle through when looping is needed during 35-second tracks
const ADDITIONAL_VIDEOS = [
  '20251123_1513_01kanep60pf8mr4494225wy94z.mp4',
  '20251123_1513_01kanf03azfr5b3gy0328zj5j8.mp4',
  '20251123_1513_01kanfadzdfj8bw4v44zkkd7p6.mp4',
  '20251123_1513_01kanfhac2e0sabhsp8c9zp85w.mp4',
  '20251123_1514_01kasce44qefe9j5s49v6jkg0t.mp4',
  '20251123_1514_01kascfe9he71bcdzcw3wp3e2n.mp4',
  '19700121_0255_6920bf4af3c8819193e99453d6ad674a.mp4'
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeAudioRef, setActiveAudioRef] = useState<1 | 2>(1);
  const trackTimerRef = useRef<NodeJS.Timeout>();
  const syncFrameRef = useRef<number>();

  // Expose the currently active audio element globally so the video layer can sync to it
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    (window as any).__landingActiveAudio = currentAudio || null;
  }, [activeAudioRef]);

  // Fetch media on mount
  useEffect(() => {
    const fetchMedia = async () => {
      // Build curated tracks with tethered videos from playlist
      const audioTracks = CURATED_PLAYLIST.map(track => {
        const audioSrc = supabase.storage.from('landingpagemusicexcerpts').getPublicUrl(track.filename).data.publicUrl;
        const videoSrc = supabase.storage.from('landingpage').getPublicUrl(track.videoFilename).data.publicUrl;
        console.log(`🎵 Loading track: ${track.filename} → 🎬 ${track.videoFilename}`);
        return {
          src: audioSrc,
          name: track.filename.replace(/\.(mp3|MP3)$/, '').replace(/_/g, ' '),
          genre: track.genre,
          artist: track.artist,
          therapeuticGoal: track.therapeuticGoal,
          estimatedBPM: track.estimatedBPM
        };
      });
      
      // Build video array matching the track order
      const videoFiles = CURATED_PLAYLIST.map(track => ({
        src: supabase.storage.from('landingpage').getPublicUrl(track.videoFilename).data.publicUrl
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

  // Calculate video playback rate from BPM (very slow for calm, moderate for energetic: 0.4x-0.9x)
  const getPlaybackRate = (bpm: number): number => {
    const normalizedBPM = Math.max(60, Math.min(120, bpm));
    return 0.4 + ((normalizedBPM - 60) / 60) * 0.5;
  };

  // Start next track with crossfade - each track tethered to its specific video
  const playNextTrack = () => {
    if (tracks.length === 0) {
      console.log('❌ Cannot play next track: no tracks loaded');
      return;
    }

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    const nextVideo = videos[nextIndex];
    const nextVideoIndex = nextIndex;
    
    console.log(`🔄 Playing next track [${nextIndex + 1}/${tracks.length}]:`, nextTrack.name);
    console.log(`🎬 Switching to tethered video [${nextVideoIndex + 1}/${videos.length}]`);
    
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    const nextAudio = activeAudioRef === 1 ? audioRef2.current : audioRef1.current;
    const video = videoRef.current;

    if (!nextAudio || !video) {
      console.error('❌ Next audio ref or video ref is null');
      return;
    }

    // Switch video
    video.src = nextVideo.src;
    video.muted = true;
    const playbackRate = getPlaybackRate(nextTrack.estimatedBPM);
    video.playbackRate = playbackRate;
    video.play().catch(console.error);
    onVideoPlaybackRateChange(playbackRate);
    console.log('🎬 Video playback rate:', playbackRate);

    // Prepare next track
    nextAudio.src = nextTrack.src;
    nextAudio.muted = false;
    nextAudio.volume = 0;
    nextAudio.load();
    console.log('📥 Next track loaded:', nextTrack.src);

    // Start playing next track
    nextAudio.play().then(() => {
      console.log('✅ Next track playing, starting crossfade');
      // Crossfade
      const fadeSteps = 20;
      const fadeInterval = CROSSFADE_DURATION / fadeSteps;
      let step = 0;

      const fadeTimer = setInterval(() => {
        step++;
        const progress = step / fadeSteps;
        
        if (currentAudio) {
          currentAudio.volume = isMuted ? 0 : (1 - progress) * 0.6;
        }
        if (nextAudio) {
          nextAudio.volume = isMuted ? 0 : progress * 0.6;
        }

        if (step >= fadeSteps) {
          clearInterval(fadeTimer);
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.src = '';
          }
          console.log('✅ Crossfade complete');
        }
      }, fadeInterval);
    }).catch(err => {
      console.error('❌ Next track play failed:', err);
    });

    // Update state
    setCurrentTrackIndex(nextIndex);
    setCurrentVideoIndex(nextVideoIndex);
    setActiveAudioRef(activeAudioRef === 1 ? 2 : 1);
    onCurrentTrackChange(nextTrack);
    onVideoChange(nextVideoIndex);
    console.log('✅ State updated, active audio:', activeAudioRef === 1 ? 2 : 1);

    // Schedule next track
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
    console.log(`⏱️ Next track scheduled in ${TRACK_DURATION / 1000}s`);
  };

  // Sync audio and video playback
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    const video = videoRef.current;
    
    if (!currentAudio || !video) return;

    const syncLoop = () => {
      if (isPlaying && Math.abs(video.currentTime - currentAudio.currentTime) > 0.05) {
        video.currentTime = currentAudio.currentTime;
      }
      syncFrameRef.current = requestAnimationFrame(syncLoop);
    };

    syncLoop();
    return () => {
      if (syncFrameRef.current) cancelAnimationFrame(syncFrameRef.current);
    };
  }, [isPlaying, activeAudioRef]);

  // Handle play/pause - directly triggered from user interaction
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    const video = videoRef.current;
    
    if (isPlaying && tracks.length > 0) {
      if (!currentAudio?.src) {
        // First play - set up audio and video
        const firstTrack = tracks[0];
        const firstVideo = videos[0];
        if (currentAudio && video && firstVideo) {
          console.log('🎵 Starting first playback:', firstTrack.name);
          
          // CRITICAL: Set muted states BEFORE setting src
          currentAudio.muted = false;
          video.muted = false; // Unmute video to unlock audio context
          
          currentAudio.src = firstTrack.src;
          currentAudio.volume = isMuted ? 0 : 0.6;
          currentAudio.crossOrigin = 'anonymous';
          currentAudio.preload = 'auto';
          
          video.src = firstVideo.src;
          video.volume = 0; // Video audio at 0, actual audio from audio element
          video.preload = 'auto';
          
          const playbackRate = getPlaybackRate(firstTrack.estimatedBPM);
          video.playbackRate = playbackRate;
          onVideoPlaybackRateChange(playbackRate);
          
          // Attempt to play both
          const attemptPlay = async () => {
            try {
              await video.play();
              console.log('✅ Video playing');
              await currentAudio.play();
              console.log('✅ Audio playing successfully');
              onPlaybackStateChange(true);
            } catch (err) {
              console.error('❌ Play failed:', err);
              // Retry after a short delay
              setTimeout(async () => {
                try {
                  await video.play();
                  await currentAudio.play();
                  console.log('✅ Playing after retry');
                  onPlaybackStateChange(true);
                } catch (e) {
                  console.error('❌ Retry failed:', e);
                  onPlaybackStateChange(false);
                }
              }, 100);
            }
          };
          
          attemptPlay();
          onCurrentTrackChange(firstTrack);
          console.log('🎬 Video playback rate:', playbackRate, 'BPM:', firstTrack.estimatedBPM);
        }
        
        trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
        console.log(`⏱️ Track will play for ${TRACK_DURATION / 1000}s`);
      } else {
        // Resume playback
        console.log('▶️ Resuming playback...');
        video?.play().catch(console.error);
        currentAudio?.play()
          .then(() => {
            console.log('✅ Audio resumed successfully');
            onPlaybackStateChange(true);
          })
          .catch(err => {
            console.error('❌ Audio resume failed:', err);
            onPlaybackStateChange(false);
          });
      }
    } else if (!isPlaying) {
      console.log('⏸️ Pausing playback...');
      video?.pause();
      currentAudio?.pause();
      if (trackTimerRef.current) {
        clearTimeout(trackTimerRef.current);
      }
    }
  }, [isPlaying, tracks, videos, isMuted]);

  // Handle mute
  useEffect(() => {
    if (audioRef1.current) audioRef1.current.volume = isMuted ? 0 : 0.6;
    if (audioRef2.current) audioRef2.current.volume = isMuted ? 0 : 0.6;
  }, [isMuted]);

  // Skip to next track
  useEffect(() => {
    (window as any).__skipLandingTrack = () => {
      if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
      playNextTrack();
    };
  }, [currentTrackIndex, tracks, videos, activeAudioRef]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
      if (syncFrameRef.current) cancelAnimationFrame(syncFrameRef.current);
      audioRef1.current?.pause();
      audioRef2.current?.pause();
      videoRef.current?.pause();
      (window as any).__landingActiveAudio = null;
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        loop
        className="fixed inset-0 w-full h-full object-cover z-0"
        onLoadedData={() => console.log('🎬 Video loaded and ready')}
        onPlay={() => console.log('🎬 Video started playing')}
        onPause={() => console.log('🎬 Video paused')}
        onError={(e) => console.error('🎬 Video error:', e)}
      />
      <audio ref={audioRef1} crossOrigin="anonymous" preload="auto" />
      <audio ref={audioRef2} crossOrigin="anonymous" preload="auto" />
    </>
  );
};
