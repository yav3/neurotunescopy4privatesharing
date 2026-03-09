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
 * Each section gets its own gradient band so the color evolution
 * is visible regardless of total page height.
 * Palette: pure white → ice → cyan → teal-blue → cerulean → azure → vivid blue
 * NEVER navy, NEVER grey.
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
    <div>
      <motion.div
        key="landing"
        className="min-h-screen relative"
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* ── Band 1: Pure white → ice blue (Hero) ── */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(0, 0%, 100%) 0%,
            hsl(0, 0%, 100%) 40%,
            hsl(195, 100%, 97%) 100%
          )`,
        }}>
          <NavigationHeader />
          <HeroSection />
          <div className="h-12 md:h-16" />
        </div>

        {/* ── Band 2: Ice blue → light cyan (Pipeline) ── */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(195, 100%, 97%) 0%,
            hsl(192, 85%, 92%) 40%,
            hsl(190, 80%, 85%) 100%
          )`,
        }}>
          <PipelineSection />
        </div>

        {/* ── Band 3: Light cyan → vivid cyan (DataFlow) ── */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(190, 80%, 85%) 0%,
            hsl(190, 82%, 72%) 35%,
            hsl(192, 80%, 58%) 100%
          )`,
        }}>
          <DataFlowSection />
        </div>

        {/* ── Band 4: Vivid cyan → cerulean (Stats) ── */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(192, 80%, 58%) 0%,
            hsl(195, 78%, 50%) 50%,
            hsl(198, 80%, 46%) 100%
          )`,
        }}>
          <StatsBar />
        </div>

        {/* ── Band 5: Cerulean → azure blue (How It Works) ── */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(198, 80%, 46%) 0%,
            hsl(203, 82%, 45%) 40%,
            hsl(210, 82%, 48%) 100%
          )`,
        }}>
          <HowItWorksSection />
        </div>

        {/* ── Band 6: Azure → electric blue (Footer) ── */}
        <div style={{
          background: `linear-gradient(180deg,
            hsl(210, 82%, 48%) 0%,
            hsl(213, 83%, 52%) 100%
          )`,
        }}>
          <Footer />
        </div>

        <SalesAssistant externalOpen={false} />
      </motion.div>
    </div>
  );
};

export default Index;
