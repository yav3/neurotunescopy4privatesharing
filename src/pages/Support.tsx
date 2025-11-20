import React, { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, CreditCard, Lock, Wrench, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[calc(100vh-8rem)] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Support Assistant</CardTitle>
            <CardDescription className="text-base">
              Ask about technical issues, features, or how to use the app
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-primary/20 border border-primary/30 text-primary-foreground' 
                        : 'bg-muted/50 border border-border/50 text-foreground'
                    }`}
                  >
                    <div className="text-base leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                  {msg.timestamp && (
                    <span className="text-xs text-muted-foreground mt-1 px-2">
                      {formatTime(msg.timestamp)}
                    </span>
                  )}
                </div>
              ))}
              
              {showQuickActions && messages.length === 1 && (
                <div className="flex flex-wrap gap-2 justify-start px-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.id)}
                      className="gap-2 text-sm"
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-start">
                  <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border/50 text-foreground">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 p-3 bg-muted/20 rounded-xl border border-border/50">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-base rounded-lg bg-background text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <Button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="h-12 w-12 rounded-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
