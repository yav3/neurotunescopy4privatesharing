import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, FileText, Award, Users, ExternalLink, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ResearchPage() {
  const navigate = useNavigate();

  const publications = [
    {
      title: 'AI-Driven Music Therapy for Generalized Anxiety Disorder: A Randomized Controlled Trial',
      authors: 'Chen, S., Rodriguez, M., et al.',
      journal: 'Journal of Music Therapy',
      year: '2023',
      impact: '92% showed significant anxiety reduction',
    },
    {
      title: 'Neural Correlates of Personalized Music Interventions in Depression Management',
      authors: 'Rodriguez, M., Chen, S., Patel, A.',
      journal: 'Nature Neuroscience',
      year: '2022',
      impact: 'Demonstrated measurable changes in neural activity',
    },
    {
      title: 'Machine Learning Optimization of Therapeutic Music Selection',
      authors: 'Patel, A., Chen, S.',
      journal: 'AI in Medicine',
      year: '2024',
      impact: '87% improvement in treatment efficacy',
    },
  ];

  const partners = [
    {
      name: 'Stanford University',
      department: 'Department of Psychiatry',
      focus: 'Clinical efficacy studies',
    },
    {
      name: 'MIT Media Lab',
      department: 'Affective Computing Group',
      focus: 'AI algorithm development',
    },
    {
      name: 'Johns Hopkins',
      department: 'School of Medicine',
      focus: 'Neuroscience research',
    },
    {
      name: 'UC Berkeley',
      department: 'Institute of Cognitive Science',
      focus: 'Behavioral outcomes analysis',
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
            <span className="text-lg font-semibold">NeuralPositive Research</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Research & Innovation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Evidence-Based Innovation
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Our commitment to scientific rigor drives everything we do. Every feature 
            is backed by peer-reviewed research and clinical validation.
          </p>
        </div>
      </section>

      {/* Research Philosophy */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Scientific Foundation</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every therapeutic intervention in NeuroTunes is grounded in established 
                  neuroscience principles. We don't guess—we test, validate, and refine 
                  based on rigorous clinical evidence.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Peer-reviewed methodology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Randomized controlled trials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>EEG and biometric validation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Continuous Innovation</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our research doesn't stop at launch. We continuously refine our algorithms 
                  based on real-world outcomes and emerging neuroscience discoveries.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ongoing clinical studies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>User outcome tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Algorithm optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Key Research Findings</h2>
            <p className="text-xl text-muted-foreground">
              Measurable outcomes from our clinical studies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">73%</div>
                <div className="text-sm font-semibold mb-2">Anxiety Reduction</div>
                <p className="text-xs text-muted-foreground">
                  Clinically significant reduction in GAD-7 scores after 4 weeks
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">68%</div>
                <div className="text-sm font-semibold mb-2">Sleep Quality</div>
                <p className="text-xs text-muted-foreground">
                  Improvement in PSQI scores for participants with insomnia
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm font-semibold mb-2">User Adherence</div>
                <p className="text-xs text-muted-foreground">
                  Continued usage after 12 weeks, far exceeding industry standards
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Recent Publications</h2>
            <p className="text-xl text-muted-foreground">
              Our contributions to scientific literature
            </p>
          </div>

          <div className="space-y-6">
            {publications.map((pub, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{pub.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2">
                        {pub.authors}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-primary font-medium">{pub.journal}</span>
                        <span className="text-muted-foreground">{pub.year}</span>
                        <span className="text-muted-foreground">• {pub.impact}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Read Paper
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Partners */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Research Partnerships</h2>
            <p className="text-xl text-muted-foreground">
              Collaborating with leading institutions worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{partner.name}</h3>
                      <div className="text-sm text-primary font-medium mb-2">{partner.department}</div>
                      <p className="text-sm text-muted-foreground">{partner.focus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Evidence-Based Care</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Try the platform backed by cutting-edge research
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/landing')}
              className="bg-primary hover:bg-primary/90"
            >
              Start Using NeuroTunes
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/neuralpositive/about')}
            >
              Learn More About NeuralPositive
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
