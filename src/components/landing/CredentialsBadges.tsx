import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Brain, Microscope, Users, Music } from 'lucide-react';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {credentials.map((credential, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Glass card */}
              <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                  style={{
                    background: 'radial-gradient(circle at center, rgba(110, 197, 197, 0.15), transparent 70%)',
                  }}
                />

                {/* Icon container */}
                <motion.div 
                  className="relative w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 group-hover:border-cyan-300/40 transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <credential.icon className="w-8 h-8 text-cyan-300 stroke-[1.5]" />
                </motion.div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-headers font-semibold text-white mb-2">
                    {credential.title}
                  </h3>
                  <p className="text-xl font-body text-cyan-300/90 mb-4 font-medium">
                    {credential.subtitle}
                  </p>
                  <p className="text-base font-body text-white/60 leading-relaxed">
                    {credential.description}
                  </p>
                </div>

                {/* Accent corner decoration */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-300/40 group-hover:bg-cyan-300/60 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
