import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CollectedData {
  fullName?: string;
  email?: string;
  companyName?: string;
  employeeCount?: string;
}

export function useFreeTrialChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you start your free 30-day business trial of NeuroTunes. To get started, could you tell me your full name?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [isComplete, setIsComplete] = useState(false);

  const sendMessage = async (userMessage: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/free-trial-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            collectedData,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 402) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'AI credits depleted');
        }
        if (!response.body) {
          throw new Error('Failed to start stream');
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';

      while (true) {
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
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              
              // Aggressively strip out JSON artifacts and markdown code blocks
              let cleanMessage = assistantMessage;
              
              // Remove markdown code blocks (```json ... ```)
              cleanMessage = cleanMessage.replace(/```json[\s\S]*?```/g, '');
              cleanMessage = cleanMessage.replace(/```[\s\S]*?```/g, '');
              
              // Remove JSON completion data
              cleanMessage = cleanMessage.replace(/\{[\s\S]*"complete":\s*true[\s\S]*\}/g, '');
              
              // Clean up any remaining backticks
              cleanMessage = cleanMessage.replace(/`{1,3}/g, '');
              
              // Trim whitespace
              cleanMessage = cleanMessage.trim();
              
              setMessages([...newMessages, { role: 'assistant', content: cleanMessage }]);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Check if response contains completion JSON
      try {
        const completionMatch = assistantMessage.match(/\{[\s\S]*"complete":\s*true[\s\S]*\}/);
        if (completionMatch) {
          const completionData = JSON.parse(completionMatch[0]);
          if (completionData.complete && completionData.data) {
            // Aggressively clean the final message
            let cleanMessage = assistantMessage.replace(completionMatch[0], '');
            
            // Remove markdown code blocks
            cleanMessage = cleanMessage.replace(/```json[\s\S]*?```/g, '');
            cleanMessage = cleanMessage.replace(/```[\s\S]*?```/g, '');
            
            // Remove any remaining backticks
            cleanMessage = cleanMessage.replace(/`{1,3}/g, '');
            
            // Trim whitespace
            cleanMessage = cleanMessage.trim();
            
            setMessages([...newMessages, { role: 'assistant', content: cleanMessage }]);
            setCollectedData(completionData.data);
            setIsComplete(true);
            return completionData.data;
          }
        }
      } catch (e) {
        console.log('No completion data in response');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    isComplete,
    collectedData,
  };
}
