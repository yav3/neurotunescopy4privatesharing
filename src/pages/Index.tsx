/* Professional Music Therapy AI Platform Landing Page */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { usePostSessionSurvey } from '@/hooks/usePostSessionSurvey';
import { PostSessionSurvey } from '@/components/surveys/PostSessionSurvey';
import { motion } from 'framer-motion';
import { FeaturedGoalsCarousel } from '@/components/landing/FeaturedGoalsCarousel';
import { CredentialsBadges } from '@/components/landing/CredentialsBadges';
import { BenefitsCarousel } from '@/components/landing/BenefitsCarousel';
import { FitnessCardWithAudio } from '@/components/landing/FitnessCardWithAudio';

import { QADashboard } from '@/components/QADashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveInsightsDashboard } from '@/components/insights/ComprehensiveInsightsDashboard';
import cornellLogo from '../assets/cornell-university.png';
import jacobsTechnionLogo from '../assets/jacobs-technion.png';
import stanfordMedicineLogo from '../assets/stanford-medicine.png';
import weillCornellLogo from '../assets/weill-cornell.png';
import relaxationCard from '../assets/relaxation-card.png';
import recoveryCard from '../assets/recovery-card.png';
import focusCard from '../assets/focus-card.png';
import restCard from '../assets/rest-card.png';
import exerciseCard from '../assets/exercise-card.png';
import boostCard from '../assets/boost-button-bg.png';
import landingBackground from '../assets/landing-background.png';
import neurotunesHeroBg from '../assets/neurotunes-hero-bg.png';
import premiumDarkBg from '../assets/premium-dark-bg.png';
import staticBg from '../assets/static-bg.png';
import ladyHeadphones from '../assets/lady-headphones.png';
import landingBg from '../assets/landing-bg.gif';

import { Button } from '../components/ui/button';

