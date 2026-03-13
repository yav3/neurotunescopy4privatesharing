import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { MessageCircle, Send } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Help = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm the NeuroTunes AI assistant. I can help with product questions, pricing, clinical applications, technical support, and more.\n\nWhat can I help you with today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        }
      );

      if (!response.ok || !response.body) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.delta?.text || parsed.choices?.[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg?.role === 'assistant') {
                    lastMsg.content = assistantContent;
                  }
                  return [...newMessages];
                });
              }
            } catch { /* skip malformed chunks */ }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '') {
          return [...prev.slice(0, -1), { role: 'assistant' as const, content: "Sorry, I'm having trouble connecting right now. Please try again or visit our Support page for direct help." }];
        }
        return [...prev, { role: 'assistant' as const, content: "Sorry, I'm having trouble connecting right now. Please try again or visit our Support page for direct help." }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />

      <main className="pt-32 pb-28">
        <div className="max-w-6xl mx-auto px-6">

          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              AI Assistant
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Your intelligent guide powered by Anthropic
            </p>
          </div>

          {/* AI Chat Interface */}
          <div
            className="rounded-3xl mb-12 max-w-4xl mx-auto overflow-hidden flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
              maxHeight: '600px',
            }}
          >
            {/* Chat header */}
            <div className="px-8 py-5 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-light text-white">Ask Me Anything</h2>
                  <p className="text-xs text-neutral-500">Products, pricing, clinical applications, and more</p>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ minHeight: '300px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      msg.role === 'user'
                        ? { background: 'rgba(19, 20, 22, 0.90)', border: '1px solid rgba(255, 255, 255, 0.20)', color: 'rgba(255, 255, 255, 0.92)' }
                        : { background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: 'rgba(255, 255, 255, 0.88)' }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-5 py-3.5" style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
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

            {/* Chat input */}
            <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type your question here..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none px-5 py-3 rounded-xl text-sm disabled:opacity-50"
                  style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:opacity-80"
                  style={{ background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.3)' }}
                >
                  <Send className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          {/* What I Can Help With */}
          <div className="mb-20">
            <h3 className="text-3xl font-light text-white text-center mb-12">
              What I Can Help With
            </h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                "Product recommendations and features",
                "Pricing and subscription details",
                "Clinical applications and research",
                "Technical integration support",
                "Account and billing questions",
                "Implementation guidance"
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <p className="text-neutral-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div>
            <div
              className="rounded-3xl p-12 text-center"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(239, 68, 68, 0.30)',
                boxShadow: '0 0 40px rgba(239, 68, 68, 0.15)'
              }}
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Need Immediate Assistance?
              </h3>
              <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
                For urgent technical issues affecting patient care or critical system downtime
              </p>
              <button
                onClick={() => navigate('/support')}
                className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:opacity-90"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.30)',
                  color: '#fca5a5'
                }}
              >
                Emergency Support: Contact Us Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
