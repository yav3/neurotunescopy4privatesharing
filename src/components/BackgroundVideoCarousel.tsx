import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface VideoSource {
  src: string;
  type: 'video/mp4';
}

interface AudioSource {
  src: string;
}

export const BackgroundVideoCarousel = () => {
  const [videos, setVideos] = useState<VideoSource[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioSource[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch videos and audio from Supabase
  useEffect(() => {
    const fetchMedia = async () => {
      console.log('🎬 Fetching videos from landingpage bucket...');
      
      // Fetch videos
      const { data: videoData, error: videoError } = await supabase.storage
        .from('landingpage')
        .list('', { 
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (videoError) {
        console.error('❌ Error fetching videos:', videoError);
      } else {
        console.log('📦 Raw video data:', videoData);
        const videoFiles = videoData
          ?.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.MP4'))
          .map(file => ({
            src: supabase.storage.from('landingpage').getPublicUrl(file.name).data.publicUrl,
            type: 'video/mp4' as const
          })) || [];

        console.log(`✅ Found ${videoFiles.length} videos:`, videoFiles.map(v => v.src));
        
        if (videoFiles.length > 0) {
          setVideos(videoFiles);
        } else {
          console.warn('⚠️ No MP4 videos found in landingpage bucket');
        }
      }

      // Fetch audio tracks
      console.log('🎵 Fetching audio from landingpagemusicexcerpts bucket...');
      const { data: audioData, error: audioError } = await supabase.storage
        .from('landingpagemusicexcerpts')
        .list('', { 
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (audioError) {
        console.error('❌ Error fetching audio:', audioError);
      } else {
        console.log('📦 Raw audio data:', audioData);
        const audioFiles = audioData
          ?.filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.MP3'))
          .map(file => ({
            src: supabase.storage.from('landingpagemusicexcerpts').getPublicUrl(file.name).data.publicUrl
          })) || [];

        console.log(`✅ Found ${audioFiles.length} audio tracks:`, audioFiles.map(a => a.src));
        
        if (audioFiles.length > 0) {
          setAudioTracks(audioFiles);
        } else {
          console.warn('⚠️ No audio files found in landingpagemusicexcerpts bucket');
        }
      }
    };

    fetchMedia();
  }, []);

  const currentVideo = videos[currentIndex];
  const currentAudio = audioTracks[currentIndex % audioTracks.length];

  // Auto-advance to next video and audio when current video ends
  useEffect(() => {
    if (!currentVideo || videos.length === 0) return;

    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        setIsTransitioning(false);
      }, 1000);
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentVideo, videos.length]);

  // Ensure video and audio play continuously
  useEffect(() => {
    if (!currentVideo || !videoRef.current) return;

    const video = videoRef.current;
    const audio = audioRef.current;
    
    const playMedia = async () => {
      try {
        video.muted = true;
        video.load(); // Force reload
        await video.play();
        console.log('✅ Video playing:', currentVideo.src);
        
        if (audio && currentAudio) {
          audio.volume = 0.6;
          audio.load(); // Force reload
          await audio.play();
          console.log('✅ Landing page audio playing:', currentAudio.src);
        }
      } catch (err) {
        console.error('⚠️ Media autoplay blocked or failed:', err);
        // Retry after a short delay
        setTimeout(() => {
          video.play().catch(e => console.error('Video retry failed:', e));
          audio?.play().catch(e => console.error('Audio retry failed:', e));
        }, 500);
      }
    };

    // Play immediately
    playMedia();
    
    // Also play when metadata is loaded
    video.addEventListener('loadeddata', playMedia, { once: true });
    video.addEventListener('canplay', () => {
      if (video.paused) {
        video.play().catch(console.error);
      }
    });
    
    return () => {
      video.removeEventListener('loadeddata', playMedia);
    };
  }, [currentVideo, currentAudio]);

  // Cleanup audio on unmount to prevent conflicts with main player
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.load();
        console.log('🧹 Landing page audio cleaned up on unmount');
      }
    };
  }, []);

  if (!currentVideo) {
    return (
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center text-white text-sm">
        <div className="text-center">
          <div className="mb-2">Loading videos...</div>
          <div className="text-xs opacity-60">Videos: {videos.length} | Audio: {audioTracks.length}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={currentVideo.src} type="video/mp4" />
            </video>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Synced audio track */}
      {currentAudio && (
        <audio
          ref={audioRef}
          autoPlay
          loop={false}
          className="hidden"
        >
          <source src={currentAudio.src} />
        </audio>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
