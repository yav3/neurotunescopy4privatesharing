import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hurtLessImg from '@/assets/benefit-hurt-less.jpg';
import boostEnergyImg from '@/assets/benefit-boost-energy.jpg';
import thinkBetterImg from '@/assets/benefit-think-better.jpg';

const benefits = [
  {
    id: 'hurt-less',
    title: 'Hurt Less',
    description: 'Reduced pain, deeper relaxation, and better rest',
    image: hurtLessImg
  },
  {
    id: 'boost-energy',
    title: 'Boost Energy',
    description: 'Refresh, recover, and steady stamina',
    image: boostEnergyImg
  },
  {
    id: 'think-better',
    title: 'Think Better',
    description: 'Improved focus, memory, and mental clarity',
    image: thinkBetterImg
  }
];

export const RealBenefitsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? benefits.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === benefits.length - 1 ? 0 : prev + 1));
  };

  const getVisibleCards = () => {
    const prev = currentIndex === 0 ? benefits.length - 1 : currentIndex - 1;
    const next = currentIndex === benefits.length - 1 ? 0 : currentIndex + 1;
    return [prev, currentIndex, next];
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 relative bg-black">
      <motion.h2 
        className="text-5xl lg:text-6xl font-headers font-semibold text-white text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Made For Real Benefits:
      </motion.h2>

      <div className="relative w-full max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          aria-label="Previous benefit"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
          aria-label="Next benefit"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Carousel Container */}
        <div className="flex items-center justify-center gap-6 px-16 overflow-hidden">
          {visibleCards.map((cardIndex, position) => {
            const benefit = benefits[cardIndex];
            const isCurrent = position === 1;
            
            return (
              <motion.div
                key={benefit.id}
                className={`flex-shrink-0 transition-all duration-500 ${
                  isCurrent ? 'w-96' : 'w-72 opacity-40'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isCurrent ? 1 : 0.4,
                  scale: isCurrent ? 1 : 0.85,
                  x: isCurrent ? 0 : position === 0 ? -20 : 20
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                  <div className="aspect-square relative">
                    <img 
                      src={benefit.image} 
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-3xl font-headers font-semibold text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-lg font-body text-white/70 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-3 mt-12">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/30 w-2'
              }`}
              aria-label={`Go to benefit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
