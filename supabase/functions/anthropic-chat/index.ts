import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limiter: max 20 requests per minute per IP
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = req.headers.get("cf-connecting-ip") ??
             req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
             "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const messages: unknown[] = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cap message history to prevent prompt-injection via large payloads
    const recentMessages = messages.slice(-20);
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured");
      throw new Error("Service unavailable");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: "You are a helpful AI assistant for NeuroTunes. Provide clear, concise, and friendly responses about therapeutic music, wellness, and how our platform can help users achieve their mental health and wellness goals.",
        messages: recentMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      return new Response(JSON.stringify({ error: "Chat service unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!response.body) {
      throw new Error("No response body from Anthropic API");
    }

    // Create a transform stream to convert Anthropic's SSE format to OpenAI-compatible format
    const readable = response.body;
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              continue;
            }
            
            try {
              const parsed = JSON.parse(data);
              
              // Convert Anthropic format to OpenAI-compatible format
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                const openAIFormat = {
                  choices: [{
                    delta: {
                      content: parsed.delta.text
                    }
                  }]
                };
                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`)
                );
              } else if (parsed.type === 'message_stop') {
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
              }
            } catch (e) {
              console.error('Error parsing Anthropic response:', e);
            }
          }
        }
      }
    });

    return new Response(readable.pipeThrough(transformStream), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
