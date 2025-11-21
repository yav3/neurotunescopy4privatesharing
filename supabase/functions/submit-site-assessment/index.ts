import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    
    console.log("Received lead data:", leadData);

    const priority = calculatePriority(leadData.squareFootage, leadData.numberOfSites);

    const emailResponse = await resend.emails.send({
      from: "NeuroTunes <onboarding@resend.dev>",
      to: ["clong@neuralpositive.com"],
      subject: `[${priority}] Site Assessment Request - ${leadData.companyName}`,
      html: `
        <h2>New Site Assessment Request</h2>
        <p><strong>Priority:</strong> ${priority}</p>
        <hr />
        <p><strong>Name:</strong> ${leadData.name}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Company:</strong> ${leadData.companyName}</p>
        <p><strong>Number of Sites:</strong> ${leadData.numberOfSites}</p>
        <p><strong>Square Footage:</strong> ${leadData.squareFootage.toLocaleString()} sq ft</p>
        <hr />
        <p><em>Submitted via NeuroTunes website</em></p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, priority }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-site-assessment function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
