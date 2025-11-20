import { motion } from 'framer-motion';
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const featuredGoals = THERAPEUTIC_GOALS.slice(0, 6);

  return (
    <>
      {/* Built on Science & Excellence Section */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
        
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl lg:text-6xl font-headers font-semibold mb-6"
              style={{ 
                background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built on Science & Excellence
            </h2>
            <p className="text-xl lg:text-2xl font-body text-white/70">
              Our platform combines cutting-edge AI with decades of music therapy research
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {infoCards.map((card, index) => (
                <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <div className="border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm h-full flex flex-col p-6">
                      <div 
                        className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <card.icon className="h-8 w-8 text-white" />
                      </div>

                      {card.subtitle && (
                        <p className="text-sm font-body text-white/60 text-center mb-2">
                          {card.subtitle}
                        </p>
                      )}

                      <h3 
                        className="text-2xl lg:text-3xl font-headers font-semibold text-center mb-3"
                        style={{ 
                          background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {card.title}
                      </h3>

                      {card.description && (
                        <p className="text-base lg:text-lg font-body text-white/70 text-center leading-relaxed">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Featured Sessions Section */}
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
        
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl lg:text-6xl font-headers font-semibold mb-6"
              style={{ 
                background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Featured Sessions
            </h2>
            <p className="text-xl lg:text-2xl font-body text-white/70">
              Discover our therapeutic music programs
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {featuredGoals.map((goal, index) => (
                <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <div className="border border-white/20 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm h-full flex flex-col">
                      <div className="aspect-square relative">
                        <img 
                          src={goal.artwork} 
                          alt={goal.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <h3 
                          className="text-2xl lg:text-3xl font-headers font-semibold text-center mb-3"
                          style={{ 
                            background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {goal.name}
                        </h3>
                        <p className="text-base lg:text-lg font-body text-white/70 text-center leading-relaxed">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>
    </>
  );
};
