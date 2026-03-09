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
              hsl(210, 20%, 97%) 0%,
              hsl(210, 30%, 94%) 6%,
              hsl(212, 45%, 88%) 12%,
              hsl(214, 60%, 75%) 18%,
              hsl(216, 70%, 60%) 24%,
              hsl(218, 75%, 48%) 32%,
              hsl(220, 70%, 35%) 40%,
              hsl(222, 55%, 20%) 50%,
              hsl(222, 40%, 12%) 60%,
              #050607 72%,
              #050607 100%
            )
          `,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <NavigationHeader />

        <HeroSection />

        {/* Electric blue atmospheric wash between hero and pipeline */}
        <div
          className="relative h-32 md:h-48 -mt-16 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 120% 100% at 50% 0%, 
                hsla(210, 100%, 55%, 0.15) 0%, 
                hsla(210, 90%, 45%, 0.08) 40%,
                transparent 80%
              )
            `,
          }}
        />

        <PipelineSection />

        {/* Second blue wash — deeper */}
        <div
          className="relative h-24 md:h-32 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 100% 120% at 30% 50%, 
                hsla(215, 80%, 45%, 0.1) 0%, 
                transparent 70%
              ),
              radial-gradient(ellipse 80% 100% at 70% 50%, 
                hsla(200, 70%, 40%, 0.08) 0%, 
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
