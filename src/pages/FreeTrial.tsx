import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import obsidianGlassBg from '@/assets/obsidian-glass-bg.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FreeTrial() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! Enter your email to start your free 30-day trial. 🎧"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://pbtgvcjniayedqlajjzz.supabase.co/functions/v1/consumer-trial-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [...messages, userMessage] })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const contentType = response.headers.get('content-type');
      
      // Check if it's a JSON response (signup complete or already registered)
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        
        if (data.type === 'signup_complete') {
          setSignupComplete(true);
          setRegisteredEmail(data.email);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.message
          }]);
        } else if (data.type === 'already_registered') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.message
          }]);
        } else if (data.error) {
          throw new Error(data.error);
        }
      } else {
        // Stream response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');
        
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
                    return [...newMessages];
                  });
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
      
      {/* Subtle glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full" />
      
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white/70 hover:text-white hover:bg-white/5 z-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(10, 10, 12, 0.9)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Obsidian texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src={obsidianGlassBg} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white/80" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-white/90">Free Trial</h1>
              <p className="text-xs text-white/50">30 days of therapeutic music</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="relative h-[320px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: 'rgba(255, 255, 255, 0.95)',
                      }
                    : {
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255, 255, 255, 0.85)',
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
                className="rounded-2xl px-4 py-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-75" />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-150" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="relative p-4 border-t border-white/5">
          {signupComplete ? (
            <Button
              onClick={() => navigate('/auth')}
              className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-medium"
            >
              <Check className="w-4 h-4 mr-2" />
              Continue to Login
            </Button>
          ) : (
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter your email..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.95)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <Send className="w-4 h-4 text-white/90" />
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative px-6 pb-6 pt-2">
          <p className="text-[11px] text-white/30 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
