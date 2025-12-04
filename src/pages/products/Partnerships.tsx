import { useState, useRef } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Code, Smartphone, Car, Plane, Home, Watch, ArrowRight, ChevronLeft, ChevronRight, Layers, Database, Palette, Handshake } from "lucide-react";
import { FooterContactHandler } from "@/components/FooterContactHandler";

export default function Partnerships() {
  const [contactOpen, setContactOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const partnerTypes = [
    {
      title: "Content Licensing",
      icon: Layers,
      description: "License our 8,000+ therapeutic music catalog for your existing platform",
    },
    {
      title: "White-Label Platform",
      icon: Palette,
      description: "Full platform deployment under your brand with custom theming",
    },
    {
      title: "OEM Integration",
      icon: Code,
      description: "Deep integration into hardware and software products",
    },
    {
      title: "API Access",
      icon: Database,
      description: "RESTful APIs for seamless integration with your tech stack",
    },
  ];

  const targetMarkets = [
    {
      title: "Wellness App Platforms",
      icon: Smartphone,
      description: "Meditation, sleep, and fitness apps seeking premium therapeutic content",
    },
    {
      title: "Health Tech Companies",
      icon: Code,
      description: "Digital therapeutics and telehealth platforms enhancing patient care",
    },
    {
      title: "Automotive (In-Car Wellness)",
      icon: Car,
      description: "Vehicle manufacturers integrating wellness features for drivers and passengers",
    },
    {
      title: "Airlines (In-Flight Wellness)",
      icon: Plane,
      description: "Aviation partners bringing therapeutic music to millions of travelers",
    },
    {
      title: "Smart Home Devices",
      icon: Home,
      description: "Connected home ecosystems with ambient therapeutic audio",
    },
    {
      title: "Wearable Manufacturers",
      icon: Watch,
      description: "Fitness trackers and smartwatches with integrated wellness audio",
    },
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white overflow-hidden relative">
      <div className="relative z-10">
        <NavigationHeader />

        {/* Hero */}
        <section className="relative pt-16 pb-2 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              className="text-3xl lg:text-4xl font-light mb-2"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Partnerships & Integration
            </motion.h1>

            <motion.p 
              className="text-sm lg:text-base mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.60)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              White-label, OEM, and API solutions for wellness platforms and tech companies
            </motion.p>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="relative py-8 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 
              className="text-2xl lg:text-3xl font-light mb-6 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.90)' }}
            >
              Partnership Models
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {partnerTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                      </div>
                      <div>
                        <h3 
                          className="text-lg font-light mb-2"
                          style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                        >
                          {type.title}
                        </h3>
                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                        >
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Target Markets Carousel */}
        <section className="relative py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 
              className="text-2xl lg:text-3xl font-light mb-6 text-center"
              style={{ color: 'rgba(255, 255, 255, 0.90)' }}
            >
              Target Industries
            </h2>

            <div className="relative">
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(192, 192, 192, 0.3)',
                }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: 'rgba(192, 192, 192, 0.9)' }} />
              </button>

              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-12 pb-4"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {targetMarkets.map((market, index) => {
                  const Icon = market.icon;
                  
                  return (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-72"
                      style={{ scrollSnapAlign: 'start' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div 
                        className="p-6 rounded-2xl backdrop-blur-xl h-full transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <div 
                          className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                          }}
                        >
                          <Icon className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                        </div>

                        <h3 
                          className="text-base font-light mb-2"
                          style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                        >
                          {market.title}
                        </h3>

                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                        >
                          {market.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(192, 192, 192, 0.3)',
                }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: 'rgba(192, 192, 192, 0.9)' }} />
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Info */}
        <section className="relative py-8 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Handshake className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
              <h3 
                className="text-xl font-light mb-2"
                style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              >
                Custom Partnership Agreements
              </h3>
              <p 
                className="text-sm mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.65)' }}
              >
                Custom pricing based on partnership scope and integration requirements
              </p>
              <p 
                className="text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.50)' }}
              >
                Includes co-development opportunities, revenue sharing models, and dedicated support
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 0 60px rgba(255, 255, 255, 0.15), inset 0 0 40px rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="relative z-10 p-10 text-center">
                <h2 
                  className="text-3xl lg:text-4xl font-light mb-4"
                  style={{ color: 'rgba(255, 255, 255, 0.98)' }}
                >
                  Ready to partner with us?
                </h2>

                <p 
                  className="text-base mb-8 max-w-2xl mx-auto"
                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                >
                  Let's explore how therapeutic music can enhance your platform and delight your users
                </p>

                <button
                  onClick={() => setContactOpen(true)}
                  className="group relative px-12 py-5 rounded-full text-lg transition-all duration-300"
                  style={{
                    background: '#000000',
                    color: '#c0c0c0',
                    border: '1px solid rgba(192, 192, 192, 0.3)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.background = '#0a0a0a';
                    e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.borderColor = 'rgba(192, 192, 192, 0.3)';
                  }}
                >
                  <span className="flex items-center gap-2 justify-center">
                    Discuss Partnership
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>

              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15), transparent 70%)',
                  animation: 'pulse-soft 3s ease-in-out infinite',
                }}
              />
            </motion.div>
          </div>
        </section>

        <Footer />
        <FooterContactHandler
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          interestType="Partnerships & Integration - Discussion Request"
        />

        <style>{`
          @keyframes pulse-soft {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}