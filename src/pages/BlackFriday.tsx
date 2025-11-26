import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { PageBackgroundMedia } from "@/components/PageBackgroundMedia";
import { usePageBackground } from "@/hooks/usePageBackground";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const BlackFriday = () => {
  const background = usePageBackground();

  const deals = [
    {
      name: "Lovable User Wellness Access",
      price: "$29",
      period: "per year",
      originalPrice: "$59",
      savings: "Save 51%",
      description: "Perfect for individual wellness seekers",
      features: [
        "Full therapeutic music library access",
        "Web + mobile app streaming",
        "Personalized recommendations",
        "Unlimited listening sessions",
        "Ad-free experience",
        "Offline downloads"
      ],
      highlighted: false,
    },
    {
      name: "Small Business SAAS",
      price: "$2.99",
      period: "per month",
      originalPrice: "$9.99",
      savings: "Save 70%",
      description: "Ideal for small teams & startups",
      features: [
        "Up to 10 user accounts",
        "Team wellness dashboard",
        "Usage analytics & insights",
        "Priority customer support",
        "Bulk licensing discounts",
        "Flexible monthly billing"
      ],
      highlighted: true,
      badge: "Most Popular"
    },
    {
      name: "NeuroTunes Pro",
      price: "$260",
      period: "per year",
      originalPrice: "$499",
      savings: "Save 48%",
      description: "Advanced features for power users",
      features: [
        "Everything in Wellness Access",
        "Advanced spatial audio profiles",
        "Custom therapeutic playlists",
        "Priority track releases",
        "Enhanced analytics dashboard",
        "Dedicated account manager"
      ],
      highlighted: false,
    },
    {
      name: "NeuroTunes Enterprise",
      price: "$29",
      period: "per year per user",
      originalPrice: "$49",
      savings: "Save 41%",
      description: "Comprehensive solution for organizations",
      features: [
        "Unlimited user accounts",
        "Enterprise-grade security",
        "SSO & HIPAA compliance",
        "Custom integrations",
        "Dedicated support team",
        "White-label options available"
      ],
      highlighted: false,
    },
    {
      name: "NeuroTunes Enterprise 1K Plus",
      price: "$14",
      period: "per year per user",
      originalPrice: "$29",
      savings: "Save 52%",
      description: "Maximum value for large organizations",
      features: [
        "Minimum 1,000 seats",
        "All Enterprise features included",
        "Volume pricing advantages",
        "Executive onboarding program",
        "Quarterly business reviews",
        "24/7 premium support"
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#050607' }}>
      <PageBackgroundMedia 
        videoSrc={background.video}
        gifSrc={background.gif}
        overlayOpacity={background.overlayOpacity}
      />
      <div className="relative z-10">
        <NavigationHeader />
      
        <main className="pt-32 pb-28">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Hero */}
            <div className="text-center mb-16">
              <div className="inline-block px-6 py-2 mb-6 rounded-full border border-[#c0c0c0]/30 bg-black/40 backdrop-blur-sm">
                <span className="text-[#c0c0c0] text-sm tracking-wider" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                  BLACK FRIDAY SPECIAL
                </span>
              </div>
              <h1 className="text-6xl tracking-tight text-[#e4e4e4] mb-6" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Exclusive Black Friday Deals
              </h1>
              <p className="text-2xl text-[#c0c0c0]/80 mb-4" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Limited-time discounts on all NeuroTunes plans
              </p>
              <p className="text-lg text-[#c0c0c0]/60" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                Save up to 70% • Offer expires soon
              </p>
            </div>

            {/* Pricing Cards - Vertically Stacked */}
            <div className="space-y-8 max-w-4xl mx-auto">
              {deals.map((deal, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Halo effect for highlighted card */}
                  {deal.highlighted && (
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#c0c0c0] via-[#e4e4e4] to-[#c0c0c0] rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity" />
                  )}
                  
                  <div
                    className={`relative rounded-2xl border backdrop-blur-xl p-8 transition-all ${
                      deal.highlighted
                        ? 'border-[#c0c0c0]/50 bg-black/60'
                        : 'border-[#c0c0c0]/20 bg-black/40'
                    }`}
                  >
                    {/* Badge */}
                    {deal.badge && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#c0c0c0] to-[#e4e4e4] text-black text-sm" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 500 }}>
                        {deal.badge}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* Left: Plan Details */}
                      <div className="flex-1">
                        <h3 className="text-2xl text-[#e4e4e4] mb-2" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                          {deal.name}
                        </h3>
                        <p className="text-[#c0c0c0]/70 mb-4" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                          {deal.description}
                        </p>
                        
                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          {deal.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[#c0c0c0] mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-[#c0c0c0]/80" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Pricing & CTA */}
                      <div className="flex flex-col items-center md:items-end gap-4 md:min-w-[240px]">
                        {/* Savings Badge */}
                        <div className="px-4 py-1 rounded-full bg-[#c0c0c0]/10 border border-[#c0c0c0]/30">
                          <span className="text-[#c0c0c0] text-sm" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                            {deal.savings}
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="text-center md:text-right">
                          <div className="flex items-baseline justify-center md:justify-end gap-2 mb-1">
                            <span className="text-[#c0c0c0]/50 line-through text-lg" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                              {deal.originalPrice}
                            </span>
                            <span className="text-4xl text-[#e4e4e4]" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                              {deal.price}
                            </span>
                          </div>
                          <span className="text-[#c0c0c0]/70 text-sm" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                            {deal.period}
                          </span>
                        </div>

                        {/* Subscribe Button */}
                        <button
                          className={`px-8 py-3 rounded-full transition-all ${
                            deal.highlighted
                              ? 'bg-[#c0c0c0]/20 border-2 border-[#c0c0c0]/50 text-[#e4e4e4] hover:bg-[#c0c0c0]/30 hover:border-[#c0c0c0]/70'
                              : 'bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 text-[#c0c0c0] hover:bg-[#c0c0c0]/20 hover:border-[#c0c0c0]/50'
                          }`}
                          style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}
                        >
                          Claim Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Terms */}
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-[#c0c0c0]/50 text-sm" style={{ fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif', fontWeight: 400 }}>
                * Black Friday pricing valid for new subscriptions only. Existing subscribers can upgrade at discounted rates. 
                All prices in USD. Automatic renewal at standard rates after initial term unless cancelled. 
                30-day money-back guarantee on all plans.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default BlackFriday;
