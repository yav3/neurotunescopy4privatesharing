import { useState, useRef, useEffect } from "react";
import { X, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface RegistrationData {
  email?: string;
  companyName?: string;
  name?: string;
  numberOfSites?: number;
  squareFootage?: number;
}

export function RegistrationChatAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'd love to help you with a customer review. Let's start with your email address.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [currentStep, setCurrentStep] = useState<"email" | "company" | "name" | "sites" | "footage" | "done">("email");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            setRegistrationData((prev) => ({ ...prev, email: userMessage }));
            nextStep = "company";
            assistantResponse = "Great! What's your company name?";
          }
          break;

        case "company":
          setRegistrationData((prev) => ({ ...prev, companyName: userMessage }));
          nextStep = "name";
          assistantResponse = "Perfect! And what's your name?";
          break;

        case "name":
          setRegistrationData((prev) => ({ ...prev, name: userMessage }));
          nextStep = "sites";
          assistantResponse = "Nice to meet you! How many buildings or sites do you have?";
          break;

        case "sites":
          const sites = parseInt(userMessage);
          if (isNaN(sites) || sites <= 0) {
            assistantResponse = "Please provide a valid number of sites.";
          } else {
            setRegistrationData((prev) => ({ ...prev, numberOfSites: sites }));
            nextStep = "footage";
            assistantResponse = "Excellent! What's the approximate total square footage?";
          }
          break;

        case "footage":
          const footage = parseInt(userMessage.replace(/[^0-9]/g, ""));
          if (isNaN(footage) || footage <= 0) {
            assistantResponse = "Please provide a valid square footage.";
          } else {
            const updatedData = { ...registrationData, squareFootage: footage };
            setRegistrationData(updatedData);
            nextStep = "done";

            // Submit the lead
            await submitLead(updatedData);
            assistantResponse =
              "Thank you for your interest! We've received your information and will contact you shortly to discuss your customer review.";
          }
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

  const submitLead = async (data: RegistrationData) => {
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke("submit-site-assessment", {
        body: data,
      });

      if (functionError) throw functionError;

      toast.success("Your customer review request has been submitted!");
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to submit request. Please try again.");
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}>
      <div 
        className="relative w-full max-w-lg h-[600px] rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(5, 5, 7, 0.98) 0%, rgba(10, 10, 12, 0.98) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(228, 228, 228, 0.12)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Background Plus Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Plus className="w-96 h-96" style={{ color: 'rgba(228, 228, 228, 0.8)' }} />
        </div>
        
        {/* Subtle glow effects */}
        <div className="absolute top-[-20%] left-[10%] w-[80%] h-[40%] blur-[80px] rounded-full pointer-events-none" style={{ background: 'rgba(228, 228, 228, 0.03)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[80px] rounded-full pointer-events-none" style={{ background: 'rgba(228, 228, 228, 0.03)' }} />

        <div 
          className="relative flex items-center justify-between p-4"
          style={{
            borderBottom: '1px solid rgba(228, 228, 228, 0.10)',
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(228, 228, 228, 0.08)',
                border: '1px solid rgba(228, 228, 228, 0.14)',
              }}
            >
              <Plus className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.88)' }} />
            </div>
            <div>
              <h2 className="text-lg font-normal" style={{ color: 'rgba(228, 228, 228, 0.92)' }}>Customer Review</h2>
              <p className="text-xs" style={{ color: 'rgba(228, 228, 228, 0.50)' }}>Let's get started</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-[rgba(228,228,228,0.06)]">
            <X className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.60)' }} />
          </Button>
        </div>

        <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3 text-sm"
                style={
                  message.role === "user"
                    ? {
                        background: 'rgba(6, 182, 212, 0.12)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        color: 'rgba(228, 228, 228, 0.92)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      }
                    : {
                        background: 'rgba(228, 228, 228, 0.06)',
                        border: '1px solid rgba(228, 228, 228, 0.12)',
                        color: 'rgba(228, 228, 228, 0.88)',
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
                className="rounded-2xl px-4 py-3"
                style={{
                  background: 'rgba(228, 228, 228, 0.06)',
                  border: '1px solid rgba(228, 228, 228, 0.12)',
                }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(228, 228, 228, 0.80)', animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(228, 228, 228, 0.80)', animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(228, 228, 228, 0.80)', animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div 
          className="relative p-4"
          style={{
            borderTop: '1px solid rgba(228, 228, 228, 0.10)',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={isLoading || currentStep === "done"}
              className="flex-1 text-sm focus:ring-1"
              style={{
                background: 'rgba(228, 228, 228, 0.05)',
                border: '1px solid rgba(228, 228, 228, 0.12)',
                color: 'rgba(228, 228, 228, 0.92)',
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || currentStep === "done"}
              className="shrink-0"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                color: 'hsl(0, 0%, 100%)',
                border: 'none',
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
