import { useState, useMemo } from "react";
import { X, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import chromeFrame1 from '@/assets/chrome-frame-1.png';
import chromeFrame2 from '@/assets/chrome-frame-2.png';
import chromeFrame3 from '@/assets/chrome-frame-3.png';
import chromeFrame4 from '@/assets/chrome-frame-4.png';

interface ContactData {
  email?: string;
  name?: string;
  company?: string;
  interest?: string;
}

export function FooterContactHandler({ 
  isOpen, 
  onClose, 
  interestType 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  interestType: string;
}) {
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; content: string }>>([
    {
      role: "assistant",
      content: `Hi! I'd love to help you with ${interestType}. Let's start with your email address.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({ interest: interestType });
  const [currentStep, setCurrentStep] = useState<"email" | "name" | "company" | "done">("email");

  // Determine background image based on interest type
  const backgroundImage = useMemo(() => {
    switch (interestType.toLowerCase()) {
      case 'licensing':
        return chromeFrame1;
      case 'research':
        return chromeFrame2;
      case 'partners':
        return chromeFrame3;
      default:
        return chromeFrame4;
    }
  }, [interestType]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      let nextStep = currentStep;
      let assistantResponse = "";

      switch (currentStep) {
        case "email":
          if (!userMessage.includes("@")) {
            assistantResponse = "Please provide a valid email address.";
          } else {
            setContactData((prev) => ({ ...prev, email: userMessage }));
            nextStep = "name";
            assistantResponse = "Great! What's your name?";
          }
          break;

        case "name":
          setContactData((prev) => ({ ...prev, name: userMessage }));
          nextStep = "company";
          assistantResponse = "Perfect! What company do you work for?";
          break;

        case "company":
          const updatedData = { ...contactData, company: userMessage };
          setContactData(updatedData);
          nextStep = "done";

          // Submit the contact inquiry
          await submitContact(updatedData);
          assistantResponse =
            "Thank you for your interest! We've received your information and will contact you shortly.";
          break;

        case "done":
          assistantResponse = "Your request has been submitted. We'll be in touch soon!";
          break;
      }

      setCurrentStep(nextStep);
      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitContact = async (data: ContactData) => {
    try {
      console.log("Contact submission:", data);
      toast.success("Your inquiry has been submitted!");
    } catch (error) {
      console.error("Error submitting contact:", error);
      toast.error("Failed to submit inquiry. Please try again.");
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg h-[600px] rounded-3xl flex flex-col overflow-hidden"
        style={{
          background: 'rgba(10, 10, 12, 0.90)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(228, 228, 228, 0.14)',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Chrome background image - absolute positioned */}
        <div 
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'screen',
          }}
        />

        {/* Subtle gradient overlays */}
        <div className="absolute top-[-30%] left-[10%] w-[80%] h-[50%] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div 
          className="relative flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(228, 228, 228, 0.08)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(228, 228, 228, 0.08)',
                border: '1px solid rgba(228, 228, 228, 0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
            >
              <Plus className="w-6 h-6" style={{ color: 'rgba(228, 228, 228, 0.90)' }} strokeWidth={1.5} />
            </div>
            <div>
              <h2 
                className="text-xl font-light tracking-wide"
                style={{ color: 'rgba(228, 228, 228, 0.95)' }}
              >
                {interestType}
              </h2>
              <p 
                className="text-sm font-light mt-0.5"
                style={{ color: 'rgba(228, 228, 228, 0.60)' }}
              >
                Let's connect
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-white/5 transition-colors rounded-lg"
          >
            <X className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.70)' }} />
          </Button>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 font-light text-[15px] leading-relaxed ${
                  message.role === "user"
                    ? ""
                    : ""
                }`}
                style={
                  message.role === "user"
                    ? {
                        background: 'rgba(228, 228, 228, 0.12)',
                        border: '1px solid rgba(228, 228, 228, 0.18)',
                        color: 'rgba(228, 228, 228, 0.95)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                      }
                    : {
                        background: 'rgba(228, 228, 228, 0.06)',
                        border: '1px solid rgba(228, 228, 228, 0.10)',
                        color: 'rgba(228, 228, 228, 0.88)',
                        backdropFilter: 'blur(12px)',
                      }
                }
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div 
                className="rounded-2xl px-5 py-3.5"
                style={{
                  background: 'rgba(228, 228, 228, 0.06)',
                  border: '1px solid rgba(228, 228, 228, 0.10)',
                }}
              >
                <div className="flex gap-1.5">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce" 
                    style={{ 
                      background: 'rgba(228, 228, 228, 0.70)',
                      boxShadow: '0 0 8px rgba(228, 228, 228, 0.25)',
                    }} 
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce delay-100" 
                    style={{ 
                      background: 'rgba(228, 228, 228, 0.70)',
                      boxShadow: '0 0 8px rgba(228, 228, 228, 0.25)',
                      animationDelay: '0.1s',
                    }} 
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce delay-200" 
                    style={{ 
                      background: 'rgba(228, 228, 228, 0.70)',
                      boxShadow: '0 0 8px rgba(228, 228, 228, 0.25)',
                      animationDelay: '0.2s',
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input footer */}
        <div 
          className="relative p-6"
          style={{ borderTop: '1px solid rgba(228, 228, 228, 0.08)' }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={isLoading || currentStep === "done"}
              className="flex-1 h-12 bg-white/[0.06] border-white/[0.12] text-white placeholder-white/40 focus:border-white/[0.25] focus:ring-white/[0.15] rounded-xl font-light"
              style={{
                color: 'rgba(228, 228, 228, 0.90)',
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || currentStep === "done"}
              className="w-12 h-12 rounded-xl transition-all"
              style={{
                background: 'rgba(228, 228, 228, 0.12)',
                border: '1px solid rgba(228, 228, 228, 0.18)',
                color: 'rgba(228, 228, 228, 0.90)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(228, 228, 228, 0.18)';
                e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.28)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(228, 228, 228, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(228, 228, 228, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.18)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}