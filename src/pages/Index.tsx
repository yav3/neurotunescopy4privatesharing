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
import classicalSonatasImage from '../assets/classical-sonatas.png';
import nocturnesImage from '../assets/nocturnes.png';
import cornellLogo from '../assets/cornell-university.png';
import jacobsTechnionLogo from '../assets/jacobs-technion.png';
import stanfordMedicineLogo from '../assets/stanford-medicine.png';
import weillCornellLogo from '../assets/weill-cornell.png';
import leafDropletImage from '../assets/leaf-droplet.png';
import neurotunesLogo from '@/assets/neurotunes-logo.png';
import liquidGlassGradient from '@/assets/liquid-glass-gradient.png';

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
                AI-Personalized, Closed Loop Wellness
                <span className="block bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed max-w-3xl mt-6">
                Evidence-based and derived from sponsored research and the principles of music therapy, the AI technology has been tested in hospitals and clinics
              </p>
              <p className="text-base font-body text-gray-400 leading-relaxed max-w-3xl">
                Our AI analyzes thousands of musical parameters to create personalized therapy sessions that target specific mental health and cognitive goals.
              </p>
              
              {/* Stats - Animated Horizontal Carousel */}
              <div className="w-full overflow-hidden pt-6">
                <div className="relative">
                  <div className="flex gap-4 animate-scroll-infinite">
                    {[...stats, ...stats, ...stats].map((stat, index) => (
                      <div key={index} className="text-center p-6 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm flex-shrink-0"
                           style={{ width: '160px', minWidth: '160px' }}>
                        <stat.icon className="h-7 w-7 text-white stroke-[1.5] mx-auto mb-3" />
                        <div className="font-semibold font-headers text-white text-base mb-2">{stat.value}</div>
                        <div className="text-sm font-body text-gray-400 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Therapy Programs */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold font-headers bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent mb-6">
              Featured Therapy Programs
            </h2>
            <p className="text-base font-body text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Clinically-designed music therapy sessions for various conditions and goals
            </p>
          </div>

          {/* Horizontal Scrolling Container */}
          <div className="w-full overflow-hidden">
            <div className="horizontal-scroll scrollbar-hide">
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                {/* Classical Crossover for Anxiety Reduction */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 scroll-snap-start"
                     style={{ width: '320px', minWidth: '320px' }}>
                  <div className="flex flex-col space-y-4">
                    <div className="relative w-full h-28 rounded-xl overflow-hidden">
                      <img 
                        src="/src/assets/wave-splash-1.png" 
                        alt="Classical Crossover for Anxiety Reduction" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/30 text-white rounded-full text-sm font-medium font-body">
                          Anxiety Relief
                        </span>
                      </div>
                      <div 
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 text-white/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-not-allowed"
                      >
                        <Play className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium font-headers text-white leading-tight">
                        Classical Crossover for Anxiety Reduction
                      </h3>
                      <p className="text-sm font-body text-gray-300 leading-relaxed">
                        Precisely calibrated binaural beat frequencies to enhance concentration and mental clarity for cognitive tasks and deep work sessions.
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-teal-400">
                        <Shield className="h-4 w-4" />
                        <span className="font-body font-medium">Neuroscience Validated</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nocturnes for Meditation */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 scroll-snap-start"
                     style={{ width: '320px', minWidth: '320px' }}>
                  <div className="flex flex-col space-y-4">
                    <div className="relative w-full h-28 rounded-xl overflow-hidden">
                      <img 
                        src="/src/assets/zen-stones.png" 
                        alt="Nocturnes for Meditation" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/30 text-white rounded-full text-sm font-medium font-body">
                          Focus Enhancement
                        </span>
                      </div>
                      <div 
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 text-white/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-not-allowed"
                      >
                        <Play className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium font-headers text-white leading-tight">
                        Nocturnes for Meditation
                      </h3>
                      <p className="text-sm font-body text-gray-300 leading-relaxed">
                        Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain using classical compositions enhanced with therapeutic frequencies
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-cyan-400">
                        <Shield className="h-4 w-4" />
                        <span className="font-body font-medium">FDA Researched</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delta Wave Induction */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 scroll-snap-start"
                     style={{ width: '320px', minWidth: '320px' }}>
                  <div className="flex flex-col space-y-4">
                    <div className="relative w-full h-28 rounded-xl overflow-hidden">
                      <img 
                        src="/src/assets/peaceful-stones.png" 
                        alt="Delta Wave Induction" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/30 text-white rounded-full text-sm font-medium font-body">
                          Non-Sleep Deep Rest
                        </span>
                      </div>
                      <div 
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 text-white/50 rounded-full flex items-center justify-center backdrop-blur-sm cursor-not-allowed"
                      >
                        <Play className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium font-headers text-white leading-tight">
                        Delta Wave Induction
                      </h3>
                      <p className="text-sm font-body text-gray-300 leading-relaxed">
                        Advanced sleep therapy using low-frequency sounds and binaural beats to promote deep restorative sleep for insomnia and sleep disorders.
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-purple-400">
                        <Shield className="h-4 w-4" />
                        <span className="font-body font-medium">Sleep Study Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Benefits - Consolidated Features */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-semibold font-headers bg-gradient-to-r from-white via-teal-200 to-teal-300 bg-clip-text text-transparent mb-6">
              Evidence-based and derived from sponsored research and the principles of music therapy, the AI technology has been tested in hospitals and clinics
            </h2>
            <p className="text-base font-body text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Our AI analyzes thousands of musical parameters to create personalized therapy sessions 
              that target specific mental health and cognitive goals.
            </p>
          </div>

          {/* Horizontal Scrolling Container */}
          <div className="w-full overflow-hidden">
            <div className="horizontal-scroll scrollbar-hide">
              <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                {[...therapeuticBenefits, ...therapeuticBenefits].map((benefit, index) => (
                  <div 
                    key={index} 
                    className="border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-500 group bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm scroll-snap-start"
                    style={{ width: '280px', minWidth: '280px' }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mb-4 group-hover:border-white/40 transition-all duration-300">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-medium font-headers text-white mb-3">{benefit.title}</h3>
                    <p className="text-sm font-body text-gray-300 leading-relaxed">{benefit.description}</p>
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
                  filter: 'grayscale(100%) brightness(1.2) contrast(1.3)'
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
                  filter: 'grayscale(100%) brightness(1.2) contrast(1.3)'
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
                  filter: 'grayscale(100%) brightness(1.2) contrast(1.3)'
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
                  filter: 'grayscale(100%) brightness(1.2) contrast(1.3)'
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