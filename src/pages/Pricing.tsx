import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/pricing/PricingCard";
import { STRIPE_PRICES } from "@/config/stripe";

export const Pricing = () => {
  const plans = [
    {
      name: "Trial Offer",
      price: "Free",
      period: "for 1 month",
      description: "Experience the full therapeutic music library",
      features: [
        "Sample of full music library",
        "Web app for office/personal use",
        "One end-user web app experience",
        "30-day trial period",
        "10% discount code after trial"
      ],
      cta: "Start Free Trial",
      highlighted: false,
      isTrial: true,
      priceId: undefined,
      paymentLink: "/products/enterprise-wellness" // Link to free trial signup
    },
    {
      name: "Individual",
      price: "$59.99",
      period: "per year",
      description: "Perfect for personal wellness and focus",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Web app + iOS & Android apps",
        "Personalized recommendations",
        "Unlimited streaming",
        "Offline listening",
        "Ad-free experience"
      ],
      cta: "Subscribe",
      highlighted: true,
      priceId: STRIPE_PRICES.INDIVIDUAL
    },
    {
      name: "Student/Service",
      price: "$49.99",
      period: "per year",
      description: "Special pricing for students and first responders",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Web app + iOS & Android apps",
        "Personalized recommendations",
        "Unlimited streaming",
        "Offline listening",
        "Verification required"
      ],
      cta: "Subscribe",
      highlighted: false,
      priceId: STRIPE_PRICES.STUDENT_SERVICE
    },
    {
      name: "Family & Besties",
      price: "$99.99",
      period: "per year",
      description: "Share wellness with up to 6 people",
      features: [
        "All Individual plan features",
        "Up to 6 user accounts",
        "Separate profiles for each user",
        "Family usage analytics",
        "Shared playlists",
        "Best value for groups"
      ],
      cta: "Subscribe",
      highlighted: false,
      priceId: STRIPE_PRICES.FAMILY
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-16">
            <p className="text-lg font-medium text-cyan-400 mb-4">
              Sale pricing ends December 10th, 2025
            </p>
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Personal Wellness Plans
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Transform your mind with neuroscience-backed music
            </p>
          </div>

          {/* Pricing Cards - Vertically Stacked */}
          <div className="space-y-8 mb-20 max-w-3xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                priceId={plan.priceId}
                paymentLink={plan.paymentLink}
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
