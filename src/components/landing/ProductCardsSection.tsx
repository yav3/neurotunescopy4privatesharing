import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    icon: Heart,
    title: 'Clinical',
    tag: 'Anxiety & pain relief',
    description: 'Validated protocols for oncology, ED, and post-op care.',
    badges: ['Oncology', 'ED triage', 'Pain'],
    link: '/products/population-health',
  },
  {
    icon: Building2,
    title: 'Enterprise',
    tag: 'Focus & productivity',
    description: 'Adaptive music with population analytics and ROI dashboards.',
    badges: ['Focus', 'Stress', 'Analytics'],
    link: '/products/enterprise-wellness',
  },
  {
    icon: Users,
    title: 'Environmental',
    tag: 'Ambient experiences',
    description: 'Royalty-free, continuously refreshed catalog for any venue.',
    badges: ['Zero royalties', 'Multi-venue'],
    link: '/products/environmental',
  },
];

export const ProductCardsSection: React.FC = () => {
  return (
    <section
      className="relative py-20 md:py-24 overflow-hidden"
      style={{
        background: 'transparent',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
          style={{
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            color: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          Beyond music—<span style={{ color: 'hsl(210, 80%, 60%)' }}>infrastructure</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-xl mx-auto"
          style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)' }}
        >
          The complete stack for evidence-based music delivery.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {products.map((product, i) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 flex flex-col justify-between group hover:border-white/12 transition-all duration-500"
                style={{
                  background: 'hsla(220, 20%, 10%, 0.5)',
                  border: '1px solid hsla(0, 0%, 100%, 0.08)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.3), inset 0 1px 0 hsla(0, 0%, 100%, 0.03)',
                  minHeight: '280px',
                }}
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.15, type: 'spring', stiffness: 200 }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                    style={{ background: 'hsla(210, 80%, 55%, 0.1)', border: '1px solid hsla(210, 80%, 55%, 0.15)' }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: 'hsl(210, 80%, 60%)' }} />
                  </motion.div>

                  <h3 style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.95)', marginBottom: '4px' }}>
                    {product.title}
                  </h3>
                  <p style={{ fontSize: '12px', fontWeight: 400, color: 'hsl(210, 80%, 60%)', marginBottom: '12px' }}>
                    {product.tag}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.45)' }}>
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {product.badges.map((badge, bi) => (
                      <motion.span
                        key={badge}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + bi * 0.06 + 0.3 }}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background: 'hsla(220, 20%, 12%, 0.4)',
                          border: '1px solid hsla(0, 0%, 100%, 0.06)',
                          color: 'hsla(0, 0%, 100%, 0.5)',
                          fontWeight: 400,
                        }}
                      >
                        {badge}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <Link
                  to={product.link}
                  className="inline-flex items-center gap-2 mt-8 group-hover:gap-3 transition-all"
                  style={{ fontSize: '14px', fontWeight: 400, color: 'hsl(210, 80%, 60%)' }}
                >
                  Explore <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full transition-all hover:gap-3"
            style={{
              background: 'linear-gradient(135deg, hsl(210, 80%, 50%), hsl(220, 85%, 55%))',
              color: 'white',
              fontSize: '14px',
              fontWeight: 400,
              boxShadow: '0 0 24px hsla(210, 80%, 55%, 0.3)',
            }}
          >
            Experience the demo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
