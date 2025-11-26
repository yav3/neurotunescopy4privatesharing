import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { SalesAssistant } from "@/components/sales/SalesAssistant";
import { SupportChat } from "@/components/SupportChat";
import { Check, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const AppDownload = () => {
  const [salesAssistantOpen, setSalesAssistantOpen] = useState(false);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({ name: '', email: '' });
  const [enrollmentError, setEnrollmentError] = useState('');
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const handleEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollmentError('');

    // Validate inputs
    if (!enrollmentData.name.trim()) {
      setEnrollmentError('Name is required');
      return;
    }
    if (!enrollmentData.email.trim() || !enrollmentData.email.includes('@')) {
      setEnrollmentError('Valid email is required');
      return;
    }

    // TODO: Send enrollment data to backend/database
    console.log('Free trial enrollment:', enrollmentData);
    
    setEnrollmentSuccess(true);
    setTimeout(() => {
      setEnrollmentModalOpen(false);
      setEnrollmentSuccess(false);
      setEnrollmentData({ name: '', email: '' });
    }, 2000);
  };

  const plans = [
    {
      name: "Trial Offer",
      priceYearly: "Free",
      period: "1 month",
      description: "Try NeuroTunes risk-free for one month",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "No credit card required"
      ],
      cta: "Start Free Trial",
      badge: "Limited Time"
    },
    {
      name: "Individual",
      priceYearly: "$59.99",
      period: "year",
      description: "Perfect for personal wellness and focus",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "Pre-order price lock for Gen3 apps"
      ],
      cta: "Purchase Now",
      badge: "Most Popular"
    },
    {
      name: "Student / Service",
      priceYearly: "$49.99",
      period: "year",
      description: "For students, veterans, active military, government, teachers & first responders",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Personalized recommendations",
        "Offline playback",
        "Progress tracking",
        "Pre-order price lock for Gen3 apps",
        "Verification required"
      ],
      cta: "Purchase Now",
      badge: "Special Discount"
    },
    {
      name: "Family & Besties",
      priceYearly: "$99.99",
      period: "year",
      description: "Share with up to 6 family members or friends",
      features: [
        "Full access to 8,500+ therapeutic tracks",
        "Up to 6 individual accounts",
        "Personalized recommendations for each",
        "Offline playback",
        "Progress tracking",
        "Pre-order price lock for Gen3 apps"
      ],
      cta: "Purchase Now",
      badge: "Best Value"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Back to Home Button */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </Link>
          
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
              Individual therapeutic music for anxiety, stress, focus, mood, pain management, and fitness
            </p>
            <p className="text-sm text-cyan-400 font-medium">
              Prices valid until December 5th
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="rounded-3xl p-6 relative transition-all duration-300 hover:scale-[1.02] flex flex-col"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                }}
              >
                {/* Badge */}
                <div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  }}
                >
                  {plan.badge}
                </div>

                <div className="text-center mb-5 mt-4">
                  <h3 className="text-lg font-light text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <div className="text-2xl font-light text-white">
                      {plan.priceYearly}
                      <span className="text-sm text-neutral-400"> / {plan.period}</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-xs leading-tight">{plan.description}</p>
                </div>

                {/* Features - flex-grow pushes button down */}
                <ul className="space-y-2 mb-5 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-300 text-xs">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button - mt-auto keeps it at bottom */}
                <button
                  onClick={() => {
                    if (plan.name === "Trial Offer") {
                      setEnrollmentModalOpen(true);
                    } else {
                      setSalesAssistantOpen(true);
                    }
                  }}
                  className="w-full py-2.5 rounded-full font-semibold text-sm transition-all hover:bg-white/10 mt-auto"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.20)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.10)';
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
      <SalesAssistant 
        externalOpen={salesAssistantOpen}
        onExternalClose={() => setSalesAssistantOpen(false)}
      />
      <SupportChat />

      {/* Free Trial Enrollment Modal */}
      {enrollmentModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setEnrollmentModalOpen(false)}
        >
          <div 
            className="max-w-md w-full rounded-3xl p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {enrollmentSuccess ? (
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-light text-white mb-2">Welcome!</h3>
                <p className="text-neutral-300">Your free trial is being activated...</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-light text-white mb-2 text-center">Start Your Free Trial</h3>
                <p className="text-neutral-400 text-sm text-center mb-6">
                  Get full access for one month. No credit card required.
                </p>

                <form onSubmit={handleEnrollment} className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={enrollmentData.name}
                      onChange={(e) => setEnrollmentData({ ...enrollmentData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                      }}
                      placeholder="Enter your name"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-neutral-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={enrollmentData.email}
                      onChange={(e) => setEnrollmentData({ ...enrollmentData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                      }}
                      placeholder="Enter your email"
                      maxLength={255}
                    />
                  </div>

                  {enrollmentError && (
                    <p className="text-red-400 text-sm">{enrollmentError}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEnrollmentModalOpen(false)}
                      className="flex-1 py-3 rounded-full font-semibold text-sm transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                        color: 'white'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-full font-semibold text-sm transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                        color: 'white',
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                      }}
                    >
                      Start Trial
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDownload;
