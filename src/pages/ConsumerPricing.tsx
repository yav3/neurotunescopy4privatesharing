import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { STRIPE_PRICES } from "@/config/stripe";

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

          {/* Pricing Cards - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.name}
                price={plan.priceYearly || plan.priceMonthly || ""}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                priceId={
                  plan.name.includes("Individual") ? STRIPE_PRICES.INDIVIDUAL :
                  plan.name.includes("Student") || plan.name.includes("Service") ? STRIPE_PRICES.STUDENT_SERVICE :
                  plan.name.includes("Family") ? STRIPE_PRICES.FAMILY :
                  STRIPE_PRICES.INDIVIDUAL
                }
                isPopular={plan.highlight}
                buttonText={plan.cta}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsumerPricing;
