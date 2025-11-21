import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import animatedBg from '../assets/landing-bg.gif';
import staticHeroBg from '../assets/static-hero-bg.png';
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
        
        {/* Dark overlay for contrast - rgba(0,0,0,0.45) */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
        />
        
        {/* Soft teal vignette at edges */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(6, 182, 212, 0.08) 70%, rgba(0, 0, 0, 0.5) 100%)'
          }}
        />
      </div>

      {/* Stable dark gradient behind navbar - top 140px */}
      <div 
        className="fixed top-0 left-0 right-0 h-[140px] z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 50%, transparent 100%)'
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Hero Section - Full viewport */}
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            className="text-center flex flex-col items-center justify-center max-w-[900px] mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Title: 110-130px ultra-light white with 8% teal glow */}
            <h1 
              className="font-extralight text-white leading-none tracking-wide flex items-center mb-10"
              style={{
                fontSize: 'clamp(110px, 12vw, 130px)',
                textShadow: '0 0 60px rgba(6, 182, 212, 0.08), 0 0 100px rgba(6, 182, 212, 0.08)',
                gap: '0.75rem'
              }}
            >
              <span className="text-cyan-400 font-light" style={{ fontSize: '0.9em' }}>+</span>
              NeuroTunes
            </h1>
            
            {/* Subtitle: 30px white at 80% opacity - two clean lines */}
            <div className="space-y-2 mb-12">
              <p 
                className="font-light tracking-wide"
                style={{
                  fontSize: '30px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.4'
                }}
              >
                Neuroscience-backed · Clinically Validated · Patented
              </p>
              <p 
                className="font-light tracking-wide"
                style={{
                  fontSize: '30px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.4'
                }}
              >
                Medical-grade therapeutic music & AI streaming.
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="flex items-center justify-center gap-6">
              <Link to="/products">
                <button 
                  className="px-8 py-4 rounded-lg text-base font-medium text-white transition-all"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  Explore Solutions
                </button>
              </Link>
              
              <Link to="/demo">
                <button 
                  className="px-8 py-4 rounded-lg text-base font-medium text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.3) 100%)',
                    border: '1px solid rgba(6, 182, 212, 0.5)',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.4) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.7)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.3) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.2)';
                  }}
                >
                  See Samples
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Supported by section - Dark glossy panel with teal luminescence */}
        <div className="relative z-10" style={{ marginTop: '60px', marginBottom: '60px' }}>
          <div className="px-6">
            <div 
              className="max-w-6xl mx-auto rounded-2xl p-12"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                boxShadow: '0 0 40px rgba(6, 182, 212, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <motion.h3 
                className="text-lg font-normal text-center mb-10"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Supported by
              </motion.h3>

              <div className="grid grid-cols-3 gap-8 items-center justify-items-center">
                {[
                  { name: "Jacobs Technion-Cornell Institute", logo: jacobsTechnionLogo },
                  { name: "Stanford Medicine", logo: stanfordLogo },
                  { name: "Weill Cornell Medicine", logo: weillCornellLogo }
                ].map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center"
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-full h-14 object-contain brightness-0 invert opacity-70 hover:opacity-90 transition-opacity"
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
