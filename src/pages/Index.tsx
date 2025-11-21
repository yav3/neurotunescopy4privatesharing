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
        
        {/* Dark obsidian overlay - rgba(0,0,0,0.45) */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
        />
        
        {/* Platinum vignette at edges */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(228, 228, 228, 0.04) 70%, rgba(10, 10, 12, 0.7) 100%)'
          }}
        />
      </div>

      {/* Stable dark gradient behind navbar - top 160px */}
      <div 
        className="fixed top-0 left-0 right-0 h-[160px] z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.98) 0%, rgba(10, 10, 12, 0.85) 50%, transparent 100%)'
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Compact cinematic */}
        <div className="relative max-h-[72vh] min-h-[600px] flex items-center justify-center px-4 md:px-6 pt-28">

          {/* Chrome curves accent */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url(${chromeCurves})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'screen',
            }}
          />

          {/* Radial darkening fade for readability */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.6) 0%, transparent 60%)',
            }}
          />
          
          {/* Premium Glass Panel with chrome edge glow */}
          <motion.div
            className="text-center flex flex-col items-center justify-center mx-auto relative z-10 max-w-4xl px-8 py-10 md:px-14 md:py-16 rounded-[40px]"
            style={{ 
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Title: Baseline-aligned with proper hierarchy */}
            <div className="flex flex-col items-center mb-8">
              <h1 
                className="font-light tracking-[-0.02em] text-4xl md:text-6xl"
                style={{
                  lineHeight: '1.15',
                  color: 'rgba(228, 228, 228, 0.95)',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
              >
                +NeuroTunes
              </h1>
            </div>

            {/* Premium Glassmorphic CTAs */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Link to="/products">
                <button 
                  className="px-8 py-3 rounded-2xl text-sm md:text-base font-medium transition-all backdrop-blur-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.90)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.20)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  Explore Solutions
                </button>
              </Link>
              
              <Link to="/demo">
                <button 
                  className="px-8 py-3 rounded-2xl text-sm md:text-base font-medium transition-all backdrop-blur-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.90)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.20)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  See Samples
                </button>
              </Link>
            </div>
          </motion.div>
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
