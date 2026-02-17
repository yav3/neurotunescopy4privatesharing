import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '7,000+', label: 'purpose-composed tracks' },
  { value: '50+', label: 'genres covered' },
  { value: '8', label: 'languages supported' },
  { value: '15,000+', label: 'studies informing our music' },
  { value: '6', label: 'patents (2 granted · 4 pending)' },
];

export const StatsBar: React.FC = () => {
  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden"
      style={{
        background: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        style={{
          background: `radial-gradient(ellipse 80% 100% at 50% 50%, 
            hsla(210, 60%, 20%, 0.15) 0%, 
            transparent 70%
          )`
        }}
      />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-wrap justify-between gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 min-w-[140px]"
              style={{
                borderLeft: i > 0 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                paddingLeft: i > 0 ? '24px' : '0',
              }}
            >
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2, duration: 0.5, type: 'spring' }}
                style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'rgba(255, 255, 255, 0.95)' }}
              >
                {stat.value}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.35 }}
                style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
