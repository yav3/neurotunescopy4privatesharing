import { Link } from "react-router-dom";
import { Music, Brain, Headphones, Calendar, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Footer } from '@/components/Footer';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-8">How it works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            See how easy it is to access therapeutic music — simple setup, science-backed playlists, and one subscription with no licensing fees.
          </p>
          <div className="flex gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start your free trial
              </Button>
            </Link>
            <Link to="/goals">
              <Button size="lg" variant="outline">
                Explore therapeutic goals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Get Set Up Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold mb-12">Get set up</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-muted/50 p-8 rounded-lg">
            <div className="text-4xl font-bold mb-4">1.</div>
            <h3 className="text-2xl font-bold mb-4">Activate your free trial</h3>
            <p className="text-muted-foreground">
              Try NeuroTunes free for 14 days. Simply create an account and start exploring our therapeutic music library.
            </p>
          </div>
          <div className="bg-muted/50 p-8 rounded-lg">
            <div className="text-4xl font-bold mb-4">2.</div>
            <h3 className="text-2xl font-bold mb-4">Choose your therapeutic goal</h3>
            <p className="text-muted-foreground">
              Select from focus, stress relief, sleep, energy, meditation, or mood elevation to match your needs.
            </p>
          </div>
          <div className="bg-muted/50 p-8 rounded-lg">
            <div className="text-4xl font-bold mb-4">3.</div>
            <h3 className="text-2xl font-bold mb-4">Start listening</h3>
            <p className="text-muted-foreground">
              Access our full library of therapeutic music through any device. No setup fees, no complicated permissions.
            </p>
          </div>
        </div>
      </section>

      {/* No Licensing Fees Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-5xl font-bold mb-8">One subscription. Zero licensing headaches.</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Unlike traditional music services, all NeuroTunes music is fully owned and created by our company. You'll never worry about recording rights, publishing rights, or public performance licenses.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">All Rights Included</h3>
                <p className="text-muted-foreground text-sm">
                  Every track is owned by NeuroTunes. No third-party licensing, no hidden fees, no legal complications.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Therapeutic Focus</h3>
                <p className="text-muted-foreground text-sm">
                  Music designed specifically for cognitive and emotional wellness, backed by neuroscience research.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Simple Pricing</h3>
                <p className="text-muted-foreground text-sm">
                  One subscription covers everything. Use it for personal wellness, clinical practice, or business environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore and Play Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-muted/50 rounded-2xl p-12 aspect-square flex items-center justify-center">
              <Brain className="w-32 h-32 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-8">Explore and play</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-3">Play from 1,000+ therapeutic tracks</h3>
                <p className="text-muted-foreground">
                  Expert-curated for specific therapeutic goals, neurological states, and wellness outcomes.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">AI-powered recommendations</h3>
                <p className="text-muted-foreground">
                  Our system learns your preferences and suggests tracks optimized for your therapeutic journey.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">No licensing restrictions</h3>
                <p className="text-muted-foreground">
                  Since we own all the music, you can use it freely without worrying about commercial licenses or usage restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Make it Yours Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-5xl font-bold mb-8">Make it yours</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Customize playlists</h3>
                  <p className="text-muted-foreground">
                    Start from scratch or build on our science-backed playlists tailored to your therapeutic goals.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Track your progress</h3>
                  <p className="text-muted-foreground">
                    Monitor your mood, focus levels, and therapeutic outcomes over time with our built-in analytics.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Schedule sessions</h3>
                  <p className="text-muted-foreground">
                    Plan your therapeutic music sessions to align with your daily routine and wellness goals.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-background rounded-2xl p-12 aspect-square flex items-center justify-center">
                <Calendar className="w-32 h-32 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Playing Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-muted/50 rounded-2xl p-12 aspect-square flex items-center justify-center">
              <Headphones className="w-32 h-32 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-8">Get playing</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Access therapeutic music through the NeuroTunes web app on any device. Simple, seamless, and designed for your wellness journey.
            </p>
            <Link to="/goals">
              <Button size="lg" variant="default">
                Visit web app
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold mb-12">Frequently asked questions</h2>
          <div className="max-w-4xl">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="licensing" className="bg-background px-6 rounded-lg">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Do I need separate music licenses?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No. All NeuroTunes music is fully owned by our company. Your subscription includes all rights needed for personal use, clinical practice, or business environments. No additional licensing fees or permissions required.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="usage" className="bg-background px-6 rounded-lg">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Can I use NeuroTunes in my therapy practice or business?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! Your subscription covers all usage scenarios including clinical practice, wellness centers, offices, and commercial spaces. Since we own all the music, there are no restrictions on how you use it.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="multiple" className="bg-background px-6 rounded-lg">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Can I access NeuroTunes on multiple devices?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes. Your account works across all devices with an internet connection. Listen on your laptop, tablet, or phone - your preferences and progress sync automatically.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trial" className="bg-background px-6 rounded-lg">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  What happens when my free trial ends?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  If you want to continue using NeuroTunes, you can choose a plan that works for you. If you don't want to continue, there's no obligation and no charges.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancel" className="bg-background px-6 rounded-lg">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  Can I cancel anytime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes. You can cancel your subscription at any time with no penalties or cancellation fees. Your access continues until the end of your billing period.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
