import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: `You are a helpful technical support assistant for a therapeutic music streaming platform. Help users with:
- Technical issues (audio playback, app navigation, account problems)
- Feature questions (how to use playlists, favorites, genre selection)
- Troubleshooting (buffering, loading issues, login problems)
- General platform questions

IMPORTANT RESPONSE GUIDELINES:
- Keep responses SHORT and CONCISE (2-3 sentences max for initial answer)
- After providing a solution, ALWAYS ask: "Did this help resolve your issue?" or "Is there anything else I can help you with?"
- Break long answers into bullet points or numbered steps using simple text formatting:
  • Use bullet points with proper line breaks
  • Keep each point on a new line
  • Use clear spacing between sections
- For complex issues, provide the most important step first, then ask if they want more details
- Use plain text with line breaks for readability, avoid excessive formatting

Be friendly, clear, and solution-oriented. If you don't know something, admit it and suggest contacting human support.`,
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in support-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
