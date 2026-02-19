import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607', background: 'radial-gradient(ellipse at 30% 20%, hsla(220, 20%, 10%, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(210, 15%, 8%, 0.6) 0%, transparent 50%), linear-gradient(180deg, #050607 0%, #08090b 50%, #050607 100%)' }}>
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
    </div>
  );
};

export default Index;
