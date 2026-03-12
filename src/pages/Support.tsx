import React, { useState, useRef, useEffect } from 'react';
import { Send, CreditCard, Lock, Wrench, Star, Plus, X, Mail, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import liquidMetalBg from '@/assets/liquid-metal-bg.png';

const SF = 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const ticketSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Please provide more detail (at least 10 characters)").max(2000),
  category: z.string().min(1, "Please select a category"),
});

const quickActions = [
  { id: 'payment', label: 'Payment issue', icon: CreditCard },
  { id: 'login', label: 'Login help', icon: Lock },
  { id: 'technical', label: 'Technical problem', icon: Wrench },
  { id: 'subscription', label: 'Subscription', icon: Star },
];

const categories = [
  { value: 'login', label: 'Login / Account Access' },
  { value: 'trial', label: 'Free Trial Issue' },
  { value: 'payment', label: 'Payment / Billing' },
  { value: 'technical', label: 'Technical Problem' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'other', label: 'Other' },
];

type ViewMode = 'chat' | 'form';

export default function Support() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('form');
  const [user, setUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Chat state
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

  // Check auth and pre-fill form
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
        }));
      }
    };
    checkUser();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = ticketSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0]?.message || "Please fill all fields");
      return;
    }

    setIsSubmittingForm(true);
    try {
      // Save to contact_submissions (always accessible)
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        interest_type: `support_${formData.category}`,
        source: `support-form | ${formData.subject}`,
        company: formData.message.substring(0, 500), // Store message in company field as fallback
      });

      if (error) throw error;

      setFormSubmitted(true);
      toast.success("Support request submitted! We'll get back to you shortly.");
    } catch (err: any) {
      console.error('Support submission error:', err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    if (viewMode === 'form') {
      setFormData(prev => ({ ...prev, category: actionId }));
    } else {
      const actionMessages: Record<string, string> = {
        payment: 'I need help with a payment issue',
        login: 'I need help logging in',
        technical: 'I have a technical problem',
        subscription: 'I have a question about my subscription',
      };
      setInput(actionMessages[actionId] || '');
      setShowQuickActions(false);
    }
  };

  const handleSend = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/support-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] })
        }
      );

      if (!response.ok || !response.body) throw new Error('Failed to get response');

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
                    newMessages.push({ role: 'assistant', content: assistantContent, timestamp: new Date() });
                  }
                  return newMessages;
                });
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please use the contact form instead — switch with the button above.",
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

  const inputStyle = {
    fontFamily: SF,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${liquidMetalBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <div className="rounded-[32px] shadow-[0_25px_50px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden backdrop-blur-2xl" style={{ background: 'rgba(0, 0, 0, 0.85)' }}>
          
          {/* Header */}
          <div className="relative px-8 py-6 border-b border-white/10 backdrop-blur-sm" style={{ background: 'rgba(0, 0, 0, 0.60)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02]" />
            <div className="relative flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl hover:bg-white/5 border border-white/10 flex items-center justify-center transition-all"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.60)' }} />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-light tracking-tight" style={{ color: 'rgba(255, 255, 255, 0.95)', fontFamily: SF }}>
                  Support
                </h1>
                <p className="text-sm mt-0.5 font-light" style={{ color: 'rgba(255, 255, 255, 0.50)', fontFamily: SF }}>
                  We're here to help
                </p>
              </div>
              
              {/* View mode toggle */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button
                  onClick={() => setViewMode('form')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all"
                  style={{
                    fontFamily: SF,
                    backgroundColor: viewMode === 'form' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    color: viewMode === 'form' ? '#06b6d4' : 'rgba(255, 255, 255, 0.4)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Form
                </button>
                <button
                  onClick={() => setViewMode('chat')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs transition-all"
                  style={{
                    fontFamily: SF,
                    backgroundColor: viewMode === 'chat' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    color: viewMode === 'chat' ? '#06b6d4' : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'form' ? (
            /* Contact Form View */
            <div className="p-8">
              {formSubmitted ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}>
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-3" style={{ fontFamily: SF }}>Request Received</h2>
                  <p className="text-white/50 text-sm max-w-sm mx-auto mb-6" style={{ fontFamily: SF }}>
                    We'll respond to {formData.email} within one business day. For urgent issues, try our AI chat assistant.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => { setFormSubmitted(false); setFormData({ name: formData.name, email: formData.email, subject: '', message: '', category: '' }); }}
                      className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                      style={{ ...inputStyle, fontFamily: SF }}
                    >
                      Submit Another
                    </button>
                    <button
                      onClick={() => setViewMode('chat')}
                      className="px-4 py-2 rounded-xl text-sm text-white transition-all"
                      style={{ fontFamily: SF, background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}
                    >
                      Try AI Chat
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  {/* Quick action chips */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleQuickAction(action.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                        style={{
                          fontFamily: SF,
                          backgroundColor: formData.category === action.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          border: formData.category === action.id ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: formData.category === action.id ? '#06b6d4' : 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <action.icon className="w-3 h-3" />
                        {action.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all appearance-none"
                      style={{ ...inputStyle, color: formData.category ? 'white' : 'rgba(255,255,255,0.25)' }}
                    >
                      <option value="" style={{ backgroundColor: '#0a0a0c' }}>Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value} style={{ backgroundColor: '#0a0a0c' }}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your issue in detail..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none"
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: SF, background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}
                  >
                    {isSubmittingForm ? "Submitting..." : "Submit Support Request"}
                  </button>

                  <p className="text-center text-xs text-white/30" style={{ fontFamily: SF }}>
                    We typically respond within one business day
                  </p>
                </form>
              )}
            </div>
          ) : (
            /* Chat View */
            <>
              <div className="relative p-8 overflow-hidden">
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                      <div
                        className="max-w-[85%] rounded-[20px] p-5 backdrop-blur-sm shadow-lg"
                        style={
                          msg.role === 'user'
                            ? { background: 'rgba(19, 20, 22, 0.90)', border: '1px solid rgba(255, 255, 255, 0.20)', color: 'rgba(255, 255, 255, 0.92)' }
                            : { background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', color: 'rgba(255, 255, 255, 0.88)' }
                        }
                      >
                        <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-light" style={{ fontFamily: SF }}>
                          {msg.content}
                        </div>
                        {msg.timestamp && (
                          <div className="text-xs text-white/40 mt-3 font-light">{formatTime(msg.timestamp)}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {showQuickActions && messages.length === 1 && (
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {quickActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleQuickAction(action.id)}
                          className="group flex items-center gap-4 p-5 rounded-2xl hover:bg-white/[0.10] transition-all text-left backdrop-blur-sm"
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)' }}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.10)', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
                            <action.icon className="w-5 h-5" style={{ color: 'rgba(228, 228, 228, 0.88)' }} />
                          </div>
                          <span className="text-sm font-light" style={{ color: 'rgba(255, 255, 255, 0.85)', fontFamily: SF }}>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex justify-start">
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

              <div className="px-8 pb-8">
                <div className="flex gap-3 items-end pt-6 border-t border-white/10">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-5 py-4 rounded-[18px] text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50 font-light"
                    style={{ ...inputStyle, color: 'rgba(255, 255, 255, 0.92)', fontFamily: SF }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 group"
                    style={{ background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.18)' }}
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ color: 'rgba(255, 255, 255, 0.90)' }} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.04); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
