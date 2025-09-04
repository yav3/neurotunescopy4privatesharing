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
  
  // Core musical features - FIXED field names to match database
  bpm?: number;
  tempo_bpm?: number;
  key?: string;
  scale?: string;
  camelot?: string;  // Fixed: was camelot_key
  key_strength?: number;
  key_confidence?: number;
  tuning_frequency?: number;
  
  // Energy and dynamics
  energy_level?: number;
  energy?: number;
  valence?: number;
  arousal?: number;
  dominance?: number;
  danceability?: number;
  danceability_score?: number;
  
  // Audio characteristics
  acousticness?: number;
  instrumentalness?: number;
  speechiness?: number;
  loudness_lufs?: number;
  dynamic_range?: number;
  dynamic_complexity?: number;
  crest_factor?: number;
  rms_energy?: number;
  
  // Spectral features - FIXED field names
  spectral_centroid?: number;  // Fixed: was spectral_centroid_mean
  spectral_rolloff?: number;   // Fixed: was spectral_rolloff_mean
  spectral_bandwidth?: number; // Fixed: was spectral_bandwidth_mean
  zero_crossing_rate?: number; // Fixed: was zero_crossing_rate_mean
  roughness?: number;
  inharmonicity?: number;
  
  // Rhythm and timing
  onset_rate?: number;  // Fixed: was onset_rate_per_second
  pitch_mean?: number;  // Fixed: was pitch_mean_hz
  
  // Mood scores
  mood_happy?: number;
  mood_sad?: number;
  mood_aggressive?: number;
  mood_relaxed?: number;
  mood_acoustic?: number;
  mood_electronic?: number;
  
  // Complex feature structures
  mood_scores?: Record<string, number>;
  spectral_features?: Record<string, any>;
  harmonic_features?: Record<string, any>;
  rhythmic_features?: Record<string, any>;
  psychoacoustic_features?: Record<string, any>;
  tonal_features?: Record<string, any>;
  dynamic_features?: Record<string, any>;
  structural_features?: Record<string, any>;
  
  // Analysis metadata
  comprehensive_analysis?: Record<string, any>;
  analysis_version?: string;
  analyzed_at?: string;
  analysis_timestamp?: string;  // Legacy support
  tags?: string[];
  emotion_tags?: string[];
  therapeutic_use?: string[];
  eeg_targets?: string[];
  
  // Error handling
  error?: string;
  analysis_error?: string;  // Legacy support
}

serve(async (req: Request) => {
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

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

    // Parse request body - handle both formats
    let results: AnalysisResult[];
    const body = await req.json();
    
    if (Array.isArray(body)) {
      results = body;
    } else if (body.results && Array.isArray(body.results)) {
      results = body.results;
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: 'Expected array of analysis results or {results: [...]} object'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const batch_id = body.batch_id || `batch_${Date.now()}`;
    console.log(`🔬 Processing batch ${batch_id} with ${results.length} analysis results`);

    const processed = [];
    const errors = [];

    for (const result of results) {
      try {
        // Handle analysis errors
        if (result.error || result.analysis_error) {
          const error_msg = result.error || result.analysis_error;
          
          const { error: updateError } = await supabase
            .from('tracks')
            .update({
              last_error: error_msg,
              analyzed_at: new Date().toISOString()
            })
            .eq('id', result.track_id);

          if (updateError) {
            console.error(`❌ Error updating track ${result.track_id} with error status:`, updateError);
            errors.push({ track_id: result.track_id, error: updateError.message });
          } else {
            processed.push({ track_id: result.track_id, status: 'error_recorded' });
          }
          continue;
        }

        // Update track with comprehensive analysis
        const updateData = {
          // Core musical features
          bpm: result.bpm || null,
          tempo_bpm: result.tempo_bpm || null,
          key: result.key || null,
          scale: result.scale || null,
          camelot: result.camelot || null,
          key_strength: result.key_strength || null,
          key_confidence: result.key_confidence || null,
          tuning_frequency: result.tuning_frequency || null,
          
          // Energy and dynamics
          energy_level: result.energy_level || null,
          energy: result.energy || null,
          valence: result.valence || null,
          arousal: result.arousal || null,
          dominance: result.dominance || null,
          danceability: result.danceability || null,
          danceability_score: result.danceability_score || null,
          
          // Audio characteristics
          acousticness: result.acousticness || null,
          instrumentalness: result.instrumentalness || null,
          speechiness: result.speechiness || null,
          loudness_lufs: result.loudness_lufs || null,
          dynamic_range: result.dynamic_range || null,
          dynamic_complexity: result.dynamic_complexity || null,
          crest_factor: result.crest_factor || null,
          rms_energy: result.rms_energy || null,
          
          // Spectral features
          spectral_centroid: result.spectral_centroid || null,
          spectral_rolloff: result.spectral_rolloff || null,
          spectral_bandwidth: result.spectral_bandwidth || null,
          zero_crossing_rate: result.zero_crossing_rate || null,
          roughness: result.roughness || null,
          inharmonicity: result.inharmonicity || null,
          
          // Rhythm and timing
          onset_rate: result.onset_rate || null,
          pitch_mean: result.pitch_mean || null,
          
          // Mood scores
          mood_happy: result.mood_happy || null,
          mood_sad: result.mood_sad || null,
          mood_aggressive: result.mood_aggressive || null,
          mood_relaxed: result.mood_relaxed || null,
          mood_acoustic: result.mood_acoustic || null,
          mood_electronic: result.mood_electronic || null,
          
          // Complex feature structures (stored as JSONB)
          mood_scores: result.mood_scores || null,
          spectral_features: result.spectral_features || null,
          harmonic_features: result.harmonic_features || null,
          rhythmic_features: result.rhythmic_features || null,
          psychoacoustic_features: result.psychoacoustic_features || null,
          tonal_features: result.tonal_features || null,
          dynamic_features: result.dynamic_features || null,
          structural_features: result.structural_features || null,
          
          // Full comprehensive analysis
          comprehensive_analysis: result.comprehensive_analysis || null,
          analysis_version: result.analysis_version || 'v2024_comprehensive',
          analyzed_at: result.analyzed_at || result.analysis_timestamp || new Date().toISOString(),
          
          // Tags and metadata
          tags: result.tags || null,
          emotion_tags: result.emotion_tags || null,
          therapeutic_use: result.therapeutic_use || null,
          eeg_targets: result.eeg_targets || null,
          
          // Update audio status
          audio_status: 'working',
          last_verified_at: new Date().toISOString()
        };

        const { error: updateError } = await supabase
          .from('tracks')
          .update(updateData)
          .eq('id', result.track_id);

        if (updateError) {
          console.error(`❌ Error updating track ${result.track_id}:`, updateError);
          errors.push({ track_id: result.track_id, error: updateError.message });
        } else {
          console.log(`✅ Updated track ${result.track_id}: ${result.camelot || 'No key'} @ ${result.bpm || 0} BPM`);
          processed.push({ 
            track_id: result.track_id, 
            status: 'updated',
            camelot: result.camelot,
            bpm: result.bpm
          });
        }

      } catch (error) {
        console.error(`❌ Error processing track ${result.track_id}:`, error);
        errors.push({ 
          track_id: result.track_id, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Log batch completion
    console.log(`🎵 Batch ${batch_id} completed: ${processed.length} successful, ${errors.length} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        batch_id,
        processed_count: processed.length,
        error_count: errors.length,
        processed_tracks: processed,
        errors: errors,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Analysis processing error:', error);
    
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