import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  backgroundImage?: string;
  onOpenSalesChat?: () => void;
}

export const ProductCard = ({ product, index, backgroundImage }: ProductCardProps) => {
  const Icon = product.icon;
  const navigate = useNavigate();

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(product.path);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <div
        className="group relative flex flex-col h-full p-6 lg:p-8 rounded-[32px] overflow-hidden transition-all hover:scale-[1.02] cursor-pointer min-h-[580px]"
        onClick={() => navigate(product.path)}
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
        <div className="relative z-10 flex flex-col h-full">
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
            className="text-lg lg:text-xl font-light mb-4 group-hover:opacity-100 transition leading-tight"
            style={{ color: 'rgba(228, 228, 228, 0.95)' }}
          >
            {product.title}
          </h3>
          
          {/* Tagline */}
          <p className="text-sm font-light mb-5 leading-relaxed" style={{ color: 'rgba(228, 228, 228, 0.80)' }}>
            {product.tagline}
          </p>
          
          {/* Description - flex-grow pushes buttons to bottom */}
          <div className="flex-grow">
            <p className="text-sm font-light mb-6 leading-[1.8]" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
              {product.description}
            </p>

            {/* Savings Message (for environmental product) */}
            {product.savingsMessage && (
              <div 
                className="mb-6 px-4 py-4 rounded-lg text-sm font-light leading-relaxed"
                style={{ 
                  background: 'rgba(6, 182, 212, 0.10)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  color: 'rgba(6, 182, 212, 0.95)'
                }}
              >
                {product.savingsMessage}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-auto pt-6">
            <button
              onClick={handleCTAClick}
              className="flex items-center justify-center gap-2 font-medium text-sm group-hover:gap-3 transition-all px-6 py-3 rounded-xl w-full"
              style={{ 
                color: 'rgba(228, 228, 228, 0.90)',
                background: 'rgba(228, 228, 228, 0.08)',
                border: '1px solid rgba(228, 228, 228, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(228, 228, 228, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(228, 228, 228, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.15)';
              }}
            >
              {product.cta}
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
