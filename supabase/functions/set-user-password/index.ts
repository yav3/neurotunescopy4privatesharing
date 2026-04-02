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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { emails, password } = await req.json();

    const results = [];
    for (const email of emails) {
      // Find user by email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      const user = users?.find((u: any) => u.email === email.toLowerCase());
      
      if (!user) {
        results.push({ email, success: false, error: "User not found" });
        continue;
      }

      const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
      results.push({ email, success: !error, error: error?.message || null });
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
