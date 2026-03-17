import React, { useEffect, useState } from 'react';
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
import { FooterContactHandler } from '@/components/FooterContactHandler';
import { AnnouncementOverlay } from '@/components/landing/AnnouncementOverlay';

const Index = () => {
  const location = useLocation();
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  // Listen for global contact open events
  useEffect(() => {
    const handler = () => setContactOpen(true);
    window.addEventListener('openContactForm', handler);
    return () => window.removeEventListener('openContactForm', handler);
  }, []);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: 'hsl(220, 15%, 3%)' }}>
      <AnnouncementOverlay />
      <motion.div
        key="landing"
        className="min-h-screen relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <NavigationHeader />
        <HeroSection />
        <div className="h-12 md:h-20" />
        <PipelineSection />
        <DataFlowSection />
        <StatsBar />
        <HowItWorksSection />
        <Footer />

        <SalesAssistant externalOpen={false} />
        <FooterContactHandler
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          interestType="Request Access"
        />
      </motion.div>
    </div>
  );
};

export default Index;
