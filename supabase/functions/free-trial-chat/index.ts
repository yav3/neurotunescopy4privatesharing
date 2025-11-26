import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, collectedData } = await req.json()
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    const systemPrompt = `You are a friendly AI assistant helping users sign up for a free 30-day business trial of NeuroTunes.

Your goal is to collect the following information through natural conversation:
1. Full Legal Name (first and last name)
2. Work Email
3. Company Name
4. Number of Employees (1-50, 51-200, 201-1000, or 1000+)

Important guidelines:
- Be conversational and friendly
- Ask for one piece of information at a time
- Validate that names have at least first and last name
- Ensure email looks like a work email (not personal like gmail.com)
- Once you have all 4 pieces of information, tell the user: "Thank you! Please check your email to authenticate and activate your free trial."
- After telling them to check email, respond with EXACTLY this JSON and nothing else:
{
  "complete": true,
  "data": {
    "fullName": "collected name",
    "email": "collected email",
    "companyName": "collected company",
    "employeeCount": "collected range"
  }
}

Current collected data: ${JSON.stringify(collectedData || {})}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    // Transform Anthropic's streaming format to OpenAI-compatible format
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    const openAIFormat = {
                      choices: [{
                        delta: { content: parsed.delta.text },
                        index: 0
                      }]
                    }
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify(openAIFormat)}\n\n`)
                    )
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    })
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
