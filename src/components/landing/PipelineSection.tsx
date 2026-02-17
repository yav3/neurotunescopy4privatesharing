import React from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, Target, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: Music,
    title: 'Compose',
    description: 'Algorithmic composition',
    detail: 'Tempo, Key, Harmony, Timbre',
    active: true,
  },
  {
    number: 2,
    icon: Zap,
    title: 'Annotate',
    description: 'Automated feature extraction',
    detail: '',
  },
  {
    number: 3,
    icon: Target,
    title: 'Classify',
    description: 'Therapeutic mapping',
    detail: '',
  },
  {
    number: 4,
    icon: BarChart3,
    title: 'Deliver',
    description: 'Adaptive playback',
    detail: '',
  },
];

export const PipelineSection: React.FC = () => {
  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(220, 15%, 8%) 0%, 
          hsl(220, 12%, 10%) 100%
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
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255, 255, 255, 0.7)' }}>
              COMPOSITION ENGINE
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(210, 80%, 60%)' }} />
              ))}
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          Algorithmic music pipeline
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20 max-w-2xl mx-auto"
          style={{
            fontSize: '17px',
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          From patented composition methods to adaptive therapeutic delivery
        </motion.p>

        {/* Pipeline steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 md:p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative rounded-xl p-6 flex flex-col"
                  style={{
                    background: step.active ? 'rgba(56, 152, 236, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: step.active ? '1px solid rgba(56, 152, 236, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {/* Step number */}
                  <span
                    className="absolute -top-3 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{
                      background: step.active ? 'hsl(210, 80%, 55%)' : 'rgba(255, 255, 255, 0.1)',
                      color: step.active ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      fontSize: '11px',
                      fontWeight: 400,
                    }}
                  >
                    {step.number}
                  </span>

                  <Icon
                    className="w-8 h-8 mb-5"
                    strokeWidth={1.2}
                    style={{ color: step.active ? 'hsl(210, 80%, 60%)' : 'rgba(255, 255, 255, 0.3)' }}
                  />

                  <h3 style={{ fontSize: '16px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)' }}>
                    {step.description}
                  </p>
                  {step.detail && (
                    <p className="mt-3" style={{ fontSize: '12px', fontWeight: 400, color: 'hsl(210, 80%, 60%)' }}>
                      {step.detail}
                    </p>
                  )}

                  {/* Arrow connector */}
                  {i < steps.length - 1 && (
                    <span className="hidden lg:block absolute top-1/2 -right-3 text-white/15">→</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-8 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '25%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: 'hsl(210, 80%, 55%)' }}
            />
          </div>
        </motion.div>

        {/* Two info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}>
              Why algorithmic composition
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Precision dosing', 'Reproducible', 'Scalable', 'Evidence-based'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 400,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.9)' }}>
                Feature annotation
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px]" style={{ background: 'hsl(150, 60%, 40%)', color: 'white' }}>LIVE</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Signal Processing', count: 24 },
                { label: 'Neural Networks', count: 18 },
                { label: 'Statistical Models', count: 15 },
              ].map((method) => (
                <span
                  key={method.label}
                  className="px-3 py-1.5 rounded-full text-xs flex items-center gap-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 400,
                  }}
                >
                  {method.label}
                  <span style={{ color: 'hsl(210, 80%, 60%)' }}>{method.count}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
