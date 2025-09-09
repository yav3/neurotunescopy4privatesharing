import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Brain, Target, Users } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">NeuralPositive</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button variant="ghost" onClick={onLogin} className="w-full sm:w-auto">
            Sign In
          </Button>
          <Button onClick={onSignup} className="w-full sm:w-auto">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            The Leading Evidence-Based Music System to Drive Peak Performance
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Patented closed-loop personalization designed to enhance your performance through scientifically-proven therapeutic music experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onSignup} className="w-full sm:w-auto px-8 py-4 text-lg">
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" onClick={onLogin} className="w-full sm:w-auto px-8 py-4 text-lg">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-8 pb-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Therapeutic Goals</h3>
              <p className="text-muted-foreground">
                Achieve focus, relaxation, mood enhancement, and better sleep through personalized music therapy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-8 pb-6">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Evidence-Based</h3>
              <p className="text-muted-foreground">
                Built on rigorous research and validated through clinical studies for measurable outcomes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-8 pb-6">
              <Music className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Personalized</h3>
              <p className="text-muted-foreground">
                Adaptive algorithms learn from your responses to optimize your unique therapeutic experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-card/30 backdrop-blur-sm border-y">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">About NeuralPositive</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              NeuralPositive spun out of the prestigious <strong>Postdoctoral Runway Program at Jacobs Cornell Technion Institute (JCTI)</strong> at Cornell Tech. 
              We've received significant funding, partnership, research collaboration, and ongoing support from JCTI, positioning us at the forefront of therapeutic music technology.
            </p>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span className="font-medium">Trusted by researchers and practitioners worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Performance?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who have enhanced their cognitive performance through our evidence-based music therapy platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onSignup} className="w-full sm:w-auto px-8 py-4 text-lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={onLogin} className="w-full sm:w-auto px-8 py-4 text-lg">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-sm border-t">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">NeuralPositive</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 NeuralPositive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}