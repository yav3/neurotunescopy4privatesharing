import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export const AppDownload = () => {
  const plans = [
    {
      name: "Web App",
      priceMonthly: null,
      priceYearly: "$29.99",
      period: "wellness access",
      description: "Anytime upgrade to native iOS and Android with Lovable code",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "Upgrade to native apps anytime"
      ],
      cta: "Start Free Trial",
      badge: "Black Friday Sale"
    },
    {
      name: "Family",
      priceMonthly: null,
      priceYearly: "$99.99",
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
      cta: "Pre-order Family Plan",
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
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
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
              Offer valid until December 10th
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-3xl p-6 relative transition-all duration-300 hover:scale-[1.02]"
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
                {/* Badge */}
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: plan.highlight 
                      ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.8), rgba(229, 229, 229, 0.8))'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: plan.highlight ? '#000000' : 'white'
                  }}
                >
                  {plan.badge}
                </div>

                <div className="text-center mb-6 mt-4">
                  <h3 className="text-xl font-light text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.priceMonthly && (
                      <div className="text-3xl font-light text-white mb-1">
                        {plan.priceMonthly}
                        <span className="text-base text-neutral-400"> / month</span>
                      </div>
                    )}
                    <div className={`${plan.priceMonthly ? 'text-2xl' : 'text-3xl'} font-light text-white`}>
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
                  className="w-full py-3 rounded-full font-semibold transition-all"
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
              </div>
            ))}
          </div>

          {/* Mobile App Download Section */}
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3 className="text-2xl font-light text-white mb-3">
              Download the App
            </h3>
            <p className="text-neutral-300 text-base mb-6 max-w-2xl mx-auto">
              Available on all platforms — choose your preferred way to access +NeuroTunes
            </p>

            {/* Download Buttons Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Web App (PWA) */}
              <button
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-medium text-white mb-2">Web App</h4>
                <p className="text-sm text-neutral-400 mb-4">Install directly from browser</p>
                <div className="text-cyan-400 text-sm font-medium group-hover:text-cyan-300">
                  Install Now →
                </div>
              </button>

              {/* iOS App */}
              <button
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
                <h4 className="text-xl font-medium text-white mb-2">iOS App</h4>
                <p className="text-sm text-neutral-400 mb-4">Download from App Store</p>
                <div className="text-white text-sm font-medium group-hover:text-neutral-300">
                  App Store →
                </div>
              </button>

              {/* Android App */}
              <button
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/>
                  </svg>
                </div>
                <h4 className="text-xl font-medium text-white mb-2">Android App</h4>
                <p className="text-sm text-neutral-400 mb-4">Download from Google Play</p>
                <div className="text-green-400 text-sm font-medium group-hover:text-green-300">
                  Google Play →
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppDownload;
