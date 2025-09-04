import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface AnalysisResult {
  track_id: string;
  musical_key?: string;
  camelot_key?: string;
  key_confidence?: number;
  bpm_multifeature?: number;
  danceability_score?: number;
  onset_rate_per_second?: number;
  spectral_centroid_mean?: number;
  spectral_rolloff_mean?: number;
  spectral_bandwidth_mean?: number;
  zero_crossing_rate_mean?: number;
  loudness_integrated_lufs?: number;
  dynamic_complexity?: number;
  roughness?: number;
  mood_happy?: number;
  mood_sad?: number;
  mood_aggressive?: number;
  mood_relaxed?: number;
  mood_acoustic?: number;
  mood_electronic?: number;
  pitch_mean_hz?: number;
  tuning_frequency_hz?: number;
  inharmonicity?: number;
  rms_energy_mean?: number;
  dynamic_range_db?: number;
  crest_factor?: number;
  comprehensive_analysis?: Record<string, any>;
  analysis_timestamp?: string;
  analysis_version?: string;
  analysis_error?: string;
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Only allow POST requests
  if (method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing Supabase credentials'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    const { results, batch_id, processing_info } = body;

    if (!results || !Array.isArray(results)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: 'Expected array of analysis results'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing batch ${batch_id} with ${results.length} tracks`);

    // Process each analysis result
    const processed = [];
    const errors = [];

    for (const result of results as AnalysisResult[]) {
      try {
        if (result.analysis_error) {
          // Handle analysis errors
          const { error: updateError } = await supabase
            .from('tracks')
            .update({
              last_error: result.analysis_error,
              analysis_timestamp: new Date().toISOString()
            })
            .eq('id', result.track_id);

          if (updateError) {
            console.error(`Error updating track ${result.track_id} with error status:`, updateError);
            errors.push({ track_id: result.track_id, error: updateError.message });
          } else {
            processed.push({ track_id: result.track_id, status: 'error_recorded' });
          }
          continue;
        }

        // Update track with comprehensive analysis
        const updateData = {
          // Harmonic Analysis
          key: result.musical_key || null,
          camelot: result.camelot_key || null,
          key_confidence: result.key_confidence || null,
          
          // Rhythmic Analysis
          bpm: result.bpm_multifeature || null,
          danceability: result.danceability_score || null,
          onset_rate: result.onset_rate_per_second || null,
          
          // Spectral Analysis
          spectral_centroid: result.spectral_centroid_mean || null,
          spectral_rolloff: result.spectral_rolloff_mean || null,
          spectral_bandwidth: result.spectral_bandwidth_mean || null,
          zero_crossing_rate: result.zero_crossing_rate_mean || null,
          
          // Psychoacoustic Analysis
          loudness_lufs: result.loudness_integrated_lufs || null,
          dynamic_complexity: result.dynamic_complexity || null,
          roughness: result.roughness || null,
          
          // Mood Analysis
          mood_happy: result.mood_happy || null,
          mood_sad: result.mood_sad || null,
          mood_aggressive: result.mood_aggressive || null,
          mood_relaxed: result.mood_relaxed || null,
          mood_acoustic: result.mood_acoustic || null,
          mood_electronic: result.mood_electronic || null,
          
          // Tonal Analysis
          pitch_mean: result.pitch_mean_hz || null,
          tuning_frequency: result.tuning_frequency_hz || null,
          inharmonicity: result.inharmonicity || null,
          
          // Dynamic Analysis
          rms_energy: result.rms_energy_mean || null,
          dynamic_range: result.dynamic_range_db || null,
          crest_factor: result.crest_factor || null,
          
          // Full Analysis JSON
          comprehensive_analysis: result.comprehensive_analysis || null,
          analysis_timestamp: result.analysis_timestamp || new Date().toISOString(),
          analysis_version: result.analysis_version || '2.0',
          
          // Update audio status
          audio_status: 'analyzed',
          last_verified_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('tracks')
          .update(updateData)
          .eq('id', result.track_id);

        if (updateError) {
          console.error(`Error updating track ${result.track_id}:`, updateError);
          errors.push({ track_id: result.track_id, error: updateError.message });
        } else {
          console.log(`✅ Updated track ${result.track_id}: ${result.camelot_key} @ ${result.bpm_multifeature || 0} BPM`);
          processed.push({ 
            track_id: result.track_id, 
            status: 'updated',
            camelot_key: result.camelot_key,
            bpm: result.bpm_multifeature
          });
        }

      } catch (error) {
        console.error(`Error processing track ${result.track_id}:`, error);
        errors.push({ 
          track_id: result.track_id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Log batch completion
    console.log(`Batch ${batch_id} completed: ${processed.length} successful, ${errors.length} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        batch_id,
        processed_count: processed.length,
        error_count: errors.length,
        processed_tracks: processed,
        errors: errors,
        processing_info
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Analysis processing error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});