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
    <div className="min-h-screen bg-black">
      {/* Navigation Header */}
      <nav className="bg-black/80 sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end items-center">
            <Button
              onClick={() => navigate('/auth')}
              className="text-sm font-medium font-headers px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
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
                <h1 className="text-5xl lg:text-6xl font-headers font-semibold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">NeuroTunes</h1>
                <p className="text-sm font-body text-gray-500 mt-1">by NeuralPositive</p>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold font-headers text-white leading-tight">
                AI-Personalized Wellness
                <span className="block bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-base font-body text-gray-300 leading-relaxed max-w-2xl mt-6">
                Closed loop music designed to delight. Powered by patented AI and 50+ years of music therapy science.
              </p>
              
            </div>
          </div>
        </div>
      </section>



      {/* Sponsored Research & Features Carousel */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl lg:text-2xl font-semibold font-headers bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent mb-6">
              First-In-Class Technology
            </h2>
          </div>

          {/* Therapeutic Cards Grid - All 6 cards fit on page */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {therapeuticCards.map((card, index) => (
                <div 
                  key={index}
                  className="relative overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl group cursor-pointer"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 group-hover:from-black/20 group-hover:to-black/60 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold font-headers text-white mb-0.5">{card.title}</h3>
                    <p className="text-xs font-body text-white/80">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Research Institutions */}
      <footer className="py-12 bg-black border-t border-white/10">
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
      
      {/* Post-Session Survey */}
      <PostSessionSurvey
        open={showSurvey}
        onClose={closeSurvey}
      />
    </div>
  );
};

export default Index;