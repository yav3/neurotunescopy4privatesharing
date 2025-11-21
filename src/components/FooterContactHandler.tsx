import { useState } from "react";
import { X, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      // You can call an edge function or directly insert into a contacts table
      // For now, just showing toast - implement your backend logic here
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg h-[600px] rounded-2xl flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(2, 16, 20, 0.95) 0%, rgba(0, 37, 44, 0.95) 100%)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(20, 184, 166, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 220, 255, 0.15)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Plus className="w-96 h-96 text-cyan-400" />
        </div>
        
        <div className="absolute top-[-20%] left-[10%] w-[80%] h-[40%] bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/10 blur-[80px] rounded-full pointer-events-none" />

        <div 
          className="relative flex items-center justify-between p-4"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(20, 184, 166, 0.2)',
                border: '1px solid rgba(20, 184, 166, 0.3)',
              }}
            >
              <Plus className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{interestType}</h2>
              <p className="text-xs text-white/60">Let's connect</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10">
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary/25 to-primary/15 border border-primary/30 text-white shadow-lg"
                    : "bg-white/[0.07] border border-white/[0.15] text-white/90 backdrop-blur-md"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.07] rounded-2xl px-4 py-3 border border-white/[0.15]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/40" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/40 delay-100" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/40 delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div 
          className="relative p-4"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
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
              className="flex-1 bg-white/[0.06] border-white/[0.12] text-white placeholder-white/40 focus:border-cyan-400/40 focus:ring-cyan-400/20"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || currentStep === "done"}
              className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:shadow-lg hover:shadow-cyan-400/30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
