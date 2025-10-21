import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Play, CheckCircle, Brain, Heart, Activity, Zap, Sparkles } from 'lucide-react';
import { DynamicCodeReveal } from '@/components/DynamicCodeReveal';

// Hero background image
import heroBackground from '@/assets/hero-background-teal.png';

// Nature background images
import nature1 from '@/assets/nature-1.png';
import nature2 from '@/assets/nature-2.png'; 
import nature3 from '@/assets/nature-3.png';
import nature4 from '@/assets/nature-4.png';

// Therapeutic intervention images
import therapyStonesWater from '@/assets/therapy-stones-water.png';
import therapyZenStones from '@/assets/therapy-zen-stones.png';
import therapyDewdropLeaf from '@/assets/therapy-dewdrop-leaf.png';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const AnimatedFluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let time = 0;
    const waves = [];
    
    // Create wave objects
    for (let i = 0; i < 3; i++) {
      waves.push({
        amplitude: 30 + i * 20,
        frequency: 0.02 + i * 0.01,
        phase: i * Math.PI / 3,
        speed: 0.02 + i * 0.01,
        offset: i * 50
      });
    }
    
    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect();
      
      // Clear canvas with Liquid Glass gradient (pearl grey & blue-green)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(232, 238, 240, 0.05)');    // Iridescent Highlight
      gradient.addColorStop(0.4, 'rgba(110, 197, 197, 0.08)');  // Cyan Core
      gradient.addColorStop(1, 'rgba(0, 77, 91, 0.06)');        // Deep Aquatic
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw flowing waves (Liquid Glass style - pearl and teal)
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(110, 197, 197, ${0.15 - index * 0.04})`; // Cyan-green waves
        ctx.lineWidth = 1.5;
        
        for (let x = 0; x <= width; x += 2) {
          const y = height / 2 + 
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * (wave.amplitude * 0.3) +
            wave.offset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });
      
      time += 1;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ background: 'transparent' }}
    />
  );
};

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

  const handleStartTherapy = () => {
    navigate('/goals');
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-liquid-glass)] text-gray-900 overflow-x-hidden relative" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', background: 'var(--gradient-liquid-pearl)' }}>
      {/* Ripple Wave Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 animate-ripple-wave" style={{
        background: 'radial-gradient(circle at 50% 50%, hsl(var(--liquid-cyan-core) / 0.08) 0%, transparent 70%)',
        mixBlendMode: 'overlay'
      }} />
      
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-[hsl(var(--liquid-cyan-core)/0.2)] px-6 py-6" style={{ backdropFilter: 'blur(40px) saturate(120%)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Plus className="w-5 h-5 text-white font-medium" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">NeuralPositive presents +NeuroTunes</div>
              <div className="text-sm text-teal-600 font-medium">Therapeutic Music Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button
                onClick={() => navigate('/neuralpositive/about')}
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => navigate('/neuralpositive/story')}
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Our Story
              </button>
              <button
                onClick={() => navigate('/neuralpositive/research')}
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                Research
              </button>
            </nav>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-lg">🌐</span>
              <span className="text-lg">🇺🇸</span>
              <span className="font-medium">English</span>
            </div>
            <Button
              onClick={handleStartTherapy}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Start Therapy
            </Button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-medium shadow-lg">
              D
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroBackground} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Animated Background Overlay */}
        <div className="absolute inset-0">
          <AnimatedFluidBackground />
        </div>
        
        {/* Floating Glass Morphism Elements with Gentle Float Animation */}
        <div className="absolute top-20 left-10 opacity-60 animate-gentle-float" style={{ animationDelay: '0s' }}>
          <img 
            src={nature1} 
            alt="" 
            className="w-32 h-32 rounded-3xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-700"
          />
        </div>
        
        <div className="absolute top-40 right-16 opacity-50 animate-gentle-float" style={{ animationDelay: '2s' }}>
          <img 
            src={nature2} 
            alt="" 
            className="w-40 h-40 rounded-3xl shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-700"
          />
        </div>
        
        <div className="absolute bottom-32 left-20 opacity-70 animate-gentle-float" style={{ animationDelay: '4s' }}>
          <img 
            src={nature3} 
            alt="" 
            className="w-36 h-36 rounded-3xl shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-700"
          />
        </div>
        
        <div className="absolute bottom-20 right-32 opacity-55 animate-gentle-float" style={{ animationDelay: '6s' }}>
          <img 
            src={nature4} 
            alt="" 
            className="w-44 h-44 rounded-3xl shadow-2xl transform -rotate-6 hover:-rotate-12 transition-transform duration-700"
          />
        </div>
        
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-thin leading-tight mb-8">
            Personalized AI Music<br />
            Therapy for <span className="text-white/90 font-normal">Wellness</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Evidence-based AI platform that creates personalized therapeutic 
            interventions using neuroscience and music therapy principles
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 text-base font-medium rounded-xl shadow-2xl shadow-teal-500/25 hover:shadow-teal-400/30 transition-all duration-300"
            >
              Begin Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-teal-300 text-gray-800 hover:bg-teal-50 hover:border-teal-400 px-8 py-4 text-base font-medium rounded-xl transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Therapy Programs Section */}
      <section className="relative py-24" style={{ background: 'linear-gradient(180deg, hsl(var(--liquid-pearl-highlight)), hsl(0, 0%, 100%))' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-thin text-gray-900 mb-6">
              Therapeutic <span className="font-light bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Interventions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Clinically validated protocols for specific mental health conditions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group bg-white/90 backdrop-blur-xl border border-teal-200/30 overflow-hidden hover:bg-white/95 transition-all duration-500 shadow-lg hover:shadow-teal-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={therapyStonesWater} 
                  alt="Anxiety relief therapy - smooth stones by peaceful water" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-500/20 backdrop-blur-sm text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-300/50">
                    Anxiety Relief
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-normal text-gray-900 mb-3">Parasympathetic Activation</h3>
                <p className="text-gray-700 mb-4 leading-relaxed font-light">
                  Classical compositions engineered to reduce cortisol levels and activate 
                  natural relaxation responses through therapeutic frequencies.
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                  <span>Clinical Validation</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group bg-white/90 backdrop-blur-xl border border-teal-200/30 overflow-hidden hover:bg-white/95 transition-all duration-500 shadow-lg hover:shadow-teal-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={therapyDewdropLeaf} 
                  alt="Energy and mood enhancement - dewdrop on vibrant teal leaf" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500/20 backdrop-blur-sm text-orange-700 px-3 py-1 rounded-full text-sm font-medium border border-orange-300/50">
                    Energy & Mood
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-normal text-gray-900 mb-3">Dopaminergic Enhancement</h3>
                <p className="text-gray-700 mb-4 leading-relaxed font-light">
                  Targeted interventions for major depressive disorder using 
                  neuroplasticity-promoting frequency patterns.
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  <span>Peer Reviewed</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group bg-white/90 backdrop-blur-xl border border-teal-200/30 overflow-hidden hover:bg-white/95 transition-all duration-500 shadow-lg hover:shadow-teal-100">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={therapyZenStones} 
                  alt="Deep rest and meditation - zen stones stacked for balance and tranquility" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-500/20 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-300/50">
                    Deep Rest
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-normal text-gray-900 mb-3">Delta Wave Induction</h3>
                <p className="text-gray-700 mb-4 leading-relaxed font-light">
                  Precision frequencies designed to synchronize brainwaves for 
                  enhanced sleep quality and cognitive recovery.
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  <span>EEG Validated</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-4 text-base font-medium rounded-xl shadow-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Technology Section with Dynamic Code Reveal */}
      <section className="relative py-32" style={{ background: 'linear-gradient(135deg, hsl(var(--liquid-aquatic-deep)), hsl(var(--liquid-glass-shadow)))' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-thin text-white mb-8">
              AI-Powered <span className="font-light bg-gradient-to-r from-[hsl(var(--liquid-cyan-core))] to-[hsl(var(--liquid-pearl-highlight))] bg-clip-text text-transparent">Neural Architecture</span>
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto font-light leading-relaxed">
              Advanced machine learning algorithms analyze your responses in real-time
            </p>
          </div>
          
          <DynamicCodeReveal 
            codeBlocks={[
              `// Real-time therapeutic recommendation engine
