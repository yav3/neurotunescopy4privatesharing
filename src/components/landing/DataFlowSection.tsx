import React from 'react';
import { motion } from 'framer-motion';
import { FileAudio, Waves, Heart, Brain, Mic } from 'lucide-react';

const inputs = [
  { icon: FileAudio, label: 'Audio Analysis' },
  { icon: Waves, label: 'Waveform' },
  { icon: Brain, label: 'Neuro Signals' },
  { icon: Heart, label: 'Biometrics' },
  { icon: Mic, label: 'Acoustic Features' },
];

const pipeline = [
  { number: 1, title: 'Ingest & Analyze', description: 'Audio feature extraction' },
  { number: 2, title: 'Map Therapeutics', description: 'VAD + clinical mapping' },
  { number: 3, title: 'Personalize', description: 'Adaptive algorithm selection' },
  { number: 4, title: 'Deliver Session', description: 'Real-time streaming' },
];

export const DataFlowSection: React.FC = () => {
  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(220, 65%, 55%) 0%, 
          hsl(220, 60%, 50%) 100%
        )`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.9)' }}>
              DATA ARCHITECTURE
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.7)' }} />
              ))}
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'white',
          }}
        >
          End-to-end therapeutic flow
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-2xl mx-auto"
          style={{ fontSize: '17px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.65)' }}
        >
          From raw audio features to personalized therapeutic sessions
        </motion.p>

        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <p className="uppercase tracking-widest mb-6" style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.7)' }}>
            DATA INPUTS
          </p>
          <div className="flex flex-wrap gap-3">
            {inputs.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 400,
                }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <p className="uppercase tracking-widest" style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.7)' }}>
              PROCESSING PIPELINE
            </p>
            <span className="w-2 h-2 rounded-full" style={{ background: 'hsl(150, 70%, 50%)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pipeline.map((step, i) => (
              <div
                key={step.number}
                className="relative rounded-xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <span
                  className="absolute -top-3 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', fontSize: '11px' }}
                >
                  {step.number}
                </span>
                <h3 className="mt-2" style={{ fontSize: '15px', fontWeight: 400, color: 'white', marginBottom: '4px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.5)' }}>
                  {step.description}
                </p>
                {i < pipeline.length - 1 && (
                  <span className="hidden lg:block absolute top-1/2 -right-3 text-white/30">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
