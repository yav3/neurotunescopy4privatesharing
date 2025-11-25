import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { STRIPE_PRICES } from "@/config/stripe";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
          
          {/* Back Button */}
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Products</span>
          </Link>
          
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
                <div key={index} className="w-[400px] flex-shrink-0">
                  <PricingCard
                    title={plan.name}
                    price={plan.price}
                    period={plan.period}
                    description={`${plan.minSeats}\n${plan.description}`}
                    features={plan.features}
                    paymentLink={plan.name === "Small Business" ? "https://buy.stripe.com/6oUbJ24TwbzM87R4134c800" : undefined}
                    quantity={plan.name === "Small Business" ? 40 : 1000}
                    isPopular={plan.highlighted}
                    buttonText={plan.cta}
                    onCustomClick={plan.name === "Enterprise" ? () => {
                      setInterestType("Enterprise Wellness - 1,000+ Seats");
                      setContactOpen(true);
                    } : undefined}
                  />
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
