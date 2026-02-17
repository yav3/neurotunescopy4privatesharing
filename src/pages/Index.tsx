import React from 'react';
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
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607', background: 'radial-gradient(ellipse at 30% 20%, rgba(30, 30, 35, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(20, 20, 25, 0.6) 0%, transparent 50%), linear-gradient(180deg, #050607 0%, #0a0a0c 50%, #050607 100%)' }}>
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
