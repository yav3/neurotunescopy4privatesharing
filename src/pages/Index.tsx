import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import animatedBg from '../assets/landing-bg.gif';

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
      {/* Animated GIF background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={animatedBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Main centered content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 leading-none">
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
