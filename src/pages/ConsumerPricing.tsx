import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export const ConsumerPricing = () => {
  const plans = [
    {
      name: "Individual",
      priceMonthly: "$5.99",
      priceYearly: "$25.99",
      period: "per month / per year",
      description: "Perfect for personal therapeutic audio access",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "Sync across all devices",
        "Spatial audio support"
      ],
      cta: "Start Individual Plan",
      badge: "Black Friday Sale"
    },
    {
      name: "Family",
      priceMonthly: null,
      priceYearly: "$59.99",
      period: "per year",
      description: "Up to 6 family member accounts",
      features: [
        "Everything in Individual plan",
        "Up to 6 separate accounts",
        "Individual progress tracking",
        "Personalized recommendations per user",
        "Family dashboard",
        "Priority support"
      ],
      cta: "Start Family Plan",
      badge: "Best Value",
      highlight: true
    },
    {
      name: "First Responder",
      priceMonthly: null,
      priceYearly: "$25.99",
      period: "per year",
      description: "Special pricing for first responders",
      features: [
        "Everything in Individual plan",
        "Specialized stress relief content",
        "PTSD support playlists",
        "Sleep restoration protocols",
        "Priority customer support",
        "Verification required"
      ],
      cta: "Verify & Subscribe",
      badge: "Hero Discount"
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
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              Get NeuroTunes Today
            </h1>
            <p className="text-2xl font-light text-neutral-300 max-w-3xl mx-auto">
              Access therapeutic audio on web, iOS, and Android
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-3xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: plan.highlight 
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: plan.highlight 
                    ? '2px solid rgba(6, 182, 212, 0.4)' 
                    : '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: plan.highlight
                    ? '0 0 60px rgba(6, 182, 212, 0.3)'
                    : '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                {/* Badge */}
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: plan.highlight 
                      ? 'linear-gradient(135deg, #06b6d4, #2563eb)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                >
                  {plan.badge}
                </div>

                <div className="text-center mb-8 mt-4">
                  <h3 className="text-2xl font-light text-white mb-3">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.priceMonthly && (
                      <div className="text-4xl font-light text-white mb-1">
                        {plan.priceMonthly}
                        <span className="text-lg text-neutral-400"> / month</span>
                      </div>
                    )}
                    <div className={`${plan.priceMonthly ? 'text-3xl' : 'text-4xl'} font-light text-white`}>
                      {plan.priceYearly}
                      <span className="text-lg text-neutral-400"> / year</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className="w-full py-3 rounded-full font-semibold transition-all"
                  style={{
                    background: plan.highlight
                      ? 'linear-gradient(135deg, #06b6d4, #2563eb)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: plan.highlight ? 'none' : '1px solid rgba(255, 255, 255, 0.10)',
                    color: 'white',
                    boxShadow: plan.highlight 
                      ? '0 0 30px rgba(6, 182, 212, 0.3)'
                      : 'none'
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Mobile App Notice */}
          <div
            className="rounded-3xl p-12 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3 className="text-3xl font-light text-white mb-4">
              iOS & Android Apps
            </h3>
            <p className="text-neutral-300 text-lg mb-6 max-w-2xl mx-auto">
              Download our native mobile apps from the App Store or Google Play Store
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="text-center">
                <div className="text-2xl font-light text-white">$5.99/month</div>
                <div className="text-neutral-400 text-sm">or</div>
                <div className="text-2xl font-light text-white">$59/year</div>
              </div>
            </div>
            <p className="text-neutral-400 text-sm">
              Available in USD only on US App Stores • Subscription managed through your app store account
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsumerPricing;
