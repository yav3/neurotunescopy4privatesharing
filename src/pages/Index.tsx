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
          src={landingBackground} 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="bg-black/20 sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
            <div className="flex justify-end items-center">
              <Button
                onClick={() => navigate('/auth')}
                className="text-base font-medium font-headers px-8 py-3 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
              >
                Authorized User Sign-In
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-40 sm:pt-40 sm:pb-48 lg:pt-48 lg:pb-56">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl">
              {/* NeuroTunes Logo */}
              <div className="mb-32">
                <div className="flex items-center gap-8 mb-8">
                  <Plus className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 text-white" strokeWidth={1.5} />
                  <h1 className="text-[8rem] sm:text-[12rem] lg:text-[16rem] font-sf font-normal text-white leading-none tracking-tight">NeuroTunes</h1>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-didot italic text-white/70 ml-40 sm:ml-48 lg:ml-56 tracking-wide">by NeuralPositive</p>
              </div>
              
              <h2 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-sf font-normal text-white leading-[1.15] tracking-tight mb-24">
                AI-Personalized Wellness
                <span className="block text-white/90 mt-8">Meets Beautiful Music</span>
              </h2>
              
              <p className="text-3xl sm:text-4xl lg:text-5xl font-didot font-normal text-white/80 leading-[1.6] max-w-6xl">
                Closed loop music designed to delight. Powered by patented AI and 50+ years of music therapy science.
              </p>
            </div>
          </div>
        </section>

        {/* Features Carousel - Restored */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl lg:text-3xl font-semibold font-headers text-white mb-6">
                First-In-Class Technology
              </h2>
            </div>

            {/* Unified Features Carousel */}
            <div className="w-full overflow-hidden">
              <div className="horizontal-scroll scrollbar-hide">
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {/* Stats Cards */}
                  {stats.map((stat, index) => (
                    <div key={`stat-${index}`} className="text-center p-6 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm flex-shrink-0"
                         style={{ width: '220px', minWidth: '220px' }}>
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
                        <stat.icon className="h-6 w-6 text-white stroke-[1.5]" />
                      </div>
                      <div className="font-semibold font-headers text-white text-lg mb-2">{stat.value}</div>
                      <div className="text-sm font-body text-white/70 font-medium">{stat.label}</div>
                    </div>
                  ))}
                  
                  {/* Therapeutic Benefits Cards */}
                  {therapeuticBenefits.map((benefit, index) => (
                    <div 
                      key={`benefit-${index}`} 
                      className="border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-500 group bg-white/5 backdrop-blur-sm scroll-snap-start"
                      style={{ width: '280px', minWidth: '280px' }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 group-hover:border-white/40 transition-all duration-300">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-base font-medium font-headers text-white mb-2">{benefit.title}</h3>
                      <p className="text-sm font-body text-white/70 leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Research Institutions */}
        <footer className="py-24 border-t border-white/10 backdrop-blur-sm bg-black/10 mt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              <div className="w-32 h-32 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={cornellLogo} 
                  alt="Cornell University"
                  className="w-20 h-20 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
              <div className="w-32 h-32 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={jacobsTechnionLogo} 
                  alt="Jacobs Technion"
                  className="w-20 h-20 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
              <div className="w-32 h-32 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={stanfordMedicineLogo} 
                  alt="Stanford Medicine"
                  className="w-20 h-20 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
              <div className="w-32 h-32 flex items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <img 
                  src={weillCornellLogo} 
                  alt="Weill Cornell"
                  className="w-20 h-20 object-contain"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    filter: 'grayscale(100%) invert(1) brightness(1.8)'
                  }}
                />
              </div>
            </div>
          </div>
        </footer>
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