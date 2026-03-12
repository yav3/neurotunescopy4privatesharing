import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimits.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
      {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { messages } = await req.json();
    
    // Limit message history to prevent token abuse
    const limitedMessages = messages.slice(-15);
    
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    console.log(`Support chat request from IP: ${clientIP}, messages: ${limitedMessages.length}`);

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
• 50% anxiety reduction (clinically validated in peer-reviewed studies)
• Patented GRN (Generative Resonance Network) technology
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

LEAD QUALIFICATION - CRITICAL:
As you help users, naturally gather the following information through conversation. Do NOT ask all at once — weave these questions in naturally:
1. Their email address — ask early so you can follow up or send resources
2. Whether they are interested in an Enterprise or B2B account, or a consumer/individual plan
3. Their location (city and country) — frame it as "so we can connect you with the right regional team" or similar. If they give a vague location, ask for the specific city and country so it can be verified.
4. Their name and company/organization name if applicable
5. The size of their team or organization if it's a business inquiry

When you have collected at least their email AND one other piece of information (account type interest, location, name, or company), output a JSON block at the END of your message in this exact format:

\`\`\`lead_data
{
  "email": "their@email.com",
  "name": "Their Name",
  "accountType": "enterprise|b2b|consumer|unknown",
  "location": "City, Country",
  "company": "Company Name",
  "teamSize": "number or range",
  "query": "brief summary of what they asked about"
}
\`\`\`

Rules for the lead_data block:
- Only include fields you have actually collected — omit unknown fields
- "email" is required — do NOT emit the block without an email
- Output this block EVERY time you have new info, appending it to the end of your normal reply
- The user will NOT see this block — it is stripped by the frontend
- Continue the conversation normally — the block is invisible metadata

TONE: Professional yet conversational, solution-oriented, patient, and genuinely invested in optimal user experience.

Always aim for first-contact resolution while making users feel heard, valued, and confident in our product.`,
        messages: limitedMessages,
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