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
      // Fetch videos
      const { data: videoData, error: videoError } = await supabase.storage
        .from('landingpage')
        .list('', { 
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (videoError) {
        console.error('Error fetching videos:', videoError);
      } else {
        const videoFiles = videoData
          ?.filter(file => file.name.endsWith('.mp4'))
          .map(file => ({
            src: supabase.storage.from('landingpage').getPublicUrl(file.name).data.publicUrl,
            type: 'video/mp4' as const
          })) || [];

        if (videoFiles.length > 0) {
          setVideos(videoFiles);
        }
      }

      // Fetch audio tracks
      const { data: audioData, error: audioError } = await supabase.storage
        .from('landingpagemusicexcerpts')
        .list('', { 
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (audioError) {
        console.error('Error fetching audio:', audioError);
      } else {
        const audioFiles = audioData
          ?.filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.wav'))
          .map(file => ({
            src: supabase.storage.from('landingpagemusicexcerpts').getPublicUrl(file.name).data.publicUrl
          })) || [];

        if (audioFiles.length > 0) {
          setAudioTracks(audioFiles);
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
        await video.play();
        console.log('✅ Video playing:', currentVideo.src);
        
        if (audio && currentAudio) {
          audio.volume = 0.6;
          await audio.play();
          console.log('✅ Audio playing:', currentAudio.src);
        }
      } catch (err) {
        console.error('⚠️ Media autoplay blocked:', err);
        setTimeout(() => {
          video.play().catch(console.error);
          audio?.play().catch(console.error);
        }, 500);
      }
    };

    playMedia();
    video.addEventListener('loadeddata', playMedia, { once: true });
    
  }, [currentVideo, currentAudio]);

  if (!currentVideo) return null;

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
