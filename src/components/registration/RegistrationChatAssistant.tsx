import { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
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
      content: "Hello! I'd love to help you with a site assessment. Let's start with your email address.",
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
              "Thank you for your interest! We've received your information and will contact you shortly to discuss your site assessment.";
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

      toast.success("Your site assessment request has been submitted!");
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Failed to submit request. Please try again.");
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg h-[600px] bg-background rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Site Assessment Request</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
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
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || currentStep === "done"}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
