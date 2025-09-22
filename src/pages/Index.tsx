/* Professional Music Therapy AI Platform Landing Page */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { AuthPage } from '../components/auth/AuthPage';

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
  Award
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent">NeuroTunes</h1>
                <p className="text-sm text-gray-400 hidden sm:block">AI Music Therapy Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                size="sm"
                onClick={handleActionClick}
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg hover:shadow-xl font-medium px-6 hover:from-teal-400 hover:to-blue-500 transition-all duration-300"
              >
                {user ? 'Start Therapy' : 'Sign Up to Start'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div className="lg:pr-8 xl:pr-12">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                AI-Personalized, Closed Loop Wellness
                <span className="block bg-gradient-to-r from-teal-400 via-blue-500 to-green-400 bg-clip-text text-transparent mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg"
                  onClick={handleActionClick}
                  className="bg-gradient-to-r from-teal-500 via-blue-600 to-green-500 text-white shadow-xl hover:shadow-2xl font-semibold text-base px-8 py-4 h-auto flex items-center justify-center space-x-2 hover:from-teal-400 hover:via-blue-500 hover:to-green-400 transition-all duration-300"
                >
                  <Headphones className="h-5 w-5" />
                  <span>{user ? 'Begin Therapy Session' : 'Sign Up to Begin'}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Stats - Enhanced Layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm text-center p-4 lg:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl">
                    <stat.icon className="h-8 w-8 lg:h-10 lg:w-10 text-teal-400 mx-auto mb-3" />
                    <div className="font-bold text-white text-base lg:text-lg mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 relative z-10 rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-500 p-12 lg:p-16 text-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Headphones className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <h3 className="font-semibold text-white text-xl lg:text-2xl mb-2">Active Therapy Session</h3>
                <p className="text-gray-300">Cognitive Enhancement Protocol</p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-teal-400">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium">Real-time Monitoring</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Benefits */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-teal-200 to-blue-200 bg-clip-text text-transparent mb-6">
              Evidence-based and derived from sponsored research and the principles of music therapy, the AI technology has been tested in hospitals and clinics
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our AI analyzes thousands of musical parameters to create personalized therapy sessions 
              that target specific mental health and cognitive goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {therapeuticBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10 hover:bg-white/10 transition-all duration-500 group"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center mb-6 lg:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6">{benefit.title}</h3>
                <p className="text-base lg:text-lg text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Therapy Programs */}
      <section className="py-16 sm:py-20 lg:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-teal-200 bg-clip-text text-transparent mb-6">
              Featured Therapy Programs
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Clinically-designed music therapy sessions for various conditions and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="group cursor-pointer">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 group-hover:-translate-y-3">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="user-uploads://image-287.png" 
                    alt="Stress reduction therapy" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM0ZmQ5ZmYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDY5MWI3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-blue-600/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1 border border-white/20 text-teal-300 rounded-full text-sm font-medium">
                      Stress Reduction
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3">
                    Classical Sonatas for Stress Relief
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
                    Evidence-based classical music therapy featuring Chopin piano sonatas and gentle orchestral compositions. Designed to reduce cortisol levels and activate parasympathetic nervous system responses for deep relaxation.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span>258 Clinical Tracks</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 bg-white/10 border border-white/20 hover:bg-gradient-to-br hover:from-teal-500 hover:to-blue-600 hover:text-white text-teal-400 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 group-hover:-translate-y-3">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="user-uploads://image-288.png" 
                    alt="Focus enhancement therapy" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTBiOTgxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-500/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1 border border-white/20 text-blue-300 rounded-full text-sm font-medium">
                      Focus Enhancement
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3">
                    Morning Light Activation
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
                    Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain using classical compositions enhanced with therapeutic frequencies
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span>FDA Researched</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 bg-white/10 border border-white/20 hover:bg-gradient-to-br hover:from-blue-500 hover:to-green-500 hover:text-white text-blue-400 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 group-hover:-translate-y-3">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="user-uploads://image-289.png" 
                    alt="Deep rest therapy" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDU5NjY5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-teal-600/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1 border border-white/20 text-green-300 rounded-full text-sm font-medium">
                      Non-Sleep Deep Rest
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3">
                    Delta Wave Induction
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
                    Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span>Sleep Lab Tested</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 bg-white/10 border border-white/20 hover:bg-gradient-to-br hover:from-green-500 hover:to-teal-600 hover:text-white text-green-400 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 lg:mt-16">
            <Button 
              size="lg" 
              onClick={handleActionClick}
              className="bg-gradient-to-r from-teal-500 via-blue-600 to-green-500 text-white shadow-xl hover:shadow-2xl font-semibold text-base px-8 py-4 h-auto inline-flex items-center space-x-2 hover:from-teal-400 hover:via-blue-500 hover:to-green-400 transition-all duration-300"
            >
              <Zap className="h-5 w-5" />
              <span>{user ? 'Explore All Programs' : 'Sign Up to Explore'}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Research Institutions */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
              Leading Research Institutions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform is developed in collaboration with world-renowned medical and technology institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center mb-6 lg:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Award className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6">Stanford Medicine</h3>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-6">
                Collaborative research on neuroplasticity and music-based cognitive rehabilitation protocols
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-400">
                <Star className="h-4 w-4" />
                <span>Lead Research Partner</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center mb-6 lg:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Users className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6">Johns Hopkins</h3>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-6">
                Clinical trials for therapeutic music interventions in psychiatric and pain management settings
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-teal-400">
                <TrendingUp className="h-4 w-4" />
                <span>Clinical Validation</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mb-6 lg:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Sparkles className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6">MIT Technology</h3>
              <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-6">
                Advanced AI algorithms for personalized music therapy optimization and real-time adaptation
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
                <Zap className="h-4 w-4" />
                <span>AI Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-teal-200 to-blue-200 bg-clip-text text-transparent mb-6 lg:mb-8">
            Start Your Personalized Music Therapy Journey
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 lg:mb-12 leading-relaxed">
            Join thousands who have transformed their mental health through evidence-based music therapy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={handleActionClick}
              className="bg-gradient-to-r from-teal-500 via-blue-600 to-green-500 text-white shadow-2xl hover:shadow-3xl font-semibold text-lg px-12 py-6 h-auto flex items-center justify-center space-x-3 hover:from-teal-400 hover:via-blue-500 hover:to-green-400 transition-all duration-300"
            >
              <Headphones className="h-6 w-6" />
              <span>{user ? 'Begin Your Therapy Session' : 'Sign Up & Start Free Trial'}</span>
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mb-8">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
          
          <div className="border-t border-white/10 pt-8">
            <Link 
              to="/admin" 
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-teal-400 transition-colors duration-300 font-medium"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;