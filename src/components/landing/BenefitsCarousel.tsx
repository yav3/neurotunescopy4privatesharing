import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { THERAPEUTIC_GOALS, TherapeuticGoal } from '@/config/therapeuticGoals';
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
  Zap,
  Microscope,
  LucideIcon
} from 'lucide-react';

interface InfoCard {
  type: string;
  title: string;
  description: string;
  icon: LucideIcon;
  subtitle?: string;
}

type CarouselCard = InfoCard | TherapeuticGoal;

const infoCards: InfoCard[] = [
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
    type: 'patent',
    title: "Patented Methods",
    subtitle: "Backed by Science",
    description: "Proprietary therapeutic protocols",
    icon: Microscope
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

// Type guard to check if card is a TherapeuticGoal
const isGoalCard = (card: CarouselCard): card is TherapeuticGoal => {
  return 'artwork' in card && 'name' in card;
};

export const BenefitsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredGoals = THERAPEUTIC_GOALS.slice(0, 6);
  
  // Combine info cards and therapeutic goals
  const allCards: CarouselCard[] = [...infoCards, ...featuredGoals];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allCards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [allCards.length]);

  const currentCard = allCards[currentIndex];
  const isGoal = isGoalCard(currentCard);

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm"
        >
          {isGoal ? (
            // Therapeutic Goal Card
            <>
              <div className="aspect-square relative">
                <img 
                  src={currentCard.artwork} 
                  alt={currentCard.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-12">
                <motion.h3 
                  className="text-4xl lg:text-5xl font-headers font-semibold text-center mb-4"
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
                  {currentCard.name}
                </motion.h3>
                <motion.p 
                  className="text-xl lg:text-2xl font-body text-white/70 text-center leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {currentCard.description}
                </motion.p>
              </div>
            </>
          ) : (
            // Info Card
            <div className="p-12">
              <motion.div 
                className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <currentCard.icon className="h-12 w-12 text-white" />
              </motion.div>

              {currentCard.subtitle && (
                <motion.p
                  className="text-xl font-body text-white/60 text-center mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  {currentCard.subtitle}
                </motion.p>
              )}

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
            </div>
          )}
        </motion.div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {allCards.map((_, index) => (
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
      </div>
    </section>
  );
};
