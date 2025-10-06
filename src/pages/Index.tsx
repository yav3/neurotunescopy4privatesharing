/* Professional Music Therapy AI Platform Landing Page */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { useWelcomeMessage } from '../hooks/useWelcomeMessage';
import { usePostSessionSurvey } from '@/hooks/usePostSessionSurvey';
import { PostSessionSurvey } from '@/components/surveys/PostSessionSurvey';

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
  
  // Welcome returning users
  useWelcomeMessage();
  
  // Post-session survey
  const { showSurvey, closeSurvey } = usePostSessionSurvey();

  const stats = [
    { label: "Technology", value: "Patented", icon: Shield },
    { label: "Research", value: "Evidence Based", icon: Award },
    { label: "Music Library", value: "50+ Genres", icon: Music },
    { label: "Analytics", value: "Clinical Insights", icon: Brain }
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
      {/* Full background image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={neurotunesHeroBg} 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 border-b border-white/[0.08]" style={{
          background: 'rgba(10, 40, 55, 0.35)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          <div className="flex-1"></div>
          <Button
            onClick={() => navigate('/auth')}
            className="text-base font-medium font-headers px-8 py-3 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
          >
            Authorized User Sign-In
          </Button>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center h-screen">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="space-y-12">
              {/* NeuroTunes Large Title */}
              <div>
                <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-sf font-normal leading-none tracking-tight text-white mb-8" style={{ 
                  textShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
                }}>
                  NeuroTunes
                </h1>
                
                <p className="text-2xl sm:text-3xl lg:text-4xl font-body font-light text-white/90 leading-relaxed" style={{ 
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
                }}>
                  AI-driven music therapy backed by patented technology and 50+ years of research
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Scrolling Features */}
        <section className="h-screen flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-8 px-8" style={{ width: 'max-content' }}>
            {/* Stats Cards */}
            {stats.map((stat, index) => (
              <div key={`stat-${index}`} className="h-screen flex flex-col items-center justify-center snap-center" style={{ minWidth: '100vw' }}>
                <div className="text-center p-12 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8">
                    <stat.icon className="h-12 w-12 text-white stroke-[1.5]" />
                  </div>
                  <div className="font-semibold font-headers text-white text-6xl mb-4">{stat.value}</div>
                  <div className="text-3xl font-body text-white/70 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
            
            {/* Therapeutic Benefits Cards */}
            {therapeuticBenefits.map((benefit, index) => (
              <div key={`benefit-${index}`} className="h-screen flex flex-col items-center justify-center snap-center" style={{ minWidth: '100vw' }}>
                <div className="border border-white/10 rounded-2xl p-12 hover:border-white/20 transition-all duration-500 group bg-white/5 backdrop-blur-sm max-w-2xl">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8 group-hover:border-white/40 transition-all duration-300">
                    <benefit.icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-4xl font-medium font-headers text-white mb-6">{benefit.title}</h3>
                  <p className="text-2xl font-body text-white/70 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer - Research Institutions (Horizontal Scroll) */}
        <section className="h-screen flex items-center justify-center snap-center" style={{ minWidth: '100vw' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-headers text-white text-center mb-16">Research Partners</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              <div className="w-48 h-48 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={cornellLogo} 
                  alt="Cornell University"
                  className="w-32 h-32 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
              <div className="w-48 h-48 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={jacobsTechnionLogo} 
                  alt="Jacobs Technion"
                  className="w-32 h-32 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
              <div className="w-48 h-48 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={stanfordMedicineLogo} 
                  alt="Stanford Medicine"
                  className="w-32 h-32 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
              <div className="w-48 h-48 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={weillCornellLogo} 
                  alt="Weill Cornell"
                  className="w-32 h-32 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
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