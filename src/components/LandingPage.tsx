import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Brain, Target, Users, Waves, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Background Nature Images */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div 
          className="absolute top-0 left-0 w-1/3 h-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url(/lovable-uploads/alpha-mountain-lake.png)' }}
        />
        <div 
          className="absolute top-0 right-0 w-1/3 h-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url(/lovable-uploads/gamma-sunbeam-forest.png)' }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-1/2 h-1/3 bg-cover bg-center"
          style={{ backgroundImage: 'url(/lovable-uploads/delta-moonlit-lake.png)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 bg-white/20 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Waves className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <Sparkles className="h-4 w-4 text-blue-500 absolute -top-1 -right-1" />
          </div>
          <span className="text-2xl font-light text-gray-900 dark:text-white tracking-tight">NeuroTunes</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="ghost" 
            onClick={onLogin} 
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/10 text-gray-900 dark:text-white font-medium"
          >
            Sign In
          </Button>
          <Button 
            onClick={onSignup} 
            className="w-full sm:w-auto bg-blue-600/90 hover:bg-blue-600 dark:bg-blue-500/90 dark:hover:bg-blue-500 backdrop-blur-sm text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-thin text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
              Peak Performance
              <span className="block font-light bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Through Sound
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
              Evidence-based therapeutic music designed to enhance focus, creativity, and well-being through scientifically-proven neural entrainment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onSignup} 
                className="w-full sm:w-auto px-12 py-6 text-lg bg-blue-600/90 hover:bg-blue-600 dark:bg-blue-500/90 dark:hover:bg-blue-500 backdrop-blur-sm text-white font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLogin} 
                className="w-full sm:w-auto px-12 py-6 text-lg bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 text-gray-900 dark:text-white font-medium"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="group hover:scale-105 transition-all duration-500 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl">
            <CardContent className="pt-12 pb-8 text-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: 'url(/lovable-uploads/acoustic-sunset-field.png)' }}
              />
              <div className="relative z-10">
                <Target className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">Therapeutic Goals</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Achieve focus, relaxation, mood enhancement, and better sleep through personalized neural entrainment.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:scale-105 transition-all duration-500 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl">
            <CardContent className="pt-12 pb-8 text-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: 'url(/lovable-uploads/beta-waterfall.png)' }}
              />
              <div className="relative z-10">
                <Brain className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">Evidence-Based</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Built on rigorous neuroscience research and validated through clinical studies for measurable outcomes.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:scale-105 transition-all duration-500 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl">
            <CardContent className="pt-12 pb-8 text-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: 'url(/lovable-uploads/theta-misty-path.png)' }}
              />
              <div className="relative z-10">
                <Music className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">Personalized</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  AI-powered algorithms adapt to your unique neural patterns for optimal therapeutic experiences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 bg-white/5 dark:bg-black/5 backdrop-blur-xl border-y border-white/10 dark:border-white/5">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-thin text-gray-900 dark:text-white mb-8">About NeuroTunes</h2>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 font-light">
                NeuroTunes emerged from the prestigious <strong className="font-medium text-blue-600 dark:text-blue-400">Postdoctoral Runway Program at Jacobs Cornell Technion Institute (JCTI)</strong> at Cornell Tech. 
                We've received significant funding, partnership, research collaboration, and ongoing support from JCTI, positioning us at the forefront of therapeutic music technology.
              </p>
              <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-300">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-lg font-light">Trusted by researchers and practitioners worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-thin text-gray-900 dark:text-white mb-8 leading-tight">
              Ready to Transform
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-light">
                Your Performance?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 font-light leading-relaxed">
              Join thousands of users who have enhanced their cognitive performance through our evidence-based music therapy platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onSignup} 
                className="w-full sm:w-auto px-12 py-6 text-lg bg-blue-600/90 hover:bg-blue-600 dark:bg-blue-500/90 dark:hover:bg-blue-500 backdrop-blur-sm text-white font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onLogin} 
                className="w-full sm:w-auto px-12 py-6 text-lg bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/30 dark:border-white/20 text-gray-900 dark:text-white font-medium"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/5 dark:bg-black/5 backdrop-blur-xl border-t border-white/10 dark:border-white/5">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="relative">
                <Waves className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <Sparkles className="h-3 w-3 text-blue-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-light text-gray-900 dark:text-white">NeuroTunes</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-light">
              © 2025 NeuroTunes. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}