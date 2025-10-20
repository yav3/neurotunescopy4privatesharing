import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Lightbulb, Rocket, Users2, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CompanyStory() {
  const navigate = useNavigate();

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Founded by neuroscientists and AI researchers who recognized the potential of combining music therapy with machine learning.',
      icon: Lightbulb,
    },
    {
      year: '2020',
      title: 'First Clinical Trial',
      description: 'Completed our first peer-reviewed study demonstrating measurable improvements in anxiety reduction.',
      icon: Award,
    },
    {
      year: '2021',
      title: 'Platform Launch',
      description: 'Released NeuroTunes v1.0, making personalized music therapy accessible through AI-powered recommendations.',
      icon: Rocket,
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to 50+ countries with partnerships at leading academic institutions worldwide.',
      icon: TrendingUp,
    },
    {
      year: '2024',
      title: 'Advanced AI Integration',
      description: 'Introduced next-generation neural networks for real-time therapeutic optimization and personalization.',
      icon: Brain,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/landing')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">NeuralPositive</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Our Story
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From a research lab to a global platform transforming mental health care—
            this is the journey of NeuralPositive.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold mb-6">Where It All Began</h2>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  NeuralPositive was born from a simple observation: while millions struggle 
                  with mental health challenges, access to effective therapeutic interventions 
                  remains limited by cost, geography, and availability of trained professionals.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our founding team—comprising neuroscientists, music therapists, and AI 
                  researchers—came together with a shared vision: what if we could harness 
                  the therapeutic power of music and deliver it through intelligent, 
                  personalized AI systems?
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  What started as a research project in a university lab has evolved into 
                  a comprehensive platform serving users worldwide. Today, NeuroTunes represents 
                  the culmination of years of clinical research, technological innovation, 
                  and a deep commitment to making mental wellness accessible to all.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in transforming mental health care
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 md:left-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.year}
                    className={`relative flex flex-col md:flex-row gap-8 ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-8 w-4 h-4 rounded-full bg-primary border-4 border-background md:left-1/2 md:-translate-x-1/2" />

                    {/* Content */}
                    <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-primary mb-1">{item.year}</div>
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="hidden md:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">
              Experts dedicated to advancing mental health through technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Chen',
                role: 'CEO & Co-Founder',
                expertise: 'Neuroscience PhD, 15+ years in therapeutic research',
              },
              {
                name: 'Dr. Michael Rodriguez',
                role: 'Chief Science Officer',
                expertise: 'Music Therapy & Clinical Psychology',
              },
              {
                name: 'Alex Patel',
                role: 'Chief Technology Officer',
                expertise: 'AI/ML Engineering, Former Google Brain',
              },
            ].map((member) => (
              <Card key={member.name} className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users2 className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <div className="text-sm font-medium text-primary mb-2">{member.role}</div>
                  <p className="text-sm text-muted-foreground">{member.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of Our Story</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who have transformed their mental wellness journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/landing')}
              className="bg-primary hover:bg-primary/90"
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/neuralpositive/about')}
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
