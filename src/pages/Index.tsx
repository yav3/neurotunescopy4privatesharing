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
import { PartnersSection } from '@/components/landing/PartnersSection';
import { Footer } from '@/components/Footer';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import staticBg from '../assets/static-bg.png';
import { Button } from '../components/ui/button';
import { Brain, Heart, Sparkles } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  
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

  return (
    <div className="min-h-screen relative">
      {/* Static background */}
      <div className="fixed inset-0 z-0">
        <img 
          src={staticBg}
          alt="Background"
          className="w-full h-full object-cover"
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
        <NavigationHeader />

        {/* Hero Section - Following comprehensive spacing guide */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            
            {/* Headline */}
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Experience NeuroTunes
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore our therapeutic music sessions. Each track is scientifically designed to support specific cognitive and emotional states.
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  const goalsSection = document.getElementById('featured-goals');
                  goalsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-6 text-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl"
              >
                Listen Now
              </Button>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl">
                  Experience Demo
                </Button>
              </Link>
            </motion.div>
            
            {/* Three Key Features */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Science-Backed */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Science-Backed</h3>
                <p className="text-sm text-muted-foreground">Based on neuroscience research</p>
              </div>
              
              {/* Fully Owned */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Fully Owned</h3>
                <p className="text-sm text-muted-foreground">No licensing fees or restrictions</p>
              </div>
              
              {/* Proven Results */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Proven Results</h3>
                <p className="text-sm text-muted-foreground">Measurable therapeutic outcomes</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Therapeutic Sessions - 160px spacing */}
        <section id="featured-goals" className="py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Featured Therapeutic Sessions
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Scientifically designed audio experiences for every wellness goal
              </p>
            </motion.div>
            
            <motion.div 
              id="sessions"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <FeaturedGoalsCarousel />
            </motion.div>
          </div>
        </section>

        {/* Credentials - 120px spacing */}
        <section className="py-30 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              id="science"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <CredentialsBadges />
            </motion.div>
          </div>
        </section>

        {/* Benefits - 160px spacing */}
        <section className="py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              id="benefits"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <BenefitsCarousel />
            </motion.div>
          </div>
        </section>

        {/* Partners - 120px spacing */}
        <section className="py-30 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              id="partners"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <PartnersSection />
            </motion.div>
          </div>
        </section>
        
        {/* Sales Assistant */}
        <SalesAssistant />
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Post-Session Survey */}
      <PostSessionSurvey
        open={showSurvey}
        onClose={closeSurvey}
      />
    </div>
  );
};

export default Index;