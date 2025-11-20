import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { WelcomeEmail } from './_templates/welcome.tsx';
import { PasswordResetEmail } from './_templates/password-reset.tsx';
import { MagicLinkEmail } from './_templates/magic-link.tsx';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

interface EmailRequest {
  type: 'welcome' | 'password-reset' | 'magic-link';
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

    console.log(`Successfully sent ${type} email to ${to}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-auth-email function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);
