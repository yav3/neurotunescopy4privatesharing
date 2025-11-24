import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";
import { useState } from "react";
import { FooterContactHandler } from "@/components/FooterContactHandler";

export const ClinicalPricing = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");
  const plans = [
    {
      name: "Clinical",
      price: "$299",
      period: "/month",
      description: "For therapists and healthcare providers",
      features: [
        "Full library access (8,500+ tracks)",
        "Up to 50 patient accounts",
        "Clinical dashboards",
        "Session notes integration",
        "Outcome tracking",
        "HIPAA compliance",
        "Dedicated support"
      ],
      cta: "Request Demo",
      highlighted: true
    },
    {
      name: "Population Health",
      price: "Custom",
      period: "",
      description: "For health systems and large provider networks (5,000+ patients)",
      features: [
        "Everything in Clinical",
        "Unlimited patient accounts",
        "HIPAA-compliant biomarker collection",
        "RTM/RPM system integration",
        "EMR/EHR integration",
        "Population-scale analytics",
        "Clinical outcomes tracking",
        "No disruption to workflow",
        "Patient CCM support",
        "Dedicated success manager"
      ],
      cta: "Schedule Clinical Consultation",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light tracking-tight text-white mb-4">
              Clinical & Population Health Pricing
            </h1>
            <p className="text-xl font-light text-neutral-300 max-w-3xl mx-auto">
              Evidence-based therapeutic music for healthcare providers
            </p>
          </div>

          {/* Pricing Cards - Horizontal Scroll */}
          <div className="overflow-x-auto pb-8 -mx-6 px-6">
            <div className="flex gap-8 min-w-max">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className="rounded-3xl p-8 relative w-[400px] flex-shrink-0"
                  style={{
                    background: plan.highlighted 
                      ? 'rgba(6, 182, 212, 0.08)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px)',
                    border: plan.highlighted
                      ? '1px solid rgba(6, 182, 212, 0.30)'
                      : '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: plan.highlighted
                      ? '0 0 60px rgba(6, 182, 212, 0.20)'
                      : '0 0 40px rgba(0, 0, 0, 0.8)',
                    transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                      color: 'white'
                    }}
                  >
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-light text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-light text-white">{plan.price}</span>
                    <span className="text-neutral-400 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-sm text-neutral-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    setInterestType(`Clinical - ${plan.name} Plan`);
                    setContactOpen(true);
                  }}
                  className="w-full px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: plan.highlighted
                      ? 'linear-gradient(135deg, #06b6d4, #2563eb)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: plan.highlighted ? 'none' : '1px solid rgba(255, 255, 255, 0.10)',
                    color: 'white',
                    boxShadow: plan.highlighted ? '0 0 30px rgba(6, 182, 212, 0.3)' : 'none'
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FooterContactHandler
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        interestType={interestType}
      />
    </div>
  );
};

export default ClinicalPricing;
