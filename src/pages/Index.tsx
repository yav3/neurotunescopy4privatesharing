import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import chromeHeroBg from '../assets/chrome-hero-bg.mp4';
import chromeCurves from '../assets/chrome-curves.png';
import chromeTexture from '../assets/chrome-texture-02.png';
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
      {/* Chrome liquid background - video with proper mobile positioning */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={chromeHeroBg} type="video/mp4" />
        </video>
        
        {/* Layered gradient overlays for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-black/50" />
        
        {/* Premium vignette - Apple-style radial darkening */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Stable dark gradient behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-24 sm:h-28 md:h-32 z-[5] pointer-events-none bg-gradient-to-b from-obsidian/98 via-obsidian/90 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Premium Apple-style layout */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-24 pb-16 min-h-screen">
          <div className="relative w-full max-w-3xl mx-auto -mt-8 sm:-mt-12 md:-mt-16">
            {/* Premium Glass Panel - Apple Vision Pro style */}
            <motion.div
              className="text-center flex flex-col items-center justify-center gap-5 sm:gap-7 mx-auto relative z-10 w-full max-w-[90%] sm:max-w-lg md:max-w-xl px-8 py-10 sm:px-14 sm:py-14 md:px-16 md:py-16 rounded-[28px] sm:rounded-[36px] backdrop-blur-[26px] saturate-[180%] border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.6),0_1px_2px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3)] bg-[rgba(20,20,20,0.32)] before:absolute before:inset-0 before:rounded-[28px] sm:before:rounded-[36px] before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Logo/Title - Apple-thin typography */}
              <h1 className="font-light tracking-[-0.03em] text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                +NeuroTunes
              </h1>

              {/* Subtitle - Premium spacing and opacity */}
              <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-md leading-relaxed font-light tracking-wide">
                Neuroscience-backed • Clinically Validated • Therapeutic Music
              </p>
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
