import { motion } from 'framer-motion';
import bgCard1 from '@/assets/bg-card-1.png';
import bgCard2 from '@/assets/bg-card-2.png';
import bgCard3 from '@/assets/bg-card-3.png';
import bgCard4 from '@/assets/bg-card-4.png';
import bgCard5 from '@/assets/bg-card-5.png';
import bgCard6 from '@/assets/bg-card-6.png';
import bgCard7 from '@/assets/bg-card-7.png';
import bgCard8 from '@/assets/bg-card-8.png';

interface ProductCarouselProps {
  items: string[];
}

const backgroundImages = [
  bgCard1,
  bgCard2,
  bgCard3,
  bgCard4,
  bgCard5,
  bgCard6,
  bgCard7,
  bgCard8,
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
            className="relative flex-shrink-0 w-80 h-56 rounded-2xl overflow-hidden glass-card border border-border/50 group"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={backgroundImages[index % backgroundImages.length]}
                alt=""
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center p-6">
              <p className="text-lg text-foreground text-center font-medium leading-relaxed">
                {item}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
