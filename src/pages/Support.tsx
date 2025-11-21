import React, { useState, useRef, useEffect } from 'react';
import { Send, CreditCard, Lock, Wrench, Star, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import liquidMetalBg from '@/assets/liquid-metal-bg.png';

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
  const navigate = useNavigate();
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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Obsidian liquid metal background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${liquidMetalBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Premium Obsidian Glass Container */}
        <div className="rounded-[32px] shadow-[0_25px_50px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden backdrop-blur-2xl" style={{ background: 'rgba(0, 0, 0, 0.85)' }}>
          {/* Header with obsidian glassmorphic effect */}
          <div className="relative px-8 py-6 border-b border-white/10 backdrop-blur-sm" style={{ background: 'rgba(0, 0, 0, 0.60)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02]" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <Plus className="w-7 h-7" style={{ color: 'rgba(228, 228, 228, 0.90)' }} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                  NeuroPositive Support Assistant
                </h1>
                <p className="text-sm mt-1 font-light" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                  Clinical, technical, and account support
                </p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl hover:bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-200 group"
                aria-label="Close support chat"
              >
                <X className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.60)' }} />
              </button>
            </div>
          </div>

          {/* Chat Area with Obsidian Gloss Panel */}
          <div className="relative p-8 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden mb-8" style={{ background: 'rgba(0, 0, 0, 0.75)' }}>
            {/* Glossy chrome highlight */}
            <div className="absolute top-[-20%] left-[10%] w-[80%] h-[40%] bg-white/8 blur-[80px] rounded-full opacity-50 pointer-events-none" />
            
            {/* Subtle graphite glow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className="max-w-[85%] rounded-[20px] p-5 backdrop-blur-sm shadow-lg"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'rgba(19, 20, 22, 0.90)',
                            border: '1px solid rgba(255, 255, 255, 0.20)',
                            color: 'rgba(255, 255, 255, 0.92)',
                          }
                        : {
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: 'rgba(255, 255, 255, 0.88)',
                          }
                    }
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
                      className="group relative flex items-center gap-4 p-5 rounded-2xl hover:bg-white/[0.10] hover:border-white/20 transition-all duration-300 text-left overflow-hidden backdrop-blur-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/3 transition-all duration-300" />
                      <div className="relative w-10 h-10 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300" style={{ background: 'rgba(255, 255, 255, 0.10)', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
                        <action.icon className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.88)' }} />
                      </div>
                      <span className="relative text-sm font-medium group-hover:text-white transition-colors" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="rounded-[20px] p-5 backdrop-blur-md" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <div className="flex gap-2">
                      <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: 'rgba(228, 228, 228, 0.80)', animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: 'rgba(228, 228, 228, 0.80)', animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ background: 'rgba(228, 228, 228, 0.80)', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Premium Obsidian Input Area */}
          <div className="px-8 pb-8">
            <div className="relative flex gap-3 items-end pt-6 border-t border-white/10">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full px-5 py-4 rounded-[18px] text-sm focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 backdrop-blur-sm font-light"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.92)',
                  }}
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none group"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ color: 'rgba(255, 255, 255, 0.90)' }} />
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
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
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
