import { motion } from 'framer-motion';
import chrome1 from '@/assets/chrome-1.png';
import chrome2 from '@/assets/chrome-2.png';
import chrome3 from '@/assets/chrome-3.png';
import chrome4 from '@/assets/chrome-4.png';

interface ProductCarouselProps {
  items: string[];
}

const chromeBackgrounds = [
  chrome1,
  chrome2,
  chrome3,
  chrome4,
];

export const ProductCarousel = ({ items }: ProductCarouselProps) => {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -100 * items.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: items.length * 5,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${item}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (index % items.length) * 0.1 }}
            className="relative flex-shrink-0 w-80 h-56 rounded-2xl overflow-hidden group"
          >
            {/* Chrome GIF background */}
            <div className="absolute inset-0">
              <img
                src={chromeBackgrounds[index % chromeBackgrounds.length]}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Glossy black overlay for readability */}
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.75) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <p className="text-lg text-white/95 text-center font-light leading-relaxed">
                {item}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
