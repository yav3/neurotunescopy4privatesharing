/* Professional Music Therapy AI Platform Landing Page */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WebAppWrapper, ResponsiveContainer } from '@/components/layout';

// Import nature images for therapy protocols - using placeholders temporarily
const stackedStones = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
const sereneLake = 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop';
const oceanWave = 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop';
const waterDropLeaf = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
const dewLeaf = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop';
const stonesWater = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop';
const forestLake = 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop';

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
    <WebAppWrapper>
      <div className="min-h-screen bg-gradient-dark-teal">
      {/* Navigation Header with Glass Morphism */}
        <nav className="backdrop-blur-xl bg-glass-dark-bg sticky top-0 z-50 border-b border-glass-dark-border shadow-glass-dark-shadow">
          <ResponsiveContainer>
            <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-white to-white/80 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white">NeuroTunes</h1>
                <p className="text-xs text-white/70 hidden sm:block">AI Music Therapy Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                asChild
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white shadow-glass-dark-shadow hover:bg-white/30 font-medium text-sm sm:text-base px-3 sm:px-4 border border-white/30"
              >
                <Link to="/goals">Start Therapy</Link>
              </Button>
              </div>
            </div>
          </ResponsiveContainer>
        </nav>

        {/* Hero Section with Dark Turquoise Gradient */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-dark-teal relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${sereneLake})` }}
            />
          </div>
          <ResponsiveContainer>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
            <div>
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 border border-white/30 text-white rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>AI-Powered Music Therapy</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
                Personalized AI Music Therapy for 
                <span className="text-white/90"> Wellness</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 leading-relaxed drop-shadow-sm">
                Evidence-based AI platform that creates personalized therapeutic music experiences 
                to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed drop-shadow-sm">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                a field with 50+ years of successful implementation in clinical settings.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white shadow-glass-dark-shadow hover:bg-white/30 font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 border border-white/30"
                >
                  <Link to="/goals">
                    <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Begin Therapy Session</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Stats with Glass Morphism */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm text-center p-3 sm:p-4 md:p-6 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-glass-dark-shadow">
                    <stat.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white mx-auto mb-2 sm:mb-3 md:mb-4" />
                    <div className="font-bold text-white text-sm sm:text-base mb-1 sm:mb-2">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/80 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm relative z-10 rounded-2xl border border-white/20 overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-300">
                <div 
                  className="w-full h-60 sm:h-72 md:h-80 flex items-center justify-center bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${stackedStones})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="text-center relative z-10">
                    <Music className="h-16 w-16 sm:h-20 sm:w-20 text-white mx-auto mb-4 drop-shadow-lg" />
                    <h3 className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg">Music Therapy Interface</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-6 md:p-8 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-base sm:text-lg mb-1">Active Therapy Session</h3>
                      <p className="text-xs sm:text-sm text-white/70">Cognitive Enhancement Protocol</p>
                    </div>
                    <div className="ml-4 sm:ml-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full opacity-10 blur-3xl"></div>
            </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Therapeutic Benefits - White Section for Contrast */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-white-section">
          <ResponsiveContainer>
            <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Science-Based Therapeutic Benefits
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes thousands of musical parameters to create personalized therapy sessions 
              that target specific mental health and cognitive goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {therapeuticBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:bg-white/90"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <benefit.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
            </div>
          </ResponsiveContainer>
        </section>

        {/* Featured Therapy Programs with Nature Images */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-dark-teal relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${forestLake})` }}
            />
          </div>
          <ResponsiveContainer>
            <div className="text-center mb-12 sm:mb-16 relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                Featured Therapy Programs
              </h2>
              <p className="text-base sm:text-lg text-white/90 drop-shadow-sm">
                Clinically-designed music therapy sessions for various conditions and goals
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-500 group-hover:-translate-y-2">
                 <div 
                  className="relative h-40 sm:h-48 overflow-hidden bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url(${dewLeaf})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <Heart className="h-12 w-12 text-white drop-shadow-lg relative z-10" />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <span className="bg-white/15 backdrop-blur-sm px-2 sm:px-3 py-1 border border-white/25 text-white rounded-full text-xs sm:text-sm font-medium">
                      Stress Reduction
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    Classical Sonatas for Stress Relief
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 mb-4 leading-relaxed">
                    Evidence-based classical music therapy featuring Chopin piano sonatas and gentle orchestral compositions.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/70">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      <span>258 Clinical Tracks</span>
                    </div>
                    <Link 
                      to="/goals"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-500 group-hover:-translate-y-2">
                 <div 
                  className="relative h-40 sm:h-48 overflow-hidden bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url(${waterDropLeaf})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <Brain className="h-12 w-12 text-white drop-shadow-lg relative z-10" />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <span className="bg-white/15 backdrop-blur-sm px-2 sm:px-3 py-1 border border-white/25 text-white rounded-full text-xs sm:text-sm font-medium">
                      Focus Enhancement
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    Morning Light Activation
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 mb-4 leading-relaxed">
                    Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/70">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      <span>FDA Researched</span>
                    </div>
                    <Link 
                      to="/goals"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-500 group-hover:-translate-y-2">
                 <div 
                  className="relative h-40 sm:h-48 overflow-hidden bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url(${oceanWave})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <Activity className="h-12 w-12 text-white drop-shadow-lg relative z-10" />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <span className="bg-white/15 backdrop-blur-sm px-2 sm:px-3 py-1 border border-white/25 text-white rounded-full text-xs sm:text-sm font-medium">
                      Non-Sleep Deep Rest
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    Delta Wave Induction
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 mb-4 leading-relaxed">
                    Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/70">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      <span>Sleep Lab Tested</span>
                    </div>
                    <Link 
                      to="/goals"
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-300"
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="text-center mt-8 sm:mt-12 relative z-10">
              <Button 
                asChild
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white shadow-glass-dark-shadow hover:bg-white/30 font-semibold text-sm sm:text-base px-6 sm:px-8 border border-white/30"
              >
                <Link to="/goals" className="inline-flex items-center space-x-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Explore All Programs</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Research Institutions - White Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-white-section">
          <ResponsiveContainer>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Leading Research Institutions
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Our platform is developed in collaboration with world-renowned medical and technology institutions
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:bg-white/90">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Jacobs Technion Institute at Cornell Tech
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Advanced AI research and computational music therapy algorithms
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:bg-white/90">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Stanford Medicine
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Clinical validation and evidence-based therapy protocols
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:bg-white/90">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Berklee College of Music
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Music therapy research and therapeutic composition expertise
                </p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* CTA Section - Now Footer with Dark Turquoise Gradient */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-dark-teal text-white relative overflow-hidden">
          {/* Background Pattern with reduced opacity */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${stonesWater})` }}
            />
          </div>
          <ResponsiveContainer>
            <div className="text-center relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                Ready to Transform Your Mental Wellness?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 drop-shadow-sm">
                Join thousands of users who have improved their mental health with personalized music therapy
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white shadow-glass-dark-shadow hover:bg-white/30 font-semibold text-sm sm:text-base px-6 sm:px-8 border border-white/30"
                >
                  <Link to="/goals" className="flex items-center justify-center space-x-2">
                    <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Start Free Session</span>
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold text-sm sm:text-base px-6 sm:px-8 backdrop-blur-sm"
                >
                  <Link to="/profile" className="flex items-center justify-center space-x-2">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>View Research</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Admin Access moved into CTA footer */}
            <div className="text-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20 relative z-10">
              <Link 
                to="/admin" 
                className="text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </ResponsiveContainer>
        </section>
      </div>
    </WebAppWrapper>
  );
};

export default Index;