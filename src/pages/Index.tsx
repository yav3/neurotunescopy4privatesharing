import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { BackgroundVideoCarousel } from '@/components/BackgroundVideoCarousel';
import { MusicPreviewRow } from '@/components/MusicPreviewRow';
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';

const Index = () => {
  const { user, loading } = useAuthContext();
  const [scrollY, setScrollY] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const [heroVisible, setHeroVisible] = useState(true);
  
  // Welcome returning users
  useWelcomeMessage();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide subtitle after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubtitle(false);
    }, 2500); // Duration of zoom + hold time
    return () => clearTimeout(timer);
  }, []);

  // Fade out entire hero after music starts (4 seconds total)
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setHeroVisible(false);
    }, 4000);
    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Video Carousel */}
      <BackgroundVideoCarousel />

      {/* Stable dark gradient behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-24 sm:h-28 md:h-32 z-[5] pointer-events-none bg-gradient-to-b from-obsidian/98 via-obsidian/90 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Positioned higher and more compact */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 min-h-screen">
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Hero Container - Absolutely positioned to overlay, doesn't affect layout */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ 
                opacity: heroVisible ? 1 : 0, 
                scale: heroVisible ? 1 : 0.92,
                filter: heroVisible ? "blur(0px)" : "blur(8px)"
              }}
              transition={{ 
                duration: heroVisible ? 0.8 : 1.8, 
                delay: heroVisible ? 0.1 : 0,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              {/* Premium Glass Container */}
              <div className="text-center flex flex-col items-center justify-center gap-4 w-[95%] sm:w-[90%] md:w-[65%] px-6 py-8 sm:px-12 sm:py-12 md:px-16 md:pt-12 md:pb-10 rounded-[36px] md:rounded-[48px] backdrop-blur-[22px] saturate-[180%] border border-white/[0.08] shadow-[0_0_70px_rgba(0,0,0,0.6)] bg-[rgba(20,20,20,0.55)] before:absolute before:inset-0 before:rounded-[36px] md:before:rounded-[48px] before:bg-gradient-to-br before:from-white/[0.05] before:via-transparent before:to-transparent before:pointer-events-none overflow-hidden"
              >
              {/* Logo/Title */}
              <h1 className="font-light tracking-[-0.03em] text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                +NeuroTunes
              </h1>

              {/* Animated Subtitle - Zooms in then disappears */}
              <AnimatePresence>
                {showSubtitle && (
                  <motion.p 
                    className="text-[0.6rem] leading-tight sm:text-xs md:text-sm text-white/80 font-light tracking-wide mt-4 max-w-[280px] sm:max-w-none sm:whitespace-nowrap text-center absolute"
                    initial={{ 
                      scale: 0.3, 
                      opacity: 0,
                      filter: "blur(8px)"
                    }}
                    animate={{ 
                      scale: [0.3, 1.8, 1.8, 1.8],
                      opacity: [0, 1, 1, 0],
                      filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(4px)"]
                    }}
                    transition={{
                      duration: 2.5,
                      times: [0, 0.4, 0.7, 1],
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                    style={{
                      transformOrigin: "center center",
                      pointerEvents: "none"
                    }}
                  >
                    Neuroscience-backed • Clinically Validated • Premium Environmental & Wellness Music
                  </motion.p>
                )}
              </AnimatePresence>
              </div>
            </motion.div>

            {/* Music Preview Row - Centered naturally, reveals after hero fades */}
            <motion.div
              className="w-full relative z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: !heroVisible ? 1 : 0,
                scale: !heroVisible ? 1 : 0.95,
                filter: !heroVisible ? "blur(0px)" : "blur(4px)"
              }}
              transition={{ 
                duration: 1.4,
                delay: !heroVisible ? 0.5 : 0,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <MusicPreviewRow />
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
        
        {/* Sales Assistant */}
        <SalesAssistant />
      </div>
    </div>
  );
};

export default Index;
