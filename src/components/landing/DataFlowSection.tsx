import React from 'react';
import { motion } from 'framer-motion';
import { FileAudio, Waves, Heart, Brain, Mic, Music, Target, Sparkles, Shield } from 'lucide-react';

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

const genres = [
  { name: 'Ambient', color: 'hsl(200, 60%, 55%)' },
  { name: 'Classical', color: 'hsl(260, 50%, 60%)' },
  { name: 'Lo-Fi', color: 'hsl(170, 50%, 50%)' },
  { name: 'Nature', color: 'hsl(140, 45%, 50%)' },
  { name: 'Jazz', color: 'hsl(35, 60%, 55%)' },
  { name: 'Binaural', color: 'hsl(280, 50%, 55%)' },
];

const goals = [
  { icon: Target, label: 'Focus Enhancement', intensity: 85 },
  { icon: Shield, label: 'Anxiety Relief', intensity: 92 },
  { icon: Sparkles, label: 'Sleep Induction', intensity: 78 },
  { icon: Music, label: 'Pain Management', intensity: 70 },
];

export const DataFlowSection: React.FC = () => {
  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        background: `linear-gradient(155deg, 
          hsl(195, 70%, 42%) 0%, 
          hsl(210, 65%, 48%) 40%,
          hsl(220, 60%, 52%) 70%,
          hsl(230, 55%, 45%) 100%
        )`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 30% 20%, 
            hsla(180, 60%, 55%, 0.15) 0%, transparent 70%
          ), radial-gradient(ellipse 40% 50% at 80% 80%, 
            hsla(240, 50%, 50%, 0.1) 0%, transparent 70%
          )`,
        }}
      />

      <div className="relative z-10 container mx-auto px-6 md:px-12">
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
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
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

        {/* Genre + Therapeutic Goal Snapshots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Genre Personalization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-7"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="uppercase tracking-widest mb-5" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.6)' }}>
              GENRE LIBRARY
            </p>
            <div className="flex flex-wrap gap-2.5">
              {genres.map((genre, i) => (
                <motion.div
                  key={genre.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: genre.color }} />
                  <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.85)' }}>
                    {genre.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Therapeutic Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-7"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="uppercase tracking-widest mb-5" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.6)' }}>
              THERAPEUTIC GOALS
            </p>
            <div className="space-y-3">
              {goals.map((goal, i) => (
                <motion.div
                  key={goal.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <goal.icon className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255, 255, 255, 0.6)' }} strokeWidth={1.5} />
                  <span className="flex-1" style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.85)' }}>
                    {goal.label}
                  </span>
                  <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${goal.intensity}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(180, 60%, 50%), hsl(200, 70%, 55%))`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.45)', minWidth: '28px', textAlign: 'right' }}>
                    {goal.intensity}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <p className="uppercase tracking-widest mb-6" style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.7)' }}>
            DATA INPUTS
          </p>
          <div className="flex flex-wrap gap-3">
            {inputs.map(({ icon: Icon, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 400,
                }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </motion.span>
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
            border: '1px solid rgba(255, 255, 255, 0.18)',
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
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative rounded-xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.2, type: 'spring', stiffness: 300 }}
                  className="absolute -top-3 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white', fontSize: '11px' }}
                >
                  {step.number}
                </motion.span>
                <h3 className="mt-2" style={{ fontSize: '15px', fontWeight: 400, color: 'white', marginBottom: '4px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.5)' }}>
                  {step.description}
                </p>
                {i < pipeline.length - 1 && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.3 }}
                    className="hidden lg:block absolute top-1/2 -right-3 text-white/30"
                  >→</motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
