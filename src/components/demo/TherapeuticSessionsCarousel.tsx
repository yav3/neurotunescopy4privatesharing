import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import bgCard1 from '@/assets/bg-card-1.png';
import bgCard2 from '@/assets/bg-card-2.png';
import bgCard3 from '@/assets/bg-card-3.png';
import bgCard4 from '@/assets/bg-card-4.png';
import bgCard5 from '@/assets/bg-card-5.png';
import bgCard6 from '@/assets/bg-card-6.png';
import bgCard7 from '@/assets/bg-card-7.png';
import bgCard8 from '@/assets/bg-card-8.png';

interface TherapeuticSession {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: any;
  benefits: string[];
  sampleTrack: {
    title: string;
    artist: string;
    duration: string;
  };
}

interface TherapeuticSessionsCarouselProps {
  sessions: TherapeuticSession[];
  playingId: string | null;
  isPlaying: boolean;
  onPlayPause: (session: TherapeuticSession) => void;
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

export const TherapeuticSessionsCarousel = ({ 
  sessions, 
  playingId, 
  isPlaying, 
  onPlayPause 
}: TherapeuticSessionsCarouselProps) => {
  // Duplicate items for seamless infinite scroll
  const duplicatedSessions = [...sessions, ...sessions, ...sessions];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -100 * sessions.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: sessions.length * 8,
            ease: "linear",
          },
        }}
      >
        {duplicatedSessions.map((session, index) => {
          const Icon = session.icon;
          const isCurrentlyPlaying = playingId === session.id && isPlaying;
          
          return (
            <motion.div
              key={`${session.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % sessions.length) * 0.1 }}
              className="relative flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden glass-card border border-border/50 group"
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={backgroundImages[index % backgroundImages.length]}
                  alt=""
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {session.longDescription}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold mb-2 text-foreground">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {session.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-0.5">✓</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Track Player */}
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-semibold text-xs truncate text-foreground">{session.sampleTrack.title}</p>
                      <p className="text-xs text-muted-foreground">{session.sampleTrack.artist} • {session.sampleTrack.duration}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isCurrentlyPlaying ? "default" : "outline"}
                      onClick={() => onPlayPause(session)}
                      className="flex-shrink-0 h-8 w-8 p-0"
                    >
                      {isCurrentlyPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
