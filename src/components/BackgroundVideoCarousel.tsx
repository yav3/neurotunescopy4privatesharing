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
        }, 3200); // Match ultra-slow transition duration
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
      <div className={`absolute inset-0 transition-all duration-[3200ms] ${dimBackground ? 'opacity-40' : 'opacity-100'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTheme}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.2, ease: 'easeInOut' }}
            className={`absolute inset-0 transition-all duration-[3200ms] ${dimBackground ? 'blur-[4px]' : 'blur-0'}`}
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
      
      {/* Premium gradient overlay - 40% opacity for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.50)_0%,rgba(0,0,0,0.75)_50%,rgba(0,0,0,0.90)_100%)] pointer-events-none" />
      
      {/* Additional top-to-bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/65 pointer-events-none" />
    </div>
  );
};
