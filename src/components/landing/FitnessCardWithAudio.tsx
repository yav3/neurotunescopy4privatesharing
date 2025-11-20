import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';

export const FitnessCardWithAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const fitnessGoal = THERAPEUTIC_GOALS.find(goal => goal.id === 'energy-boost');
  
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    // You'll need to add the actual audio file path here
    // audioRef.current.src = '/path-to-fitness-track.mp3';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!fitnessGoal) return null;

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-6 relative bg-black">
      <div className="max-w-2xl mx-auto">
        <motion.h2 
          className="text-5xl font-headers font-semibold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {fitnessGoal.name}
        </motion.h2>

        <motion.div
          className="relative rounded-3xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-square relative">
            <img 
              src={fitnessGoal.artwork} 
              alt={fitnessGoal.name}
              className="w-full h-full object-cover"
            />
            
            {/* Audio Control Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" fill="white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                )}
              </button>
            </div>
          </div>

          <div className="p-8 text-center">
            <p className="text-xl font-body text-white/70 leading-relaxed">
              {fitnessGoal.description}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-sm text-white/50">
                {fitnessGoal.bpmRange.optimal} BPM • High Energy
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
