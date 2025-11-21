import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Send, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import obsidianGlassBg from '@/assets/obsidian-glass-bg.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help with any technical issues or questions you have. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
                    newMessages.push({ role: 'assistant', content: assistantContent });
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
        content: 'Sorry, I encountered an error. Please try again or contact support at support@example.com'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 z-50"
        style={{
          background: 'rgba(10, 10, 12, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(255, 255, 255, 0.04)',
          color: 'rgba(228, 228, 228, 0.92)',
        }}
      >
        <Plus className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 left-6 w-96 h-[500px] rounded-3xl flex flex-col overflow-hidden z-50"
          style={{
            background: '#000000',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Obsidian glass background */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
            <img src={obsidianGlassBg} alt="" className="w-full h-full object-cover" />
          </div>
          
          {/* Glossy highlight */}
          <div className="absolute top-[-20%] left-[10%] w-[80%] h-[40%] bg-white/5 blur-[80px] rounded-full pointer-events-none" />

          <div
            className="relative flex items-center justify-between p-5 border-b backdrop-blur-sm"
            style={{ borderColor: 'rgba(255, 255, 255, 0.10)' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <Plus className="w-6 h-6" style={{ color: 'rgba(228, 228, 228, 0.90)' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
                  NeuroPositive Support
                </h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                  Technical support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors"
              style={{ color: 'rgba(255, 255, 255, 0.70)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-[20px] px-5 py-3.5 text-[14px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'shadow-lg'
                      : 'backdrop-blur-md'
                  }`}
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
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div 
                  className="rounded-[20px] px-5 py-3.5 backdrop-blur-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div className="flex gap-1.5">
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
            className="relative p-5 border-t backdrop-blur-sm"
            style={{ borderColor: 'rgba(255, 255, 255, 0.10)' }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.92)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <Send className="w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.90)' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
