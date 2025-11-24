import { Link } from "react-router-dom";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export default function Subscribe() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationHeader />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience clinical-grade therapeutic music designed to enhance focus, reduce anxiety, and improve well-being
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Consumer Plan */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-light mb-2">Consumer</h3>
              <p className="text-white/60 mb-6">For individual users</p>
              
              <div className="mb-8">
                <span className="text-5xl font-light">$9.99</span>
                <span className="text-white/60">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Unlimited access to therapeutic music library</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Personalized goal-based playlists</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">High-quality audio streaming</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Mobile & desktop apps</span>
                </li>
              </ul>

              <Link
                to="/consumer-pricing"
                className="block w-full py-3 px-6 rounded-full border border-white/20 bg-white/10 text-center hover:bg-white/20 transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-white/30 bg-white/10 p-8 backdrop-blur-sm relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-black text-sm font-medium">
                Most Popular
              </div>
              
              <h3 className="text-2xl font-light mb-2">Enterprise</h3>
              <p className="text-white/60 mb-6">For businesses & organizations</p>
              
              <div className="mb-8">
                <span className="text-5xl font-light">Custom</span>
                <span className="text-white/60 block text-sm mt-2">Contact for pricing</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">Everything in Consumer</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">Multi-location support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">Custom branding options</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">Analytics & reporting dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <span className="text-white/90">Dedicated account manager</span>
                </li>
              </ul>

              <Link
                to="/products/enterprise-wellness"
                className="block w-full py-3 px-6 rounded-full bg-white text-black text-center hover:bg-white/90 transition-all font-medium"
              >
                Get Started
              </Link>
            </div>

            {/* Clinical Plan */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-light mb-2">Clinical</h3>
              <p className="text-white/60 mb-6">For healthcare providers</p>
              
              <div className="mb-8">
                <span className="text-5xl font-light">Custom</span>
                <span className="text-white/60 block text-sm mt-2">HIPAA compliant</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Everything in Enterprise</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">HIPAA-compliant infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">EMR/EHR integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Patient outcome tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">Clinical research support</span>
                </li>
              </ul>

              <Link
                to="/clinical-pricing"
                className="block w-full py-3 px-6 rounded-full border border-white/20 bg-white/10 text-center hover:bg-white/20 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6">
                <h3 className="text-xl font-light mb-2">Can I switch plans later?</h3>
                <p className="text-white/70">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              
              <div className="border-b border-white/10 pb-6">
                <h3 className="text-xl font-light mb-2">Is there a free trial?</h3>
                <p className="text-white/70">Yes, all new users get a 14-day free trial with full access to our therapeutic music library.</p>
              </div>
              
              <div className="border-b border-white/10 pb-6">
                <h3 className="text-xl font-light mb-2">What payment methods do you accept?</h3>
                <p className="text-white/70">We accept all major credit cards, debit cards, and PayPal. Enterprise customers can also pay via invoice.</p>
              </div>
              
              <div className="pb-6">
                <h3 className="text-xl font-light mb-2">How do I cancel my subscription?</h3>
                <p className="text-white/70">You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
