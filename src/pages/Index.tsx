import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { PipelineSection } from '@/components/landing/PipelineSection';
import { DataFlowSection } from '@/components/landing/DataFlowSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SalesAssistant } from '@/components/sales/SalesAssistant';

const Index = () => {
  const location = useLocation();
  

  // Hash scroll handling
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  // Auto-dissolve removed — landing page stays visible

  return (
    <div>
      <motion.div
        key="landing"
        className="min-h-screen relative"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(0, 0%, 100%) 0%,
              hsl(210, 50%, 97%) 10%,
              hsl(210, 60%, 93%) 20%,
              hsl(212, 70%, 88%) 30%,
              hsl(214, 78%, 78%) 42%,
              hsl(216, 82%, 66%) 55%,
              hsl(218, 85%, 55%) 70%,
              hsl(220, 88%, 48%) 85%,
              hsl(222, 90%, 42%) 100%
            )
          `,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <NavigationHeader />

        <HeroSection />

        {/* Subtle atmospheric wash between hero and pipeline */}
        <div
          className="relative h-24 md:h-32 -mt-8 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 100% 100% at 50% 0%, 
                hsla(210, 90%, 60%, 0.12) 0%, 
                transparent 70%
              )
            `,
          }}
        />

        <PipelineSection />

        {/* Second blue wash */}
        <div
          className="relative h-20 md:h-28 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 100% 100% at 50% 50%, 
                hsla(215, 80%, 50%, 0.1) 0%, 
                transparent 60%
              )
            `,
          }}
        />

        <DataFlowSection />
        <StatsBar />
        <HowItWorksSection />
        
        
        <Footer />
        
        {/* Hidden Sales Assistant (triggered from header) */}
        <SalesAssistant externalOpen={false} />
      </motion.div>
    </div>
  );
};

export default Index;
