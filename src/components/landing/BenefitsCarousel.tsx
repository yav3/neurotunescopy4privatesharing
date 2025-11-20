import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { 
  Brain, 
  Heart, 
  Activity, 
  Music, 
  Shield, 
  Award,
  TrendingUp,
  Sparkles,
  Headphones,
  Zap
} from 'lucide-react';

const cards = [
  {
    type: 'mission',
    title: "Personalized streaming of medical-grade music, powered by AI closed-loop tech.",
    description: "",
    icon: Brain
  },
  {
    type: 'library',
    title: "8.5K+ original world-class quality songs by award-winning pros encompassing 50 genres in 5 languages",
    description: "",
    icon: Music
  },
  {
    type: 'company',
    title: "Turning Music Into Treatment",
    description: "NeuralPositive develops software that turns music into treatment. Our patent portfolio covers how therapeutic music is created and personalized for clinical use.",
    icon: Music
  },
  {
    type: 'team',
    title: "Expert Team",
    description: "NeuroTunes, our flagship app, delivers purpose-composed sessions that adapt to each user. The team behind it includes neuroscientists, physician-scientists, developers, composers, and a 5x Grammy winning engineer.",
    icon: Award
  },
  {
    type: 'research',
    title: "Research Foundation",
    description: "We began at Cornell Tech's Jacobs Technion–Cornell Institute and have built on more than eight years of sponsored research.",
    icon: TrendingUp
  },
  {
    type: 'stat',
    title: "Evidence-Based",
    description: "Clinically Tested",
    icon: Shield
  },
  {
    type: 'stat',
    title: "8K Songs",
    description: "Original Music",
    icon: Music
  },
  {
    type: 'stat',
    title: "15K Studies",
    description: "Research Backed",
    icon: TrendingUp
  },
  {
    type: 'stat',
    title: "50+ Genres",
    description: "Genre Variety",
    icon: Sparkles
  },
  {
    type: 'stat',
    title: "Proprietary",
    description: "Spatial Audio",
    icon: Headphones
  },
  {
    type: 'stat',
    title: "Premium Quality",
    description: "Immersive Sound",
    icon: Zap
  },
  {
    type: 'benefit',
    title: "Cognitive Enhancement",
    description: "Scientifically-backed music selections to improve focus, memory, and mental clarity",
    icon: Brain
  },
  {
    type: 'benefit',
    title: "Emotional Regulation",
    description: "AI-curated playlists designed to balance mood and reduce stress responses",
    icon: Heart
  },
  {
    type: 'benefit',
    title: "Physiological Benefits",
    description: "Evidence-based frequencies that promote relaxation and cardiovascular health",
    icon: Activity
  }
];

export const BenefitsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredGoals = THERAPEUTIC_GOALS.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentCard = cards[currentIndex];
  const CardIcon = currentCard.icon;

  return (
    <>
      {/* Benefits Cards Carousel */}
      <section className="min-h-screen flex items-center justify-center py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="border border-white/20 rounded-2xl p-12 bg-white/5 backdrop-blur-sm"
          >
            <motion.div 
              className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardIcon className="h-12 w-12 text-white" />
            </motion.div>

            <motion.h3 
              className="text-4xl lg:text-5xl font-headers font-semibold text-center mb-6"
              style={{ 
                background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {currentCard.title}
            </motion.h3>

            {currentCard.description && (
              <motion.p 
                className="text-xl lg:text-2xl font-body text-white/70 text-center leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {currentCard.description}
              </motion.p>
            )}

            <div className="flex justify-center gap-2 mt-8">
              {cards.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white/80 w-8' 
                      : 'bg-white/20 w-1.5'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Goals Carousel */}
      <section className="min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="w-full">
          <motion.div
            className="text-center mb-20 px-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-6xl lg:text-7xl font-headers font-semibold mb-6"
              style={{ 
                background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Featured Sessions
            </h2>
            <p className="text-2xl text-white/70 font-body max-w-3xl mx-auto">
              Purpose-composed music sessions designed for your specific therapeutic needs
            </p>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              className="flex gap-8 px-8"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {[...featuredGoals, ...featuredGoals, ...featuredGoals].map((goal, index) => (
                <motion.div
                  key={`${goal.id}-${index}`}
                  className="flex-shrink-0 w-96 rounded-3xl overflow-hidden border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:border-white/30 transition-all duration-300 hover:scale-105"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % featuredGoals.length) * 0.1 }}
                >
                  <div className="aspect-square relative">
                    <img 
                      src={goal.artwork} 
                      alt={goal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 text-center bg-gradient-to-t from-black/40 to-transparent">
                    <h3 className="text-2xl font-headers font-semibold text-white mb-3">{goal.name}</h3>
                    <p className="text-base font-body text-white/70 mb-4">
                      {goal.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                      <span>{goal.musicBuckets.slice(0, 2).join(' • ')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
