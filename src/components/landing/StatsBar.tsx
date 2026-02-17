import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '7,000+', label: 'purpose-composed tracks' },
  { value: '50+', label: 'genres covered' },
  { value: '8', label: 'languages supported' },
  { value: '92%', label: 'symptom response rate' },
  { value: '3', label: 'patents filed' },
];

export const StatsBar: React.FC = () => {
  return (
    <section
      className="relative py-16 md:py-20"
      style={{
        background: 'hsl(220, 15%, 6%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-wrap justify-between gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 min-w-[140px]"
              style={{
                borderLeft: i > 0 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                paddingLeft: i > 0 ? '24px' : '0',
              }}
            >
              <p style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'rgba(255, 255, 255, 0.95)' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
