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
      {/* Chrome liquid background - video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src={chromeHeroBg} type="video/mp4" />
        </video>
        
        {/* Dark obsidian overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Platinum vignette at edges */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-obsidian/70" />
      </div>

      {/* Stable dark gradient behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-28 md:h-32 z-[5] pointer-events-none bg-gradient-to-b from-obsidian/98 via-obsidian/90 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Full height centered */}
        <main className="flex-1 flex items-center justify-center px-6 md:px-8 pt-20 pb-16 min-h-[calc(100vh-4rem)]">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Chrome curves accent */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none bg-cover bg-center mix-blend-screen"
              style={{ backgroundImage: `url(${chromeCurves})` }}
            />

            {/* Radial darkening fade for readability */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)]" />
            
            {/* Premium Glass Panel with chrome edge glow */}
            <motion.div
              className="text-center flex flex-col items-center justify-center mx-auto relative z-10 w-fit px-10 py-8 sm:px-14 sm:py-10 md:px-16 md:py-12 lg:px-20 lg:py-14 rounded-3xl md:rounded-[40px] backdrop-blur-[40px] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)_inset] bg-gradient-to-b from-white/20 via-white/5 to-white/5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="font-light tracking-[-0.02em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] text-platinum-glow/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                +NeuroTunes
              </h1>
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
