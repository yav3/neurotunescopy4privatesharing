import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Zap, Target, BarChart3 } from 'lucide-react';

const steps = [
  { number: 1, icon: Music, title: 'Compose', description: 'Algorithmic composition' },
  { number: 2, icon: Zap, title: 'Annotate', description: 'Feature extraction' },
  { number: 3, icon: Target, title: 'Classify', description: 'Therapeutic mapping' },
  { number: 4, icon: BarChart3, title: 'Deliver', description: 'Adaptive playback' },
];

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through steps every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
          style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.15em', color: 'hsl(0, 0%, 50%)' }}
        >
          COMPOSITION ENGINE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-2"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, letterSpacing: '-0.02em', color: 'hsl(0, 0%, 89%)' }}
        >
          Algorithmic music pipeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
          style={{ fontSize: '14px', fontWeight: 300, color: 'hsl(0, 0%, 55%)' }}
        >
          From patented composition to adaptive therapeutic delivery
        </motion.p>

        {/* Pipeline steps — auto-cycling + hover */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.04, y: -2 }}
                onHoverStart={() => setActiveStep(i)}
                className="relative rounded-xl p-5 cursor-pointer transition-colors duration-500"
                style={{
                  background: isActive ? 'hsla(210, 60%, 45%, 0.1)' : 'hsla(220, 20%, 12%, 0.4)',
                  border: isActive ? '1px solid hsla(210, 60%, 50%, 0.2)' : '1px solid hsla(0, 0%, 100%, 0.06)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: isActive ? '0 0 24px hsla(210, 70%, 50%, 0.08), inset 0 1px 0 hsla(210, 60%, 70%, 0.06)' : 'none',
                }}
              >
                {/* Pulsing icon */}
                <motion.div
                  animate={isActive ? {
                    scale: [1, 1.15, 1],
                    opacity: [0.8, 1, 0.8],
                  } : { scale: 1, opacity: 0.6 }}
                  transition={isActive ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  } : { duration: 0.3 }}
                >
                  <Icon
                    className="w-6 h-6 mb-3"
                    strokeWidth={1.2}
                    style={{ color: isActive ? 'hsl(210, 80%, 60%)' : 'hsl(0, 0%, 55%)' }}
                  />
                </motion.div>
                <h3 style={{ fontSize: '15px', fontWeight: 400, color: isActive ? 'hsl(0, 0%, 95%)' : 'hsl(0, 0%, 75%)', marginBottom: '2px', transition: 'color 0.4s' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '12px', fontWeight: 300, color: isActive ? 'hsl(0, 0%, 65%)' : 'hsl(0, 0%, 45%)', transition: 'color 0.4s' }}>
                  {step.description}
                </p>

                {/* Arrow connector */}
                {i < steps.length - 1 && (
                  <motion.span
                    className="hidden lg:block absolute top-1/2 -right-2.5"
                    style={{ fontSize: '12px' }}
                    animate={{
                      color: isActive ? 'hsl(210, 60%, 55%)' : 'hsl(0, 0%, 30%)',
                      x: isActive ? [0, 3, 0] : 0,
                    }}
                    transition={isActive ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                  >
                    →
                  </motion.span>
                )}

                {/* Active indicator line */}
                <motion.div
                  className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                  style={{ background: 'hsl(210, 80%, 55%)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Two compact info rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl p-5 cursor-default"
            style={{ background: 'hsla(220, 20%, 12%, 0.4)', border: '1px solid hsla(0, 0%, 100%, 0.06)', backdropFilter: 'blur(12px)' }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(0, 0%, 89%)', marginBottom: '10px' }}>
              Why algorithmic composition
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Precision dosing', 'Reproducible', 'Scalable', 'Evidence-based'].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  whileHover={{ scale: 1.08, borderColor: 'hsla(210, 60%, 50%, 0.2)' }}
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
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl p-5 cursor-default"
            style={{ background: 'hsla(220, 20%, 12%, 0.4)', border: '1px solid hsla(0, 0%, 100%, 0.06)', backdropFilter: 'blur(12px)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(0, 0%, 89%)' }}>
                Feature annotation
              </h3>
              <motion.span
                className="px-2 py-0.5 rounded text-[9px]"
                style={{ background: 'hsl(150, 60%, 40%)', color: 'hsl(0, 0%, 96%)' }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                LIVE
              </motion.span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Signal Processing', count: 24 },
                { label: 'Neural Networks', count: 18 },
                { label: 'Statistical Models', count: 15 },
              ].map((method, i) => (
                <motion.span
                  key={method.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  whileHover={{ scale: 1.08, borderColor: 'hsla(210, 60%, 50%, 0.2)' }}
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
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
