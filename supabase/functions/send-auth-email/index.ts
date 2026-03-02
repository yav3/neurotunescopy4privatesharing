import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { WelcomeEmail } from './_templates/welcome.tsx';
import { PasswordResetEmail } from './_templates/password-reset.tsx';
import { MagicLinkEmail } from './_templates/magic-link.tsx';
import { TrialConfirmationEmail } from './_templates/trial-confirmation.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface EmailRequest {
  type: 'welcome' | 'password-reset' | 'magic-link' | 'trial-confirmation';
  to: string;
  data: {
    displayName?: string;
    email?: string;
    resetLink?: string;
    magicLink?: string;
    recipientName?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || !emailRegex.test(to)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Rate limiting check using Supabase service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 'unknown';

    // Check rate limit
    const { data: allowed, error: rlError } = await supabase
      .rpc('check_email_rate_limit', { 
        p_email: to, 
        p_ip: clientIp,
        p_max_per_recipient: 3,
        p_max_per_ip: 5,
        p_window_hours: 1
      });

    if (rlError) {
      console.error('Rate limit check error:', rlError);
    }

    if (allowed === false) {
      console.warn(`Rate limited email request: ${type} to ${to} from ${clientIp}`);
      return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let html: string;
    let subject: string;

    switch (type) {
      case 'welcome':
        html = await renderAsync(
          React.createElement(WelcomeEmail, {
            displayName: data.displayName || 'User',
            email: data.email || to,
          })
        );
        subject = 'Welcome to NeuroTunes!';
        break;

      case 'password-reset':
        if (!data.resetLink) {
          throw new Error('Reset link is required for password reset emails');
        }
        html = await renderAsync(
          React.createElement(PasswordResetEmail, {
            resetLink: data.resetLink,
          })
        );
        subject = 'Reset Your NeuroTunes Password';
        break;

      case 'magic-link':
        if (!data.magicLink) {
          throw new Error('Magic link is required for magic link emails');
        }
        html = await renderAsync(
          React.createElement(MagicLinkEmail, {
            magicLink: data.magicLink,
            recipientName: data.recipientName || 'VIP User',
          })
        );
        subject = 'Your VIP Access to NeuroTunes';
        break;

      case 'trial-confirmation':
        html = await renderAsync(
          React.createElement(TrialConfirmationEmail, {
            displayName: data.displayName || 'User',
            email: data.email || to,
          })
        );
        subject = 'Your NeuroTunes Free Business Trial is Confirmed';
        break;

      default:
        throw new Error('Invalid email type');
    }

    const { error } = await resend.emails.send({
      from: 'NeuroTunes <updates@updates.neurotunes.app>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    // Record the send for rate limiting
    await supabase.rpc('record_email_send', { p_email: to, p_type: type, p_ip: clientIp });

    console.log(`Successfully sent ${type} email to ${to}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in send-auth-email function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
