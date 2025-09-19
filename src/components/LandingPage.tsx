import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Globe, Zap, Shield, Bookmark, Music, BarChart3 } from 'lucide-react';
import tealAbstractBg from '@/assets/teal-abstract-bg.jpg';

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
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">NeuroTunes</div>
              <div className="text-sm text-muted-foreground">AI Music Therapy Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>Português</span>
            </div>
            <Button 
              onClick={handleSignup}
              className="bg-primary hover:bg-teal-600 text-primary-foreground"
            >
              Start Therapy
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">D</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-50 text-primary px-3 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI-Powered Music Therapy
              </div>
              
              <h1 className="text-5xl font-bold text-foreground leading-tight mb-6">
                Personalized Music <br />
                Therapy for <span className="text-primary">Mental <br />
                Wellness</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Evidence-based AI platform that creates personalized therapeutic music experiences to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              
              <p className="text-muted-foreground mb-8">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — a field with 50+ years of successful implementation in clinical settings.
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
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={tealAbstractBg} 
                  alt="Abstract therapeutic background" 
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <Card className="bg-background/95 backdrop-blur-sm border border-border shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-semibold text-foreground">Active Therapy Session</div>
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

      {/* Features Section */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Patented</h3>
              <p className="text-sm text-muted-foreground">Technology</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Evidence</h3>
              <p className="text-sm text-muted-foreground">Based Research</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">50+</h3>
              <p className="text-sm text-muted-foreground">Music Library</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Clinical</h3>
              <p className="text-sm text-muted-foreground">Insights Analytics</p>
            </div>
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