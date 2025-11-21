import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const Checkout = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'lovable';
  
  const planDetails = {
    lovable: {
      name: "Lovable User Special",
      price: "$2.99",
      period: "per user per month",
      description: "Annual contract • Minimum 40 users"
    },
    smallbusiness: {
      name: "Small Business",
      price: "$2.99",
      period: "per user per month",
      description: "Annual contract • Minimum 40 users • Up to 500 users"
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.lovable;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          
          <Link 
            to="/consumer-pricing"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to pricing
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-light tracking-tight text-white mb-4">
              Complete Your Purchase
            </h1>
            <p className="text-xl text-neutral-400">
              Subscribe to {currentPlan.name}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
              }}
            >
              <h2 className="text-2xl font-light text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{currentPlan.name}</h3>
                  <p className="text-sm text-neutral-400">{currentPlan.description}</p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-neutral-400">Price</span>
                    <span className="text-2xl font-light text-white">
                      {currentPlan.price}
                      <span className="text-sm text-neutral-400"> {currentPlan.period}</span>
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">Billed annually</p>
                </div>
              </div>

              <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
                <p className="text-sm text-cyan-400 font-medium">
                  🎉 Black Friday Special - Valid until December 10th, 2025
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="rounded-3xl p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
              }}
            >
              <h2 className="text-2xl font-light text-white mb-6">Contact Information</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Contact Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Number of Users</label>
                  <input
                    type="number"
                    min="40"
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                    placeholder="Minimum 40"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-300 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                    }}
                    placeholder="Any special requirements or questions?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(37, 99, 235, 0.9))',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                    color: 'white'
                  }}
                >
                  Submit Request
                </button>

                <p className="text-xs text-center text-neutral-500">
                  Our sales team will contact you within 24 hours to complete your subscription
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
