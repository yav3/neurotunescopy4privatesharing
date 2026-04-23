import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const PRODUCTION_URL = "https://neurotunes.app";

const corsHeaders = {
  'Access-Control-Allow-Origin': PRODUCTION_URL,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateLinkRequest {
  target_user_id: string;
  expires_in_hours?: number;
  metadata?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Only admins may generate magic links
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });
    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { target_user_id, expires_in_hours = 24, metadata = {} }: GenerateLinkRequest = await req.json();

    if (!target_user_id) {
      return new Response(JSON.stringify({ success: false, error: 'target_user_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { data, error } = await supabase.rpc('create_magic_link_for_vip', {
      target_user_id,
      expires_in_hours,
      link_metadata: metadata
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Failed to create magic link');
    }

    const magicLink = data[0];

    // Use hardcoded production URL — never trust the Origin header for security-sensitive links
    const magicLinkUrl = `${PRODUCTION_URL}/admin/magic-auth?token=${magicLink.token}`;

    return new Response(JSON.stringify({
      success: true,
      link_id: magicLink.link_id,
      token: magicLink.token,
      expires_at: magicLink.expires_at,
      magic_link_url: magicLinkUrl
    }), {
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
