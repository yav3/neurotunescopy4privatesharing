import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { WelcomeEmail } from './_templates/welcome.tsx';
import { PasswordResetEmail } from './_templates/password-reset.tsx';
import { MagicLinkEmail } from './_templates/magic-link.tsx';
import { TrialConfirmationEmail } from './_templates/trial-confirmation.tsx';

const PRODUCTION_URL = 'https://neurotunes.app';

const corsHeaders = {
  'Access-Control-Allow-Origin': PRODUCTION_URL,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

type SafeEmailType = 'welcome' | 'password-reset' | 'magic-link' | 'trial-confirmation';

interface EmailRequest {
  type: SafeEmailType;
  to: string;
  data: {
    displayName?: string;
    email?: string;
    recipientName?: string;
    userId?: string;
  };
}

const ALLOWED_EMAIL_TYPES: SafeEmailType[] = ['welcome', 'password-reset', 'magic-link', 'trial-confirmation'];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    if (!ALLOWED_EMAIL_TYPES.includes(type)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || !emailRegex.test(to)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (type === 'magic-link') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      const callerClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
      );
      const { data: { user }, error: uErr } = await callerClient.auth.getUser();
      if (uErr || !user) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      const { data: isAdmin } = await callerClient.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (!isAdmin) {
        return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

    const clientIp = req.headers.get('cf-connecting-ip') ||
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     'unknown';

    const { data: allowed, error: rlError } = await supabase
      .rpc('check_email_rate_limit', {
        p_email: to,
        p_ip: clientIp,
        p_max_per_recipient: 3,
        p_max_per_ip: 5,
        p_window_hours: 1
      });

    if (rlError) {
      console.error('Rate limit check error');
    }

    if (allowed === false) {
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

      case 'password-reset': {
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: to,
          options: { redirectTo: `${PRODUCTION_URL}/auth/reset-password` },
        });
        if (linkError || !linkData?.properties?.action_link) {
          throw new Error('Failed to generate password reset link');
        }
        html = await renderAsync(
          React.createElement(PasswordResetEmail, { resetLink: linkData.properties.action_link })
        );
        subject = 'Reset Your NeuroTunes Password';
        break;
      }

      case 'magic-link': {
        const targetUserId = data.userId;
        if (!targetUserId) {
          return new Response(JSON.stringify({ success: false, error: 'userId is required for magic-link emails' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        const { data: vipLinkData, error: vipLinkError } = await supabase.rpc('create_magic_link_for_vip', {
          target_user_id: targetUserId,
          expires_in_hours: 24,
          link_metadata: {},
        });
        if (vipLinkError || !vipLinkData?.length) {
          throw new Error('Failed to generate magic link');
        }
        const generatedLink = `${PRODUCTION_URL}/admin/magic-auth?token=${vipLinkData[0].token}`;
        html = await renderAsync(
          React.createElement(MagicLinkEmail, {
            magicLink: generatedLink,
            recipientName: data.recipientName || 'VIP User',
          })
        );
        subject = 'Your VIP Access to NeuroTunes';
        break;
      }

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
        return new Response(JSON.stringify({ success: false, error: 'Invalid email type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    const { error } = await resend.emails.send({
      from: 'NeuroTunes <updates@updates.neurotunes.app>',
      to: [to],
      subject,
      html,
    });

    if (error) throw error;

    await supabase.rpc('record_email_send', { p_email: to, p_type: type, p_ip: clientIp });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (_error) {
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
