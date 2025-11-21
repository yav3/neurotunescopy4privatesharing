import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  backgroundImage?: string;
}

export const ProductCard = ({ product, index, backgroundImage }: ProductCardProps) => {
  const Icon = product.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={product.path}
        className="group relative block p-8 rounded-[32px] overflow-hidden transition-all hover:scale-[1.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 12, 0.95) 0%, rgba(19, 20, 22, 0.95) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(228, 228, 228, 0.12)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Chrome Background Texture */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity pointer-events-none"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'screen',
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition"
            style={{
              background: 'rgba(228, 228, 228, 0.08)',
              border: '1px solid rgba(228, 228, 228, 0.15)',
            }}
          >
            <Icon className="h-7 w-7" style={{ color: 'rgba(228, 228, 228, 0.85)' }} />
          </div>

          {/* Title */}
          <h3 
            className="text-xl font-light mb-2 group-hover:opacity-100 transition"
            style={{ color: 'rgba(228, 228, 228, 0.95)' }}
          >
            {product.title}
          </h3>
          
          {/* Tagline */}
          <p className="text-sm font-light mb-3" style={{ color: 'rgba(228, 228, 228, 0.75)' }}>
            {product.tagline}
          </p>
          
          {/* Description */}
          <p className="text-sm font-light mb-6" style={{ color: 'rgba(228, 228, 228, 0.65)', lineHeight: '1.6' }}>
            {product.description}
          </p>

          {/* CTA */}
          <div 
            className="flex items-center gap-2 font-medium text-sm group-hover:gap-3 transition-all"
            style={{ color: 'rgba(228, 228, 228, 0.85)' }}
          >
            {product.cta}
            <span>→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
