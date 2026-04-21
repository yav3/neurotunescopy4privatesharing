import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

function esc(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  email: string;
  companyName: string;
  name: string;
  numberOfSites: number;
  squareFootage: number;
}

const calculatePriority = (squareFootage: number, numberOfSites: number): string => {
  if (squareFootage >= 100000 && numberOfSites >= 5) {
    return "HIGH PRIORITY";
  } else if (squareFootage >= 100000) {
    return "MEDIUM PRIORITY";
  } else if (squareFootage >= 20000 && squareFootage < 75000) {
    return "LOW-MEDIUM PRIORITY";
  } else if (squareFootage < 20000) {
    return "LOW PRIORITY";
  }
  return "MEDIUM PRIORITY";
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();

    const priority = calculatePriority(leadData.squareFootage, leadData.numberOfSites);

    const emailResponse = await resend.emails.send({
      from: "NeuroTunes <onboarding@resend.dev>",
      to: ["clong@neuralpositive.com"],
      subject: `[${esc(priority)}] Customer Review Request - ${esc(leadData.companyName)}`,
      html: `
        <h2>New Customer Review Request</h2>
        <p><strong>Priority:</strong> ${esc(priority)}</p>
        <hr />
        <p><strong>Name:</strong> ${esc(leadData.name)}</p>
        <p><strong>Email:</strong> ${esc(leadData.email)}</p>
        <p><strong>Company:</strong> ${esc(leadData.companyName)}</p>
        <p><strong>Number of Sites:</strong> ${esc(leadData.numberOfSites)}</p>
        <p><strong>Square Footage:</strong> ${esc(leadData.squareFootage.toLocaleString())} sq ft</p>
        <hr />
        <p><em>Submitted via NeuroTunes website</em></p>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, priority }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
