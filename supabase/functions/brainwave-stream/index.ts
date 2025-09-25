// Brainwave Frequency Streaming Endpoint
// Generates real-time binaural beats and frequency-based audio streams

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Content-Type': 'text/event-stream',
};

// Frequency bands for brainwave entrainment
const FREQUENCY_BANDS = {
  'delta': { min: 0.5, max: 4, description: 'Deep sleep, healing' },
  'theta': { min: 4, max: 8, description: 'REM sleep, creativity, meditation' },
  'alpha': { min: 8, max: 12, description: 'Relaxed awareness, learning' },
  'beta': { min: 12, max: 30, description: 'Normal waking consciousness, focus' },
  'gamma': { min: 30, max: 100, description: 'Higher mental activity, insight' }
};

// Goal-based frequency selection
const GOAL_FREQUENCIES = {
  'focus': { band: 'beta', baseFreq: 20, binauralBeat: 6 },
  'relaxation': { band: 'alpha', baseFreq: 10, binauralBeat: 3 },
  'meditation': { band: 'theta', baseFreq: 6, binauralBeat: 2 },
  'sleep': { band: 'delta', baseFreq: 2, binauralBeat: 1 },
  'creativity': { band: 'theta', baseFreq: 7, binauralBeat: 4 },
  'energy': { band: 'beta', baseFreq: 25, binauralBeat: 8 }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`🧠 Brainwave stream request: ${req.method} ${req.url}`);

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      const { frequency, goal = 'focus', duration = 30 } = body;
      
      console.log(`🎵 Generating brainwave stream:`, { frequency, goal, duration });
      
      // Validate parameters
      if (frequency && !(FREQUENCY_BANDS as any)[frequency]) {
        return new Response(
          JSON.stringify({ error: 'Invalid frequency band. Use: delta, theta, alpha, beta, gamma' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Determine frequency parameters
      const targetFreq = frequency || (GOAL_FREQUENCIES as any)[goal]?.band || 'alpha';
      const freqConfig = (GOAL_FREQUENCIES as any)[goal] || (GOAL_FREQUENCIES as any)['focus'];
      const bandConfig = (FREQUENCY_BANDS as any)[targetFreq];

      // Generate streaming response
      const stream = generateBrainwaveStream(freqConfig, bandConfig, duration);
      
      return new Response(stream, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'X-Brainwave-Frequency': targetFreq,
          'X-Base-Frequency': freqConfig.baseFreq.toString(),
          'X-Binaural-Beat': freqConfig.binauralBeat.toString(),
        }
      });
    }

    // Health check for GET requests
    if (req.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'Brainwave Stream Generator',
        supportedBands: Object.keys(FREQUENCY_BANDS),
        supportedGoals: Object.keys(GOAL_FREQUENCIES),
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('❌ Brainwave stream error:', error);
    return new Response(
      JSON.stringify({ error: 'Stream generation failed', details: error instanceof Error ? error.message : String(error) }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateBrainwaveStream(freqConfig: any, bandConfig: any, duration: number) {
  const stream = new ReadableStream({
    start(controller) {
      console.log(`🌊 Starting brainwave stream: ${freqConfig.baseFreq}Hz for ${duration}s`);
      
      let elapsed = 0;
      const interval = 1000; // 1 second intervals
      const startTime = Date.now();

      const timer = setInterval(() => {
        elapsed = Math.floor((Date.now() - startTime) / 1000);
        
        if (elapsed >= duration) {
          // Send completion event
          const completionData = {
            type: 'complete',
            timestamp: new Date().toISOString(),
            totalDuration: elapsed,
            message: 'Brainwave session completed'
          };
          
          controller.enqueue(`data: ${JSON.stringify(completionData)}\n\n`);
          controller.close();
          clearInterval(timer);
          return;
        }

        // Generate real-time brainwave data
        const progress = elapsed / duration;
        const currentFreq = freqConfig.baseFreq + (Math.sin(elapsed * 0.1) * 2); // Slight frequency modulation
        const intensity = 0.5 + (Math.sin(elapsed * 0.05) * 0.3); // Intensity variation
        
        const streamData = {
          type: 'brainwave',
          timestamp: new Date().toISOString(),
          elapsed: elapsed,
          progress: Math.round(progress * 100),
          frequency: {
            band: bandConfig,
            current: Math.round(currentFreq * 10) / 10,
            target: freqConfig.baseFreq,
            binauralBeat: freqConfig.binauralBeat
          },
          intensity: Math.round(intensity * 100) / 100,
          waveform: generateWaveformData(currentFreq, intensity),
          session: {
            goal: freqConfig.goal || 'focus',
            duration: duration,
            remaining: duration - elapsed
          }
        };

        controller.enqueue(`data: ${JSON.stringify(streamData)}\n\n`);
        
      }, interval);

      // Send initial connection event
      const initData = {
        type: 'connected',
        timestamp: new Date().toISOString(),
        session: {
          frequency: freqConfig,
          band: bandConfig,
          duration: duration
        },
        message: 'Brainwave stream initialized'
      };
      
      controller.enqueue(`data: ${JSON.stringify(initData)}\n\n`);
    }
  });

  return stream;
}

function generateWaveformData(frequency: number, intensity: number) {
  // Generate sample waveform data points for visualization
  const samples = 32;
  const waveform = [];
  
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * (2 * Math.PI);
    const amplitude = intensity * Math.sin(frequency * t);
    waveform.push(Math.round(amplitude * 100) / 100);
  }
  
  return waveform;
}