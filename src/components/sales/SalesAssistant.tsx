import { useState, useRef, useEffect } from 'react';
import { X, Send, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const SalesAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you discover how NeuroTunes can transform your business.\n\nWhat brings you here today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sales-chat`;
    
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: userMessages }),
      });

      if (resp.status === 429) {
        toast({
          title: "Rate Limit Reached",
          description: "Too many requests. Please wait a moment and try again.",
          variant: "destructive",
        });
        return;
      }

      if (resp.status === 402) {
        toast({
          title: "Service Unavailable",
          description: "AI service requires additional credits. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to start stream');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';
      let streamDone = false;

      // Add assistant message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw || raw.startsWith(':') || !raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content = assistantContent;
                }
                return newMessages;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI assistant. Please try again.",
        variant: "destructive",
      });
      // Remove the empty assistant message
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await streamChat([...messages, userMessage]);
    setIsLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 px-6 py-3 rounded-full flex items-center gap-3 transition-all hover:scale-105 z-50 group"
          style={{
            background: 'rgba(10, 10, 12, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(228, 228, 228, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 24px rgba(228, 228, 228, 0.08)',
          }}
        >
          <Plus className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.90)' }} />
          <span className="text-sm font-light" style={{ color: 'rgba(228, 228, 228, 0.92)' }}>
            Chat with NeuroTunes AI Assistant
          </span>
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 w-96 h-[600px] rounded-2xl flex flex-col z-50 overflow-hidden"
          style={{
            background: '#0A0A0C',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(228, 228, 228, 0.14)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(228, 228, 228, 0.06)',
          }}
        >
          {/* Subtle chrome glow effect */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(228, 228, 228, 0.1) 0%, transparent 60%)',
            }}
          />

          {/* Header */}
          <div 
            className="relative flex items-center justify-between px-6 py-4"
            style={{
              borderBottom: '1px solid rgba(228, 228, 228, 0.10)',
            }}
          >
            <div className="flex items-center gap-3">
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
                <h3 className="text-sm font-medium" style={{ color: 'rgba(228, 228, 228, 0.92)' }}>
                  NeuroTunes AI Sales Assistant
                </h3>
                <p className="text-xs" style={{ color: 'rgba(228, 228, 228, 0.65)' }}>
                  Business solutions & partnerships
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.65)' }} />
            </button>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'shadow-lg'
                      : 'backdrop-blur-md'
                  }`}
                  style={
                    message.role === 'user'
                      ? {
                          background: 'rgba(19, 20, 22, 0.90)',
                          border: '1px solid rgba(228, 228, 228, 0.20)',
                          color: 'rgba(228, 228, 228, 0.92)',
                        }
                      : {
                          background: 'rgba(228, 228, 228, 0.06)',
                          border: '1px solid rgba(228, 228, 228, 0.12)',
                          color: 'rgba(228, 228, 228, 0.88)',
                        }
                  }
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        background: 'rgba(228, 228, 228, 0.80)',
                        animationDelay: '0ms',
                      }} 
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        background: 'rgba(228, 228, 228, 0.80)',
                        animationDelay: '150ms',
                      }} 
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        background: 'rgba(228, 228, 228, 0.80)',
                        animationDelay: '300ms',
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div 
            className="relative p-6"
            style={{
              borderTop: '1px solid rgba(228, 228, 228, 0.10)',
            }}
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  background: 'rgba(228, 228, 228, 0.05)',
                  border: '1px solid rgba(228, 228, 228, 0.12)',
                  color: 'rgba(228, 228, 228, 0.92)',
                  caretColor: 'rgba(228, 228, 228, 0.88)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.24)';
                  e.currentTarget.style.background = 'rgba(228, 228, 228, 0.08)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(228, 228, 228, 0.12)';
                  e.currentTarget.style.background = 'rgba(228, 228, 228, 0.05)';
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  background: 'rgba(228, 228, 228, 0.12)',
                  border: '1px solid rgba(228, 228, 228, 0.18)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && input.trim()) {
                    e.currentTarget.style.background = 'rgba(228, 228, 228, 0.20)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(228, 228, 228, 0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(228, 228, 228, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Send className="w-4 h-4" style={{ color: 'rgba(228, 228, 228, 0.90)' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};