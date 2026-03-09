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
          className="relative h-40 md:h-56 -mt-16 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 140% 100% at 50% 0%, 
                hsla(210, 100%, 55%, 0.25) 0%, 
                hsla(212, 90%, 50%, 0.15) 30%,
                hsla(215, 80%, 45%, 0.08) 60%,
                transparent 85%
              )
            `,
          }}
        />

        <PipelineSection />

        {/* Second blue wash — deeper, more vivid */}
        <div
          className="relative h-32 md:h-40 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 120% 120% at 40% 50%, 
                hsla(215, 85%, 50%, 0.18) 0%, 
                transparent 65%
              ),
              radial-gradient(ellipse 100% 100% at 65% 50%, 
                hsla(205, 80%, 45%, 0.14) 0%, 
                transparent 55%
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
