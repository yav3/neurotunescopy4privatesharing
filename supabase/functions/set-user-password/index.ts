import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Require Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: missing bearer token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // 2. Verify the JWT and resolve the caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const callerId = claimsData.claims.sub as string;

    // 3. Service-role client for privileged operations + admin check
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // 4. Verify caller has admin or super_admin role via has_role()
    const [{ data: isAdmin }, { data: isSuperAdmin }] = await Promise.all([
      supabase.rpc("has_role", { _user_id: callerId, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: callerId, _role: "super_admin" }),
    ]);

    if (!isAdmin && !isSuperAdmin) {
      console.warn("🚨 Non-admin attempted set-user-password", { callerId });
      return new Response(
        JSON.stringify({ error: "Forbidden: admin role required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Validate input
    const body = await req.json().catch(() => null);
    const emails = body?.emails;
    const password = body?.password;

    if (!Array.isArray(emails) || emails.length === 0 || emails.some((e) => typeof e !== "string")) {
      return new Response(
        JSON.stringify({ error: "Invalid input: 'emails' must be a non-empty string array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Invalid input: 'password' must be a string of at least 8 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Perform password updates
    const results = [];
    for (const email of emails) {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        results.push({ email, success: false, error: listError.message });
        continue;
      }
      const user = users?.find((u: any) => u.email === email.toLowerCase());

      if (!user) {
        results.push({ email, success: false, error: "User not found" });
        continue;
      }

      const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
      results.push({ email, success: !error, error: error?.message || null });
    }

    console.log("✅ set-user-password executed by admin", { callerId, count: emails.length });

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
