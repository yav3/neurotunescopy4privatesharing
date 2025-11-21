import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import chromeHeroBg from '../assets/chrome-hero-bg.gif';
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
      {/* Chrome liquid background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={chromeHeroBg}
          alt="Chrome liquid background"
          className="w-full h-full object-cover"
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
          {/* Enhanced radial gradient overlay for perfect text contrast */}
          <div 
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0) 85%)'
            }}
          />
          
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
          
          <motion.div
            className="text-center flex flex-col items-center justify-center max-w-[900px] mx-auto relative z-10"
            style={{ marginTop: '80px' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Title: 110-140px ultra-light white with chrome highlight */}
            <h1 
              className="font-extralight leading-none tracking-wide flex items-center mb-10"
              style={{
                fontSize: 'clamp(110px, 12vw, 140px)',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 0 60px rgba(255, 255, 255, 0.12), 0 0 100px rgba(228, 228, 228, 0.08), 0 0 20px rgba(255, 255, 255, 0.02)',
                gap: '0.75rem'
              }}
            >
              <span className="font-light" style={{ fontSize: '0.9em', color: 'rgba(255, 255, 255, 0.92)' }}>+</span>
              NeuroTunes
            </h1>
            
            {/* Subtitle: 30-34px white at 80% opacity - two clean lines */}
            <div className="space-y-2 mb-16">
              <p 
                className="font-light tracking-wide"
                style={{
                  fontSize: 'clamp(24px, 3vw, 34px)',
                  color: 'rgba(255, 255, 255, 0.80)',
                  lineHeight: '1.4'
                }}
              >
                Neuroscience-backed · Clinically Validated · Patented
              </p>
              <p 
                className="font-light tracking-wide"
                style={{
                  fontSize: 'clamp(24px, 3vw, 34px)',
                  color: 'rgba(255, 255, 255, 0.80)',
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
                  className="px-8 py-4 rounded-lg text-base font-medium text-white transition-all"
                  style={{
                    border: '1px solid rgba(228, 228, 228, 0.18)',
                    background: 'transparent',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.35)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.12)';
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
                  className="px-8 py-4 rounded-lg text-base font-medium text-white transition-all"
                  style={{
                    background: 'rgba(10, 10, 12, 0.70)',
                    border: '1px solid rgba(228, 228, 228, 0.18)',
                    boxShadow: '0 0 30px rgba(255, 255, 255, 0.10)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 10, 12, 0.50)';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.35)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(10, 10, 12, 0.70)';
                    e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.18)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.10)';
                  }}
                >
                  See Samples
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Supported by section - Floating obsidian glass panel */}
        <div className="relative z-10 py-24 px-6">
          {/* Dimmed chrome background - 50% opacity for clarity */}
          <div 
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `url(${chromeHeroBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div 
              className="relative"
              style={{
                background: '#0A0A0C',
                borderRadius: '36px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.04), 0 40px 100px rgba(0, 0, 0, 0.7), 0 0 60px rgba(255, 255, 255, 0.035)',
                padding: '80px 60px',
              }}
            >
              <motion.h3 
                className="text-lg font-light text-center mb-16 tracking-wide"
                style={{ color: 'rgba(255, 255, 255, 0.90)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Supported by
              </motion.h3>

              <div className="flex items-center justify-center gap-20">
                {[
                  { name: "Jacobs Technion-Cornell Institute", logo: jacobsTechnionLogo },
                  { name: "Stanford Medicine", logo: stanfordLogo },
                  { name: "Weill Cornell Medicine", logo: weillCornellLogo }
                ].map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center"
                    style={{ flex: '1 1 0', maxWidth: '280px' }}
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="object-contain transition-all duration-300"
                      style={{
                        height: '64px',
                        width: '100%',
                        filter: 'brightness(0) invert(1)',
                        opacity: '0.90',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.filter = 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.2))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.90';
                        e.currentTarget.style.filter = 'brightness(0) invert(1)';
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
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
