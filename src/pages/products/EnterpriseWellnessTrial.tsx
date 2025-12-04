import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFreeTrialChat } from "@/hooks/useFreeTrialChat";

export const EnterpriseWellnessTrial = () => {
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
            to="/products/enterprise-wellness"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Enterprise Wellness</span>
          </Link>
          
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light tracking-tight text-white mb-4">
              Enterprise Wellness Trial
            </h1>
          </div>

          {/* Chat Interface */}
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-3xl p-6 flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: '2px solid rgba(228, 228, 228, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                minHeight: '600px'
              }}
            >
              {/* Trial Benefits Header */}
              <div className="mb-6 pb-6 border-b border-white/20">
                <h3 className="text-xl font-light text-white mb-4 text-center">
                  What's Included in Your Trial
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] mt-1.5 flex-shrink-0" />
                    <p className="text-[#e4e4e4]">Sample of therapeutic music library</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] mt-1.5 flex-shrink-0" />
                    <p className="text-[#e4e4e4]">Web app for office use</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] mt-1.5 flex-shrink-0" />
                    <p className="text-[#e4e4e4]">One end user web app experience</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] mt-1.5 flex-shrink-0" />
                    <p className="text-[#e4e4e4]">One month trial period</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-center text-[#c0c0c0] text-xs">
                    After trial: Redeem 10% discount for full SAAS access including web app, iOS, Android, and admin controller with complete therapeutic suite
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                        message.role === 'user'
                          ? 'text-[#0a0a0c]'
                          : 'bg-black/60 text-[#e4e4e4] border border-[#e4e4e4]/20'
                      }`}
                      style={{
                        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                        backgroundColor: message.role === 'user' ? '#e4e4e4' : undefined,
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-black/60 text-[#e4e4e4] px-3 py-2 rounded-xl border border-[#e4e4e4]/20">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#e4e4e4] animate-bounce" style={{ animationDelay: '300ms' }} />
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
                  className="flex-1 px-4 py-2.5 rounded-full text-sm text-[#e4e4e4] placeholder-[#c0c0c0]/50 focus:outline-none focus:ring-2 focus:ring-[#e4e4e4]/30 transition-all disabled:opacity-50"
                  style={{ 
                    fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                    backgroundColor: '#000000',
                    border: '1.5px solid #e4e4e4'
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || !inputMessage.trim()}
                  className="p-2.5 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#000000',
                    border: '1.5px solid #e4e4e4',
                    color: '#e4e4e4',
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-xs text-[#c0c0c0] mt-3">
                No credit card required • Full access • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnterpriseWellnessTrial;
