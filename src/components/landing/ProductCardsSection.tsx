import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    icon: Heart,
    title: 'Clinical Applications',
    tag: 'Anxiety & pain relief',
    description:
      'Therapeutic music sessions for oncology, emergency departments, and post-operative care. Validated symptom reduction protocols with structured outcome reporting.',
    badges: ['Oncology support', 'ED triage', 'Pain management'],
    link: '/products/population-health',
  },
  {
    icon: Building2,
    title: 'Enterprise Wellness',
    tag: 'Focus & productivity',
    description:
      'On-demand focus and stress reduction for the workplace. Adaptive music that responds to team needs with population-level analytics and ROI dashboards.',
    badges: ['Focus sessions', 'Stress reduction', 'Analytics'],
    link: '/products/enterprise-wellness',
  },
  {
    icon: Users,
    title: 'Environmental & Background',
    tag: 'Ambient experiences',
    description:
      'Purpose-composed ambient music for hospitality, retail, and healthcare environments. No royalties, fully licensed, continuously refreshed catalog.',
    badges: ['Zero royalties', 'Continuous refresh', 'Multi-venue'],
    link: '/products/environmental',
  },
];

export const ProductCardsSection: React.FC = () => {
  return (
    <section
      className="relative py-28 md:py-36 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          hsl(220, 15%, 8%) 0%, 
          hsl(220, 12%, 6%) 100%
        )`,
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
            fontSize: 'clamp(32px, 5vw, 48px)',
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
          className="text-center mb-20 max-w-2xl mx-auto"
          style={{ fontSize: '17px', fontWeight: 300, color: 'rgba(255, 255, 255, 0.4)' }}
        >
          From therapeutic sessions to enterprise deployment. The complete stack for
          evidence-based music delivery.
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
                className="rounded-2xl p-8 flex flex-col justify-between group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  minHeight: '380px',
                }}
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.15, type: 'spring', stiffness: 200 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-8"
                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: 'hsl(210, 80%, 60%)' }} />
                  </motion.div>

                  <h3 style={{ fontSize: '20px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.95)', marginBottom: '6px' }}>
                    {product.title}
                  </h3>
                  <p style={{ fontSize: '13px', fontWeight: 400, color: 'hsl(210, 80%, 60%)', marginBottom: '16px' }}>
                    {product.tag}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.45)' }}>
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {product.badges.map((badge, bi) => (
                      <motion.span
                        key={badge}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + bi * 0.06 + 0.3 }}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'rgba(255, 255, 255, 0.5)',
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
          className="flex justify-center mt-16"
        >
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full transition-all hover:gap-3"
            style={{
              background: 'hsl(210, 80%, 55%)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            Experience the demo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
