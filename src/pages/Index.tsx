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
        
        {/* Strong dark overlay for video calming */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Premium vignette - Apple-style radial darkening */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        
        {/* Subtle top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      </div>

      {/* Stable dark gradient behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-24 sm:h-28 md:h-32 z-[5] pointer-events-none bg-gradient-to-b from-obsidian/98 via-obsidian/90 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Premium Apple-style layout */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pt-24 pb-16 min-h-screen">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Premium Glass Panel - World-class readability */}
            <motion.div
              className="text-center flex flex-col items-center justify-center gap-6 sm:gap-8 mx-auto relative z-10 w-full max-w-[85%] sm:max-w-xl px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-18 rounded-[24px] sm:rounded-[32px] backdrop-blur-[60px] saturate-[140%] border border-white/[0.08] shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02),0_8px_40px_rgba(0,0,0,0.4)] bg-[rgba(20,20,20,0.60)]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Logo/Title - Apple-thin typography */}
              <h1 className="font-light tracking-[-0.03em] text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                +NeuroTunes
              </h1>

              {/* Subtitle - Premium spacing and opacity */}
              <p className="text-xs sm:text-sm md:text-base text-white/75 max-w-md leading-relaxed font-light">
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
