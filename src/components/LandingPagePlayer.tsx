import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AudioTrack {
  src: string;
  name: string;
  genre: string;
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

// Estimate BPM from filename or default to relaxing tempo
const estimateBPM = (filename: string): number => {
  const bpmMatch = filename.match(/(\d{2,3})bpm/i);
  if (bpmMatch) return parseInt(bpmMatch[1]);
  
  // Default to relaxing tempo range
  return 70;
};

// Determine genre from filename
const determineGenre = (filename: string): string => {
  const lower = filename.toLowerCase();
  if (lower.includes('focus')) return 'Focus';
  if (lower.includes('sleep') || lower.includes('calm')) return 'Sleep';
  if (lower.includes('energy') || lower.includes('active')) return 'Energy';
  if (lower.includes('meditat')) return 'Meditation';
  return 'Relaxation';
};

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
      // Fetch audio
      const { data: audioData } = await supabase.storage
        .from('landingpagemusicexcerpts')
        .list('', { limit: 100, sortBy: { column: 'name', order: 'asc' } });

      if (audioData) {
        const audioTracks = audioData
          .filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.MP3'))
          .map(file => {
            const src = supabase.storage.from('landingpagemusicexcerpts').getPublicUrl(file.name).data.publicUrl;
            const estimatedBPM = estimateBPM(file.name);
            return {
              src,
              name: file.name.replace(/\.(mp3|MP3)$/, '').replace(/_/g, ' '),
              genre: determineGenre(file.name),
              estimatedBPM
            };
          });
        setTracks(audioTracks);
        if (audioTracks.length > 0) {
          onCurrentTrackChange(audioTracks[0]);
        }
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

  // Calculate video playback rate from BPM (60-90 BPM -> 0.85x-1.15x)
  const getPlaybackRate = (bpm: number): number => {
    const normalizedBPM = Math.max(60, Math.min(90, bpm));
    return 0.85 + ((normalizedBPM - 60) / 30) * 0.3;
  };

  // Start next track with crossfade
  const playNextTrack = () => {
    if (tracks.length === 0) return;

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    const nextVideoIndex = (currentVideoIndex + 1) % videos.length;
    
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    const nextAudio = activeAudioRef === 1 ? audioRef2.current : audioRef1.current;

    if (!nextAudio) return;

    // Prepare next track
    nextAudio.src = nextTrack.src;
    nextAudio.volume = 0;
    nextAudio.load();

    // Start playing next track
    nextAudio.play().then(() => {
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
        }
      }, fadeInterval);
    });

    // Update state
    setCurrentTrackIndex(nextIndex);
    setCurrentVideoIndex(nextVideoIndex);
    setActiveAudioRef(activeAudioRef === 1 ? 2 : 1);
    onCurrentTrackChange(nextTrack);
    onVideoChange(nextVideoIndex);
    
    // Update video playback rate
    const playbackRate = getPlaybackRate(nextTrack.estimatedBPM);
    onVideoPlaybackRateChange(playbackRate);

    // Schedule next track
    if (trackTimerRef.current) clearTimeout(trackTimerRef.current);
    trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
  };

  // Handle play/pause
  useEffect(() => {
    const currentAudio = activeAudioRef === 1 ? audioRef1.current : audioRef2.current;
    
    if (isPlaying && tracks.length > 0) {
      if (!currentAudio?.src) {
        // First play
        const firstTrack = tracks[0];
        if (currentAudio) {
          currentAudio.src = firstTrack.src;
          currentAudio.volume = isMuted ? 0 : 0.6;
          currentAudio.load();
          currentAudio.play();
          
          const playbackRate = getPlaybackRate(firstTrack.estimatedBPM);
          onVideoPlaybackRateChange(playbackRate);
        }
        
        trackTimerRef.current = setTimeout(playNextTrack, TRACK_DURATION);
      } else {
        currentAudio?.play();
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
