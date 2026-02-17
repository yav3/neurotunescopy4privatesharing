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
    <div className="min-h-screen relative">
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
