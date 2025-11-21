import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import chromeFocus from '@/assets/chrome-focus.gif';
import chromeStress from '@/assets/chrome-stress.gif';
import chromeSleep from '@/assets/chrome-sleep.gif';
import chromeEnergy from '@/assets/chrome-energy.gif';
import chromeCalm from '@/assets/chrome-calm.gif';
import chromeCreative from '@/assets/chrome-creative.gif';

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
  chromeFocus,
  chromeStress,
  chromeSleep,
  chromeEnergy,
  chromeCalm,
  chromeCreative,
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
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative flex-shrink-0 w-80 h-[28rem] rounded-3xl overflow-hidden border border-white/10 group backdrop-blur-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.75)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Chrome GIF Background */}
              <div className="absolute inset-0">
                <img
                  src={backgroundImages[index % backgroundImages.length]}
                  alt=""
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-all duration-500"
                  style={{
                    mixBlendMode: 'lighten',
                    filter: 'contrast(1.1) brightness(0.9)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-7">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: 'rgba(220, 220, 220, 0.95)' }} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'rgba(228, 228, 228, 0.95)' }}>
                    {session.title}
                  </h3>
                  <p className="text-sm mb-5 line-clamp-3 leading-relaxed" style={{ color: 'rgba(200, 200, 200, 0.8)' }}>
                    {session.longDescription}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold mb-3" style={{ color: 'rgba(220, 220, 220, 0.9)' }}>Key Benefits:</h4>
                    <ul className="space-y-2">
                      {session.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(200, 200, 200, 0.75)' }}>
                          <span className="mt-0.5" style={{ color: 'rgba(180, 180, 180, 0.85)' }}>✓</span>
                          <span className="line-clamp-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Track Player */}
                <div 
                  className="rounded-xl p-4 border backdrop-blur-md"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-semibold text-sm truncate" style={{ color: 'rgba(228, 228, 228, 0.95)' }}>
                        {session.sampleTrack.title}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(190, 190, 190, 0.7)' }}>
                        {session.sampleTrack.artist} • {session.sampleTrack.duration}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onPlayPause(session)}
                      className="flex-shrink-0 h-9 w-9 p-0 rounded-lg border transition-all"
                      style={{
                        background: isCurrentlyPlaying ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(228, 228, 228, 0.95)',
                      }}
                    >
                      {isCurrentlyPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
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
