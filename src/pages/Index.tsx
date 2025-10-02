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

  const stats = [
    { label: "Technology", value: "Patented", icon: Shield },
    { label: "Research", value: "Evidence Based", icon: Award },
    { label: "Music Library", value: "50+ Genres", icon: Music },
    { label: "Analytics", value: "Clinical Insights", icon: Brain }
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

          {/* Unified Features Carousel */}
          <div className="w-full overflow-hidden">
            <div className="horizontal-scroll scrollbar-hide">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {/* Stats Cards */}
                {stats.map((stat, index) => (
                  <div key={`stat-${index}`} className="text-center p-6 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm flex-shrink-0"
                       style={{ width: '220px', minWidth: '220px' }}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-white stroke-[1.5]" />
                    </div>
                    <div className="font-semibold font-headers text-white text-lg mb-2">{stat.value}</div>
                    <div className="text-sm font-body text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
                
                {/* Therapeutic Benefits Cards */}
                {therapeuticBenefits.map((benefit, index) => (
                  <div 
                    key={`benefit-${index}`} 
                    className="border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-500 group bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm scroll-snap-start"
                    style={{ width: '280px', minWidth: '280px' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mb-4 group-hover:border-white/40 transition-all duration-300">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-medium font-headers text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm font-body text-gray-400 leading-relaxed">{benefit.description}</p>
                  </div>
                ))}
              </div>
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