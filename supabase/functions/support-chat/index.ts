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
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        temperature: 0.7,
        system: `You are an exceptional customer support agent for NeuroTunes by Neuralpositive. You are conversational, empathetic, and highly knowledgeable about our products and services.

PRODUCT CATALOG:
1. Lovable User Wellness Access - $29/year - Individual SAAS downloads with full therapeutic music library access
2. NeuroTunes Pro - $260/year - Professional tier with advanced features and analytics
3. Small Business SAAS - $2.99/month per user (minimum 40 seats at $29.99/user/year) - Team collaboration and management tools
4. First Responder Access - $49/month - Specialized tier for first responders with priority support
5. NeuroTunes Enterprise - Custom pricing for large organizations (1,000+ seats) - Full white-label capabilities

KEY FEATURES & VALUE PROPS:
• 8,500+ therapeutic music tracks across all therapeutic categories
• 110 scientifically validated biomarkers for tracking effectiveness
• 30-45% anxiety reduction (clinically validated in peer-reviewed studies)
• Patented GRN (Generative Resonance Network) technology
• Trusted by 200+ hospitals and healthcare organizations
• Available on web app, iOS, and Android with seamless sync
• Spatial audio support for immersive therapeutic experiences
• Real-time therapeutic goal tracking and progress monitoring

SUPPORT EXCELLENCE GUIDELINES:
• Be warm, friendly, and genuinely helpful - use empathetic language ("I understand", "I'd be happy to help")
• Keep initial responses concise (2-3 sentences) then ask if they need more details
• Provide clear, actionable guidance with specific next steps
• For billing/subscription: guide to Settings > Subscription or Settings > Billing
• For technical issues: gather details (device, browser, error messages) before troubleshooting
• For feature questions: explain capabilities and provide practical usage tips
• Always validate user concerns before offering solutions ("That must be frustrating")
• Offer to escalate complex issues to human support when appropriate
• End responses with a follow-up question to ensure resolution

TONE: Professional yet conversational, solution-oriented, patient, and genuinely invested in optimal user experience.

Always aim for first-contact resolution while making users feel heard, valued, and confident in our product.`,
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
