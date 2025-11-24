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

// Direct URLs for audio tracks
const CURATED_PLAYLIST = [
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/The-Spartan-Age-(1).mp3',
    videoFilename: '19700121_0255_6920bf4af3c8819193e99453d6ad674a.mp4',
    therapeuticGoal: 'Focus Enhancement Goal',
    genre: 'New Age',
    artist: 'The Scientists',
    name: 'The Spartan Age',
    estimatedBPM: 75
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/na%20na%20oohhh%20CROSS%20THE%20LINE%20HOUSE%20MIX.mp3',
    videoFilename: '19700121_0258_6923840584fc8191a6b2658f4caceac4.mp4',
    therapeuticGoal: 'Mood Boost',
    genre: 'Country',
    artist: 'Van Wild',
    name: 'Cross The Line House Mix',
    estimatedBPM: 80
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/Alternative%20frequencies%20expanding%20universe%20instrumental.mp3',
    videoFilename: '20251122_0435_01kanep60pf8mr4494225wy94z.mp4',
    therapeuticGoal: 'Relaxation Goal',
    genre: 'Crossover Classical',
    artist: 'Yasmine',
    name: 'Expanding Universe',
    estimatedBPM: 65
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/venha-ao-meu-jardim-samba-bossa-nova-2.mp3',
    videoFilename: '20251122_0450_01kanf03azfr5b3gy0328zj5j8.mp4',
    therapeuticGoal: 'Pain Reduction',
    genre: 'Serene Samba',
    artist: 'Yasmine',
    name: 'Venha ao Meu Jardim',
    estimatedBPM: 90
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/_DJ%20CHRIS%20Versus%20DJ%20EDward%20VOL%204%20HOUSE%20WORLD%20.mp3',
    videoFilename: '20251123_1505_01kakyxn2mfma8jw0q7bjwax6x.mp4',
    therapeuticGoal: 'Energy Boost Goal',
    genre: 'Tropical House',
    artist: 'DJ CHRIS Versus DJ EDward',
    name: 'House World',
    estimatedBPM: 120
  },
  {
    audioUrl: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/landingpagemusicexcerpts/quietude-nocturne-(remastered).mp3',
    videoFilename: '20251122_0435_01kanep60pf8mr4494225wy94z.mp4',
    therapeuticGoal: 'Sleep Enhancement',
    genre: 'Ambient',
    artist: 'Yasmine',
    name: 'Quietude Nocturne',
    estimatedBPM: 60
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
  const [activeAudioRef, setActiveAudioRef] = useState<1 | 2>(1);
  const trackTimerRef = useRef<NodeJS.Timeout>();

  // Expose the currently active audio element globally so the video layer can sync to it
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    (window as any).__landingActiveAudio = currentAudio || null;
  }, [activeAudioRef]);

  // Fetch media on mount
  useEffect(() => {
    const fetchMedia = async () => {
      // Build curated tracks with direct URLs
      const audioTracks = CURATED_PLAYLIST.map(track => {
        const videoSrc = supabase.storage.from('landingpage').getPublicUrl(track.videoFilename).data.publicUrl;
        console.log(`🎵 Loading track: ${track.name} → 🎬 ${track.videoFilename}`);
        return {
          src: track.audioUrl,
          name: track.name,
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

  // Calculate video playback rate from BPM (very slow for calm, fast for energetic: 0.4x-1.3x)
  const getPlaybackRate = (bpm: number): number => {
    const normalizedBPM = Math.max(60, Math.min(120, bpm));
    return 0.4 + ((normalizedBPM - 60) / 60) * 0.9;
  };

  // Start next track with crossfade - each track tethered to its specific video
  const playNextTrack = () => {
    if (tracks.length === 0 || !isPlaying) {
      console.log('❌ Cannot play next track: no tracks or not playing');
      return;
    }

    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    const nextVideo = videos[nextIndex];
    const nextVideoIndex = nextIndex;
    
    console.log(`🔄 Advancing to track [${nextIndex + 1}/${tracks.length}]:`, nextTrack.name);
    console.log(`🎬 Switching to video [${nextVideoIndex + 1}/${videos.length}]`);
    console.log(`🎵 Current track was: ${tracks[currentTrackIndex]?.name}`);
    
    
    const nextAudio = activeAudioRef === 1 ? audioRef2.current : audioRef1.current;

    if (!nextAudio) {
      console.error('❌ Next audio ref is null');
      return;
    }

    // Update video via callback (BackgroundVideoCarousel handles actual video switching)
    onVideoChange(nextVideoIndex);
    const playbackRate = getPlaybackRate(nextTrack.estimatedBPM);
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

    // Schedule next track ONLY if still playing
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    if (isPlaying) {
      trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
      console.log(`⏱️ Next track scheduled in ${TRACK_DURATION / 1000}s`);
    }
  };

  // Handle play/pause - directly triggered from user interaction
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    
    // Guard: Don't attempt playback if tracks not loaded yet
    if (tracks.length === 0 || videos.length === 0) {
      console.log('⏳ Waiting for media to load...');
      return;
    }
    
    if (isPlaying) {
      if (!currentAudio?.src) {
        // First play - set up audio and video
        const firstTrack = tracks[0];
        const firstVideo = videos[0];
        if (currentAudio && firstVideo) {
          console.log('🎵 Starting first playback:', firstTrack.name);
          
          // Set up audio
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
              
              // CRITICAL: Only schedule next track AFTER playback confirmed
              if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
              trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
              console.log(`⏱️ Track will play for ${TRACK_DURATION / 1000}s`);
              
              onPlaybackStateChange(true);
              onCurrentTrackChange(firstTrack);
              console.log('🎬 Video playback rate:', playbackRate, 'BPM:', firstTrack.estimatedBPM);
            } catch (err) {
              console.error('❌ Play failed:', err);
              // Retry after a short delay
              setTimeout(async () => {
                try {
                  await currentAudio.play();
                  console.log('✅ Playing after retry');
                  
                  // Schedule timer after successful retry
                  if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
                  trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
                  
                  onPlaybackStateChange(true);
                  onCurrentTrackChange(firstTrack);
                } catch (e) {
                  console.error('❌ Retry failed:', e);
                  onPlaybackStateChange(false);
                }
              }, 100);
            }
          };
          
          attemptPlay();
        }
      } else {
        // Resume playback
        console.log('▶️ Resuming playback...');
        currentAudio?.play()
          .then(() => {
            console.log('✅ Audio resumed successfully');
            onPlaybackStateChange(true);
            
            // Restart timer if not already running
            if (!trackTimerRef.current && isPlaying) {
              const timeLeft = (currentAudio?.duration || TRACK_DURATION / 1000) - (currentAudio?.currentTime || 0);
              trackTimerRef.current = setTimeout(playNextTrack, timeLeft * 1000);
            }
          })
          .catch(err => {
            console.error('❌ Audio resume failed:', err);
            onPlaybackStateChange(false);
          });
      }
    } else {
      console.log('⏸️ Pausing playback...');
      currentAudio?.pause();
      if (trackTimerRef.current) {
        clearTimeout(trackTimerRef.current);
        trackTimerRef.current = undefined;
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
      audioRef1.current?.pause();
      audioRef2.current?.pause();
      (window as any).__landingActiveAudio = null;
    };
  }, []);

  return (
    <>
      <audio ref={audioRef1} crossOrigin="anonymous" preload="auto" />
      <audio ref={audioRef2} crossOrigin="anonymous" preload="auto" />
    </>
  );
};
