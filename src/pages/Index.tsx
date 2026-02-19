import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { PipelineSection } from '@/components/landing/PipelineSection';
import { DataFlowSection } from '@/components/landing/DataFlowSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ProductCardsSection } from '@/components/landing/ProductCardsSection';
import { SalesAssistant } from '@/components/sales/SalesAssistant';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dissolving, setDissolving] = useState(false);
  const interactedRef = useRef(false);

  // Hash scroll handling
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  // Auto-dissolve after 5s of no interaction → navigate to /demo
  useEffect(() => {
    const markInteracted = () => { interactedRef.current = true; };
    window.addEventListener('scroll', markInteracted, { once: true });
    window.addEventListener('click', markInteracted, { once: true });
    window.addEventListener('touchstart', markInteracted, { once: true });

    const timer = setTimeout(() => {
      if (!interactedRef.current) {
        setDissolving(true);
        // Navigate after fade-out completes
        setTimeout(() => navigate('/demo'), 1200);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', markInteracted);
      window.removeEventListener('click', markInteracted);
      window.removeEventListener('touchstart', markInteracted);
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      <motion.div
        key="landing"
        className="min-h-screen relative"
        style={{ backgroundColor: '#050607', background: 'radial-gradient(ellipse at 30% 20%, hsla(220, 20%, 10%, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(210, 15%, 8%, 0.6) 0%, transparent 50%), linear-gradient(180deg, #050607 0%, #08090b 50%, #050607 100%)' }}
        animate={{ opacity: dissolving ? 0 : 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        <NavigationHeader />
        
        <HeroSection />
        <PipelineSection />
        <DataFlowSection />
        <StatsBar />
        <HowItWorksSection />
        <ProductCardsSection />
        
        <Footer />
        
        {/* Hidden Sales Assistant (triggered from header) */}
        <SalesAssistant externalOpen={false} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