import { 
  Brain, 
  Heart, 
  Activity, 
  Music, 
  Play, 
  ArrowRight, 
  Star, 
  Users, 
  Shield, 
  Zap,
  Headphones,
  Sparkles,
  TrendingUp,
  Award,
  Plus
} from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [gifFinished, setGifFinished] = useState(false);
  
  // Welcome returning users
  useWelcomeMessage();
  
  // Post-session survey
  const { showSurvey, closeSurvey } = usePostSessionSurvey();

  // Redirect authenticated users to the music player
  // DISABLED FOR DEVELOPMENT - Re-enable when ready
  // useEffect(() => {
  //   if (!loading && user) {
  //     console.log('✅ User already authenticated, redirecting to music player');
  //     navigate('/goals');
  //   }
  // }, [user, loading, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Mark as animated after initial load
    const timer = setTimeout(() => setHasAnimated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Switch from GIF to static background after GIF duration (adjust timing as needed)
  useEffect(() => {
    const gifDuration = setTimeout(() => {
      setGifFinished(true);
    }, 5000); // 5 seconds - adjust based on your GIF's actual duration
    return () => clearTimeout(gifDuration);
  }, []);


  // Map display names to existing therapeutic goals with specific imagery
  const therapeuticCards = [
    {
      title: "Relaxation",
      description: "Calm your mind with soothing soundscapes",
      image: relaxationCard,
      goalId: "stress-anxiety-support",
      featured: "Ambient Nature Sounds",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Recovery",
      description: "Restore and heal your body",
      image: recoveryCard,
      goalId: "pain-support",
      featured: "Gentle Healing Frequencies",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Focus+",
      description: "Enhance concentration and clarity",
      image: focusCard,
      goalId: "focus-enhancement",
      featured: "Binaural Beats & Classical",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      title: "Rest",
      description: "Deep relaxation for better sleep",
      image: restCard,
      goalId: "meditation-support",
      featured: "Meditative Soundscapes",
      gradient: "from-violet-500/20 to-purple-500/20"
    },
    {
      title: "Exercise",
      description: "Energize your workout routine",
      image: exerciseCard,
      goalId: "energy-vitality",
      featured: "Upbeat Rhythmic Energy",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      title: "Boost",
      description: "Elevate your mood instantly",
      image: boostCard,
      goalId: "calm-mood-boost",
      featured: "Uplifting Melodies",
      gradient: "from-yellow-500/20 to-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Full background - GIF plays once then shows static image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={landingBg}
          alt="Background animation"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${gifFinished ? 'opacity-0' : 'opacity-100'}`}
        />
        <img 
          src={staticBg}
          alt="Background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${gifFinished ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Floating ambient elements */}
      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 backdrop-blur-sm"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${15 * i}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="fixed top-0 w-full z-50 flex justify-end items-center px-8 py-4 border-b border-white/[0.08]" style={{
          background: 'rgba(10, 40, 55, 0.35)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          <Button
            onClick={() => navigate('/auth')}
            className="text-base font-medium font-headers px-8 py-3 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
          >
            Authorized User Sign-In
          </Button>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center h-screen relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="space-y-12">
              {/* NeuroTunes Large Title */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div 
                  className="flex items-center justify-center gap-8 mb-4"
                  animate={!hasAnimated ? {
                    scale: [1, 1.02, 1],
                  } : {}}
                  transition={{
                    duration: 4,
                    repeat: !hasAnimated ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Plus 
                    className="w-[8rem] h-[8rem] sm:w-[10rem] sm:h-[10rem] lg:w-[12rem] lg:h-[12rem]" 
                    strokeWidth={1.5}
                    style={{
                      color: '#b2dfdb',
                      filter: 'drop-shadow(0 0 30px rgba(224, 242, 241, 0.5)) drop-shadow(0 0 15px rgba(178, 223, 219, 0.4))'
                    }}
                  />
                  <h1 
                    className="text-[4rem] sm:text-[5rem] lg:text-[6rem] font-sf font-normal leading-none tracking-tight" 
                    style={{ 
                      background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: 'none',
                      filter: 'drop-shadow(0 0 30px rgba(224, 242, 241, 0.4)) drop-shadow(0 0 15px rgba(178, 223, 219, 0.3))',
                    }}
                  >
                    NeuroTunes
                  </h1>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Pulsing glow effect - only on initial load */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={!hasAnimated ? {
              opacity: [0.1, 0.3, 0.1],
            } : { opacity: 0.1 }}
            transition={{
              duration: 3,
              repeat: !hasAnimated ? Infinity : 0,
              ease: "easeInOut"
            }}
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 217, 255, 0.2) 0%, transparent 70%)',
            }}
          />
        </section>

        {/* Company Mission Section */}
        {/* Credentials Section */}
        <CredentialsBadges />

        {/* Unified Benefits & Goals Carousel */}
        <BenefitsCarousel />


        {/* Footer - Research Institutions (Horizontal Scroll) */}
        <section className="h-screen flex items-center justify-center snap-center" style={{ minWidth: '100vw' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h3 
              className="text-4xl font-headers text-white text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              With Generous Support from
            </motion.h3>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              {[
                { logo: cornellLogo, alt: "Cornell University" },
                { logo: jacobsTechnionLogo, alt: "Jacobs Technion" },
                { logo: stanfordMedicineLogo, alt: "Stanford Medicine" },
                { logo: weillCornellLogo, alt: "Weill Cornell" }
              ].map((partner, index) => (
                <motion.div 
                  key={index}
                  className="w-48 h-48 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.15,
                    rotateZ: [0, -5, 5, 0],
                    y: -10,
                    transition: { duration: 0.4 }
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: index * 0.1 },
                    scale: { duration: 0.5, delay: index * 0.1 }
                  }}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.alt}
                    className="w-32 h-32 object-contain"
                    style={{ 
                      imageRendering: 'crisp-edges',
                      filter: 'grayscale(100%) invert(1) brightness(1.8)'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      {/* Post-Session Survey */}
      <PostSessionSurvey
        open={showSurvey}
        onClose={closeSurvey}
      />
    </div>
  );
};

export default Index;