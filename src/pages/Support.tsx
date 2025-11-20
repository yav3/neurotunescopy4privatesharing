import React, { useState, useRef, useEffect } from 'react';
import { Send, CreditCard, Lock, Wrench, Star, Sparkles } from 'lucide-react';
import liquidGlassBg from '@/assets/liquid-glass-bg.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const quickActions = [
  { id: 'payment', label: 'Payment issue', icon: CreditCard },
  { id: 'login', label: 'Login help', icon: Lock },
  { id: 'technical', label: 'Technical problem', icon: Wrench },
  { id: 'subscription', label: 'Subscription', icon: Star },
];

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help with any technical issues or questions.\n\nWhat brings you here today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickAction = (actionId: string) => {
    const actionMessages: Record<string, string> = {
      payment: 'I need help with a payment issue',
      login: 'I need help logging in',
      technical: 'I have a technical problem',
      subscription: 'I have a question about my subscription',
    };
    
    setInput(actionMessages[actionId] || '');
    setShowQuickActions(false);
  };

  const handleSend = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const response = await fetch(
        `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/support-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] })
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.delta?.text;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg?.role === 'assistant') {
                    lastMsg.content = assistantContent;
                  } else {
                    newMessages.push({ 
                      role: 'assistant', 
                      content: assistantContent,
                      timestamp: new Date()
                    });
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact support.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid glass background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${liquidGlassBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40" />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Premium Glass Container */}
        <div className="glass-surface rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl">
          {/* Header with glassmorphic effect */}
          <div className="relative px-8 py-6 border-b border-white/10 bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white/95 tracking-tight">
                  NeuroPositive Support Assistant
                </h1>
                <p className="text-sm text-white/60 mt-1 font-light">
                  Clinical, technical, and account support
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="p-8">
            <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] rounded-[20px] p-5 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-primary/25 to-primary/15 border border-primary/30 text-white shadow-lg shadow-primary/10 backdrop-blur-sm' 
                        : 'bg-white/[0.07] border border-white/[0.15] text-white/90 backdrop-blur-md shadow-xl'
                    }`}
                  >
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-light">
                      {msg.content}
                    </div>
                    {msg.timestamp && (
                      <div className="text-xs text-white/40 mt-3 font-light">
                        {formatTime(msg.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {showQuickActions && messages.length === 1 && (
                <div className="grid grid-cols-2 gap-4 mt-8 animate-fadeIn">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="group relative flex items-center gap-4 p-5 rounded-2xl bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.10] hover:border-primary/40 transition-all duration-300 text-left overflow-hidden backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-300" />
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                        <action.icon className="w-5 h-5 text-primary drop-shadow-[0_0_6px_rgba(20,184,166,0.4)]" />
                      </div>
                      <span className="relative text-sm font-medium text-white/85 group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-white/[0.07] border border-white/[0.15] rounded-[20px] p-5 backdrop-blur-md">
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/40" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/40" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/40" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Premium Input Area */}
            <div className="relative flex gap-3 items-end pt-6 border-t border-white/10">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-[18px] bg-white/[0.06] border border-white/[0.12] text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 focus:bg-white/[0.08] transition-all duration-200 disabled:opacity-50 backdrop-blur-sm font-light"
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 border border-primary/30 flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none group"
              >
                <Send className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.5);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
