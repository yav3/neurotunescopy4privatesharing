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

interface BackgroundVideoCarouselProps {
  playbackRate?: number;
  currentVideoIndex?: number;
  isLandingPagePlayerActive?: boolean;
}

export const BackgroundVideoCarousel = ({ 
  playbackRate = 1.0,
  currentVideoIndex,
  isLandingPagePlayerActive = false
}: BackgroundVideoCarouselProps) => {
  const [videos, setVideos] = useState<VideoSource[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch videos from Supabase
  useEffect(() => {
    const fetchMedia = async () => {
      console.log('🎬 Fetching videos from landingpage bucket...');
      
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
    };

    fetchMedia();
  }, []);

  const currentVideo = videos[currentIndex];

  // Update index when controlled externally
  useEffect(() => {
    if (currentVideoIndex !== undefined && currentVideoIndex !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentVideoIndex);
        setIsTransitioning(false);
      }, 1000);
    }
  }, [currentVideoIndex]);

  // Auto-advance to next video when current video ends (only if not controlled externally)
  useEffect(() => {
    if (!currentVideo || videos.length === 0 || currentVideoIndex !== undefined) return;

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
  }, [currentVideo, videos.length, currentVideoIndex]);

  // Set video playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
      console.log(`🎬 Video playback rate set to ${playbackRate.toFixed(2)}x`);
    }
  }, [playbackRate]);

  // Ensure video plays continuously
  useEffect(() => {
    if (!currentVideo || !videoRef.current) return;

    const video = videoRef.current;
    
    const playMedia = async () => {
      try {
        video.muted = true;
        video.playbackRate = playbackRate;
        video.load();
        await video.play();
        console.log('✅ Video playing:', currentVideo.src);
      } catch (err) {
        console.error('⚠️ Video autoplay blocked or failed:', err);
        setTimeout(() => {
          video.play().catch(e => console.error('Video retry failed:', e));
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
  }, [currentVideo, playbackRate]);

  if (!currentVideo) {
    return (
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center text-white text-sm">
        <div className="text-center">
          <div className="mb-2">Loading videos...</div>
          <div className="text-xs opacity-60">Videos: {videos.length}</div>
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
              loop
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
