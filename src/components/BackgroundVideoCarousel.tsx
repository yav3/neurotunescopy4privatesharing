import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const videoSources = [
  { src: bgVideo1, type: 'video/mp4', duration: 15000 },
  { src: bgVideo2, type: 'image/gif', duration: 12000 },
  { src: bgVideo3, type: 'image/gif', duration: 12000 },
  { src: bgVideo4, type: 'image/gif', duration: 12000 },
  { src: bgVideo5, type: 'video/mp4', duration: 15000 },
  { src: bgVideo6, type: 'video/mp4', duration: 15000 },
  { src: bgVideo7, type: 'video/mp4', duration: 15000 },
  { src: bgVideo8, type: 'video/mp4', duration: 15000 },
  { src: bgVideo9, type: 'image/gif', duration: 12000 },
  { src: bgVideo10, type: 'video/mp4', duration: 15000 },
  { src: bgVideo11, type: 'image/gif', duration: 12000 },
  { src: bgVideo12, type: 'image/gif', duration: 12000 },
  { src: bgVideo13, type: 'image/gif', duration: 12000 },
  { src: bgVideo14, type: 'video/mp4', duration: 15000 },
  { src: bgVideo15, type: 'video/mp4', duration: 15000 },
  { src: bgVideo16, type: 'video/mp4', duration: 15000 },
  { src: bgVideo17, type: 'video/mp4', duration: 15000 },
  { src: bgVideo18, type: 'video/mp4', duration: 15000 },
];

export const BackgroundVideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const current = videoSources[currentIndex];
    
    // For MP4s, listen to video end
    if (current.type === 'video/mp4' && videoRef.current) {
      const handleEnded = () => {
        setCurrentIndex((prev) => (prev + 1) % videoSources.length);
      };
      
      videoRef.current.addEventListener('ended', handleEnded);
      return () => {
        videoRef.current?.removeEventListener('ended', handleEnded);
      };
    } 
    
    // For GIFs, use timer
    if (current.type === 'image/gif') {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % videoSources.length);
      }, current.duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const currentSource = videoSources[currentIndex];

  // Notify parent about index changes (for audio sync)
  useEffect(() => {
    // Dispatch custom event that the Index page can listen to
    window.dispatchEvent(new CustomEvent('videoCarouselChange', { 
      detail: { index: currentIndex } 
    }));
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {currentSource.type === 'video/mp4' ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src={currentSource.src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={currentSource.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Layered gradient overlays for depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-black/50" />
      
      {/* Premium vignette - Apple-style radial darkening */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
};
