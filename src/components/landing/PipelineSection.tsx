import React from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, Target, BarChart3 } from 'lucide-react';

const steps = [
  { number: 1, icon: Music, title: 'Compose', description: 'Algorithmic composition', active: true },
  { number: 2, icon: Zap, title: 'Annotate', description: 'Feature extraction' },
  { number: 3, icon: Target, title: 'Classify', description: 'Therapeutic mapping' },
  { number: 4, icon: BarChart3, title: 'Deliver', description: 'Adaptive playback' },
];

export const PipelineSection: React.FC = () => {
  return (
    <section
      className="relative py-20 md:py-24 overflow-hidden"
      style={{
        background: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Title */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(0, 0%, 50%)' }}
        >
          COMPOSITION ENGINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-2"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(0, 0%, 89%)' }}
        >
          Algorithmic music pipeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(0, 0%, 55%)' }}
        >
          From patented composition to adaptive therapeutic delivery
        </motion.p>

        {/* Pipeline steps — inline row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-xl p-5"
                style={{
                  background: step.active ? 'hsla(210, 60%, 45%, 0.08)' : 'hsla(220, 20%, 12%, 0.4)',
                  border: step.active ? '1px solid hsla(210, 60%, 50%, 0.15)' : '1px solid hsla(0, 0%, 100%, 0.06)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Icon
                  className="w-6 h-6 mb-3"
                  strokeWidth={1.2}
                  style={{ color: step.active ? 'hsl(210, 80%, 60%)' : 'hsl(0, 0%, 55%)' }}
                />
                <h3 style={{ fontSize: '15px', fontWeight: 400, color: 'hsl(0, 0%, 89%)', marginBottom: '2px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '12px', fontWeight: 300, color: 'hsl(0, 0%, 55%)' }}>
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <span className="hidden lg:block absolute top-1/2 -right-2.5" style={{ color: 'hsl(0, 0%, 30%)', fontSize: '12px' }}>→</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Two compact info rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl p-5"
            style={{ background: 'hsla(220, 20%, 12%, 0.4)', border: '1px solid hsla(0, 0%, 100%, 0.06)', backdropFilter: 'blur(12px)' }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(0, 0%, 89%)', marginBottom: '10px' }}>
              Why algorithmic composition
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Precision dosing', 'Reproducible', 'Scalable', 'Evidence-based'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    fontSize: '11px',
                    background: 'hsla(220, 20%, 14%, 0.5)',
                    border: '1px solid hsla(0, 0%, 100%, 0.06)',
                    color: 'hsl(0, 0%, 65%)',
                    fontWeight: 400,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="rounded-xl p-5"
            style={{ background: 'hsla(220, 20%, 12%, 0.4)', border: '1px solid hsla(0, 0%, 100%, 0.06)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(0, 0%, 89%)' }}>
                Feature annotation
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px]" style={{ background: 'hsl(150, 60%, 40%)', color: 'hsl(0, 0%, 96%)' }}>LIVE</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Signal Processing', count: 24 },
                { label: 'Neural Networks', count: 18 },
                { label: 'Statistical Models', count: 15 },
              ].map((method) => (
                <span
                  key={method.label}
                  className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    fontSize: '11px',
                    background: 'hsla(220, 20%, 14%, 0.5)',
                    border: '1px solid hsla(0, 0%, 100%, 0.06)',
                    color: 'hsl(0, 0%, 65%)',
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
