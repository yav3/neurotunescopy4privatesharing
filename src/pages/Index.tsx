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
              <div className="w-8 h-8 border-2 border-white/60 rounded flex items-center justify-center">
                <div className="w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-white/80 rotate-45"></div>
              </div>
              <div>
                <h1 className="text-4xl font-headers font-bold bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">NeuroTunes</h1>
                <p className="text-xs font-body text-gray-500">by NeuralPositive</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                size="sm"
                onClick={handleActionClick}
                className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg hover:shadow-xl font-medium font-headers px-6 hover:from-teal-500 hover:to-blue-500 transition-all duration-300"
              >
                {user ? 'Start Therapy' : 'Enter Code'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-24 lg:py-32 xl:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-center">
            <div className="lg:pr-8 xl:pr-12 space-y-8">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-headers text-white leading-tight">
                AI-Personalized, Closed Loop Wellness
                <span className="block bg-gradient-to-r from-teal-600 via-blue-600 to-blue-700 bg-clip-text text-transparent mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-lg font-body text-gray-300 leading-relaxed max-w-2xl">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-base font-body text-gray-400 leading-relaxed">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleActionClick}
                  className="bg-gradient-to-r from-teal-600 via-blue-600 to-blue-700 font-headers text-white shadow-xl hover:shadow-2xl font-semibold text-base px-8 py-4 h-auto flex items-center justify-center space-x-2 hover:from-teal-500 hover:via-blue-500 hover:to-blue-600 transition-all duration-300"
                >
                  <Headphones className="h-5 w-5" />
                  <span>{user ? 'Begin Therapy Session' : 'Request Enterprise Code'}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Stats - Enhanced Layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 lg:p-6 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl">
                    <stat.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white stroke-[1.5] mx-auto mb-3" />
                    <div className="font-bold font-headers text-white text-sm lg:text-base mb-1">{stat.value}</div>
                    <div className="text-xs font-body text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 relative z-10 rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-500 p-12 lg:p-16 text-center">
                <div className="w-16 h-16 lg:w-20 lg:w-20 rounded-full border-2 border-white/40 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Headphones className="h-8 w-8 lg:h-10 lg:w-10 text-white stroke-1" />
                </div>
                <h3 className="font-semibold font-headers text-white text-lg lg:text-xl mb-2">Active Therapy Session</h3>
                <p className="font-body text-gray-300 text-sm">Classical Sonatas for Stress Relief</p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-white/70">
                  <Activity className="h-4 w-4 stroke-1" />
                  <span className="text-xs font-medium font-body">Real-time Monitoring</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-700/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-800/10 to-transparent rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Benefits */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-headers bg-gradient-to-r from-white via-teal-300 to-blue-300 bg-clip-text text-transparent mb-8">
              Evidence-based and derived from sponsored research and the principles of music therapy, the AI technology has been tested in hospitals and clinics
            </h2>
            <p className="text-lg font-body text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our AI analyzes thousands of musical parameters to create personalized therapy sessions 
              that target specific mental health and cognitive goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {therapeuticBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="border border-white/10 rounded-2xl p-8 lg:p-10 hover:border-white/20 transition-all duration-500 group"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl border-2 border-white/30 flex items-center justify-center mb-6 lg:mb-8 group-hover:border-white/50 transition-all duration-300">
                  <benefit.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white stroke-1" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold font-headers text-white mb-4 lg:mb-6">{benefit.title}</h3>
                <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Therapy Programs */}
      <section className="py-20 sm:py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold font-headers bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent mb-8">
              Featured Therapy Programs
            </h2>
            <p className="text-lg font-body text-gray-300 max-w-2xl mx-auto">
              Clinically-designed music therapy sessions for various conditions and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="group cursor-pointer">
              <div className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:-translate-y-2">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="/src/assets/wave-splash-1.png" 
                    alt="Stress reduction therapy" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-sm px-3 py-1 border border-white/20 text-white rounded-full text-sm font-medium font-body">
                      Stress Reduction
                    </span>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-semibold font-headers text-white mb-3">
                    Binaural Beats for Focus
                  </h3>
                  <p className="text-sm lg:text-base font-body text-gray-300 mb-6 leading-relaxed">
                    Precisely calibrated binaural beat frequencies to enhance concentration and mental clarity for cognitive tasks and deep work sessions.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-white stroke-1" />
                      <span className="font-body">Neuroscience Validated</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <Play className="h-4 w-4 stroke-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:-translate-y-2">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="/src/assets/zen-stones.png" 
                    alt="Focus enhancement therapy" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-sm px-3 py-1 border border-white/20 text-white rounded-full text-sm font-medium font-body">
                      Focus Enhancement
                    </span>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-semibold font-headers text-white mb-3">
                    Morning Light Activation
                  </h3>
                  <p className="text-sm lg:text-base font-body text-gray-300 mb-6 leading-relaxed">
                    Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain using classical compositions enhanced with therapeutic frequencies
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-white stroke-1" />
                      <span className="font-body">FDA Researched</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <Play className="h-4 w-4 stroke-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 group-hover:-translate-y-2">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="/src/assets/peaceful-stones.png" 
                    alt="Deep rest therapy" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-sm px-3 py-1 border border-white/20 text-white rounded-full text-sm font-medium font-body">
                      Non-Sleep Deep Rest
                    </span>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <h3 className="text-lg lg:text-xl font-semibold font-headers text-white mb-3">
                    Delta Wave Induction
                  </h3>
                  <p className="text-sm lg:text-base font-body text-gray-300 mb-6 leading-relaxed">
                    Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Shield className="h-4 w-4 text-white stroke-1" />
                      <span className="font-body">Sleep Lab Tested</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <Play className="h-4 w-4 stroke-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 lg:mt-20">
            <Button 
              size="lg" 
              onClick={handleActionClick}
              className="bg-gradient-to-r from-teal-600 via-blue-600 to-blue-700 font-headers text-white shadow-xl hover:shadow-2xl font-semibold text-base px-8 py-4 h-auto inline-flex items-center space-x-2 hover:from-teal-500 hover:via-blue-500 hover:to-blue-600 transition-all duration-300"
            >
              <Zap className="h-5 w-5 stroke-[1.5]" />
              <span>{user ? 'Explore All Programs' : 'Enter Code'}</span>
              <ArrowRight className="h-5 w-5 stroke-[1.5]" />
            </Button>
          </div>
        </div>
      </section>

      {/* Research Institutions */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold font-headers bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-8">
              Leading Research Institutions
            </h2>
            <p className="text-lg font-body text-gray-300 max-w-3xl mx-auto">
              Our platform is developed in collaboration with world-renowned medical and technology institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
            <div className="border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl border-2 border-blue-500/50 flex items-center justify-center mb-6 lg:mb-8 group-hover:border-blue-400/70 transition-all duration-300 mx-auto">
                <Award className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400 stroke-1" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold font-headers text-white mb-4 lg:mb-6">Stanford University Medical School</h3>
              <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed mb-6">
                Collaborative research on neuroplasticity and music-based cognitive rehabilitation protocols
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-400">
                <Star className="h-4 w-4 stroke-1" />
                <span className="font-body">Lead Research Partner</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl border-2 border-teal-600/50 flex items-center justify-center mb-6 lg:mb-8 group-hover:border-teal-500/70 transition-all duration-300 mx-auto">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-teal-500 stroke-1" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold font-headers text-white mb-4 lg:mb-6">Jacobs Cornell Technion Institute</h3>
              <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed mb-6">
                Advanced technology research for therapeutic applications and digital health innovation
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-teal-500">
                <TrendingUp className="h-4 w-4 stroke-1" />
                <span className="font-body">Technology Innovation</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl border-2 border-teal-700/50 flex items-center justify-center mb-6 lg:mb-8 group-hover:border-teal-600/70 transition-all duration-300 mx-auto">
                <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-teal-600 stroke-1" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold font-headers text-white mb-4 lg:mb-6">Weill Cornell Medical College</h3>
              <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed mb-6">
                Clinical research and medical validation of therapeutic music protocols in healthcare settings
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-teal-600">
                <Zap className="h-4 w-4 stroke-1" />
                <span className="font-body">Clinical Validation</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-2xl p-8 lg:p-10 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl border-2 border-blue-600/50 flex items-center justify-center mb-6 lg:mb-8 group-hover:border-blue-500/70 transition-all duration-300 mx-auto">
                <Brain className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500 stroke-1" />
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold font-headers text-white mb-4 lg:mb-6">Columbia University</h3>
              <p className="text-base lg:text-lg font-body text-gray-300 leading-relaxed mb-6">
                Neuroscience studies on therapeutic music effects and evidence-based treatment development
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-500">
                <Heart className="h-4 w-4 stroke-1" />
                <span className="font-body">Neuroscience Research</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 sm:py-24 lg:py-32 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-headers bg-gradient-to-r from-white via-teal-300 to-blue-300 bg-clip-text text-transparent mb-8 lg:mb-10">
            Start Your Personalized Music Therapy Journey
          </h2>
          <p className="text-lg lg:text-xl font-body text-gray-300 mb-10 lg:mb-12 leading-relaxed">
            Experience personalized therapeutic music designed for clinical applications
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={handleActionClick}
              className="bg-gradient-to-r from-teal-600 via-blue-600 to-blue-700 font-headers text-white shadow-2xl hover:shadow-3xl font-semibold text-lg px-12 py-6 h-auto flex items-center justify-center space-x-3 hover:from-teal-500 hover:via-blue-500 hover:to-blue-600 transition-all duration-300"
            >
              <Headphones className="h-6 w-6 stroke-[1.5]" />
              <span>{user ? 'Begin Your Therapy Session' : 'Request Enterprise Code'}</span>
              <ArrowRight className="h-6 w-6 stroke-[1.5]" />
            </Button>
          </div>
          
          <p className="text-sm font-body text-gray-500 mb-8">
            Request a license for your enterprise
          </p>
          
          <div className="border-t border-white/10 pt-8">
            <Link 
              to="/admin" 
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-teal-500 transition-colors duration-300 font-medium font-body"
            >
              <Shield className="h-4 w-4 stroke-[1.5]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;