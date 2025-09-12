import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3,10 Q6,4 9,10 T15,10" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">NeuroTunes</div>
              <div className="text-sm text-gray-600">AI Music Therapy Platform</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleLogin}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Personal Music
            </Button>
            <Button 
              onClick={handleSignup}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Start Therapy
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-blue-500 font-medium mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3,10 Q6,4 9,10 T15,10" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                AI-Powered Music Therapy
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Personalized AI Music Therapy
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Evidence-based AI platform that creates personalized therapeutic music experiences to support mental health, cognitive enhancement, and emotional well-being.
              </p>
              
              <p className="text-gray-500 mb-8">
                Based on evidence from 15K+ studies, utilizing the science of music therapy — a field with 50+ years of successful implementation in clinical settings.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleSignup}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <circle cx="10" cy="10" r="3" fill="currentColor"/>
                </svg>
                Begin Therapy Session →
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-blue-500 rounded-2xl p-8 text-white relative overflow-hidden">
                <svg className="w-full h-32 mb-4" viewBox="0 0 400 100">
                  <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50" stroke="white" strokeWidth="3" fill="none" opacity="0.8"/>
                  <path d="M0,50 Q25,10 50,50 T100,50 T150,50 T200,50 T250,50 T300,50 T350,50 T400,50" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
                </svg>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-lg font-semibold">Active Therapy Session</div>
                  <div className="text-blue-100">Cognitive Enhancement Protocol</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science-Based Benefits */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Science-Based Therapeutic Benefits</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto">
            Our AI analyzes thousands of musical parameters to create personalized therapy sessions that target specific mental health and cognitive goals.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 32 32" fill="currentColor">
                    <circle cx="16" cy="16" r="2" fill="currentColor"/>
                    <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8"/>
                    <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Cognitive Enhancement</h3>
                <p className="text-gray-600">
                  Scientifically-backed music selections to improve focus, memory, and mental clarity
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16,8 C20,8 23,11 23,15 C23,19 20,22 16,22 C12,22 9,19 9,15 C9,11 12,8 16,8 Z M16,12 C14,12 13,13 13,15 C13,17 14,18 16,18 C18,18 19,17 19,15 C19,13 18,12 16,12 Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Emotional Regulation</h3>
                <p className="text-gray-600">
                  AI-curated playlists designed to balance mood and reduce stress responses
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M6,16 L10,10 L14,22 L18,6 L22,18 L26,12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Physiological Benefits</h3>
                <p className="text-gray-600">
                  Evidence-based frequencies that promote relaxation and cardiovascular health
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Therapy Programs</h2>
            <p className="text-xl text-gray-600">
              Clinically-designed music therapy sessions for various conditions and goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                <svg className="w-full h-20 text-white/30" viewBox="0 0 300 60">
                  <path d="M0,30 Q30,10 60,30 T120,30 T180,30 T240,30 T300,30" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Stress Reduction
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Peaceful Waters Protocol</h3>
                <p className="text-gray-600 mb-4">
                  Immersive spatial audio combined with nature sounds using our patented personalization methods based on neuroscience, neurology, and music therapy to reduce cortisol levels and promote calm
                </p>
                <div className="flex items-center text-sm text-blue-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Clinically Validated
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="relative h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Focus Enhancement
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Morning Light Activation</h3>
                <p className="text-gray-600 mb-4">
                  Specifically designed for patients with major depressive disorder (MDD), anxiety disorders, and chronic pain using classical compositions enhanced with therapeutic frequencies
                </p>
                <div className="flex items-center text-sm text-blue-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  FDA Researched
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden shadow-lg border-0">
              <div className="relative h-48 bg-blue-500 flex items-center justify-center">
                <svg className="w-full h-20 text-white" viewBox="0 0 300 60">
                  <path d="M0,30 Q40,15 80,30 T160,30 T240,30 T300,30" stroke="currentColor" strokeWidth="3" fill="none"/>
                  <path d="M0,30 Q20,20 40,30 T80,30 T120,30 T160,30 T200,30 T240,30 T280,30 T300,30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
                </svg>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Non-Sleep Deep Rest
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Delta Wave Induction</h3>
                <p className="text-gray-600 mb-4">
                  Scientifically tuned frequencies to synchronize brainwaves and promote deep, restorative sleep
                </p>
                <div className="flex items-center text-sm text-blue-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Sleep Lab Tested
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleSignup}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3,10 Q6,4 9,10 T15,10" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              Explore All Programs →
            </Button>
          </div>
        </div>
      </section>

      {/* Research Institutions */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Leading Research Institutions</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-4xl mx-auto">
            Our platform is developed in collaboration with world-renowned medical and technology institutions
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Jacobs Technion Institute at Cornell Tech
                </h3>
                <p className="text-gray-600">
                  Advanced AI and technology research for therapeutic applications
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Weill Cornell Medical College
                </h3>
                <p className="text-gray-600">
                  Clinical research and medical validation of therapeutic protocols
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gray-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Stanford University Medical School
                </h3>
                <p className="text-gray-600">
                  Neuroscience research and evidence-based treatment development
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Mental Wellness?</h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of users who have improved their mental health with personalized music therapy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleSignup}
              className="bg-white text-blue-500 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="3" fill="currentColor"/>
              </svg>
              Start Free Session
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6,16 L10,10 L14,22 L18,6 L22,18 L26,12" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              View Research
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2,8 Q4,4 6,8 T10,8 T14,8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold">NeuroTunes</div>
              <div className="text-gray-400 text-sm">AI Music Therapy Platform</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 NeuroTunes. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}