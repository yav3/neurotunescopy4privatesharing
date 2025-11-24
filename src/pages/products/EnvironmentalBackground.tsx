import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Building2, ShoppingBag, Coffee, Dumbbell, Home, Users, Volume2, Clock, Shield, Cloud, ArrowLeft } from "lucide-react";
import obsidianLiquid from '@/assets/obsidian-liquid-1.png';
import { FooterContactHandler } from "@/components/FooterContactHandler";
import { Link } from "react-router-dom";

export default function EnvironmentalBackground() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

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
      title: "Zero PRO licensing fees (100% proprietary)",
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
    <div className="min-h-screen bg-black text-white">
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Obsidian background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${obsidianLiquid})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.9))',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Back Button */}
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 mb-12 group"
            style={{ color: 'rgba(255, 255, 255, 0.60)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.60)'}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Products</span>
          </Link>
          
          <div className="max-w-4xl">
            {/* Sound wave icon */}
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <Volume2 className="w-8 h-8" style={{ color: 'rgba(255, 255, 255, 0.90)' }} />
            </div>

            <motion.h1 
              className="text-5xl lg:text-7xl font-light mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Environmental & Background
            </motion.h1>

            <motion.p 
              className="text-xl lg:text-2xl mb-8"
              style={{ color: 'rgba(255, 255, 255, 0.70)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              PRO-free environmental music for facilities, retail, hospitality, and public spaces
            </motion.p>

            <motion.button
              onClick={() => setContactOpen(true)}
              className="px-8 py-4 rounded-full text-base font-medium transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: 'rgba(255, 255, 255, 0.95)',
                cursor: 'pointer'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255, 255, 255, 0.30)',
              }}
            >
              Request Site Assessment
            </motion.button>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl lg:text-5xl font-light mb-16 text-center"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
          >
            Perfect for:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative rounded-3xl overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="relative p-8 h-full backdrop-blur-2xl transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div 
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                    </div>

                    <h3 
                      className="text-2xl font-light mb-3"
                      style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      {useCase.title}
                    </h3>

                    <p 
                      className="text-base leading-relaxed"
                      style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                    >
                      {useCase.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl lg:text-5xl font-light mb-16 text-center"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
          >
            Key Benefits:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="relative rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div 
                    className="relative p-10 backdrop-blur-2xl"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div 
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: 'rgba(255, 255, 255, 0.85)' }} />
                    </div>

                    <h3 
                      className="text-2xl font-light mb-4"
                      style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      {benefit.title}
                    </h3>

                    <p 
                      className="text-lg leading-relaxed"
                      style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                    >
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent 60%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl lg:text-6xl font-light mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
            >
              Ready to transform your space with therapeutic music?
            </h2>

            <p 
              className="text-xl mb-12"
              style={{ color: 'rgba(255, 255, 255, 0.70)' }}
            >
              Join hundreds of facilities using NeuroTunes to enhance environments and support well-being
            </p>

            <button
              onClick={() => setContactOpen(true)}
              className="px-10 py-4 rounded-full text-lg font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.12))';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.08)';
              }}
            >
              Request Site Assessment
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FooterContactHandler
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        interestType="Environmental & Background Music - Site Assessment"
      />
    </div>
  );
}
