import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFreeTrialChat } from "@/hooks/useFreeTrialChat";

export const EnterpriseWellnessPricing = () => {
  const { messages, isLoading, sendMessage, isComplete, collectedData } = useFreeTrialChat();
  const [inputMessage, setInputMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isComplete && collectedData) {
      handleValidation();
    }
  }, [isComplete, collectedData]);

  const handleValidation = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-signup', {
        body: { 
          displayName: collectedData.fullName,
          email: collectedData.email
        }
      });

      if (error) throw error;

      if (!data.isValid) {
        toast.error(data.errors?.join(', ') || 'Validation failed');
        return;
      }

      toast.success('Free trial request submitted! We\'ll contact you shortly.');
    } catch (err: any) {
      console.error('Trial signup error:', err);
      toast.error(err.message || 'Failed to submit trial request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage("");
    await sendMessage(message);
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

          {/* Chat Interface */}
          <div className="max-w-2xl mx-auto mb-12">
            <div
              className="rounded-3xl p-6 flex flex-col"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(228, 228, 228, 0.15)',
                height: '500px'
              }}
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-[#e4e4e4] text-[#050607]'
                          : 'bg-black/60 text-[#e4e4e4] border border-[#e4e4e4]/10'
                      }`}
                      style={{
                        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-black/60 text-[#e4e4e4] px-4 py-3 rounded-2xl border border-[#e4e4e4]/10">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#e4e4e4] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#e4e4e4] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-[#e4e4e4] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading || isSubmitting}
                  className="flex-1 px-4 py-3 rounded-full text-[#e4e4e4] placeholder-[#c0c0c0]/50 focus:outline-none focus:border-[#e4e4e4] transition-colors disabled:opacity-50"
                  style={{ 
                    fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                    backgroundColor: '#000000',
                    border: '1px solid #e4e4e4'
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || !inputMessage.trim()}
                  className="p-3 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#000000',
                    border: '1px solid #e4e4e4',
                    color: '#e4e4e4',
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>

              <p className="text-center text-sm text-white/50 mt-4">
                No credit card required • Full access • Cancel anytime
              </p>
            </div>
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
                <p>Sample of therapeutic music library</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>Web app for office use</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>One end user web app experience</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70 mt-2 flex-shrink-0" />
                <p>One month trial period</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-neutral-300 text-sm">
                After trial: Redeem 10% discount for full SAAS access including web app, iOS, Android, and admin controller with complete therapeutic suite
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnterpriseWellnessPricing;
