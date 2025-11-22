import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
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
  
  // Welcome returning users
  useWelcomeMessage();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <main className="flex-1 flex items-start justify-center px-4 sm:px-6 md:px-8 pt-[18vh] pb-8 min-h-screen">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Premium Glass Container */}
            <motion.div
              className="text-center flex flex-col items-center justify-center gap-4 mx-auto relative z-10 w-[95%] sm:w-[90%] md:w-[65%] px-6 py-8 sm:px-12 sm:py-12 md:px-16 md:pt-12 md:pb-10 rounded-[36px] md:rounded-[48px] backdrop-blur-[22px] saturate-[180%] border border-white/[0.08] shadow-[0_0_70px_rgba(0,0,0,0.6)] bg-[rgba(20,20,20,0.55)] before:absolute before:inset-0 before:rounded-[36px] md:before:rounded-[48px] before:bg-gradient-to-br before:from-white/[0.05] before:via-transparent before:to-transparent before:pointer-events-none"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Logo/Title */}
              <h1 className="font-light tracking-[-0.03em] text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                +NeuroTunes
              </h1>

              {/* Subtitle */}
              <p className="text-[0.6rem] leading-tight sm:text-xs md:text-sm text-white/80 font-light tracking-wide mt-4 max-w-[280px] sm:max-w-none sm:whitespace-nowrap text-center">
                Neuroscience-backed • Clinically Validated • Premium Environmental & Wellness Music
              </p>
            </motion.div>
          </div>
        </main>

        {/* Music Preview Row - Below Hero */}
        <MusicPreviewRow />

        {/* Footer */}
        <Footer />
        
        {/* Sales Assistant */}
        <SalesAssistant />
      </div>
    </div>
  );
};

export default Index;
