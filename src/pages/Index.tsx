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
              hsl(0, 0%, 100%) 22%,
              hsl(195, 100%, 97%) 32%,
              hsl(192, 90%, 88%) 42%,
              hsl(191, 85%, 74%) 52%,
              hsl(192, 82%, 60%) 62%,
              hsl(195, 80%, 50%) 72%,
              hsl(200, 82%, 48%) 82%,
              hsl(210, 83%, 50%) 92%,
              hsl(215, 83%, 53%) 100%
            )
          `,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <NavigationHeader />

        <HeroSection />

        {/* Clean spacer */}
        <div className="h-12 md:h-16" />

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
