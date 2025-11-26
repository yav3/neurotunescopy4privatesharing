import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Building2, ShoppingBag, Coffee, Dumbbell, Home, Users, Volume2, Clock, Shield, Cloud, ArrowRight } from "lucide-react";
import { FooterContactHandler } from "@/components/FooterContactHandler";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";

export default function EnvironmentalBackground() {
  const background = usePageBackground();
  const [contactOpen, setContactOpen] = useState(false);
  const [hoveredUseCase, setHoveredUseCase] = useState<number | null>(null);
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  const useCases = [
    {
      title: "Hotels & hospitality",
      icon: Building2,
      description: "Create calming atmospheres for guests across lobbies, spas, and common areas",
    },
    {
      title: "Retail stores & shopping centers",
      icon: ShoppingBag,
      description: "Enhance customer experience and increase dwell time with therapeutic background music",
    },
    {
      title: "Restaurants & cafés",
      icon: Coffee,
      description: "Set the perfect ambiance for dining experiences that encourage return visits",
    },
    {
      title: "Gyms & fitness centers",
      icon: Dumbbell,
      description: "Motivate members with energizing, scientifically-optimized workout soundtracks",
    },
    {
      title: "Senior living facilities",
      icon: Home,
      description: "Support cognitive health and emotional well-being for residents",
    },
    {
      title: "Spas & wellness centers",
      icon: Users,
      description: "Deepen relaxation and therapeutic outcomes with clinical-grade audio",
    },
  ];

  const benefits = [
    {
      title: "Zero PRO licensing fees",
      icon: Shield,
      description: "No ASCAP, BMI, or SESAC costs. All music is owned and produced by NeuroPositive.",
    },
    {
      title: "Multi-room zone control",
      icon: Volume2,
      description: "Manage different therapeutic music programs across multiple spaces simultaneously",
    },
    {
      title: "Time-of-day programming",
      icon: Clock,
      description: "Automatically adjust music energy levels throughout the day to match natural rhythms",
    },
    {
      title: "Cloud-managed system",
      icon: Cloud,
      description: "Update playlists, monitor playback, and manage settings from anywhere",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-white overflow-hidden relative">
      <PageBackgroundMedia 
        videoSrc={background.video}
        gifSrc={background.gif}
        overlayOpacity={background.overlayOpacity}
      />
      <div className="relative z-10">
        <NavigationHeader />

      {/* Condensed Hero - Minimal Padding */}
      <section className="relative pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl lg:text-5xl font-light mb-3"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            Environmental & Background
          </motion.h1>

          <motion.p 
            className="text-base lg:text-lg mb-8"
            style={{ color: 'rgba(255, 255, 255, 0.60)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            PRO-free environmental music for facilities, retail, hospitality, and public spaces
          </motion.p>
        </div>
      </section>

      {/* Use Cases - Compact Grid with Hover Expand */}
      <section className="relative py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-2xl lg:text-3xl font-light mb-6 text-center"
            style={{ color: 'rgba(255, 255, 255, 0.90)' }}
          >
            Perfect for:
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              const isHovered = hoveredUseCase === index;
              
              return (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  onMouseEnter={() => setHoveredUseCase(index)}
                  onMouseLeave={() => setHoveredUseCase(null)}
                >
                  <div 
                    className="relative p-4 rounded-2xl backdrop-blur-xl transition-all duration-300"
                    style={{
                      background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)'}`,
                      minHeight: isHovered ? '180px' : '120px',
                    }}
                  >
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-xl mb-3 mx-auto"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                    </div>

                    <h3 
                      className="text-sm font-light text-center mb-2"
                      style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      {useCase.title}
                    </h3>

                    <motion.p 
                      className="text-xs text-center leading-relaxed"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.65)',
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0,
                      }}
                      initial={false}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {useCase.description}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits - Compact 2x2 Grid with Hover Expand */}
      <section className="relative py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-2xl lg:text-3xl font-light mb-6 text-center"
            style={{ color: 'rgba(255, 255, 255, 0.90)' }}
          >
            Key Benefits:
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isHovered = hoveredBenefit === index;
              
              return (
                <motion.div
                  key={index}
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredBenefit(index)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                >
                  <div 
                    className="relative p-5 rounded-2xl backdrop-blur-xl transition-all duration-300"
                    style={{
                      background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)'}`,
                      minHeight: isHovered ? '200px' : '140px',
                    }}
                  >
                    <div 
                      className="flex items-center justify-center w-12 h-12 rounded-xl mb-3 mx-auto"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                    </div>

                    <h3 
                      className="text-sm font-light text-center mb-2"
                      style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      {benefit.title}
                    </h3>

                    <motion.p 
                      className="text-xs text-center leading-relaxed"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.65)',
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0,
                      }}
                      initial={false}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0 
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {benefit.description}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prominent CTA - Eye-catching Design */}
      <section className="relative py-12 px-6">
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
                Ready to transform your space?
              </h2>

              <p 
                className="text-base mb-8 max-w-2xl mx-auto"
                style={{ color: 'rgba(255, 255, 255, 0.75)' }}
              >
                Join hundreds of facilities using NeuroTunes to enhance environments and support well-being
              </p>

              <button
                onClick={() => setContactOpen(true)}
                className="group relative px-12 py-5 rounded-full text-lg font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                  color: '#000000',
                  boxShadow: '0 8px 32px rgba(255, 255, 255, 0.25), 0 0 0 0 rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 48px rgba(255, 255, 255, 0.35), 0 0 0 8px rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.25), 0 0 0 0 rgba(255, 255, 255, 0.4)';
                }}
              >
                <span className="flex items-center gap-2 justify-center">
                  Request Site Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Animated glow background */}
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
        interestType="Environmental & Background Music - Site Assessment"
      />

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.25), 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.35), 0 0 0 4px rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
      </div>
    </div>
  );
}
