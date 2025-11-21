import { useState } from "react";
import { Link } from "react-router-dom";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { RegistrationChatAssistant } from "@/components/registration/RegistrationChatAssistant";
import chrome1 from '@/assets/chrome-1.png';
import chrome2 from '@/assets/chrome-2.png';
import chrome3 from '@/assets/chrome-3.png';
import chrome4 from '@/assets/chrome-4.png';

const SESSIONS = [
  {
    id: "stress-relief",
    title: "Stress Relief",
    icon: "♡",
    short:
      "Scientifically designed to lower cortisol levels and support parasympathetic recovery.",
    benefits: [
      "Reduced stress and anxiety",
      "Easier emotional regulation",
      "More stable mood throughout the day",
    ],
    chrome: chrome1,
  },
  {
    id: "deep-sleep",
    title: "Deep Sleep",
    icon: "☾",
    short:
      "Delta-wave–inspired frequencies and gentle melodic architecture for deeper, restorative sleep.",
    benefits: [
      "Faster sleep onset",
      "Deeper, more restorative sleep",
      "Improved morning clarity",
    ],
    chrome: chrome2,
  },
  {
    id: "natural-energy",
    title: "Natural Energy",
    icon: "⚡",
    short:
      "Energizing compositions with uplifting rhythms and activating spectral patterns.",
    benefits: [
      "Increased motivation",
      "Sustained cognitive energy",
      "Reduced mid-day fatigue",
    ],
    chrome: chrome3,
  },
  {
    id: "meditation-support",
    title: "Meditation Support",
    icon: "≋",
    short:
      "Theta-focused soundscapes to support deeper meditative states and mindful presence.",
    benefits: [
      "Easier entry into meditation",
      "Improved focus on breath and body",
      "Greater sense of calm afterward",
    ],
    chrome: chrome4,
  },
];

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
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-2xl sm:text-3xl lg:text-[64px] font-light text-center leading-[1.1]"
        >
          Featured Therapeutic Sessions
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SESSIONS.map((session, index) => (
            <motion.article
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative rounded-[32px] overflow-hidden flex flex-col group cursor-pointer"
            >
              {/* Chrome background */}
              <div className="absolute inset-0">
                <img
                  src={session.chrome}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Glossy black overlay */}
              <div 
                className="absolute inset-0 backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.75) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Icon chip */}
                <div 
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl text-lg"
                  style={{
                    background: 'rgba(0, 0, 0, 0.50)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                  }}
                >
                  {session.icon}
                </div>

                <h3 
                  className="text-xl font-light mb-2"
                  style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                >
                  {session.title}
                </h3>
                <p 
                  className="text-sm mb-4 font-light leading-relaxed"
                  style={{ color: 'rgba(255, 255, 255, 0.70)' }}
                >
                  {session.short}
                </p>

                <div 
                  className="mt-auto pt-4"
                  style={{ borderTop: '1px solid rgba(255, 255, 255, 0.10)' }}
                >
                  <p 
                    className="text-xs font-semibold tracking-wide mb-2"
                    style={{ color: 'rgba(255, 255, 255, 0.60)' }}
                  >
                    KEY BENEFITS
                  </p>
                  <ul className="space-y-1 text-xs" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                    {session.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span 
                          className="mt-[3px] h-[6px] w-[6px] rounded-full"
                          style={{ background: 'rgba(255, 255, 255, 0.40)' }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section 
        className="relative py-40"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.10)',
          background: 'rgba(0, 0, 0, 0.90)',
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at top, rgba(255, 255, 255, 0.06), transparent 65%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[40px] px-8 py-16"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
              backdropFilter: 'blur(60px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 80px rgba(255, 255, 255, 0.08)',
            }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[64px] font-light mb-6 leading-[1.1]">
              Ready to transform your well-being?
            </h2>
            <p 
              className="text-base sm:text-lg lg:text-[24px] max-w-2xl mx-auto mb-10 font-extralight leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.70)' }}
            >
              Get started with NeuroTunes and experience the power of medical-grade
              therapeutic music with no additional licensing fees or restrictions.
            </p>
            <button 
              onClick={() => setIsRegistrationOpen(true)}
              className="px-10 py-4 rounded-2xl text-sm sm:text-base font-medium transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: 'rgba(255, 255, 255, 0.90)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.20)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
