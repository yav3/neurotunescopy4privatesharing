import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { RegistrationChatAssistant } from "@/components/registration/RegistrationChatAssistant";
import FeaturedSessions from "@/components/FeaturedSessions";


export default function Experience() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationHeader />
      <RegistrationChatAssistant 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32">
        {/* Chrome/obsidian background */}
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at top, rgba(27, 27, 31, 0.7), rgba(5, 5, 9, 1))',
            }}
          />
        </div>

        {/* Dark radial overlay for readability */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.65), transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 lg:pb-32">
          {/* Glass backplate */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[40px] px-8 py-12 sm:px-14 sm:py-16"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(60px)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[80px] font-light tracking-tight text-center leading-[1.1]">
              Experience NeuroTunes
            </h1>
            <p 
              className="mt-6 text-base sm:text-lg lg:text-[26px] text-center max-w-3xl mx-auto font-extralight leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.70)' }}
            >
              Explore our therapeutic music sessions. Each session is
              scientifically designed to support specific cognitive and
              emotional states using neuroscience-informed composition and AI
              personalization.
            </p>

            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => setIsRegistrationOpen(true)}
                className="px-10 py-4 rounded-2xl text-sm sm:text-base font-light transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.10)',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  color: 'rgba(255, 255, 255, 0.90)',
                  backdropFilter: 'blur(20px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.20)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED SESSIONS */}
      <FeaturedSessions />


      <Footer />
    </div>
  );
}
