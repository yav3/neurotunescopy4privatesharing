import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import chromeHeroBg from '../assets/chrome-hero-bg-slow.gif';
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
      {/* Chrome liquid background - slowed 10X */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url(${chromeHeroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            animation: 'slowChrome 100s linear infinite',
          }}
        />
        
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

        {/* Hero Section - Full viewport */}
        <div className="relative min-h-screen flex items-center justify-center px-6 pt-20">
          
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
          
          {/* Floating Obsidian Glass Panel behind hero text */}
          <motion.div
            className="text-center flex flex-col items-center justify-center mx-auto relative z-10"
            style={{ 
              marginTop: '80px',
              maxWidth: '960px',
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '40px',
              padding: '64px 80px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Title: 110-140px ultra-light pearl grey */}
            <h1 
              className="font-extralight leading-none tracking-wide flex items-center mb-10"
              style={{
                fontSize: 'clamp(110px, 12vw, 140px)',
                color: 'rgba(228, 228, 228, 0.95)',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.02)',
                gap: '0.75rem'
              }}
            >
              <span className="font-light" style={{ fontSize: '0.9em', color: 'rgba(228, 228, 228, 0.88)' }}>+</span>
              NeuroTunes
            </h1>
            
            {/* Subtitle: pearl grey - two clean lines */}
            <div className="space-y-2 mb-16">
              <p 
                className="font-light tracking-wide"
                style={{
                  fontSize: 'clamp(16px, 2vw, 22px)',
                  color: 'rgba(228, 228, 228, 0.88)',
                  lineHeight: '1.4'
                }}
              >
                Neuroscience-backed · Clinically Validated · Patented
              </p>
              <p 
                className="font-light tracking-wide"
                style={{
                  fontSize: 'clamp(18px, 2.2vw, 24px)',
                  color: 'rgba(228, 228, 228, 0.88)',
                  lineHeight: '1.4'
                }}
              >
                Medical-grade Therapeutic Music & AI Streaming
              </p>
            </div>

            {/* Hero CTAs - Premium Buttons */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Link to="/products">
                <button 
                  className="px-8 py-4 rounded-lg text-base font-medium transition-all"
                  style={{
                    border: '1px solid rgba(228, 228, 228, 0.18)',
                    background: 'transparent',
                    backdropFilter: 'blur(10px)',
                    color: 'rgba(228, 228, 228, 0.90)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(228, 228, 228, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.35)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(228, 228, 228, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.18)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Explore Solutions
                </button>
              </Link>
              
              <Link to="/demo">
                <button 
                  className="px-8 py-4 rounded-lg text-base font-medium transition-all"
                  style={{
                    background: 'rgba(10, 10, 12, 0.70)',
                    border: '1px solid rgba(228, 228, 228, 0.18)',
                    boxShadow: '0 0 30px rgba(228, 228, 228, 0.10)',
                    color: 'rgba(228, 228, 228, 0.92)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 10, 12, 0.50)';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.35)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(228, 228, 228, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 10, 12, 0.70)';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.18)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(228, 228, 228, 0.10)';
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
