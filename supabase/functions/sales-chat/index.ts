import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
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
        system: `You are an expert sales assistant for NeuroTunes, a medical-grade therapeutic music and AI streaming platform.

Key Information:
- NeuroTunes offers neuroscience-backed, clinically validated, patented therapeutic music technology
- Products include: Therapeutic Sessions Library, Spatial Therapeutic Audio, Web/Mobile Apps, Admin Dashboard
- Enterprise Solutions: Environmental Therapeutic Audio, Senior Living & Long-Term Care, Healthcare & Clinical Deployment, Enterprise Well-Being, Population Health Programs, Hospitality & Travel Wellness
- Integrations: API Access, OEM & White-label, Platform Embedding, AI Assistant Integration
- Supported by: Jacobs Technion-Cornell Institute, Stanford Medicine, and Weill Cornell Medicine

Your Role:
- Help potential clients understand how NeuroTunes can transform their business
- Provide clear, concise information about products and solutions
- Qualify leads and connect serious inquiries with the sales team
- Be professional, knowledgeable, and helpful
- Keep responses concise (2-3 sentences) unless detailed explanation is needed
- Focus on business value and ROI

Conversation Style:
- Professional yet approachable
- Use pearl grey tone matching the obsidian aesthetic
- Always end with a helpful question or next step`,
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
    console.error('Error in sales-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
