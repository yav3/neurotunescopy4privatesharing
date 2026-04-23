import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://neurotunes.app",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_EMAILS_PER_REQUEST = 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify caller is an authenticated super_admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } }
    );

    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller has super_admin role
    const { data: isAdmin, error: roleError } = await callerClient.rpc("has_role", {
      _user_id: user.id,
      _role: "super_admin",
    });

    if (roleError || !isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const body = await req.json();
    const emails: string[] = body.emails;
    const password: string = body.password;

    if (!Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: "emails array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (emails.length > MAX_EMAILS_PER_REQUEST) {
      return new Response(JSON.stringify({ error: `Maximum ${MAX_EMAILS_PER_REQUEST} emails per request` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!password || password.length < 12) {
      return new Response(JSON.stringify({ error: "Password must be at least 12 characters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user list once and build a lookup map — avoids N+1 admin API calls
    const { data: { users: allUsers } } = await serviceClient.auth.admin.listUsers();
    const emailToUser = new Map(allUsers?.map((u: any) => [u.email?.toLowerCase(), u]) ?? []);

    const results = [];
    for (const email of emails) {
      const normalizedEmail = email.toLowerCase().trim();
      const target = emailToUser.get(normalizedEmail);

      if (!target) {
        results.push({ email: normalizedEmail, success: false, error: "User not found" });
        continue;
      }

      const { error } = await serviceClient.auth.admin.updateUserById(target.id, { password });
      results.push({ email: normalizedEmail, success: !error, error: error ? "Update failed" : null });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
