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

/*
 * Seamless gradient bands — white → ice → cyan → cerulean → azure → electric blue
 * NEVER navy, NEVER grey. Each band blends into the next.
 */

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="overflow-x-hidden">
      <motion.div
        key="landing"
        className="min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Single continuous gradient background */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(0, 0%, 100%) 0%,
            hsl(195, 100%, 97%) 12%,
            hsl(192, 85%, 90%) 22%,
            hsl(190, 80%, 82%) 32%,
            hsl(190, 82%, 68%) 44%,
            hsl(192, 80%, 56%) 55%,
            hsl(198, 80%, 48%) 66%,
            hsl(205, 82%, 46%) 76%,
            hsl(210, 82%, 46%) 86%,
            hsl(215, 84%, 44%) 100%
          )`,
        }}>
          <NavigationHeader />
          <HeroSection />
          <div className="h-12 md:h-20" />
          <PipelineSection />
          <DataFlowSection />
          <StatsBar />
          <HowItWorksSection />
          <Footer />
        </div>

        <SalesAssistant externalOpen={false} />
      </motion.div>
    </div>
  );
};

export default Index;