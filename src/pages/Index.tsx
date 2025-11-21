import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import animatedBg from '../assets/landing-bg.gif';
import staticHeroBg from '../assets/static-hero-bg.png';
import bgAbstract1 from '../assets/bg-abstract-1.png';
import bgAbstract2 from '../assets/bg-abstract-2.png';
import bgAbstract3 from '../assets/bg-abstract-3.png';

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
      {/* Animated GIF background with fade */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 transition-opacity duration-[3000ms]"
          style={{ opacity: scrollY > 100 ? 0 : 1 }}
        >
          <img 
            src={animatedBg}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Static background image */}
        <div 
          className="absolute inset-0 transition-opacity duration-[3000ms]"
          style={{ opacity: scrollY > 100 ? 1 : 0 }}
        >
          <img 
            src={staticHeroBg}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>

      {/* Navbar gradient backdrop */}
      <div className="fixed top-0 left-0 right-0 h-[140px] bg-gradient-to-b from-black via-black/80 to-transparent z-[5] pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Full viewport */}
        <div className="min-h-screen flex items-center justify-center px-6 pb-20">
          <motion.div
            className="text-center flex flex-col items-center justify-center max-w-[900px] mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 
              className="text-[7rem] sm:text-[9rem] lg:text-[11rem] font-extralight text-white leading-none tracking-wide flex items-center gap-3 mb-10"
              style={{
                textShadow: '0 0 40px rgba(6, 182, 212, 0.08), 0 0 80px rgba(6, 182, 212, 0.04)'
              }}
            >
              <span className="text-cyan-400 font-light">+</span>
              NeuroTunes
            </h1>
            <div className="space-y-3">
              <p className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] font-light text-white/80 tracking-wide">
                Neuroscience-backed · Clinically Validated · Patented
              </p>
              <p className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] font-light text-white/80 tracking-wide">
                Medical-grade Therapeutic Music & AI Streaming
              </p>
            </div>
          </motion.div>
        </div>

        {/* Supported by section - Below hero */}
        <div className="relative z-10 py-16 px-6">
          <PartnersSection />
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
