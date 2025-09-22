/* Professional Music Therapy AI Platform Landing Page */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { AuthPage } from '../components/auth/AuthPage';
import classicalSonatasImage from '../assets/classical-sonatas.png';
import nocturnesImage from '../assets/nocturnes.png';
import cornellLogo from '../assets/cornell-university.png';
import jacobsTechnionLogo from '../assets/jacobs-technion.png';
import stanfordMedicineLogo from '../assets/stanford-medicine.png';
import weillCornellLogo from '../assets/weill-cornell.png';
import leafDropletImage from '../assets/leaf-droplet.png';

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
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const [showAuth, setShowAuth] = useState(false);

  // Handler for action buttons - show auth if not logged in, go to app if logged in
  const handleActionClick = () => {
    console.log('🔘 Action button clicked, user:', !!user, 'loading:', loading);
    if (user) {
      console.log('🎯 User authenticated, navigating to goals');
      navigate('/goals');
    } else {
      console.log('🔐 User not authenticated, showing auth');
      setShowAuth(true);
    }
  };

  // Show the auth page when requested
  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-white/60 rounded flex items-center justify-center">
                <Plus className="w-3 h-3 text-white/80" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-4xl font-headers font-semibold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">NeuroTunes</h1>
                <p className="text-xs font-body text-gray-500">by NeuralPositive</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                size="sm"
                onClick={handleActionClick}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg hover:shadow-xl font-medium font-headers px-6 hover:from-teal-400 hover:to-cyan-500 transition-all duration-300"
              >
                {user ? 'Admin Login' : 'Enter Code'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-start">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-semibold font-headers text-white leading-tight">
                AI-Personalized, Closed Loop Wellness
                <span className="block bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent mt-1">Meets Beautiful Music</span>
              </h1>
              <p className="text-sm font-body text-gray-300 leading-relaxed max-w-lg">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-xs font-body text-gray-400 leading-relaxed max-w-lg">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  size="sm"
                  onClick={handleActionClick}
                  className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 font-headers text-white shadow-xl hover:shadow-2xl font-medium text-sm px-6 py-3 h-auto flex items-center justify-center space-x-2 hover:from-teal-400 hover:via-teal-500 hover:to-teal-600 transition-all duration-300"
                >
                  <Headphones className="h-4 w-4" />
                  <span>{user ? 'Enter Code' : 'Request Enterprise Code'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Stats - Horizontal Scrolling Layout */}
              <div className="w-full overflow-hidden pt-4">
                <div className="horizontal-scroll scrollbar-hide">
                  <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center p-4 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm scroll-snap-start"
                           style={{ width: '140px', minWidth: '140px' }}>
                        <stat.icon className="h-6 w-6 text-white stroke-[1.5] mx-auto mb-2" />
                        <div className="font-semibold font-headers text-white text-sm mb-1">{stat.value}</div>
                        <div className="text-xs font-body text-gray-400 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side with leaf image and Nocturnes card */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative max-w-sm lg:max-w-md xl:max-w-lg">
                <img 
                  src={leafDropletImage} 
                  alt="Leaf with water droplet" 
                  className="w-full h-auto object-contain rounded-2xl"
                />
                
                {/* Nocturnes card positioned over the leaf image */}
                <div className="absolute bottom-4 right-4 w-48 max-w-[45%]">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 relative z-10 rounded-lg border border-white/20 backdrop-blur-sm overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-500">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={nocturnesImage} 
                        alt="Nocturnes" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                    <div className="p-2 text-center">
                      <h3 className="font-medium font-headers text-white text-xs mb-1">Nocturnes</h3>
                      <p className="font-body text-gray-300 text-[10px] mb-1">Calming Night Compositions</p>
                      <div className="flex items-center justify-center space-x-1 text-white/70">
                        <Activity className="h-2.5 w-2.5 stroke-1" />
                        <span className="text-[9px] font-medium font-body">Real-time Monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Benefits */}
      <section className="py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-lg lg:text-xl font-semibold font-headers bg-gradient-to-r from-white via-teal-200 to-teal-300 bg-clip-text text-transparent mb-3">
              Evidence-based and derived from sponsored research and the principles of music therapy, the AI technology has been tested in hospitals and clinics
            </h2>
            <p className="text-sm font-body text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
      <section className="py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-lg lg:text-xl font-semibold font-headers bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent mb-3">
              Featured Therapy Programs
            </h2>
            <p className="text-sm font-body text-gray-300 max-w-2xl mx-auto">
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
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 hover:border-white/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                      >
                        <Play className="h-5 w-5" />
                      </button>
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
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 hover:border-white/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                      >
                        <Play className="h-5 w-5" />
                      </button>
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
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 hover:border-white/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium font-headers text-white leading-tight">
                        Delta Wave Induction
                      </h3>
                      <p className="text-sm font-body text-gray-300 leading-relaxed">
                        Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-purple-400">
                        <Shield className="h-4 w-4" />
                        <span className="font-body font-medium">Sleep Lab Tested</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alpha Wave Focus */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 scroll-snap-start"
                     style={{ width: '320px', minWidth: '320px' }}>
                  <div className="flex flex-col space-y-4">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
                      <img 
                        src="/src/assets/classical-sonatas.png" 
                        alt="Alpha Wave Focus" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/30 text-white rounded-full text-sm font-medium font-body">
                          Productivity Enhancement
                        </span>
                      </div>
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 hover:border-white/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium font-headers text-white leading-tight">
                        Alpha Wave Focus Sessions
                      </h3>
                      <p className="text-sm font-body text-gray-300 leading-relaxed">
                        Optimized alpha wave entrainment combined with classical compositions to enhance creative thinking and sustained attention for knowledge work.
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-emerald-400">
                        <Shield className="h-4 w-4" />
                        <span className="font-body font-medium">Cognitive Lab Tested</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stress Recovery */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 scroll-snap-start"
                     style={{ width: '320px', minWidth: '320px' }}>
                  <div className="flex flex-col space-y-4">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden">
                      <img 
                        src="/src/assets/nocturnes.png" 
                        alt="Stress Recovery" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/30 text-white rounded-full text-sm font-medium font-body">
                          Stress Relief
                        </span>
                      </div>
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-3 right-3 w-12 h-12 border-2 border-white/30 hover:border-white/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium font-headers text-white leading-tight">
                        Adaptive Stress Recovery
                      </h3>
                      <p className="text-sm font-body text-gray-300 leading-relaxed">
                        AI-powered stress detection and recovery protocols using nature sounds and gentle harmonics to activate the parasympathetic nervous system.
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-blue-400">
                        <Shield className="h-4 w-4" />
                        <span className="font-body font-medium">Wellness Protocol Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="sm"
              onClick={handleActionClick}
              className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 font-headers text-white shadow-xl hover:shadow-2xl font-medium text-sm px-6 py-3 h-auto inline-flex items-center space-x-2 hover:from-teal-400 hover:via-teal-500 hover:to-teal-600 transition-all duration-300"
            >
              <Zap className="h-4 w-4 stroke-[1.5]" />
              <span>{user ? 'Explore All Programs' : 'Enter Code'}</span>
              <ArrowRight className="h-4 w-4 stroke-[1.5]" />
            </Button>
          </div>
        </div>
      </section>

      {/* Research Institutions */}
      <section className="py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-lg lg:text-xl font-semibold font-headers bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent mb-3">
              Leading Research Institutions
            </h2>
            <p className="text-sm font-body text-gray-300 max-w-3xl mx-auto">
              Our platform is developed in collaboration with world-renowned medical and technology institutions
            </p>
          </div>
          
          {/* Horizontal Scrolling Container */}
          <div className="w-full overflow-hidden">
            <div className="horizontal-scroll scrollbar-hide">
              <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                <div className="border border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all duration-500 group scroll-snap-start bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm"
                     style={{ width: '200px', minWidth: '200px' }}>
                  <div className="w-24 h-20 mx-auto flex items-center justify-center">
                    <img 
                      src={stanfordMedicineLogo} 
                      alt="Stanford Medicine" 
                      className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all duration-500 group scroll-snap-start bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm"
                     style={{ width: '200px', minWidth: '200px' }}>
                  <div className="w-24 h-20 mx-auto flex items-center justify-center">
                    <img 
                      src={jacobsTechnionLogo} 
                      alt="Jacobs Technion-Cornell Institute" 
                      className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all duration-500 group scroll-snap-start bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm"
                     style={{ width: '200px', minWidth: '200px' }}>
                  <div className="w-24 h-20 mx-auto flex items-center justify-center">
                    <img 
                      src={weillCornellLogo} 
                      alt="Weill Cornell Medicine" 
                      className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="border border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-all duration-500 group scroll-snap-start bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm"
                     style={{ width: '200px', minWidth: '200px' }}>
                  <div className="w-24 h-20 mx-auto flex items-center justify-center">
                    <img 
                      src={cornellLogo} 
                      alt="Cornell University" 
                      className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-6 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg lg:text-xl font-semibold font-headers bg-gradient-to-r from-white via-teal-200 to-teal-300 bg-clip-text text-transparent mb-3">
            Start Your Personalized Music Therapy Journey
          </h2>
          <p className="text-sm font-body text-gray-300 mb-4 leading-relaxed">
            Experience personalized therapeutic music designed for clinical applications
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button 
              size="sm"
              onClick={handleActionClick}
              className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 font-headers text-white shadow-2xl hover:shadow-3xl font-medium text-sm px-8 py-4 h-auto flex items-center justify-center space-x-2 hover:from-teal-400 hover:via-teal-500 hover:to-teal-600 transition-all duration-300"
            >
              <Headphones className="h-4 w-4 stroke-[1.5]" />
              <span>{user ? 'Enter Code' : 'Request Enterprise Code'}</span>
              <ArrowRight className="h-4 w-4 stroke-[1.5]" />
            </Button>
          </div>
          
          <p className="text-xs font-body text-gray-500 mb-4">
            Request a license for your enterprise
          </p>
          
          <div className="border-t border-white/10 pt-3">
            <Link 
              to="/admin" 
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-colors duration-300 font-medium font-body"
            >
              <Shield className="h-3 w-3 stroke-[1.5]" />
              <span className="text-xs">Admin Portal</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;