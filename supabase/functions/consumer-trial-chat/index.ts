import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiting
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60000;

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

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Extract email from message
function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0].toLowerCase() : null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';

  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages, collectedEmail } = await req.json()
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    // Check if the last user message contains an email
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    const extractedEmail = lastUserMessage ? extractEmail(lastUserMessage.content) : null;
    
    // If we have a valid email, process the signup
    if (extractedEmail && isValidEmail(extractedEmail)) {
      console.log(`Processing trial signup for: ${extractedEmail}`);
      
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        // Check if email already exists
        const { data: existing } = await supabase
          .from('trial_requests')
          .select('email')
          .eq('email', extractedEmail)
          .single();
        
        if (existing) {
          // Return special response for already registered
          return new Response(
            JSON.stringify({ 
              type: 'already_registered',
              message: `It looks like ${extractedEmail} is already registered for a trial. Check your inbox for the confirmation email, or contact support if you need help.`
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Store trial request
        const { error: insertError } = await supabase
          .from('trial_requests')
          .insert({
            email: extractedEmail,
            full_name: 'Consumer Trial',
            status: 'pending',
            created_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Failed to create trial record:', insertError);
        }
        
        // Send confirmation email
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (resendApiKey) {
          const resend = new Resend(resendApiKey);
          await resend.emails.send({
            from: 'NeuroTunes <updates@updates.neurotunes.app>',
            to: [extractedEmail],
            subject: 'Welcome to Your NeuroTunes Free Trial! 🎧',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
                <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 24px;">Welcome to NeuroTunes</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0; margin-bottom: 24px;">
                  Your free trial is now active. You have 30 days to explore our therapeutic music library.
                </p>
                <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 12px;">What's included:</h3>
                  <ul style="list-style: none; padding: 0; margin: 0; color: #ccc; font-size: 15px; line-height: 2;">
                    <li>✓ Full access to therapeutic music library</li>
                    <li>✓ Web app experience</li>
                    <li>✓ Personalized recommendations</li>
                  </ul>
                </div>
                <a href="https://neurotunescopy4privatesharing.lovable.app/auth" 
                   style="display: inline-block; background: #fff; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 15px;">
                  Start Listening →
                </a>
                <p style="font-size: 13px; color: #666; margin-top: 32px;">
                  Questions? Reply to this email or visit our help center.
                </p>
              </div>
            `,
          });
          console.log('✅ Trial confirmation email sent to', extractedEmail);
        }
        
        // Return success response
        return new Response(
          JSON.stringify({ 
            type: 'signup_complete',
            email: extractedEmail,
            message: `You're all set! Check ${extractedEmail} for your confirmation email with login instructions. Your 30-day free trial starts now.`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      } catch (signupError) {
        console.error('Signup processing error:', signupError);
      }
    }

    // Normal chat flow - continue conversation
    const limitedMessages = messages.slice(-8);
    
    const systemPrompt = `You are a friendly, concise assistant helping users sign up for a free 30-day NeuroTunes trial.

Your ONLY goal: Get the user's email address to complete signup.

Guidelines:
- Be warm but brief (1-2 sentences max)
- If they provide an email, confirm it and say you're setting up their trial
- If they ask questions, answer briefly then redirect to getting their email
- Don't ask for any other information - just email
- Use a calm, premium tone matching a wellness brand

Example responses:
- "Hi! Enter your email to start your free 30-day trial. 🎧"
- "Great question! [brief answer]. Ready to start? Just drop your email below."
- "Perfect, setting up your trial now..."

DO NOT:
- Ask for name, company, or other details
- Write long paragraphs
- Use excessive emojis`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 256,
        system: systemPrompt,
        messages: limitedMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status}`);
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
    console.error('Error in consumer-trial-chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
