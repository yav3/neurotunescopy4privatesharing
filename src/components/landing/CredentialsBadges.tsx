import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Award, Brain, Microscope, Users, Music, ChevronLeft, ChevronRight } from 'lucide-react';

const credentials = [
  {
    icon: Shield,
    title: "Evidence-Based",
    subtitle: "Clinically Tested",
    description: "Clinical validation with peer-reviewed research"
  },
  {
    icon: Microscope,
    title: "Patented Methods",
    subtitle: "Backed by Science",
    description: "Proprietary therapeutic protocols"
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    subtitle: "15K+ Studies",
    description: "Crafted from comprehensive music therapy research"
  },
  {
    icon: Users,
    title: "KOL Team",
    subtitle: "Physician-Neuroscientist",
    description: "Key Opinion Leader informed methodology"
  },
  {
    icon: Award,
    title: "Award-Winning",
    subtitle: "Expert Musicians",
    description: "Professional songwriting, composing & production team"
  },
  {
    icon: Music,
    title: "Original Music",
    subtitle: "8K+ Songs",
    description: "Proprietary therapeutic music library"
  }
];

export function CredentialsBadges() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Start carousel animation after 3 seconds (when GIF finishes)
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, 3000);

    return () => clearTimeout(startTimer);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % credentials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hasStarted]);

  return (
    <section className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl sm:text-6xl font-headers font-light text-white mb-6">
            Built on <span className="font-normal bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">Science & Excellence</span>
          </h2>
          <p className="text-xl sm:text-2xl font-body text-white/70 max-w-3xl mx-auto leading-relaxed">
            Our platform combines cutting-edge AI with decades of music therapy research
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              transition={{ 
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="absolute w-full max-w-2xl"
            >
              {/* Glass card with zoom effect */}
              <div className="relative h-full p-12 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl opacity-60" 
                  style={{
                    background: 'radial-gradient(circle at center, rgba(110, 197, 197, 0.2), transparent 70%)',
                  }}
                />

                {/* Icon container */}
                <motion.div 
                  className="relative w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 mx-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  {React.createElement(credentials[currentIndex].icon, {
                    className: "w-12 h-12 text-cyan-300 stroke-[1.5]"
                  })}
                </motion.div>

                {/* Content */}
                <div className="relative text-center">
                  <motion.h3 
                    className="text-4xl font-headers font-semibold text-white mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {credentials[currentIndex].title}
                  </motion.h3>
                  <motion.p 
                    className="text-2xl font-body text-cyan-300/90 mb-6 font-medium"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {credentials[currentIndex].subtitle}
                  </motion.p>
                  <motion.p 
                    className="text-xl font-body text-white/60 leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {credentials[currentIndex].description}
                  </motion.p>
                </div>

                {/* Accent corner decorations */}
                <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-cyan-300/60" />
                <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-cyan-300/60" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + credentials.length) % credentials.length)}
            className="absolute left-0 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % credentials.length)}
            className="absolute right-0 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
            {credentials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-cyan-300 w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
