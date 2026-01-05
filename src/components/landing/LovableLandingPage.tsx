import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import atmosphereImage from '@/assets/atmosphere-engineered.jpeg';

interface LovableLandingPageProps {
  onExplore?: () => void;
}

export const LovableLandingPage: React.FC<LovableLandingPageProps> = ({ onExplore }) => {
  const navigate = useNavigate();
  const sfPro = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';
  
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startDemo = () => {
    setIsDemoPlaying(true);
  };

  const stopDemo = (navigateToApp: boolean = false) => {
    // Fade out audio
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.1) {
          audio.volume -= 0.1;
        } else {
          clearInterval(fadeOut);
          audio.pause();
          audio.currentTime = 0;
        }
      }, 100);
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    
    setIsDemoPlaying(false);
    
    // Navigate to the goals/demo experience after intro
    if (navigateToApp) {
      navigate('/goals');
    }
  };

  useEffect(() => {
    if (isDemoPlaying) {
      // Start video and audio
      if (videoRef.current) {
        videoRef.current.play().catch(console.log);
      }
      if (audioRef.current) {
        audioRef.current.volume = 0.6;
        audioRef.current.play().catch(console.log);
      }
    }
  }, [isDemoPlaying]);

  // Navigate to app when video ends
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onended = () => stopDemo(true);
    }
    return () => {
      if (video) video.onended = null;
    };
  }, []);

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundColor: 'hsl(240 8% 4%)',
        fontFamily: sfPro 
      }}
    >
      {/* Demo Video Overlay */}
      <AnimatePresence>
        {isDemoPlaying && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/intro-2.mp4"
              muted
              playsInline
            />
            
            <audio
              ref={audioRef}
              src="/audio/story-intro.mp3"
              preload="auto"
            />
            
            {/* Close button */}
            <button
              onClick={() => stopDemo(true)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full transition-all duration-300 hover:bg-white/10"
              style={{ 
                color: 'rgba(228, 228, 228, 0.8)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(228, 228, 228, 0.2)'
              }}
              aria-label="Close demo"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-xs" style={{ color: 'rgba(228, 228, 228, 0.5)' }}>
                Press X to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION - Full bleed image with play button */}
      <section className="min-h-screen relative flex items-center justify-center">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${atmosphereImage})`,
          }}
        />
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240_8%_4%)] via-transparent to-transparent opacity-60" />
        
        {/* Play button */}
        <motion.button
          onClick={startDemo}
          className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Play demo"
        >
          <Play className="w-8 h-8 text-white ml-1" fill="white" fillOpacity={0.9} />
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/20 text-xs font-light tracking-[0.3em] uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Scroll
        </motion.div>
      </section>

      {/* DIFFERENTIATION SECTION */}
      <section className="py-32 flex flex-col items-center justify-center px-6">
        <motion.div
          className="max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-white/50 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            Most music platforms optimize for preference and engagement.
          </p>
          <p
            className="text-white/70 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            NeuroTunes AI optimizes for regulation — using structured musical parameters 
            informed by neuroscience research to support how the brain actually functions under load.
          </p>
        </motion.div>
      </section>

      {/* NOT A PLAYLIST SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-32">
        <motion.h2
          className="text-white font-medium text-center mb-12"
          style={{ 
            fontSize: 'clamp(28px, 5vw, 44px)',
            letterSpacing: '-0.02em',
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          Not a playlist. Not a wellness app.
        </motion.h2>

        <motion.div
          className="max-w-3xl text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p
            className="text-white/60 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            NeuroTunes AI is an adaptive music system designed using neuroscience principles 
            to support focus, calm, and cognitive performance.
          </p>
          <p
            className="text-white/60 font-light"
            style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)',
              lineHeight: 1.7,
            }}
          >
            It is built for environments where regulation matters — not distraction.
          </p>
        </motion.div>
      </section>

    </div>
  );
};
