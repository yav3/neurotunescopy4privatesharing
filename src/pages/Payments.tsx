import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Smartphone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Payments = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Choose Your Platform</h1>
            <p className="text-xl text-muted-foreground">
              Access NeuroTunes therapeutic music on web, iOS, and Android
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Web App */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-12 h-12 text-primary" />
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    Available Now
                  </span>
                </div>
                <CardTitle className="text-3xl">Web Application</CardTitle>
                <CardDescription className="text-lg">
                  Full-featured web access from any browser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Access from any device with a browser</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Full therapeutic music library</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Personalized recommendations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>Progress tracking and analytics</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span>No licensing fees or restrictions</span>
                  </div>
                </div>
                <Link to="/pricing">
                  <Button size="lg" className="w-full">
                    View Web Pricing
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Native Apps */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Smartphone className="w-12 h-12 text-muted-foreground" />
                  <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Coming Soon
                  </span>
                </div>
                <CardTitle className="text-3xl">Native Apps</CardTitle>
                <CardDescription className="text-lg">
                  iOS and Android applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <span>Optimized mobile experience</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <span>Offline listening capability</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <span>Background audio playback</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <span>Native notification integration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <span>Apple Watch & Android Wear support</span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-center font-medium">
                    iOS and Android apps launching Q1 2026
                  </p>
                </div>
                <Button size="lg" variant="outline" className="w-full" disabled>
                  Notify Me When Available
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions about our platforms?</h2>
            <p className="text-muted-foreground mb-6">
              Get in touch with our team to learn more about web access and upcoming native apps
            </p>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payments;
