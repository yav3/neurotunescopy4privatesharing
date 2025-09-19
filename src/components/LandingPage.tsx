import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Play, CheckCircle, Brain, Heart, Activity, Zap } from 'lucide-react';

// Abstract fluid glass morphism images
const fluidShape1 = '/src/assets/fluid-shape-1.jpg'; // Image 1
const fluidShape2 = '/src/assets/fluid-shape-2.jpg'; // Image 2  
const fluidShape3 = '/src/assets/fluid-shape-3.jpg'; // Image 3

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
      
      // Clear canvas with gradient background (pale, glassmorphic colors)
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(0.5, 'rgba(240, 253, 244, 0.05)');
      gradient.addColorStop(1, 'rgba(236, 254, 255, 0.04)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw flowing waves (very pale and glassmorphic)
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 - index * 0.02})`;
        ctx.lineWidth = 1;
        
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif' }}>
      {/* Navigation */}
      <nav className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-black font-medium" strokeWidth={2} />
            </div>
            <div>
              <div className="text-lg font-normal text-white">NeuroTunes</div>
              <div className="text-xs text-white/60">AI Music Therapy</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={handleLogin}
              className="text-white/80 hover:text-white hover:bg-white/10 font-normal"
            >
              Sign In
            </Button>
            <div className="text-base font-normal text-white/90">
              NeuralPositive
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <AnimatedFluidBackground />
        </div>
        
        {/* Floating Glass Morphism Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 opacity-20 animate-pulse">
            <img src={fluidShape1} alt="" className="w-full h-full object-contain mix-blend-screen" />
          </div>
          <div className="absolute top-40 right-20 w-48 h-48 opacity-15 animate-bounce" style={{ animationDuration: '6s' }}>
            <img src={fluidShape2} alt="" className="w-full h-full object-contain mix-blend-screen" />
          </div>
          <div className="absolute bottom-32 left-1/4 w-56 h-56 opacity-10 animate-pulse" style={{ animationDuration: '4s' }}>
            <img src={fluidShape3} alt="" className="w-full h-full object-contain mix-blend-screen" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-teal-300 px-4 py-2 rounded-full text-sm font-normal mb-8 border border-white/20">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
            AI-Powered Music Therapy
          </div>
          
          <h1 className="text-7xl font-thin text-white leading-tight mb-8">
            Wellness through<br />
            <span className="font-light bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Personalized Music
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Evidence-based therapeutic interventions designed by neuroscientists, 
            powered by cutting-edge AI personalization
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black px-8 py-4 text-base font-medium rounded-xl shadow-2xl shadow-teal-500/25 hover:shadow-teal-400/30 transition-all duration-300"
            >
              Begin Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              className="border-2 border-white/40 text-white/90 hover:bg-white/15 hover:border-white/60 backdrop-blur-md px-8 py-4 text-base font-medium rounded-xl bg-white/5 transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Therapy Programs Section */}
      <section className="relative py-24 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-thin text-white mb-6">
              Therapeutic <span className="font-light text-teal-300">Interventions</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light">
              Clinically validated protocols for specific mental health conditions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={therapyStonesWater} 
                  alt="Anxiety relief therapy - smooth stones by peaceful water" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-teal-300 px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    Anxiety Relief
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-normal text-white mb-3">Parasympathetic Activation</h3>
                <p className="text-white/70 mb-4 leading-relaxed font-light">
                  Classical compositions engineered to reduce cortisol levels and activate 
                  natural relaxation responses through therapeutic frequencies.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Clinical Validation</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={therapyDewdropLeaf} 
                  alt="Energy and mood enhancement - dewdrop on vibrant teal leaf" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-orange-300 px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    Energy & Mood
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-normal text-white mb-3">Dopaminergic Enhancement</h3>
                <p className="text-white/70 mb-4 leading-relaxed font-light">
                  Targeted interventions for major depressive disorder using 
                  neuroplasticity-promoting frequency patterns.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                  <span>Peer Reviewed</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={therapyZenStones} 
                  alt="Deep rest and meditation - zen stones stacked for balance and tranquility" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-purple-300 px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                    Deep Rest
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-normal text-white mb-3">Delta Wave Induction</h3>
                <p className="text-white/70 mb-4 leading-relaxed font-light">
                  Precision frequencies designed to synchronize brainwaves for 
                  enhanced sleep quality and cognitive recovery.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  <span>EEG Validated</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black px-8 py-4 text-base font-medium rounded-xl"
            >
              <Zap className="w-5 h-5 mr-2" />
              Explore Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="relative py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-thin text-white mb-8">
              Research <span className="font-light text-teal-300">Partnerships</span>
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto font-light leading-relaxed">
              Collaborating with leading institutions in neuroscience and technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Card className="p-10 text-center bg-white/8 backdrop-blur-xl border border-white/20 hover:bg-white/12 transition-all duration-300 group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm group-hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl font-bold text-white">CT</div>
              </div>
              <h3 className="text-2xl font-medium text-white mb-6">Cornell Tech</h3>
              <p className="text-white/70 font-light text-lg leading-relaxed">
                AI research for therapeutic applications
              </p>
            </Card>
            
            <Card className="p-10 text-center bg-white/8 backdrop-blur-xl border border-white/20 hover:bg-white/12 transition-all duration-300 group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm group-hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl font-bold text-white">WC</div>
              </div>
              <h3 className="text-2xl font-medium text-white mb-6">Weill Cornell</h3>
              <p className="text-white/70 font-light text-lg leading-relaxed">
                Clinical validation and medical research
              </p>
            </Card>
            
            <Card className="p-10 text-center bg-white/8 backdrop-blur-xl border border-white/20 hover:bg-white/12 transition-all duration-300 group">
              <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm group-hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl font-bold text-white">SM</div>
              </div>
              <h3 className="text-2xl font-medium text-white mb-6">Stanford Medical</h3>
              <p className="text-white/70 font-light text-lg leading-relaxed">
                Neuroscience and intervention development
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-7xl font-thin text-white mb-10">
            Transform Your <span className="font-light text-teal-300">Wellness</span>
          </h2>
          <p className="text-2xl text-white/80 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Join the future of personalized mental health through evidence-based music therapy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button 
              size="lg" 
              onClick={handleSignup}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black px-12 py-5 text-xl font-medium rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Start Free Session
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              onClick={handleLogin}
              className="border-2 border-white/40 text-white/90 hover:bg-white/15 hover:border-white/60 backdrop-blur-md px-12 py-5 text-xl font-medium rounded-xl bg-white/5 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="text-white font-normal">NeuroTunes</div>
              <div className="text-white/40 text-sm">© 2025 NeuroTunes. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}