import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { STRIPE_PRICES } from "@/config/stripe";

export const Pricing = () => {
  const plans = [
    {
      name: "Small Business",
      price: "$29.99",
      period: "/user/year",
      description: "For teams and growing businesses (min 40 seats)",
      features: [
        "Full library access (8,500+ tracks)",
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
      name: "Clinical",
      price: "$299",
      period: "/month",
      description: "For therapists and healthcare providers",
      features: [
        "Everything in Small Business",
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
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For hospitals and large organizations",
      features: [
        "Everything in Clinical",
        "Unlimited users",
        "Custom branding",
        "API access",
        "SSO integration",
        "Custom reporting",
        "SLA guarantee",
        "Dedicated success manager"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Business & Enterprise Pricing
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Choose the plan that fits your needs
            </p>
          </div>

          {/* Pricing Cards - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                priceId={
                  plan.name === "Small Business" ? STRIPE_PRICES.SMALL_BUSINESS :
                  plan.name === "Clinical" ? STRIPE_PRICES.CLINICAL :
                  STRIPE_PRICES.ENTERPRISE_CUSTOM
                }
                quantity={plan.name === "Small Business" ? 40 : 1}
                isPopular={plan.highlighted}
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

export default Pricing;
