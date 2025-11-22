import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TherapeuticCategory } from '@/utils/therapeuticAudio';

// Import new background videos
const focusVideo1 = '/videos/focus-1.mp4';
const focusVideo2 = '/videos/focus-2.mp4';
const calmVideo = '/videos/calm-1.mp4';
const energizeVideo = '/videos/energize-1.mp4';
const defaultVideo = '/videos/default-1.mp4';

interface VideoSource {
  src: string;
  type: 'video/mp4' | 'image/gif';
  duration: number;
}

// Organize videos by therapeutic category for track-aware transitions
const visualThemes: Record<TherapeuticCategory | 'default', VideoSource[]> = {
  // Focus & Flow - New Age sample
  focus: [
    { src: focusVideo1, type: 'video/mp4', duration: 20000 },
    { src: focusVideo2, type: 'video/mp4', duration: 20000 },
  ],
  
  // Nocturnes - Crossover Classical for Deep Rest
  calm: [
    { src: calmVideo, type: 'video/mp4', duration: 20000 },
  ],
  
  // Mood Boost - Placeholder
  boost: [
    { src: defaultVideo, type: 'video/mp4', duration: 20000 },
  ],
  
  // Serene Samba - Samba Jazz for Social Relaxation
  energize: [
    { src: energizeVideo, type: 'video/mp4', duration: 20000 },
  ],
  
  // Default - Mixed selection for initial load
  default: [
    { src: defaultVideo, type: 'video/mp4', duration: 20000 },
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

  // Listen for category changes from preview cards
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent<{ category: TherapeuticCategory }>) => {
      console.log('🎭 Category changed to:', event.detail.category);
      setActiveTheme(event.detail.category);
      setCurrentIndex(0);
      setIsTransitioning(true);
    };

    const handleCarouselChange = (event: CustomEvent<{ category: TherapeuticCategory }>) => {
      console.log('🎠 Carousel changed to:', event.detail.category);
      setActiveTheme(event.detail.category);
      setCurrentIndex(0);
      setIsTransitioning(true);
    };

    window.addEventListener('categoryChange', handleCategoryChange as EventListener);
    window.addEventListener('carouselChange', handleCarouselChange as EventListener);
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange as EventListener);
      window.removeEventListener('carouselChange', handleCarouselChange as EventListener);
    };
  }, []);

  // Auto-cycle within current theme and ensure video plays
  useEffect(() => {
    // Clear existing timer
    if (autoCycleTimer.current) {
      clearTimeout(autoCycleTimer.current);
    }

    // For MP4s, let video end naturally
    if (currentVideo.type === 'video/mp4' && videoRef.current) {
      const video = videoRef.current;
      
      // Ensure video plays - try multiple times for reliability
      const playVideo = async () => {
        try {
          await video.play();
          console.log('✅ Background video playing');
        } catch (err) {
          console.log('⚠️ Background video autoplay blocked, user interaction needed:', err);
        }
      };

      // Try to play immediately if already loaded
      if (video.readyState >= 2) {
        playVideo();
      }
      
      // Also try when metadata loads
      video.addEventListener('loadedmetadata', playVideo, { once: true });
      
      // And when enough data is loaded
      video.addEventListener('canplay', playVideo, { once: true });

      const handleEnded = () => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % activeVideoList.length);
          setIsTransitioning(false);
        }, 3200); // Match ultra-slow transition duration
      };
      
      video.addEventListener('ended', handleEnded);
      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
    
    // For GIFs, use auto-cycle timer
    if (currentVideo.type === 'image/gif') {
      autoCycleTimer.current = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % activeVideoList.length);
          setIsTransitioning(false);
        }, 3200); // Match ultra-slow transition duration
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
      {/* Video/GIF Layer with ultra-slow crossfade and cinematic dimming */}
      <div className={`absolute inset-0 transition-all duration-[3200ms] ${dimBackground ? 'opacity-85' : 'opacity-100'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTheme}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.2, ease: 'easeInOut' }}
            className={`absolute inset-0 transition-all duration-[3200ms] ${dimBackground ? 'blur-[2px]' : 'blur-0'}`}
          >
            {currentVideo.type === 'video/mp4' ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                style={{ 
                  transition: 'transform 8s ease-in-out',
                  transform: isTransitioning ? 'scale(1.05)' : 'scale(1.1)'
                }}
              >
                <source src={currentVideo.src} type="video/mp4" />
              </video>
            ) : (
              <img
                src={currentVideo.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                style={{ 
                  transition: 'transform 8s ease-in-out',
                  transform: isTransitioning ? 'scale(1.05)' : 'scale(1.1)'
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Premium gradient overlay - lighter for visibility */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.40)_50%,rgba(0,0,0,0.60)_100%)] pointer-events-none" />
      
      {/* Additional top-to-bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
};
