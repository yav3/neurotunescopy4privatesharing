import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TherapeuticCategory } from '@/utils/therapeuticAudio';

// Import new background videos
const bgVideo1 = '/videos/bg-video-1.mp4';
const bgVideo2 = '/videos/bg-video-2.mp4';
const bgVideo3 = '/videos/bg-video-3.mp4';
const bgVideo4 = '/videos/bg-video-4.mp4';
const bgVideo5 = '/videos/bg-video-5.mp4';
const bgVideo6 = '/videos/bg-video-6.mp4';
const bgVideo7 = '/videos/bg-video-7.mp4';

interface VideoSource {
  src: string;
  type: 'video/mp4' | 'image/gif';
  duration: number;
}

// Organize videos by therapeutic category for track-aware transitions
const visualThemes: Record<TherapeuticCategory | 'default', VideoSource[]> = {
  // Focus & Flow - New Age sample
  focus: [
    { src: bgVideo1, type: 'video/mp4', duration: 15000 },
    { src: bgVideo2, type: 'video/mp4', duration: 15000 },
  ],
  
  // Nocturnes - Crossover Classical for Deep Rest
  calm: [
    { src: bgVideo3, type: 'video/mp4', duration: 15000 },
    { src: bgVideo4, type: 'video/mp4', duration: 15000 },
  ],
  
  // Mood Boost - Placeholder
  boost: [
    { src: bgVideo5, type: 'video/mp4', duration: 15000 },
  ],
  
  // Serene Samba - Samba Jazz for Social Relaxation
  energize: [
    { src: bgVideo6, type: 'video/mp4', duration: 15000 },
    { src: bgVideo7, type: 'video/mp4', duration: 15000 },
  ],
  
  // Default - Mixed selection for initial load
  default: [
    { src: bgVideo1, type: 'video/mp4', duration: 15000 },
    { src: bgVideo2, type: 'video/mp4', duration: 15000 },
  ],
};

export const BackgroundVideoCarousel = () => {
  const [activeTheme, setActiveTheme] = useState<TherapeuticCategory | 'default'>('default');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dimBackground, setDimBackground] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoCycleTimer = useRef<NodeJS.Timeout | null>(null);

  const activeVideoList = visualThemes[activeTheme];
  const currentVideo = activeVideoList[currentIndex];

  // Cinematic background dim - 2.4s delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDimBackground(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // Listen for category changes from MusicPreviewRow
  useEffect(() => {
    const handleCategoryChange = (e: CustomEvent<{ category: TherapeuticCategory }>) => {
      setActiveTheme(e.detail.category);
      setCurrentIndex(0); // Start from first video in new theme
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
    };
  }, []);

  // Auto-cycle within current theme every 15 seconds
  useEffect(() => {
    // Clear existing timer
    if (autoCycleTimer.current) {
      clearTimeout(autoCycleTimer.current);
    }

    // For MP4s, let video end naturally
    if (currentVideo.type === 'video/mp4' && videoRef.current) {
      const handleEnded = () => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % activeVideoList.length);
          setIsTransitioning(false);
        }, 600); // Match transition duration
      };
      
      videoRef.current.addEventListener('ended', handleEnded);
      return () => {
        videoRef.current?.removeEventListener('ended', handleEnded);
      };
    } 
    
    // For GIFs, use auto-cycle timer
    if (currentVideo.type === 'image/gif') {
      autoCycleTimer.current = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % activeVideoList.length);
          setIsTransitioning(false);
        }, 600); // Match transition duration
      }, currentVideo.duration);
      
      return () => {
        if (autoCycleTimer.current) {
          clearTimeout(autoCycleTimer.current);
        }
      };
    }
  }, [currentIndex, currentVideo, activeVideoList.length]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Video/GIF Layer with smooth crossfade and cinematic dimming */}
      <div className={`absolute inset-0 transition-all duration-[2000ms] ${dimBackground ? 'opacity-40' : 'opacity-100'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTheme}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className={`absolute inset-0 transition-all duration-[2000ms] ${dimBackground ? 'blur-[4px]' : 'blur-0'}`}
          >
            {currentVideo.type === 'video/mp4' ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center"
              >
                <source src={currentVideo.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={currentVideo.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Premium gradient overlay - 40% opacity for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.50)_0%,rgba(0,0,0,0.75)_50%,rgba(0,0,0,0.90)_100%)] pointer-events-none" />
      
      {/* Additional top-to-bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/65 pointer-events-none" />
    </div>
  );
};
