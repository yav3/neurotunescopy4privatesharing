import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateLinkRequest {
  target_user_id: string;
  expires_in_hours?: number;
  metadata?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Authenticated user:', user.id);

    if (req.method !== 'POST') {
      throw new Error('Only POST method allowed');
    }

    const { target_user_id, expires_in_hours = 24, metadata = {} }: GenerateLinkRequest = await req.json();

    if (!target_user_id) {
      throw new Error('target_user_id is required');
    }

    console.log('Generating magic link for user:', target_user_id);

    // Call the database function to create magic link
    const { data, error } = await supabase.rpc('create_magic_link_for_vip', {
      target_user_id,
      expires_in_hours,
      link_metadata: metadata
    });

    if (error) {
      console.error('Error creating magic link:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('Failed to create magic link');
    }

    const magicLink = data[0];
    
    // Generate the full magic link URL
    const baseUrl = req.headers.get('origin') || 'https://neurotunes.app';
    const magicLinkUrl = `${baseUrl}/admin/magic-auth?token=${magicLink.token}`;

    console.log('Magic link created successfully:', magicLink.link_id);

    return new Response(JSON.stringify({
      success: true,
      link_id: magicLink.link_id,
      token: magicLink.token,
      expires_at: magicLink.expires_at,
      magic_link_url: magicLinkUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in generate-magic-link function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: error.message.includes('Only admins') ? 403 : 
             error.message.includes('Magic links can only be created for VIP') ? 400 :
             error.message.includes('not authenticated') ? 401 : 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);