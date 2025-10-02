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
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
                <img 
                  src={neurotunesLogo} 
                  alt="NeuroTunes Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-headers font-semibold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">NeuroTunes</h1>
                <p className="text-xs font-body text-gray-500">by NeuralPositive</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/auth')}
                className="text-sm font-medium font-headers px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-teal-500/25"
              >
                Authorized User Sign-In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-semibold font-headers text-white leading-tight">
                AI-Personalized, Closed Loop Wellness
                <span className="block bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed max-w-xl">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-sm font-body text-gray-400 leading-relaxed max-w-xl">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              {/* Stats - Horizontal Scrolling Layout */}
              <div className="w-full overflow-hidden pt-6">
                <div className="horizontal-scroll scrollbar-hide">
                  <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center p-6 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm scroll-snap-start"
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

            {/* Active Therapy Session Card - Side by side */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative max-w-sm w-full">
                {/* Active Therapy Session Card */}
                <div className="bg-gradient-to-br from-white/8 to-white/3 border border-white/20 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                  {/* Background leaf image */}
                  <div className="absolute inset-0 opacity-60">
                    <img 
                      src="/src/assets/leaf-therapy.png"
                      alt="" 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                    {/* Headphones Icon */}
                    <div className="w-16 h-16 bg-white/20 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg">
                      <Headphones className="h-8 w-8 text-white drop-shadow-sm" />
                    </div>
                    
                    {/* Session Info */}
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-semibold font-headers text-white drop-shadow-lg">Active Therapy Session</h3>
                      <p className="text-xs font-body text-gray-200 drop-shadow-md">Classical Sonatas for Stress Relief</p>
                      <div className="flex items-center justify-center space-x-2 text-white/90">
                        <Activity className="h-3 w-3 drop-shadow-sm" />
                        <span className="text-xs font-medium font-body drop-shadow-sm">Real-time Monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Insights Dashboard */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComprehensiveInsightsDashboard />
        </div>
      </section>

      {/* Therapeutic Benefits */}
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
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
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
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
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
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
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

      {/* Research Institutions */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-cyan-500/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-headers bg-gradient-to-r from-white via-gray-100 to-cyan-200 bg-clip-text text-transparent mb-8 tracking-tight">
              Research Institutions
            </h2>
            <p className="text-lg lg:text-xl font-body text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
              Collaborating with leading institutions in neuroscience and technology
            </p>
          </div>
          
          {/* Enhanced institutional cards */}
          <div className="w-full overflow-hidden">
            <div className="horizontal-scroll scrollbar-hide">
              <div className="flex gap-8 pb-6" style={{ width: 'max-content' }}>
                {[
                  { name: "Cornell Tech", logo: cornellLogo, field: "AI & Machine Learning Research" },
                  { name: "Jacobs Technion", logo: jacobsTechnionLogo, field: "Neurotechnology Innovation" },
                  { name: "Stanford Medicine", logo: stanfordMedicineLogo, field: "Clinical Neuroscience" },
                  { name: "Weill Cornell", logo: weillCornellLogo, field: "Medical Research" }
                ].map((institution, index) => (
                  <div 
                    key={index}
                    className="group text-center bg-gradient-to-br from-white/8 via-white/4 to-white/2 backdrop-blur-sm border border-white/15 rounded-2xl p-10 hover:border-white/30 hover:bg-gradient-to-br hover:from-white/12 hover:via-white/8 hover:to-white/4 transition-all duration-500 scroll-snap-start shadow-2xl hover:shadow-teal-500/10 hover:shadow-3xl transform hover:-translate-y-2"
                    style={{ width: '300px', minWidth: '300px' }}
                  >
                    <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden border border-white/20 group-hover:border-white/30 transition-all duration-500 shadow-xl">
                      <img 
                        src={institution.logo} 
                        alt={`${institution.name} logo`}
                        className="w-18 h-18 object-contain filter brightness-110 contrast-125 group-hover:scale-110 transition-all duration-500"
                        style={{ 
                          imageRendering: 'crisp-edges',
                          filter: 'brightness(1.1) contrast(1.25) saturate(1.1)'
                        }}
                      />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold font-headers text-white mb-4 tracking-tight group-hover:text-cyan-100 transition-colors duration-300">{institution.name}</h3>
                    <p className="text-base font-body text-gray-300 font-medium leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{institution.field}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden border-t border-white/10">
        {/* Liquid glass gradient background */}
        <div className="absolute inset-0">
          <img 
            src={liquidGlassGradient} 
            alt=""
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-semibold font-headers text-white mb-6">
              Ready to Begin Your Musical Wellness Journey?
            </h2>
            <p className="text-lg font-body text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join thousands who have discovered the therapeutic power of AI-personalized music
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <span className="text-gray-300 font-medium font-body text-lg px-6 py-3 border border-gray-500 rounded-lg bg-gray-700/50 backdrop-blur-sm">
                Authorized User Sign-In
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Post-Session Survey */}
      <PostSessionSurvey
        open={showSurvey}
        onClose={closeSurvey}
      />
    </div>
  );
};

export default Index;