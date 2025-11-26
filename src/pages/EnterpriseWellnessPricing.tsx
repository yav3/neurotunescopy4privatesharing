import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EnterpriseWellnessPricing = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate the user before allowing trial signup
      const { data, error } = await supabase.functions.invoke('validate-signup', {
        body: { 
          displayName: fullName,
          email: email
        }
      });

      if (error) throw error;

      if (!data.valid) {
        toast.error(data.errors?.join(', ') || 'Validation failed');
        setIsSubmitting(false);
        return;
      }

      // Here you would typically create the trial account
      // For now, we'll just show a success message
      toast.success('Free trial request submitted! We\'ll contact you shortly.');
      
      // Reset form
      setFullName("");
      setEmail("");
      setCompanyName("");
      setEmployeeCount("");
    } catch (err: any) {
      console.error('Trial signup error:', err);
      toast.error(err.message || 'Failed to submit trial request');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Free Business Trial
            </h1>
          </div>

          {/* Free Trial Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSubmit}
              className="rounded-3xl p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(228, 228, 228, 0.2)',
                boxShadow: '0 0 40px rgba(228, 228, 228, 0.1)'
              }}
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-light mb-2" style={{ color: '#c0c0c0' }}>
                    Full Legal Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-[#c0c0c0] placeholder-white/30 focus:outline-none focus:border-[#e4e4e4] transition-colors"
                    placeholder="First and Last Name"
                    style={{ 
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      backgroundColor: '#000000',
                      border: '1px solid #e4e4e4'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-light mb-2" style={{ color: '#c0c0c0' }}>
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-[#c0c0c0] placeholder-white/30 focus:outline-none focus:border-[#e4e4e4] transition-colors"
                    placeholder="you@company.com"
                    style={{ 
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      backgroundColor: '#000000',
                      border: '1px solid #e4e4e4'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-light mb-2" style={{ color: '#c0c0c0' }}>
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-[#c0c0c0] placeholder-white/30 focus:outline-none focus:border-[#e4e4e4] transition-colors"
                    placeholder="Your Company"
                    style={{ 
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      backgroundColor: '#000000',
                      border: '1px solid #e4e4e4'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="employeeCount" className="block text-sm font-light mb-2" style={{ color: '#c0c0c0' }}>
                    Number of Employees *
                  </label>
                  <select
                    id="employeeCount"
                    required
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-[#c0c0c0] focus:outline-none focus:border-[#e4e4e4] transition-colors"
                    style={{ 
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      backgroundColor: '#000000',
                      border: '1px solid #e4e4e4'
                    }}
                  >
                    <option value="" className="bg-[#050607]">Select range</option>
                    <option value="1-50" className="bg-[#050607]">1-50</option>
                    <option value="51-200" className="bg-[#050607]">51-200</option>
                    <option value="201-1000" className="bg-[#050607]">201-1,000</option>
                    <option value="1000+" className="bg-[#050607]">1,000+</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-full font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#000000',
                    border: '1px solid #e4e4e4',
                    color: '#c0c0c0',
                    fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                    fontSize: '18px'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Start Free 30-Day Trial'}
                </button>

                <p className="text-center text-sm text-white/50 mt-4">
                  No credit card required • Full access • Cancel anytime
                </p>
              </div>
            </form>
          </div>

          {/* Benefits */}
          <div 
            className="rounded-3xl p-8 max-w-4xl mx-auto"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
            }}
          >
            <h3 className="text-2xl font-light text-white mb-6 text-center">
              What's Included in Your Trial
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Full therapeutic music library access</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Web app for office use</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Employee app download codes</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Usage analytics dashboard</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Dedicated onboarding support</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Priority customer service</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnterpriseWellnessPricing;
