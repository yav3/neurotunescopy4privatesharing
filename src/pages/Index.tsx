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
          className="absolute inset-0 w-full h-full object-cover object-center md:object-center"
        >
          <source src={chromeHeroBg} type="video/mp4" />
        </video>
        
        {/* Dark obsidian overlay with stronger mobile darkening for readability */}
        <div className="absolute inset-0 bg-black/65 sm:bg-black/55 md:bg-black/50" />
        
        {/* Edge lighting gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-transparent md:from-black/40 md:via-black/20" />
        
        {/* Platinum vignette at edges */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-obsidian/60" />
      </div>

      {/* Stable dark gradient behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-24 sm:h-28 md:h-32 z-[5] pointer-events-none bg-gradient-to-b from-obsidian/98 via-obsidian/90 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Mobile-first vertical stacking */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pt-32 sm:pt-28 md:pt-24 pb-16 sm:pb-20 md:pb-16 min-h-screen">
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Chrome curves accent */}
            <div 
              className="absolute inset-0 opacity-[0.03] sm:opacity-[0.04] pointer-events-none bg-cover bg-center mix-blend-screen"
              style={{ backgroundImage: `url(${chromeCurves})` }}
            />

            {/* Radial darkening fade for readability */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7)_0%,transparent_70%)] sm:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)]" />
            
            {/* Premium Glass Panel - mobile optimized with proper hierarchy */}
            <motion.div
              className="text-center flex flex-col items-center justify-center gap-6 sm:gap-8 mx-auto relative z-10 w-[92%] sm:w-fit px-6 py-12 sm:px-12 sm:py-12 md:px-16 md:py-14 lg:px-20 lg:py-16 rounded-xl sm:rounded-2xl md:rounded-[40px] backdrop-blur-[40px] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_0_40px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white/[0.15] via-white/[0.08] to-white/[0.05]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {/* Logo/Title - Mobile optimized sizing */}
              <h1 className="font-light tracking-[-0.02em] text-[2.75rem] leading-[1.1] sm:text-5xl sm:leading-[1.12] md:text-6xl lg:text-7xl text-platinum-glow/95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                +NeuroTunes
              </h1>

              {/* Subtitle - Better mobile readability */}
              <p className="text-sm sm:text-base md:text-lg text-platinum-glow/70 max-w-md sm:max-w-lg leading-[1.6] px-2">
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
