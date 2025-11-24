import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";
import { useState } from "react";
import { FooterContactHandler } from "@/components/FooterContactHandler";

export const EnterpriseWellnessPricing = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [interestType, setInterestType] = useState("");
  const plans = [
    {
      name: "Small Business",
      price: "$29.99",
      period: "per user/year",
      minSeats: "Minimum 40 seats",
      description: "Web app for office plus employee app store download",
      features: [
        "Full therapeutic music library access",
        "Web app for office use",
        "Employee app store download codes",
        "Basic usage analytics",
        "Email support",
        "Onboarding assistance"
      ],
      cta: "Request Quote",
      highlighted: false
    },
    {
      name: "Enterprise",
      price: "$14.99",
      period: "per user/year",
      minSeats: "Minimum 1,000 seats",
      description: "Admin accounts for on-site environmental and employee take-home app store codes",
      features: [
        "Everything in Small Business",
        "Admin dashboard with controls",
        "On-site environmental audio system",
        "Employee take-home app codes",
        "Advanced analytics & reporting",
        "Dedicated account manager",
        "Custom integration support",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      highlighted: true
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
              Enterprise Wellness Pricing
            </h1>
            <p className="text-xl font-light text-neutral-300 max-w-3xl mx-auto">
              Workplace mental health programs to boost employee wellbeing and productivity
            </p>
          </div>

          {/* Pricing Cards - Horizontal Scroll */}
          <div className="overflow-x-auto pb-8 -mx-6 px-6 mb-12">
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
                  <p className="text-sm text-cyan-400 font-medium mb-2">{plan.minSeats}</p>
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
                    setInterestType(`Enterprise Wellness - ${plan.name} Plan`);
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

          {/* Additional Info */}
          <div 
            className="rounded-3xl p-8 text-center max-w-4xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3 className="text-2xl font-light text-white mb-4">
              Need a custom solution?
            </h3>
            <p className="text-neutral-300 text-base mb-6">
              For organizations with unique requirements or larger deployments, we offer customized enterprise packages with flexible pricing and dedicated support.
            </p>
            <button
              onClick={() => {
                setInterestType("Enterprise Wellness - Custom Solution");
                setContactOpen(true);
              }}
              className="px-8 py-3 rounded-full text-sm font-medium transition-all cursor-pointer hover:bg-white/10"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                color: 'white'
              }}
            >
              Schedule Consultation
            </button>
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

export default EnterpriseWellnessPricing;
