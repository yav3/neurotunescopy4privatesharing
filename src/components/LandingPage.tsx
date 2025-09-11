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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white">NeuralPositive</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button variant="ghost" onClick={handleLogin} className="w-full sm:w-auto text-white/90 hover:text-white hover:bg-white/10 border-white/20">
            Sign In
          </Button>
          <Button onClick={handleSignup} className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-blue-500/25">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            NeuroTunes The Leading Evidence-Based Music Technology, Driving Outcomes Through Science
          </h1>
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            Patented closed-loop personalization designed to enhance your performance through scientifically-proven therapeutic music experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSignup} className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-blue-500/30">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" onClick={handleLogin} className="w-full sm:w-auto px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-30 container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="pt-8 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Therapeutic Goals</h3>
              <p className="text-white/70">
                Achieve focus, relaxation, mood enhancement, and better sleep through personalized music therapy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="pt-8 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Evidence-Based</h3>
              <p className="text-white/70">
                Built on rigorous research and validated through clinical studies for measurable outcomes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardContent className="pt-8 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">Personalized</h3>
              <p className="text-white/70">
                Adaptive algorithms learn from your responses to optimize your unique therapeutic experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-20 bg-gradient-to-r from-blue-950/30 to-slate-900/30 backdrop-blur-xl border-y border-white/10">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">About NeuralPositive</h2>
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              We spun out of <strong className="text-white">The Runway Postdoc program at the Jacobs Cornell Technion Institute at Cornell Tech</strong>, partners from other leading US institutions and companies. 
              We've received significant funding, partnership, research collaboration, and ongoing support, positioning us at the forefront of therapeutic music technology.
            </p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-white">NeuralPositive</span>
            </div>
            <p className="text-sm text-white/60">
              © 2025 NeuralPositive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}