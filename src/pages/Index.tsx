/* Professional Music Therapy AI Platform Landing Page */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../components/auth/AuthProvider';
import { AuthPage } from '../components/auth/AuthPage';
import classicalSonatasImage from '../assets/classical-sonatas.png';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-white/60 rounded flex items-center justify-center">
                <div className="w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-white/80 rotate-45"></div>
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="lg:pr-4 space-y-4">
              <h1 className="text-2xl lg:text-3xl font-semibold font-headers text-white leading-tight">
                AI-Personalized, Closed Loop Wellness
                <span className="block bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-sm font-body text-gray-300 leading-relaxed max-w-2xl">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-xs font-body text-gray-400 leading-relaxed">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              
              <div className="flex flex-col sm:flex-row gap-4">
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
              
              {/* Stats - Enhanced Layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-2 border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl">
                    <stat.icon className="h-4 w-4 text-white stroke-[1.5] mx-auto mb-1" />
                    <div className="font-semibold font-headers text-white text-xs mb-1">{stat.value}</div>
                    <div className="text-xs font-body text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 relative z-10 rounded-xl border border-white/20 backdrop-blur-sm overflow-hidden hover:from-white/15 hover:to-white/10 transition-all duration-500">
                <div className="relative h-32 overflow-hidden rounded-t-xl">
                  <img 
                    src={classicalSonatasImage} 
                    alt="Classical Sonatas for Stress Relief" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-medium font-headers text-white text-sm mb-1">Active Therapy Session</h3>
                  <p className="font-body text-gray-300 text-xs">Classical Sonatas for Stress Relief</p>
                  <div className="mt-2 flex items-center justify-center space-x-1 text-white/70">
                    <Activity className="h-3 w-3 stroke-1" />
                    <span className="text-xs font-medium font-body">Real-time Monitoring</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-cyan-600/10 to-transparent rounded-full blur-3xl"></div>
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

          <div className="grid md:grid-cols-3 gap-4">
            {therapeuticBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-500 group"
              >
                <div className="w-8 h-8 rounded-xl border-2 border-white/30 flex items-center justify-center mb-3 group-hover:border-white/50 transition-all duration-300">
                  <benefit.icon className="h-4 w-4 text-white stroke-1" />
                </div>
                <h3 className="text-base font-medium font-headers text-white mb-2">{benefit.title}</h3>
                <p className="text-sm font-body text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
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

          {/* Horizontal scrollable container */}
          <div className="relative">
            {/* Gradient fade at left */}
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            
            {/* Horizontal scrollable content */}
            <div className="overflow-x-auto scrollbar-hide hover:scrollbar-thin hover:scrollbar-thumb-gray-600 hover:scrollbar-track-transparent pb-2">
              <div className="flex space-x-4 pl-8 pr-8 min-w-max">
                {/* Classical Crossover for Anxiety Reduction */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 w-80 flex-shrink-0">
                  <div className="flex flex-col space-y-3">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img 
                        src="/src/assets/wave-splash-1.png" 
                        alt="Classical Crossover for Anxiety Reduction" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/50 backdrop-blur-sm px-2 py-1 border border-white/20 text-white rounded-full text-xs font-medium font-body">
                          Anxiety Relief
                        </span>
                      </div>
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-2 right-2 w-8 h-8 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <Play className="h-4 w-4 stroke-1" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium font-headers text-white mb-1">
                        Classical Crossover for Anxiety Reduction
                      </h3>
                      <p className="text-xs font-body text-gray-300 leading-relaxed line-clamp-2 mb-2">
                        Precisely calibrated binaural beat frequencies to enhance concentration and mental clarity for cognitive tasks and deep work sessions.
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Shield className="h-3 w-3 text-white stroke-1" />
                        <span className="font-body">Neuroscience Validated</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nocturnes for Meditation */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 w-80 flex-shrink-0">
                  <div className="flex flex-col space-y-3">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img 
                        src="/src/assets/zen-stones.png" 
                        alt="Nocturnes for Meditation" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/50 backdrop-blur-sm px-2 py-1 border border-white/20 text-white rounded-full text-xs font-medium font-body">
                          Focus Enhancement
                        </span>
                      </div>
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-2 right-2 w-8 h-8 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <Play className="h-4 w-4 stroke-1" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium font-headers text-white mb-1">
                        Nocturnes for Meditation
                      </h3>
                      <p className="text-xs font-body text-gray-300 leading-relaxed line-clamp-2 mb-2">
                        Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain using classical compositions enhanced with therapeutic frequencies
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Shield className="h-3 w-3 text-white stroke-1" />
                        <span className="font-body">FDA Researched</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delta Wave Induction */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 w-80 flex-shrink-0">
                  <div className="flex flex-col space-y-3">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img 
                        src="/src/assets/peaceful-stones.png" 
                        alt="Delta Wave Induction" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/50 backdrop-blur-sm px-2 py-1 border border-white/20 text-white rounded-full text-xs font-medium font-body">
                          Non-Sleep Deep Rest
                        </span>
                      </div>
                      <button 
                        onClick={handleActionClick}
                        className="absolute bottom-2 right-2 w-8 h-8 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <Play className="h-4 w-4 stroke-1" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium font-headers text-white mb-1">
                        Delta Wave Induction
                      </h3>
                      <p className="text-xs font-body text-gray-300 leading-relaxed line-clamp-2 mb-2">
                        Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Shield className="h-3 w-3 text-white stroke-1" />
                        <span className="font-body">Sleep Lab Tested</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gradient fade at right */}
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
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
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-8 h-8 rounded-xl border-2 border-teal-500/50 flex items-center justify-center mb-3 group-hover:border-teal-400/70 transition-all duration-300 mx-auto">
                <Award className="h-4 w-4 text-teal-400 stroke-1" />
              </div>
              <h3 className="text-sm font-medium font-headers text-white mb-2">Stanford University Medical School</h3>
              <p className="text-xs font-body text-gray-300 leading-relaxed mb-2">
                Collaborative research on neuroplasticity and music-based cognitive rehabilitation protocols
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-teal-400">
                <Star className="h-3 w-3 stroke-1" />
                <span className="font-body">Lead Research Partner</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-8 h-8 rounded-xl border-2 border-teal-600/50 flex items-center justify-center mb-3 group-hover:border-teal-500/70 transition-all duration-300 mx-auto">
                <Users className="h-4 w-4 text-teal-500 stroke-1" />
              </div>
              <h3 className="text-sm font-medium font-headers text-white mb-2">Jacobs Cornell Technion Institute</h3>
              <p className="text-xs font-body text-gray-300 leading-relaxed mb-2">
                Advanced technology research for therapeutic applications and digital health innovation
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-teal-500">
                <TrendingUp className="h-3 w-3 stroke-1" />
                <span className="font-body">Technology Innovation</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-8 h-8 rounded-xl border-2 border-cyan-600/50 flex items-center justify-center mb-3 group-hover:border-cyan-500/70 transition-all duration-300 mx-auto">
                <Sparkles className="h-4 w-4 text-cyan-500 stroke-1" />
              </div>
              <h3 className="text-sm font-medium font-headers text-white mb-2">Weill Cornell Medical College</h3>
              <p className="text-xs font-body text-gray-300 leading-relaxed mb-2">
                Clinical research and medical validation of therapeutic music protocols in healthcare settings
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-cyan-500">
                <Zap className="h-3 w-3 stroke-1" />
                <span className="font-body">Clinical Validation</span>
              </div>
            </div>

            <div className="border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-all duration-500 group">
              <div className="w-8 h-8 rounded-xl border-2 border-teal-700/50 flex items-center justify-center mb-3 group-hover:border-teal-600/70 transition-all duration-300 mx-auto">
                <Brain className="h-4 w-4 text-teal-600 stroke-1" />
              </div>
              <h3 className="text-sm font-medium font-headers text-white mb-2">Columbia University</h3>
              <p className="text-xs font-body text-gray-300 leading-relaxed mb-2">
                Neuroscience studies on therapeutic music effects and evidence-based treatment development
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-teal-600">
                <Heart className="h-3 w-3 stroke-1" />
                <span className="font-body">Neuroscience Research</span>
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