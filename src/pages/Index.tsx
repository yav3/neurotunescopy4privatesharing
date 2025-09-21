/* Professional Music Therapy AI Platform Landing Page */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WebAppWrapper, ResponsiveContainer } from '@/components/layout';

// Import nature images for therapy protocols
import stackedStones from '@/assets/stacked-stones.png';
import sereneLake from '@/assets/serene-lake.png';
import oceanWave from '@/assets/ocean-wave.png';
import waterDropLeaf from '@/assets/water-drop-leaf.png';
import dewLeaf from '@/assets/dew-leaf.png';
import stonesWater from '@/assets/stones-water.png';
import mountainLake from '@/assets/mountain-lake.png';

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
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white relative overflow-hidden">
        {/* Additional brand texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/20 to-transparent"></div>
        <div className="relative z-10">
        {/* Navigation Header with Enhanced Glass Morphism */}
        <nav className="glass-pearlized sticky top-0 z-50">
          <ResponsiveContainer>
            <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                <div className="text-white font-light text-2xl sm:text-3xl leading-none">+</div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-sf font-light text-white text-shadow-dramatic">NeuroTunes</h1>
                <p className="text-sm text-white/70 hidden sm:block font-sf">AI Music Therapy Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                asChild
                size="sm"
                className="glass-pearlized text-white shadow-glass-dark-shadow hover:bg-white/30 font-medium text-sm sm:text-base px-3 sm:px-4 border border-white/30 transition-all duration-300"
              >
                <Link to="/goals">Start Therapy</Link>
              </Button>
              </div>
            </div>
          </ResponsiveContainer>
        </nav>

        {/* Hero Section with Brand Gradient */}
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-brand-900 to-brand-500 relative overflow-hidden">
          {/* Abstract floating spheres */}
          <div className="floating-sphere floating-sphere-lg top-20 right-20 opacity-30"></div>
          <div className="floating-sphere floating-sphere-md top-40 left-10 opacity-20"></div>
          <div className="floating-sphere floating-sphere-sm bottom-32 right-1/3 opacity-25"></div>
          <div className="floating-sphere floating-sphere-md bottom-20 left-1/4 opacity-15"></div>
          
          {/* Enhanced Background Pattern with Opacity */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${mountainLake})` }}
            />
          </div>
          {/* Brand texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 to-brand-500/60"></div>
          <ResponsiveContainer>
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center relative z-10">
            <div className="space-y-8">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 border border-white/30 text-white rounded-full text-sm sm:text-base font-medium flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>AI-Powered Music Therapy</span>
                </div>
              </div>
              <h1 className="text-display-1 text-white drop-shadow-lg mb-6">
                AI-Personalized, Closed Loop Wellness 
                <span className="text-brand-100 block mt-2"> Meets Beautiful Music</span>
              </h1>
              <div className="space-y-6">
                <p className="text-body-large text-white/95 drop-shadow-sm max-w-2xl">
                  Evidence-based AI platform that creates personalized therapeutic music experiences 
                  to support mental health, cognitive enhancement, and emotional well-being.
                </p>
                <p className="text-body text-white/85 drop-shadow-sm max-w-2xl">
                  Based on evidence from 15K+ studies, utilizing the science of music therapy — 
                  a field with 50+ years of successful implementation in clinical settings.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Button 
                  asChild
                  size="lg"
                  className="bg-brand-400 hover:bg-brand-300 text-brand-900 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center space-x-2 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-all duration-300"
                >
                  <Link to="/goals">
                    <Headphones className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>Begin Therapy Session</span>
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                </Button>
              </div>
              
              {/* Stats with Enhanced Glass Morphism */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm text-center p-4 sm:p-6 md:p-8 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 shadow-glass-dark-shadow">
                    <stat.icon className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white mx-auto mb-3 sm:mb-4 md:mb-5" />
                    <div className="font-bold text-white text-base sm:text-lg mb-2">{stat.value}</div>
                    <div className="text-sm sm:text-base text-white/80 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm relative z-10 rounded-2xl border border-white/20 overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-300">
                <div 
                  className="w-full h-60 sm:h-72 md:h-80 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${stackedStones})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 relative z-10">
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
            <h2 className="text-heading-1 text-foreground mb-4">
              Science-Based Therapeutic Benefits
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes thousands of musical parameters to create personalized therapy sessions 
              that target specific mental health and cognitive goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {therapeuticBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:bg-white/90 card-hover-lift card-animate-up card-stagger-${index + 1}`}
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

        {/* Featured Therapy Programs with Brand Design */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-brand-500 to-brand-600 relative overflow-hidden">
          {/* Abstract floating elements */}
          <div className="floating-sphere floating-sphere-md top-10 right-16 opacity-20"></div>
          <div className="floating-sphere floating-sphere-sm top-1/2 left-8 opacity-15"></div>
          <div className="floating-sphere floating-sphere-lg bottom-16 right-1/4 opacity-25"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${mountainLake})` }}
            />
          </div>
          <ResponsiveContainer>
            <div className="text-center mb-12 sm:mb-16 relative z-10">
              <h2 className="text-heading-1 text-white mb-4 drop-shadow-lg">
                Featured Therapy Programs
              </h2>
              <p className="text-body text-white/90 drop-shadow-sm">
                Clinically-designed music therapy sessions for various conditions and goals
              </p>
            </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            <div className="group cursor-pointer card-animate-up card-stagger-1">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-500 card-hover-lift">
                 <div 
                  className="relative h-40 sm:h-48 overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${dewLeaf})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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

            <div className="group cursor-pointer card-animate-up card-stagger-2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-500 card-hover-lift">
                 <div 
                  className="relative h-40 sm:h-48 overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${waterDropLeaf})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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

            <div className="group cursor-pointer card-animate-up card-stagger-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:shadow-glass-dark-shadow transition-all duration-500 card-hover-lift">
                 <div 
                  className="relative h-40 sm:h-48 overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: `url(${oceanWave})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:bg-white/90 card-hover-lift card-animate-up card-stagger-1">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Jacobs Technion Institute at Cornell Tech
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Advanced AI research and computational music therapy algorithms
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:bg-white/90 card-hover-lift card-animate-up card-stagger-2">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Weill Cornell Medical College
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Clinical research and medical validation of therapeutic protocols
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:bg-white/90 card-hover-lift card-animate-up card-stagger-3">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                  Stanford University Medical School
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Neuroscience research and evidence-based treatment development
                </p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* CTA Section - Bottom Footer with Brand Gradient */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-brand-600 to-brand-700 text-white relative overflow-hidden">
          {/* Enhanced Background Pattern with turquoise tint */}
          <div className="absolute inset-0 opacity-8">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${stonesWater})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-800/20 via-transparent to-brand-600/10"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-8 right-8 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
          
          <ResponsiveContainer>
            {/* Admin Access in enhanced footer */}
            <div className="text-center relative z-10">
              <Link 
                to="/admin" 
                className="text-sm text-white/50 hover:text-white/80 transition-all duration-300 font-medium backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20"
              >
                Admin Portal
              </Link>
            </div>
          </ResponsiveContainer>
         </section>
         </div>
       </div>
     </WebAppWrapper>
  );
};

export default Index;