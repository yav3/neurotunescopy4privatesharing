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
              hsl(192, 60%, 96%) 8%,
              hsl(192, 70%, 91%) 16%,
              hsl(190, 75%, 85%) 24%,
              hsl(189, 80%, 76%) 32%,
              hsl(190, 82%, 66%) 42%,
              hsl(195, 84%, 56%) 52%,
              hsl(200, 83%, 50%) 62%,
              hsl(210, 83%, 50%) 74%,
              hsl(217, 83%, 53%) 86%,
              hsl(217, 83%, 53%) 100%
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
