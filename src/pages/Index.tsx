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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-end items-center">
              <Button
                onClick={() => navigate('/auth')}
                className="text-sm font-medium font-headers px-6 py-2 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 shadow-lg backdrop-blur-sm border border-white/20"
              >
                Authorized User Sign-In
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-6">
                {/* NeuroTunes Logo */}
                <div className="mb-6">
                  <h1 className="text-5xl lg:text-6xl font-headers font-semibold text-white">NeuroTunes</h1>
                  <p className="text-sm font-body text-white/70 mt-1">by NeuralPositive</p>
                </div>
                
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold font-headers text-white leading-tight">
                  AI-Personalized Wellness
                  <span className="block text-white/90 mt-2">Meets Beautiful Music</span>
                </h1>
                <p className="text-base font-body text-white/80 leading-relaxed max-w-2xl mt-6">
                  Closed loop music designed to delight. Powered by patented AI and 50+ years of music therapy science.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Research Institutions */}
        <footer className="py-12 border-t border-white/10 backdrop-blur-sm bg-black/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
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