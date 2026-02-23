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
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(210, 20%, 97%) 0%,
              hsl(210, 25%, 94%) 8%,
              hsl(212, 30%, 85%) 18%,
              hsl(215, 35%, 55%) 30%,
              hsl(218, 40%, 25%) 42%,
              hsl(220, 30%, 10%) 55%,
              #050607 70%,
              #050607 100%
            )
          `,
        }}
        animate={{ opacity: dissolving ? 0 : 1 }}
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
        <ProductCardsSection />
        
        <Footer />
        
        {/* Hidden Sales Assistant (triggered from header) */}
        <SalesAssistant externalOpen={false} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
