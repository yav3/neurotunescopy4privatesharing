import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MagicAuthRequest {
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role for authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      throw new Error('Only POST method allowed');
    }

    const { token }: MagicAuthRequest = await req.json();

    if (!token) {
      throw new Error('Token is required');
    }

    console.log('Validating magic link token...');

    // Validate the magic link token
    const { data: validationData, error: validationError } = await supabase.rpc('validate_magic_link', {
      link_token: token
    });

    if (validationError) {
      console.error('Error validating magic link:', validationError);
      throw validationError;
    }

    if (!validationData || validationData.length === 0) {
      throw new Error('Invalid response from validation');
    }

    const validation = validationData[0];

    if (!validation.valid) {
      console.log('Magic link validation failed:', validation.reason);
      return new Response(JSON.stringify({
        success: false,
        error: validation.reason
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Resolve user email from ID so we can generate a valid magic link
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(validation.user_id);
    if (userError || !userData.user?.email) {
      throw new Error('Failed to resolve user');
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email,
      options: { redirectTo: 'https://neurotunes.app' },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error('Error generating magic link');
      throw new Error('Failed to generate session');
    }

    return new Response(JSON.stringify({
      success: true,
      user_id: validation.user_id,
      session_url: linkData.properties.action_link,
      message: 'Magic link authenticated successfully',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: unknown) {
    console.error('Error in magic-auth function:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
