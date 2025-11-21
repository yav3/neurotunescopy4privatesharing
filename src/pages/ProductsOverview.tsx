import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { useState } from 'react';
import { FooterContactHandler } from '@/components/FooterContactHandler';
import chromeBg1 from '@/assets/chrome-bg-1.png';
import chromeBg2 from '@/assets/chrome-bg-2.png';
import chromeBg3 from '@/assets/chrome-bg-3.png';
import chromeHeroBg from '@/assets/chrome-hero-bg.mp4';

export const ProductsOverview = () => {
  const cardBackgrounds = [chromeBg1, chromeBg2, chromeBg3, chromeBg1, chromeBg2];
  const [contactOpen, setContactOpen] = useState(false);
  
  return (
    <div className="min-h-screen relative">
      <NavigationHeader />
      
      {/* Premium Chrome Background */}
      <div className="fixed inset-0 z-0">
        {/* Base chrome liquid video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={chromeHeroBg} type="video/mp4" />
        </video>
        
        {/* Dark overlay for readability */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.75) 0%, rgba(10, 10, 12, 0.85) 50%, rgba(10, 10, 12, 0.75) 100%)'
          }}
        />
        
        {/* Chrome texture overlay */}
        <div className="absolute inset-0 opacity-[0.08]">
          <img src={chromeBg2} alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-screen" />
        </div>
      </div>
      
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'rgba(228, 228, 228, 0.95)' }}>
              Choose the right solution
              <br />
              for your needs
            </h1>
            <p className="text-lg md:text-xl font-light max-w-2xl mx-auto" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Clinical-grade therapeutic music deployed across multiple platforms and scales
            </p>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(NEUROTUNES_PRODUCTS).map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                backgroundImage={cardBackgrounds[index]} 
              />
            ))}
          </div>

          {/* Not Sure? */}
          <div className="mt-16 text-center">
            <p className="font-light mb-4" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
              Not sure which solution fits your needs?
            </p>
            <button 
              onClick={() => setContactOpen(true)}
              className="px-8 py-3 rounded-2xl text-sm font-medium transition-all backdrop-blur-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.90)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.20)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              Chat with Sales Assistant
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <SalesAssistant />
      <FooterContactHandler
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        interestType="General"
      />
    </div>
  );
};
