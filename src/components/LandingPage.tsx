import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Globe, Zap, Shield, Bookmark, Music, BarChart3, Brain, Heart, Activity, Play, CheckCircle, Plus } from 'lucide-react';
import animatedTealBg from '@/assets/animated-teal-bg.jpg';
import stressReliefBg from '@/assets/stress-relief-bg.jpg';
import energyBoostBg from '@/assets/energy-boost-bg.jpg';
import deepRestBg from '@/assets/deep-rest-bg.jpg';
import anxietySupportBg from '@/assets/anxiety-support-bg.jpg';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/');
    onLogin();
  };

  const handleSignup = () => {
    navigate('/');
    onSignup();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary-foreground" strokeWidth={1} />
            </div>
            <div>
              <div className="text-xl font-normal text-foreground">NeuroTunes</div>
              <div className="text-sm text-muted-foreground">AI Music Therapy Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-lg font-normal text-foreground">
              NeuralPositive
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-primary px-3 py-2 rounded-full text-sm font-normal mb-6">
                <Plus className="w-4 h-4" strokeWidth={1} />
                AI-Powered Music Therapy
              </div>
              
              <h1 className="text-5xl font-normal text-foreground leading-tight mb-6">
                Music Wellness driven by <br />
                AI <span className="text-primary">Personalization</span>
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Evidence-based and crafted by musicians, neuroscientists, and musicians. Powered by cutting edge AI.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleSignup}
                className="bg-primary hover:bg-teal-600 text-primary-foreground px-6 py-3 text-base inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="10" cy="10" r="3" fill="currentColor"/>
                </svg>
                Begin Therapy Session
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"/>
                </svg>
              </Button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src={animatedTealBg} 
                alt="Flowing therapeutic background with smooth animation" 
                className="w-full h-80 object-cover animate-[float_6s_ease-in-out_infinite]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-transparent animate-[shimmer-overlay_8s_ease-in-out_infinite]"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <Card className="bg-background/95 backdrop-blur-sm border border-border shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-normal text-foreground">Active Therapy Session</div>
                        <div className="text-sm text-muted-foreground">Cognitive Enhancement Protocol</div>
                      </div>
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Therapy Programs Section */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-normal text-foreground mb-6">Featured Therapy Programs</h2>
          <p className="text-xl text-muted-foreground mb-16">
            Clinically-designed music therapy sessions for various conditions and goals
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={anxietySupportBg} 
                  alt="Calming water droplets on leaf for anxiety support" 
                  className="w-full h-48 object-cover"
                  style={{ filter: 'none' }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Anxiety Support
                  </span>
                </div>
              </div>
              <CardContent className="p-6 text-left">
                <h3 className="text-xl font-normal text-foreground mb-3">Anxiety Support</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Evidence-based classical music therapy featuring Chopin piano sonatas and 
                  gentle orchestral compositions. Designed to reduce cortisol levels and 
                  activate parasympathetic nervous system responses for deep relaxation.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Play className="w-4 h-4" />
                  <span>258 Clinical Tracks</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={energyBoostBg} 
                  alt="Sunrise lake reflection for energy boost therapy" 
                  className="w-full h-48 object-cover"
                  style={{ filter: 'none' }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Energy Boost
                  </span>
                </div>
              </div>
              <CardContent className="p-6 text-left">
                <h3 className="text-xl font-normal text-foreground mb-3">Energy Boost</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Specifically designed for patients with major depressive disorder (MDD), 
                  anxiety disorders, and chronic pain using classical compositions enhanced 
                  with therapeutic frequencies
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>FDA Researched</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={deepRestBg} 
                  alt="Zen stones for deep rest therapy" 
                  className="w-full h-48 object-cover"
                  style={{ filter: 'none' }}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Non-Sleep Deep Rest
                  </span>
                </div>
              </div>
              <CardContent className="p-6 text-left">
                <h3 className="text-xl font-normal text-foreground mb-3">Delta Wave Induction</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Scientifically tuned frequencies to synchronize brainwaves and promote 
                  deep, restorative sleep
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sleep Lab Tested</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            size="lg" 
            onClick={handleSignup}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base inline-flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Explore All Programs
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z"/>
            </svg>
          </Button>
        </div>
      </section>

      {/* Leading Research Institutions Section */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-normal text-foreground mb-6">Leading Research Institutions</h2>
          <p className="text-xl text-muted-foreground mb-16">
            Our platform is developed in collaboration with world-renowned medical and technology institutions
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <h3 className="text-xl font-normal text-foreground mb-4">Jacobs Technion Institute at Cornell Tech</h3>
              <p className="text-muted-foreground">
                Advanced AI and technology research for therapeutic applications
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <h3 className="text-xl font-normal text-foreground mb-4">Weill Cornell Medical College</h3>
              <p className="text-muted-foreground">
                Clinical research and medical validation of therapeutic protocols
              </p>
            </Card>
            
            <Card className="p-8 text-center">
              <h3 className="text-xl font-normal text-foreground mb-4">Stanford University Medical School</h3>
              <p className="text-muted-foreground">
                Neuroscience research and evidence-based treatment development
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-normal text-primary-foreground mb-6">
            Ready to Transform Your Mental Wellness?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of users who have improved their mental health with personalized music therapy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-background text-primary hover:bg-background/90 px-8 py-3 text-base inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="3" fill="currentColor"/>
              </svg>
              Start Free Session
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleLogin}
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 text-base"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-foreground font-semibold">NeuroTunes</div>
              <div className="text-muted-foreground text-sm">© 2025 NeuroTunes. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}