import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { FooterContactHandler } from "@/components/FooterContactHandler";
import { toast } from "sonner";


export default function EnterpriseWellness() {
  const [searchParams] = useSearchParams();
  const [contactOpen, setContactOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState(searchParams.get("code") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Welcome! Check your inbox for access details.");
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white overflow-hidden relative flex flex-col">
      <div className="relative z-10 flex flex-col flex-1">
        <NavigationHeader />

        {/* Hero with Email Capture */}
        <section className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Focus | Relax | Reset tagline */}
            <motion.h1 
              className="text-2xl md:text-4xl lg:text-5xl mb-2 tracking-wide"
              style={{ 
                color: '#d4d4d4',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 300,
                letterSpacing: '0.08em',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Focus | Relax | Reset
            </motion.h1>

            <motion.p 
              className="text-lg md:text-2xl lg:text-3xl mb-12"
              style={{ 
                color: 'rgba(212, 212, 212, 0.5)',
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontWeight: 200,
                letterSpacing: '0.15em',
                textTransform: 'lowercase',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              on-demand
            </motion.p>

            {!isSubmitted ? (
              <motion.form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div 
                  className="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="flex-1 px-6 py-4 bg-transparent text-white text-lg placeholder:text-white/30 focus:outline-none"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                      color: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.12))';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Starting...</span>
                    ) : (
                      <>
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Promo Code Input */}
                <div className="mt-6 flex flex-col items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="px-6 py-3 rounded-full text-center text-base bg-transparent focus:outline-none transition-all"
                    style={{
                      color: '#d4d4d4',
                      border: '1px solid rgba(212, 212, 212, 0.2)',
                      width: '220px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 212, 212, 0.4)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(212, 212, 212, 0.2)';
                    }}
                    disabled={isSubmitting}
                  />
                  <span 
                    className="text-xs"
                    style={{ color: 'rgba(212, 212, 212, 0.4)' }}
                  >
                    for your free sub
                  </span>
                </div>

                <p 
                  className="text-sm mt-4"
                  style={{ color: 'rgba(212, 212, 212, 0.35)' }}
                >
                  No credit card required · Cancel anytime
                </p>
              </motion.form>
            ) : (
              <motion.div
                className="flex items-center justify-center gap-3 text-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
                >
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Check your inbox for access</span>
              </motion.div>
            )}


            <motion.button
              onClick={() => setContactOpen(true)}
              className="mt-8 text-sm transition-colors"
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
            >
              Or contact our sales team →
            </motion.button>
          </div>
        </section>

        <Footer />
        <FooterContactHandler
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
          interestType="enterprise"
        />
      </div>
    </div>
  );
}
