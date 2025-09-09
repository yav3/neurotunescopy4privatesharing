import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NeuralPositiveLandingProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export default function NeuralPositiveLanding({ onSignIn, onGetStarted }: NeuralPositiveLandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center p-6 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">NeuralPositive</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
        >
          <Button 
            variant="ghost" 
            onClick={onSignIn}
            className="text-white/90 hover:text-white hover:bg-white/10 border-white/20"
          >
            Sign In
          </Button>
          <Button 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-blue-500/25"
          >
            Get Started
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300 font-medium">Flow State — powered by Harmonic Flow Engine™</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
              NeuroTunes
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-200 font-light max-w-4xl mx-auto leading-relaxed mb-4">
              The Leading Evidence-Based Music Technology, Driving Outcomes Through Science
            </p>
            
            <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
              Patented closed-loop personalization designed to enhance your performance through scientifically-proven therapeutic music experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-blue-500/30 px-8 py-4 text-lg font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={onSignIn}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg font-medium backdrop-blur-sm"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-30 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Therapeutic Goals</h3>
                <p className="text-white/70 leading-relaxed">
                  Achieve focus, relaxation, mood enhancement, and better sleep through personalized music therapy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Evidence-Based</h3>
                <p className="text-white/70 leading-relaxed">
                  Built on rigorous research and validated through clinical studies for measurable outcomes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Personalized</h3>
                <p className="text-white/70 leading-relaxed">
                  Adaptive algorithms learn from your responses to optimize your unique therapeutic experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-20 px-6 py-16 bg-gradient-to-r from-blue-950/30 to-slate-900/30 backdrop-blur-xl border-y border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About NeuralPositive</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            NeuralPositive spun out of <strong className="text-white">Stanford University Medical School and partners from other leading US institutions and companies</strong>. 
            We've received significant funding, partnership, research collaboration, and ongoing support, positioning us at the forefront of therapeutic music technology.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 bg-black/20 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">NeuralPositive</span>
          </div>
          <p className="text-sm text-white/60">
            © 2025 NeuralPositive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}