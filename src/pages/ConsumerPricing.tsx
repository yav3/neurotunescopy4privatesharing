import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export const ConsumerPricing = () => {
  const plans = [
    {
      name: "Lovable User Special",
      priceMonthly: "$2.99",
      priceYearly: null,
      period: "per user per month",
      description: "For single users • Annual contracts • Minimum 40 users",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Employee wellness dashboard",
        "Usage analytics & reporting",
        "Priority customer support",
        "Sync across all devices",
        "Admin management tools"
      ],
      cta: "Get Started",
      ctaLink: "/checkout?plan=lovable",
      badge: "Lovable Users Only",
      specialOffer: 'Limited time offer • Valid until December 10th only'
    },
    {
      name: "Small Business",
      priceMonthly: "$2.99",
      priceYearly: null,
      period: "per user per month",
      description: "Web app access + mobile apps bundle • Annual contracts • Minimum 40 users • Up to 500 users",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Employee wellness dashboard",
        "Usage analytics & reporting",
        "Priority customer support",
        "Sync across all devices",
        "Admin management tools"
      ],
      cta: "Get Started",
      ctaLink: "/checkout?plan=smallbusiness",
      badge: "Professional",
      highlight: true
    },
    {
      name: "First Responder",
      priceMonthly: null,
      priceYearly: "$49.99",
      period: "per year",
      description: "Web app access + mobile apps with special pricing for first responders",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Specialized stress relief content",
        "PTSD support playlists",
        "Sleep restoration protocols",
        "Priority customer support",
        "Verification required"
      ],
      cta: "Verify & Subscribe",
      badge: "Hero Discount"
    },
    {
      name: "Enterprise, 1,000+",
      priceMonthly: null,
      priceYearly: "Let's Talk!",
      period: "/ year",
      description: "Web app access + mobile apps for organizations with 1,000+ users",
      features: [
        "Everything in Small Business plan",
        "Dedicated account manager",
        "Custom integration support",
        "Advanced analytics",
        "SLA guarantee",
        "White-label options available"
      ],
      cta: "Contact Sales",
      badge: "🎉 Black Friday Sale",
      specialOffer: 'Enter code "lovable" • Offer valid only until December 1st'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <div 
              className="inline-block px-6 py-2 rounded-full mb-6"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
              }}
            >
              <span className="text-white font-semibold tracking-wide">🎉 BLACK FRIDAY SPECIAL</span>
            </div>
            <p className="text-lg font-medium text-cyan-400 mb-4">
              Sale pricing ends December 10th, 2025
            </p>
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              NeuroTunes Web App
            </h1>
            <p className="text-2xl font-light text-neutral-300 max-w-3xl mx-auto">
              Professional web-based therapeutic audio platform for teams and organizations
            </p>
            <p className="text-lg font-light text-neutral-400 max-w-2xl mx-auto mt-3">
              Access from any browser • Perfect for workplace wellness • Includes admin dashboard
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-3xl p-8 relative transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
                style={{
                  background: plan.highlight 
                    ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.12), rgba(229, 229, 229, 0.12))'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: plan.highlight 
                    ? '2px solid rgba(192, 192, 192, 0.6)' 
                    : '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: plan.highlight
                    ? '0 0 60px rgba(192, 192, 192, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                {/* Badge - Fixed height */}
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{
                    background: plan.highlight 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(229, 229, 229, 0.8))'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: plan.highlight ? '#000000' : 'white'
                  }}
                >
                  {plan.badge}
                </div>

                {/* Header Section - Fixed height */}
                <div className="text-center mb-8 mt-4" style={{ minHeight: '220px' }}>
                  <h3 className="text-2xl font-light text-white mb-3 h-16 flex items-center justify-center">{plan.name}</h3>
                  <div className="mb-2 h-16 flex flex-col items-center justify-center">
                    {plan.priceMonthly && (
                      <div className="text-4xl font-light text-white">
                        {plan.priceMonthly}
                        <span className="text-lg text-neutral-400"> {plan.period}</span>
                      </div>
                    )}
                    {plan.priceYearly && (
                      <div className={`${plan.priceMonthly ? 'text-3xl' : 'text-4xl'} font-light text-white`}>
                        {plan.priceYearly}
                        <span className="text-lg text-neutral-400"> {plan.period}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm min-h-[64px]">{plan.description}</p>
                  {plan.specialOffer && (
                    <p className="text-cyan-400 text-xs mt-2 font-medium min-h-[32px]">
                      {plan.specialOffer}
                    </p>
                  )}
                  {!plan.specialOffer && (
                    <div className="min-h-[32px]"></div>
                  )}
                </div>

                {/* Features - Fixed item height */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 min-h-[28px]">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - Fixed position */}
                <Link
                  to={plan.ctaLink || '#'}
                  className="block w-full"
                >
                  <button
                    className="w-full py-3 rounded-full font-semibold transition-all mt-auto"
                    style={{
                      background: plan.highlight
                        ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.9), rgba(229, 229, 229, 0.9))'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: plan.highlight ? 'none' : '1px solid rgba(255, 255, 255, 0.10)',
                      color: plan.highlight ? '#000000' : 'white',
                      boxShadow: plan.highlight 
                        ? '0 0 30px rgba(192, 192, 192, 0.5)'
                        : 'none'
                    }}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsumerPricing;