const analyzeUserState = async (biometrics) => {
  const neuralPattern = await model.predict({
    heartRate: biometrics.hr,
    stressLevel: biometrics.cortisol,
    timeOfDay: getCurrentPhase()
  });
  
  return selectOptimalIntervention(neuralPattern);
};`,
              `// Adaptive music therapy protocol
const generateTherapeuticPlaylist = (userProfile) => {
  const therapeuticGoal = userProfile.currentGoal;
  const preferences = userProfile.musicPreferences;
  
  return ai.curate({
    frequency: therapeuticGoal.targetFrequency,
    tempo: calculateOptimalBPM(userProfile),
    genre: preferences.filter(matchesTherapeuticCriteria)
  });
};`,
              `// Personalized intervention tracking
const trackTherapeuticOutcome = async (session) => {
  const response = await measureUserResponse({
    preSessionState: session.baseline,
    postSessionState: session.current,
    intervention: session.protocol
  });
  
  await updateLearningModel(response);
  return generateNextRecommendation(response);
};`
            ]} 
          />
        </div>
      </section>

      {/* Research Section */}
      <section className="relative py-32" style={{ background: 'var(--gradient-liquid-glass)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-thin text-gray-900 mb-8">
              Research <span className="font-light bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Partnerships</span>
            </h2>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed">
              Collaborating with leading institutions in neuroscience and technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Card className="p-10 text-center bg-white/95 backdrop-blur-xl border border-teal-200/40 hover:bg-white/100 transition-all duration-300 group shadow-lg">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl backdrop-blur-sm group-hover:from-teal-200 group-hover:to-cyan-200 transition-all duration-300">
                <div className="text-2xl font-bold text-teal-700">CT</div>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-6">Cornell Tech</h3>
              <p className="text-gray-700 font-light text-lg leading-relaxed">
                AI research for therapeutic applications
              </p>
            </Card>
            
            <Card className="p-10 text-center bg-white/95 backdrop-blur-xl border border-teal-200/40 hover:bg-white/100 transition-all duration-300 group shadow-lg">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl backdrop-blur-sm group-hover:from-teal-200 group-hover:to-cyan-200 transition-all duration-300">
                <div className="text-2xl font-bold text-teal-700">WC</div>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-6">Weill Cornell</h3>
              <p className="text-gray-700 font-light text-lg leading-relaxed">
                Clinical validation and medical research
              </p>
            </Card>
            
            <Card className="p-10 text-center bg-white/95 backdrop-blur-xl border border-teal-200/40 hover:bg-white/100 transition-all duration-300 group shadow-lg">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl backdrop-blur-sm group-hover:from-teal-200 group-hover:to-cyan-200 transition-all duration-300">
                <div className="text-2xl font-bold text-teal-700">SM</div>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-6">Stanford Medical</h3>
              <p className="text-gray-700 font-light text-lg leading-relaxed">
                Neuroscience and intervention development
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32" style={{ background: 'linear-gradient(135deg, hsl(var(--liquid-emerald-edge)), hsl(var(--liquid-cyan-core)), hsl(var(--liquid-aquatic-deep)))' }}>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-7xl font-thin text-white mb-10">
            Transform Your <span className="font-light text-white">Wellness</span>
          </h2>
          <p className="text-2xl text-white/90 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Join the future of personalized mental health through evidence-based music therapy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-12 py-5 text-xl font-medium rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Enter Code
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleLogin}
              className="border-2 border-teal-300 text-gray-800 hover:bg-teal-50 hover:border-teal-400 px-12 py-5 text-xl font-medium rounded-xl transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-teal-200/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">NeuralPositive presents +NeuroTunes</div>
                  <div className="text-gray-600 text-xs">by NeuralPositive</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Evidence-based AI music therapy for mental wellness.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => navigate('/neuralpositive/about')}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    About NeuralPositive
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/neuralpositive/story')}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/neuralpositive/research')}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    Research
                  </button>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={handleStartTherapy}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    Start Therapy
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogin}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-teal-200/20 text-center">
            <p className="text-sm text-gray-600">
              © 2025 NeuralPositive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}