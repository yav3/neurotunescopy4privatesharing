import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface VideoSource {
  src: string;
  type: 'video/mp4';
}

export const BackgroundVideoCarousel = () => {
  const [videos, setVideos] = useState<VideoSource[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch videos from Supabase landingpage bucket
  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.storage
        .from('landingpage')
        .list('', { 
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      const videoFiles = data
        ?.filter(file => file.name.endsWith('.mp4'))
        .map(file => ({
          src: supabase.storage.from('landingpage').getPublicUrl(file.name).data.publicUrl,
          type: 'video/mp4' as const
        })) || [];

      if (videoFiles.length > 0) {
        setVideos(videoFiles);
      }
    };

    fetchVideos();
  }, []);

  const currentVideo = videos[currentIndex];

  // Auto-advance to next video when current video ends
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

  // Ensure video plays continuously
  useEffect(() => {
    if (!currentVideo || !videoRef.current) return;

    const video = videoRef.current;
    
    const playVideo = async () => {
      try {
        video.muted = true;
        await video.play();
        console.log('✅ Video playing:', currentVideo.src);
      } catch (err) {
        console.error('⚠️ Video autoplay blocked:', err);
        setTimeout(() => video.play().catch(console.error), 500);
      }
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo, { once: true });
    
  }, [currentVideo]);

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
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
