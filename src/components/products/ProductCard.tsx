import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
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
        className="group relative block p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-white/10 hover:border-cyan-500/30 transition-all hover:scale-105"
      >
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition">
          <Icon className="h-7 w-7 text-cyan-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">
          {product.title}
        </h3>
        
        {/* Tagline */}
        <p className="text-sm text-cyan-400 mb-3">
          {product.tagline}
        </p>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-4">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-1">{product.pricing.model}</p>
          <p className="text-white font-semibold text-sm">{product.pricing.starting}</p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm group-hover:gap-3 transition-all">
          {product.cta}
          <span>→</span>
        </div>
      </Link>
    </motion.div>
  );
};
