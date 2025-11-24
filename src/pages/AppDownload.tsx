import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { SalesAssistant } from "@/components/sales/SalesAssistant";
import { SupportChat } from "@/components/SupportChat";
import { Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const AppDownload = () => {
  const [salesAssistantOpen, setSalesAssistantOpen] = useState(false);
  const plans = [
    {
      name: "Individual",
      priceYearly: "$59.99",
      period: "year",
      description: "Perfect for personal wellness and focus",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "Pre-order price lock for Gen3 apps"
      ],
      cta: "Purchase Now",
      badge: "Most Popular"
    },
    {
      name: "Student / Service",
      priceYearly: "$49.99",
      period: "year",
      description: "For students, veterans, active military, government, teachers & first responders",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "Pre-order price lock for Gen3 apps",
        "Verification required"
      ],
      cta: "Purchase Now",
      badge: "Special Discount"
    },
    {
      name: "Family & Besties",
      priceYearly: "$99.99",
      period: "year",
      description: "Share with up to 6 family members or friends",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Up to 6 individual accounts",
        "Personalized recommendations for each",
        "Offline playback",
        "Progress tracking",
        "Pre-order price lock for Gen3 apps"
      ],
      cta: "Purchase Now",
      badge: "Best Value"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Back to Home Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </Link>
          
          {/* Hero */}
          <div className="text-center mb-12">
            <div 
              className="inline-block px-6 py-2 rounded-full mb-4"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
              }}
            >
              <span className="text-white font-semibold tracking-wide">🎉 BLACK FRIDAY SPECIAL</span>
            </div>
            <h1 className="text-5xl font-light tracking-tight text-white mb-4">
              Personal Wellness Web App
            </h1>
            <p className="text-xl font-light text-neutral-300 max-w-3xl mx-auto mb-2">
              Individual therapeutic music for anxiety relief, focus, sleep, and wellness
            </p>
            <p className="text-sm text-cyan-400 font-medium">
              Prices valid until December 5th
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-3xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                {/* Badge */}
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                >
                  {plan.badge}
                </div>

                <div className="text-center mb-6 mt-4">
                  <h3 className="text-xl font-light text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <div className="text-3xl font-light text-white">
                      {plan.priceYearly}
                      <span className="text-base text-neutral-400"> / {plan.period}</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => setSalesAssistantOpen(true)}
                  className="w-full py-3 rounded-full font-semibold transition-all hover:bg-white/10"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <SalesAssistant 
        externalOpen={salesAssistantOpen}
        onExternalClose={() => setSalesAssistantOpen(false)}
      />
      <SupportChat />
    </div>
  );
};

export default AppDownload;
