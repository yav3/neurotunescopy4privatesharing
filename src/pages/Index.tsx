import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import animatedBg from '../assets/landing-bg.gif';
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
        
        {/* Glassmorphism static background with abstract images */}
        <div 
          className="absolute inset-0 transition-opacity duration-[3000ms]"
          style={{ opacity: scrollY > 100 ? 1 : 0 }}
        >
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 opacity-40">
            <img src={bgAbstract1} alt="" className="absolute top-0 left-0 w-1/2 h-1/2 object-cover" />
            <img src={bgAbstract2} alt="" className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover" />
            <img src={bgAbstract3} alt="" className="absolute top-1/3 left-1/3 w-1/2 h-1/2 object-cover mix-blend-screen" />
          </div>
          <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-cyan-950/30 via-slate-900/50 to-teal-950/30" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Main centered content - Full viewport */}
        <div className="flex-1 flex items-center justify-center px-6 min-h-screen">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-7xl sm:text-8xl lg:text-[10rem] font-normal text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-cyan-300 to-teal-400 leading-none tracking-tight">
              NeuroTunes
            </h1>
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
