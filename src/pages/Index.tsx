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
    <div className="min-h-screen" style={{ background: 'var(--gradient-white-section)' }}>
      {/* Navigation Header */}
      <nav className="glass-card sticky top-0 z-50 border-b border-glass-border backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">NeuroTunes</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">AI Music Therapy Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                size="sm"
                onClick={handleActionClick}
                className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:shadow-xl font-medium px-6"
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
              <h1 className="text-display-1 font-bold text-foreground mb-6 leading-tight">
                AI-Personalized, Closed Loop Wellness
                <span className="block text-primary mt-2">Meets Beautiful Music</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg"
                  onClick={handleActionClick}
                  className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl hover:shadow-2xl font-semibold text-base px-8 py-4 h-auto flex items-center justify-center space-x-2"
                >
                  <Headphones className="h-5 w-5" />
                  <span>{user ? 'Begin Therapy Session' : 'Sign Up to Begin'}</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Stats - Enhanced Layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="glass-card text-center p-4 lg:p-6 border-glass-border hover:shadow-glass-shadow-hover transition-all duration-300 rounded-xl">
                    <stat.icon className="h-8 w-8 lg:h-10 lg:w-10 text-primary mx-auto mb-3" />
                    <div className="font-bold text-foreground text-base lg:text-lg mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass-card relative z-10 rounded-2xl border-glass-border overflow-hidden hover:shadow-glass-shadow-hover transition-all duration-500 p-12 lg:p-16 text-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Headphones className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-xl lg:text-2xl mb-2">Active Therapy Session</h3>
                <p className="text-muted-foreground">Cognitive Enhancement Protocol</p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-primary">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium">Real-time Monitoring</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Benefits */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-heading-1 font-bold text-foreground mb-6">
              Evidence-based and derived from sponsored research and the principles of music therapy, the AI technology has been tested in hospitals and clinics
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our AI analyzes thousands of musical parameters to create personalized therapy sessions 
              that target specific mental health and cognitive goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {therapeuticBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="glass-card border-glass-border rounded-2xl p-8 lg:p-10 hover:shadow-glass-shadow-hover transition-all duration-500 group"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 lg:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6">{benefit.title}</h3>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Therapy Programs */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-heading-1 font-bold text-foreground mb-6">
              Featured Therapy Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Clinically-designed music therapy sessions for various conditions and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="group cursor-pointer">
              <div className="glass-card border-glass-border rounded-2xl overflow-hidden hover:shadow-glass-shadow-hover transition-all duration-500 group-hover:-translate-y-3">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="/src/assets/nature-5.png" 
                    alt="Stress reduction therapy" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10"></div>
                  <div className="absolute top-4 left-4">
                    <span className="glass-card px-3 py-1 border-glass-border text-primary rounded-full text-sm font-medium backdrop-blur-lg">
                      Stress Reduction
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3">
                    Classical Sonatas for Stress Relief
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                    Evidence-based classical music therapy featuring Chopin piano sonatas and gentle orchestral compositions. Designed to reduce cortisol levels and activate parasympathetic nervous system responses for deep relaxation.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-success" />
                      <span>258 Clinical Tracks</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 glass-card border-glass-border hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:text-white text-primary rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="glass-card border-glass-border rounded-2xl overflow-hidden hover:shadow-glass-shadow-hover transition-all duration-500 group-hover:-translate-y-3">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="/src/assets/nature-6.png" 
                    alt="Focus enhancement therapy" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-info/20 to-info/10"></div>
                  <div className="absolute top-4 left-4">
                    <span className="glass-card px-3 py-1 border-glass-border text-primary rounded-full text-sm font-medium backdrop-blur-lg">
                      Focus Enhancement
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3">
                    Morning Light Activation
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                    Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain using classical compositions enhanced with therapeutic frequencies
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-success" />
                      <span>FDA Researched</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 glass-card border-glass-border hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:text-white text-primary rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="glass-card border-glass-border rounded-2xl overflow-hidden hover:shadow-glass-shadow-hover transition-all duration-500 group-hover:-translate-y-3">
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img 
                    src="/src/assets/nature-7.png" 
                    alt="Deep rest therapy" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/10"></div>
                  <div className="absolute top-4 left-4">
                    <span className="glass-card px-3 py-1 border-glass-border text-primary rounded-full text-sm font-medium backdrop-blur-lg">
                      Non-Sleep Deep Rest
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground mb-3">
                    Delta Wave Induction
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                    Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-success" />
                      <span>Sleep Lab Tested</span>
                    </div>
                    <button 
                      onClick={handleActionClick}
                      className="w-10 h-10 glass-card border-glass-border hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:text-white text-primary rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
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
              className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl hover:shadow-2xl font-semibold text-base px-8 py-4 h-auto inline-flex items-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>{user ? 'Explore All Programs' : 'Sign Up to Explore'}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Research Institutions */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-heading-1 font-bold text-foreground mb-6">
              Leading Research Institutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform is developed in collaboration with world-renowned medical and technology institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="glass-card border-glass-border rounded-2xl p-8 lg:p-10 text-center hover:shadow-glass-shadow-hover transition-all duration-500 group">
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6 group-hover:text-primary transition-colors">
                Jacobs Technion Institute at Cornell Tech
              </h3>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Advanced AI and technology research for therapeutic applications
              </p>
            </div>
            
            <div className="glass-card border-glass-border rounded-2xl p-8 lg:p-10 text-center hover:shadow-glass-shadow-hover transition-all duration-500 group">
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6 group-hover:text-primary transition-colors">
                Weill Cornell Medical College
              </h3>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Clinical research and medical validation of therapeutic protocols
              </p>
            </div>
            
            <div className="glass-card border-glass-border rounded-2xl p-8 lg:p-10 text-center hover:shadow-glass-shadow-hover transition-all duration-500 group">
              <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6 group-hover:text-primary transition-colors">
                Stanford University Medical School
              </h3>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Neuroscience research and evidence-based treatment development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Now Footer */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-heading-1 font-bold mb-6">
            Ready to Transform Your Mental Wellness?
          </h2>
          <p className="text-xl lg:text-2xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have improved their mental health with personalized music therapy
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              onClick={handleActionClick}
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl text-base px-8 py-4 h-auto flex items-center justify-center space-x-2"
            >
              <Headphones className="h-5 w-5" />
              <span>{user ? 'Start Free Session' : 'Sign Up for Free'}</span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleActionClick}
              className="border-2 border-white text-white hover:bg-white/10 font-semibold text-base px-8 py-4 h-auto flex items-center justify-center space-x-2"
            >
              <Activity className="h-5 w-5" />
              <span>{user ? 'View Research' : 'Learn More'}</span>
            </Button>
          </div>
        </div>
        
        {/* Admin Access moved into CTA footer */}
        <div className="text-center mt-12 pt-12 border-t border-white/20 max-w-5xl mx-auto">
          <Link 
            to="/admin" 
            className="text-sm text-white/60 hover:text-white/80 transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;