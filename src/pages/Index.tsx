/* Professional Music Therapy AI Platform Landing Page */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { usePostSessionSurvey } from '@/hooks/usePostSessionSurvey';
import { PostSessionSurvey } from '@/components/surveys/PostSessionSurvey';
import { motion } from 'framer-motion';
import { FeaturedGoalsCarousel } from '@/components/landing/FeaturedGoalsCarousel';

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
import boostCard from '../assets/boost-card.png';
import landingBackground from '../assets/landing-background.png';
import neurotunesHeroBg from '../assets/neurotunes-hero-bg.png';
import premiumDarkBg from '../assets/premium-dark-bg.png';

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
  const [showNatureCards, setShowNatureCards] = useState(false);
  
  // Welcome returning users
  useWelcomeMessage();
  
  // Post-session survey
  const { showSurvey, closeSurvey } = usePostSessionSurvey();

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

  const stats = [
    { label: "Clinically Tested", value: "Evidence-Based", icon: Shield },
    { label: "Original Music", value: "8K Songs", icon: Music },
    { label: "Award Winning", value: "Expert Team", icon: Award },
    { label: "KOL Informed", value: "Physician-Neuroscientist", icon: Brain },
    { label: "Research Backed", value: "15K Studies", icon: TrendingUp },
    { label: "Genre Variety", value: "50+ Genres", icon: Sparkles },
    { label: "Spatial Audio", value: "Proprietary", icon: Headphones },
    { label: "Immersive Sound", value: "Premium Quality", icon: Zap }
  ];

  const therapeuticBenefits = [
    {
      icon: Brain,
      title: "Cognitive Enhancement",
      description: "Scientifically-backed music selections to improve focus, memory, and mental clarity",
      color: "text-primary"
    },
    {
      icon: Heart,
      title: "Emotional Regulation", 
      description: "AI-curated playlists designed to balance mood and reduce stress responses",
      color: "text-info"
    },
    {
      icon: Activity,
      title: "Physiological Benefits",
      description: "Evidence-based frequencies that promote relaxation and cardiovascular health",
      color: "text-success"
    }
  ];

  // Map display names to existing therapeutic goals (keeping music buckets intact)
  const therapeuticCards = [
    {
      title: "Relaxation",
      description: "Calm your mind",
      image: relaxationCard,
      goalId: "stress-anxiety-support" // Keeps existing music buckets
    },
    {
      title: "Recovery",
      description: "Restore and heal",
      image: recoveryCard,
      goalId: "pain-support" // Keeps existing music buckets
    },
    {
      title: "Focus+",
      description: "Enhance concentration",
      image: focusCard,
      goalId: "focus-enhancement" // Keeps existing music buckets
    },
    {
      title: "Rest",
      description: "Deep relaxation",
      image: restCard,
      goalId: "meditation-support" // Keeps existing music buckets
    },
    {
      title: "Exercise",
      description: "Energize your workout",
      image: exerciseCard,
      goalId: "energy-vitality" // Keeps existing music buckets
    },
    {
      title: "Boost",
      description: "Elevate your mood",
      image: boostCard,
      goalId: "calm-mood-boost" // Keeps existing music buckets
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Full background image with parallax */}
      <div className="fixed inset-0 z-0">
        <motion.img 
          src={premiumDarkBg} 
          alt="Background"
          className="w-full h-full object-cover"
          style={{
            scale: 1 + scrollY * 0.0005,
            y: scrollY * 0.5
          }}
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
                  className="flex items-center justify-center gap-8 mb-8"
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
                    className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-sf font-normal leading-none tracking-tight" 
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
                
                <motion.p 
                  className="text-2xl sm:text-3xl lg:text-4xl font-body font-light text-white/90 leading-relaxed" 
                  style={{ 
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  AI-driven music therapy backed by patented technology and 50+ years of research
                </motion.p>
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

        {/* Horizontal Scrolling Features */}
        <section className="h-screen flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-8 px-8" style={{ width: 'max-content' }}>
            {/* Stats Cards */}
            {stats.map((stat, index) => (
              <div key={`stat-${index}`} className="h-screen flex flex-col items-center justify-center snap-center" style={{ minWidth: '100vw' }}>
                <motion.div 
                  className="text-center p-12 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-2xl bg-white/5 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: -5,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div 
                    className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="h-12 w-12 text-white stroke-[1.5]" />
                  </motion.div>
                  <motion.div 
                    className="font-semibold font-headers text-white text-6xl mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <motion.div 
                    className="text-3xl font-body text-white/70 font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              </div>
            ))}
            
            {/* Therapeutic Benefits Cards */}
            {therapeuticBenefits.map((benefit, index) => (
              <div key={`benefit-${index}`} className="h-screen flex flex-col items-center justify-center snap-center" style={{ minWidth: '100vw' }}>
                <motion.div 
                  className="border border-white/10 rounded-2xl p-12 hover:border-white/20 transition-all duration-500 group bg-white/5 backdrop-blur-sm max-w-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{
                    scale: 1.08,
                    rotateZ: 2,
                    y: -10,
                    transition: { duration: 0.4 }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div 
                    className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 group-hover:border-white/40 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <benefit.icon className="h-12 w-12 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-4xl font-medium font-headers text-white mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {benefit.title}
                  </motion.h3>
                  <motion.p 
                    className="text-2xl font-body text-white/70 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {benefit.description}
                  </motion.p>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Goals Carousel */}
        <FeaturedGoalsCarousel showNatureCards={showNatureCards} />

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