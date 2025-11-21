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
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Main centered content - Full viewport */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            className="text-center flex flex-col items-center justify-center group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-[9rem] sm:text-[11rem] lg:text-[13rem] font-extralight text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-cyan-400 to-teal-300 leading-none tracking-wide flex items-center gap-4">
              <span className="text-cyan-400/80 font-light">+</span>
              NeuroTunes
            </h1>
            <p className="text-[1.8rem] sm:text-[2.2rem] lg:text-[2.6rem] font-light text-gray-300/90 mt-6 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              Neuroscience backed | Clinically Validated | Patented | Medical Grade Music & AI Streaming
            </p>
          </motion.div>
        </div>

        {/* Supported by section */}
        <div className="py-12 px-6">
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
