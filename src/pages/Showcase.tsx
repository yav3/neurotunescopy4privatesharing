import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, Brain, Zap, Shield, Users, TrendingUp, ArrowRight, Check } from 'lucide-react';

export default function Showcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Neurotunes
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Therapeutic music powered by neuroscience to enhance cognitive function, reduce stress, and boost focus
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link to="/auth">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to="/research">
                  View Research
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Why Choose Neurotunes?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Science-Backed</h3>
              <p className="text-muted-foreground">
                Every track is curated based on peer-reviewed neuroscience research and cognitive studies
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Therapeutic Goals</h3>
              <p className="text-muted-foreground">
                Personalized playlists for focus, relaxation, sleep, anxiety relief, and cognitive enhancement
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Instant Results</h3>
              <p className="text-muted-foreground">
                Experience noticeable improvements in mood, focus, and relaxation within minutes
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Privacy First</h3>
              <p className="text-muted-foreground">
                Your listening data stays private. No ads, no tracking, just pure therapeutic music
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Expert Curated</h3>
              <p className="text-muted-foreground">
                Music selected by neuroscientists, therapists, and audio engineers
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your listening patterns and see how music impacts your wellbeing over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Goals Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            Therapeutic Goals
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Focus & Productivity',
                description: 'Enhance concentration and cognitive performance with specially designed soundscapes'
              },
              {
                title: 'Stress & Anxiety Relief',
                description: 'Reduce stress levels and calm anxious thoughts with soothing therapeutic music'
              },
              {
                title: 'Sleep Enhancement',
                description: 'Fall asleep faster and improve sleep quality with scientifically proven relaxation tracks'
              },
              {
                title: 'Mood Elevation',
                description: 'Boost your mood and emotional wellbeing with uplifting therapeutic compositions'
              },
              {
                title: 'Meditation Support',
                description: 'Deepen your meditation practice with ambient sounds designed for mindfulness'
              },
              {
                title: 'Energy & Motivation',
                description: 'Energize your day and stay motivated with stimulating rhythmic patterns'
              }
            ].map((goal, index) => (
              <div key={index} className="bg-card/50 p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{goal.title}</h3>
                    <p className="text-muted-foreground text-sm">{goal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Listening Experience?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already experiencing the therapeutic benefits of Neurotunes
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/auth">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link to="/neuralpositive/story" className="text-muted-foreground hover:text-foreground transition-colors">Our Story</Link></li>
                <li><Link to="/neuralpositive/research" className="text-muted-foreground hover:text-foreground transition-colors">Research</Link></li>
                <li><Link to="/neuralpositive/about" className="text-muted-foreground hover:text-foreground transition-colors">Neural Positive</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                <li><a href="https://docs.lovable.dev" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <p className="text-muted-foreground text-sm">
                Experience the power of therapeutic music backed by neuroscience
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
            <p>© 2024 Neurotunes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
