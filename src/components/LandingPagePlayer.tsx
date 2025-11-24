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

// Curated playlist with specific tracks
const CURATED_PLAYLIST = [
  {
    filename: 'The Spartan New Age.mp3',
    therapeuticGoal: 'Focus Enhancement Goal',
    genre: 'New Age',
    artist: 'The Scientists',
    estimatedBPM: 75
  },
  {
    filename: 'Can we cross the line small room Radio.mp3',
    therapeuticGoal: 'Mood Boost',
    genre: 'Country',
    artist: 'Van Wild',
    estimatedBPM: 80
  },
  {
    filename: 'Expanding universe instrumental.mp3',
    therapeuticGoal: 'Relaxation Goal',
    genre: 'Crossover Classical',
    artist: 'Yasmine',
    estimatedBPM: 65
  },
  {
    filename: 'venha-ao-meu-jardim-samba-bossa-nova-2.mp3',
    therapeuticGoal: 'Pain Reduction',
    genre: 'Serene Samba',
    artist: 'Yasmine',
    estimatedBPM: 90
  },
  {
    filename: '_DJ CHRIS Versus DJ EDward VOL 4 HOUSE WORLD.mp3',
    therapeuticGoal: 'Energy Boost Goal',
    genre: 'Tropical House',
    artist: 'DJ CHRIS Versus DJ EDward',
    estimatedBPM: 120
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

  // Fetch media on mount
  useEffect(() => {
    const fetchMedia = async () => {
      // Build curated tracks from playlist
      const audioTracks = CURATED_PLAYLIST.map(track => {
        const src = supabase.storage.from('landingpagemusicexcerpts').getPublicUrl(track.filename).data.publicUrl;
        console.log(`🎵 Loading track: ${track.filename}`, src);
        return {
          src,
          name: track.filename.replace(/\.(mp3|MP3)$/, '').replace(/_/g, ' '),
          genre: track.genre,
          artist: track.artist,
          therapeuticGoal: track.therapeuticGoal,
          estimatedBPM: track.estimatedBPM
        };
      });
      
      setTracks(audioTracks);
      if (audioTracks.length > 0) {
        console.log('🎵 Setting initial track:', audioTracks[0]);
        onCurrentTrackChange(audioTracks[0]);
      }

      // Fetch videos
      const { data: videoData } = await supabase.storage
        .from('landingpage')
        .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });

      if (videoData) {
        const videoFiles = videoData
          .filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.MP4'))
          .map(file => ({
            src: supabase.storage.from('landingpage').getPublicUrl(file.name).data.publicUrl
          }));
        setVideos(videoFiles);
      }
    };

    fetchMedia();
  }, []);

  // Calculate video playback rate from BPM (very slow for calm, moderate for energetic: 0.4x-0.9x)
  const getPlaybackRate = (bpm: number): number => {
    const normalizedBPM = Math.max(60, Math.min(120, bpm));
    return 0.4 + ((normalizedBPM - 60) / 60) * 0.5;
  };

  // Start next track with crossfade
  const playNextTrack = () => {
    if (tracks.length === 0) {
      console.log('❌ Cannot play next track: no tracks loaded');
      return;
    }

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    const nextVideoIndex = (currentVideoIndex + 1) % videos.length;
    
    console.log(`🔄 Playing next track [${nextIndex + 1}/${tracks.length}]:`, nextTrack.name);
    console.log(`🎬 Switching to video [${nextVideoIndex + 1}/${videos.length}]`);
    
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    const nextAudio = activeAudioRef === 1 ? audioRef2.current : audioRef1.current;

    if (!nextAudio) {
      console.error('❌ Next audio ref is null');
      return;
    }

    // Prepare next track
    nextAudio.src = nextTrack.src;
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
    
    // Update video playback rate
    const playbackRate = getPlaybackRate(nextTrack.estimatedBPM);
    onVideoPlaybackRateChange(playbackRate);
    console.log('🎬 Video playback rate:', playbackRate);

    // Schedule next track
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
    console.log(`⏱️ Next track scheduled in ${TRACK_DURATION / 1000}s`);
  };

  // Handle play/pause
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    
    if (isPlaying && tracks.length > 0) {
      if (!currentAudio?.src) {
        // First play
        const firstTrack = tracks[0];
        if (currentAudio) {
          console.log('🎵 Starting first playback:', firstTrack.src);
          currentAudio.src = firstTrack.src;
          currentAudio.volume = isMuted ? 0 : 0.6;
          currentAudio.crossOrigin = 'anonymous';
          currentAudio.load();
          
          // Wait for canplaythrough event before playing
          const playAudio = () => {
            currentAudio.play()
              .then(() => {
                console.log('✅ Audio playing successfully');
                onPlaybackStateChange(true);
              })
              .catch(err => {
                console.error('❌ Audio play failed:', err);
                if (err.name === 'NotAllowedError') {
                  console.log('🔒 Autoplay blocked - user needs to click play button');
                }
              });
          };
          
          currentAudio.addEventListener('canplaythrough', playAudio, { once: true });
          
          const playbackRate = getPlaybackRate(firstTrack.estimatedBPM);
          onVideoPlaybackRateChange(playbackRate);
          console.log('🎬 Initial video playback rate:', playbackRate, 'for BPM:', firstTrack.estimatedBPM);
        }
        
        trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
        console.log(`⏱️ First track will play for ${TRACK_DURATION / 1000}s`);
      } else {
        currentAudio?.play()
          .then(() => console.log('✅ Audio resumed'))
          .catch(err => console.error('❌ Audio resume failed:', err));
      }
    } else {
      currentAudio?.pause();
      if (trackTimerRef.current) {
        clearTimeout(trackTimerRef.current);
      }
    }
  }, [isPlaying, tracks]);

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
    };
  }, []);

  return (
    <>
      <audio ref={audioRef1} className="hidden" />
      <audio ref={audioRef2} className="hidden" />
    </>
  );
};
