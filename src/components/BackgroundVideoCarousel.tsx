import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TherapeuticCategory } from '@/utils/therapeuticAudio';

// Import all videos
import bgVideo1 from '../assets/bg-video-1.mp4';
import bgVideo2 from '../assets/bg-video-2.gif';
import bgVideo3 from '../assets/bg-video-3.gif';
import bgVideo4 from '../assets/bg-video-4.gif';
import bgVideo5 from '../assets/bg-video-5.mp4';
import bgVideo6 from '../assets/bg-video-6.mp4';
import bgVideo7 from '../assets/bg-video-7.mp4';
import bgVideo8 from '../assets/bg-video-8.mp4';
import bgVideo9 from '../assets/bg-video-9.gif';
import bgVideo10 from '../assets/bg-video-10.mp4';
import bgVideo11 from '../assets/bg-video-11.gif';
import bgVideo12 from '../assets/bg-video-12.gif';
import bgVideo13 from '../assets/bg-video-13.gif';
import bgVideo14 from '../assets/bg-video-14.mp4';
import bgVideo15 from '../assets/bg-video-15.mp4';
import bgVideo16 from '../assets/bg-video-16.mp4';
import bgVideo17 from '../assets/bg-video-17.mp4';
import bgVideo18 from '../assets/bg-video-18.mp4';
import bgVideo19 from '../assets/bg-video-19.mp4';
import bgVideo20 from '../assets/bg-video-20.mp4';
import bgVideo21 from '../assets/bg-video-21.mp4';
import bgVideo22 from '../assets/bg-video-22.gif';

interface VideoSource {
  src: string;
  type: 'video/mp4' | 'image/gif';
  duration: number;
}

// Organize videos by therapeutic category for track-aware transitions
const visualThemes: Record<TherapeuticCategory | 'default', VideoSource[]> = {
  // Focus & Flow - Ambient, flowing, meditative chrome
  focus: [
    { src: bgVideo1, type: 'video/mp4', duration: 15000 },
    { src: bgVideo5, type: 'video/mp4', duration: 15000 },
    { src: bgVideo6, type: 'video/mp4', duration: 15000 },
    { src: bgVideo14, type: 'video/mp4', duration: 15000 },
    { src: bgVideo16, type: 'video/mp4', duration: 15000 },
  ],
  
  // Calm & Rest - Slower, darker, smoother visuals
  calm: [
    { src: bgVideo10, type: 'video/mp4', duration: 15000 },
    { src: bgVideo7, type: 'video/mp4', duration: 15000 },
    { src: bgVideo8, type: 'video/mp4', duration: 15000 },
    { src: bgVideo9, type: 'image/gif', duration: 12000 },
  ],
  
  // Mood Boost - Warmer, rhythmic, tropical energy
  boost: [
    { src: bgVideo15, type: 'video/mp4', duration: 15000 },
    { src: bgVideo17, type: 'video/mp4', duration: 15000 },
    { src: bgVideo18, type: 'video/mp4', duration: 15000 },
    { src: bgVideo19, type: 'video/mp4', duration: 15000 },
    { src: bgVideo22, type: 'image/gif', duration: 12000 },
  ],
  
  // Energize (Samba) - Bright, percussive, energetic chrome ripple
  energize: [
    { src: bgVideo20, type: 'video/mp4', duration: 15000 },
    { src: bgVideo21, type: 'video/mp4', duration: 15000 },
    { src: bgVideo2, type: 'image/gif', duration: 12000 },
    { src: bgVideo3, type: 'image/gif', duration: 12000 },
    { src: bgVideo4, type: 'image/gif', duration: 12000 },
  ],
  
  // Default - Mixed selection for initial load
  default: [
    { src: bgVideo1, type: 'video/mp4', duration: 15000 },
    { src: bgVideo11, type: 'image/gif', duration: 12000 },
    { src: bgVideo12, type: 'image/gif', duration: 12000 },
    { src: bgVideo13, type: 'image/gif', duration: 12000 },
  ],
};

export const BackgroundVideoCarousel = () => {
  const [activeTheme, setActiveTheme] = useState<TherapeuticCategory | 'default'>('default');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoCycleTimer = useRef<NodeJS.Timeout | null>(null);

  const activeVideoList = visualThemes[activeTheme];
  const currentVideo = activeVideoList[currentIndex];

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
      {/* Video/GIF Layer with smooth crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTheme}-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
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
      
      {/* Premium gradient overlay - radial darkening from center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.20)_0%,rgba(0,0,0,0.60)_50%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      
      {/* Additional top-to-bottom gradient for navbar legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/50 pointer-events-none" />
    </div>
  );
};
