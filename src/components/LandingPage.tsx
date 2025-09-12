import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Heart, Target, Music, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/30 via-purple-800/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Floating Art Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10 animate-pulse">
        <img src="/lovable-uploads/568fe397-023c-4d61-816d-837de0948919.png" alt="" className="w-full h-full object-cover rounded-full blur-sm" />
      </div>
      <div className="absolute top-40 right-20 w-24 h-24 opacity-15 animate-pulse delay-1000">
        <img src="/lovable-uploads/1da41b51-e4bb-41a7-9015-6e45aebb523c.png" alt="" className="w-full h-full object-cover rounded-lg blur-sm" />
      </div>
      <div className="absolute bottom-40 left-20 w-28 h-28 opacity-10 animate-pulse delay-2000">
        <img src="/lovable-uploads/54738be0-6688-4c13-b54a-05591ce054f7.png" alt="" className="w-full h-full object-cover rounded-full blur-sm" />
      </div>
      <div className="absolute bottom-20 right-16 w-36 h-36 opacity-10 animate-pulse delay-500">
        <img src="/lovable-uploads/68343a15-d97c-4dd6-a85f-a0806d963bb7.png" alt="" className="w-full h-full object-cover rounded-lg blur-sm" />
      </div>
      
      {/* Animated Background Sprites */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-400/20 animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full bg-purple-400/30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 rounded-full bg-indigo-400/15 animate-ping delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-cyan-400/25 animate-pulse delay-500"></div>
      </div>
      
      {/* Enhanced Navigation with Glassmorphism */}
      <nav className="relative z-50 flex justify-between items-center p-6 bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            NeuralPositive
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            onClick={handleLogin} 
            className="w-full sm:w-auto text-white/90 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg shadow-black/10"
          >
            Sign In
          </Button>
          <Button 
            onClick={handleSignup} 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-blue-500/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started
          </Button>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative z-40 container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Hero Background Glass Card */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/30 mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
                <Music className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              NeuroTunes The Leading Evidence-Based Music Technology, Driving Outcomes Through Science
            </h1>
            
            <p className="text-xl text-blue-100/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Patented closed-loop personalization designed to enhance your performance through scientifically-proven therapeutic music experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleSignup} 
                className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white border-0 shadow-2xl shadow-blue-500/40 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleLogin} 
                className="w-full sm:w-auto px-8 py-4 text-lg border-white/30 text-white hover:bg-white/15 hover:border-white/50 backdrop-blur-xl shadow-lg shadow-black/20 transform hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
          </div>
          
          {/* Floating Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 shadow-lg shadow-black/10">
              <Target className="w-4 h-4 inline mr-2" />
              Evidence-Based
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 shadow-lg shadow-black/10">
              <Brain className="w-4 h-4 inline mr-2" />
              AI-Powered
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 shadow-lg shadow-black/10">
              <Heart className="w-4 h-4 inline mr-2" />
              Therapeutic
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-30 container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group text-center bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-2">
            <CardContent className="pt-8 pb-6 relative">
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <img src="/lovable-uploads/a59ca21a-a07c-448b-bc2f-b1470dc870db.png" alt="" className="w-12 h-12 object-cover rounded-lg" />
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Therapeutic Goals</h3>
              <p className="text-white/80 leading-relaxed">
                Achieve focus, relaxation, mood enhancement, and better sleep through personalized music therapy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group text-center bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2">
            <CardContent className="pt-8 pb-6 relative">
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <img src="/lovable-uploads/1c80f044-2499-45b2-9ed4-69da791f15e4.png" alt="" className="w-12 h-12 object-cover rounded-lg" />
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Evidence-Based</h3>
              <p className="text-white/80 leading-relaxed">
                Built on rigorous research and validated through clinical studies for measurable outcomes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group text-center bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/20 transform hover:-translate-y-2">
            <CardContent className="pt-8 pb-6 relative">
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <img src="/lovable-uploads/0032890f-a22d-4907-8823-9b8b6c2f8221.png" alt="" className="w-12 h-12 object-cover rounded-lg" />
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personalized</h3>
              <p className="text-white/80 leading-relaxed">
                Adaptive algorithms learn from your responses to optimize your unique therapeutic experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="relative z-20 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/40 backdrop-blur-2xl border-y border-white/10 shadow-inner shadow-black/20">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/30">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
                About NeuralPositive
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                We spun out of <strong className="text-blue-200">The Runway Postdoc program at the Jacobs Cornell Technion Institute at Cornell Tech</strong>, partners from other leading US institutions and companies. 
                We've received significant funding, partnership, research collaboration, and ongoing support, positioning us at the forefront of therapeutic music technology.
              </p>
              
              {/* Decorative elements */}
              <div className="flex justify-center gap-8 mt-8 opacity-60">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 animate-pulse delay-500"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-500 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-2xl border-t border-white/10 shadow-2xl shadow-black/40">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                NeuralPositive
              </span>
            </div>
            <p className="text-sm text-white/70">
              © 2025 NeuralPositive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}