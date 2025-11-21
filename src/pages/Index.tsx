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
    <div className="min-h-screen relative">
      {/* Chrome liquid background - video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={chromeHeroBg} type="video/mp4" />
        </video>
        
        {/* Dark obsidian overlay */}
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Platinum vignette at edges */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-obsidian/70" />
      </div>

      {/* Stable dark gradient behind navbar */}
      <div className="fixed top-0 left-0 right-0 h-32 md:h-40 z-[5] pointer-events-none bg-gradient-to-b from-obsidian/98 via-obsidian/85 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Constrained and centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Chrome curves accent */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none bg-cover bg-center mix-blend-screen"
              style={{ backgroundImage: `url(${chromeCurves})` }}
            />

            {/* Radial darkening fade for readability */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-black/60 via-transparent to-transparent" />
            
            {/* Premium Glass Panel with chrome edge glow */}
            <motion.div
              className="text-center flex flex-col items-center justify-center mx-auto relative z-10 w-fit px-8 py-6 sm:px-12 sm:py-8 md:px-16 md:py-10 lg:px-20 lg:py-12 rounded-3xl md:rounded-[40px] backdrop-blur-[40px] border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)_inset]"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.05) 100%)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="font-light tracking-[-0.02em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] text-platinum-glow/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                +NeuroTunes
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
        
        {/* Sales Assistant */}
        <SalesAssistant />
      </div>
    </div>
  );
};

export default Index;
