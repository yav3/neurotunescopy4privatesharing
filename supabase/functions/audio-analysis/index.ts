import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AudioFeatures {
  // Basic properties
  file_size_bytes?: number
  duration_seconds?: number
  sample_rate?: number
  
  // Musical features
  musical_key?: string
  musical_scale?: string
  key_strength?: number
  tempo_bpm?: number
  camelot?: string
  
  // Spectral features
  spectral_centroid_mean?: number
  spectral_rolloff_mean?: number
  spectral_bandwidth_mean?: number
  spectral_contrast_mean?: number
  spectral_flatness_mean?: number
  zero_crossing_rate_mean?: number
  
  // Harmonic features
  harmonic_energy_ratio?: number
  percussive_energy_ratio?: number
  chroma_stft_mean?: number
  chroma_cqt_mean?: number
  tonnetz_mean?: number
  
  // Rhythmic features
  onset_count?: number
  onset_rate?: number
  danceability_score?: number
  
  // Mood features
  mood_acoustic?: number
  mood_aggressive?: number
  mood_electronic?: number
  mood_happy?: number
  mood_party?: number
  mood_relaxed?: number
  mood_sad?: number
  
  // Dynamic features
  rms_energy_mean?: number
  dynamic_range?: number
  
  // All features as JSON
  comprehensive_analysis?: Record<string, any>
}

interface BatchUpdateRequest {
  tracks: Array<{
    file_path: string
    file_name?: string
    features: AudioFeatures
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'POST') {
      const { tracks }: BatchUpdateRequest = await req.json()
      
      if (!tracks || !Array.isArray(tracks)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request format. Expected tracks array.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const results = []
      let successCount = 0
      let errorCount = 0

      for (const track of tracks) {
        try {
          const features = track.features
          
          // Prepare update data
          const updateData: any = {
            key: features.musical_key,
            scale: features.musical_scale,
            key_strength: features.key_strength,
            tempo_bpm: features.tempo_bpm,
            camelot: features.camelot,
            danceability_score: features.danceability_score,
            
            // JSON feature groups
            spectral_features: {
              centroid_mean: features.spectral_centroid_mean,
              rolloff_mean: features.spectral_rolloff_mean,
              bandwidth_mean: features.spectral_bandwidth_mean,
              contrast_mean: features.spectral_contrast_mean,
              flatness_mean: features.spectral_flatness_mean,
              zero_crossing_rate_mean: features.zero_crossing_rate_mean
            },
            
            harmonic_features: {
              harmonic_energy_ratio: features.harmonic_energy_ratio,
              percussive_energy_ratio: features.percussive_energy_ratio,
              chroma_stft_mean: features.chroma_stft_mean,
              chroma_cqt_mean: features.chroma_cqt_mean,
              tonnetz_mean: features.tonnetz_mean
            },
            
            rhythmic_features: {
              onset_count: features.onset_count,
              onset_rate: features.onset_rate,
              danceability_score: features.danceability_score
            },
            
            psychoacoustic_features: {
              mood_acoustic: features.mood_acoustic,
              mood_aggressive: features.mood_aggressive,
              mood_electronic: features.mood_electronic,
              mood_happy: features.mood_happy,
              mood_party: features.mood_party,
              mood_relaxed: features.mood_relaxed,
              mood_sad: features.mood_sad
            },
            
            mood_scores: {
              acoustic: features.mood_acoustic || 0,
              aggressive: features.mood_aggressive || 0,
              electronic: features.mood_electronic || 0,
              happy: features.mood_happy || 0,
              party: features.mood_party || 0,
              relaxed: features.mood_relaxed || 0,
              sad: features.mood_sad || 0
            },
            
            dynamic_features: {
              rms_energy_mean: features.rms_energy_mean,
              dynamic_range: features.dynamic_range
            },
            
            comprehensive_analysis: features.comprehensive_analysis || features,
            analysis_version: 'python_v1.0',
            analyzed_at: new Date().toISOString()
          }

          // Update track by file_path
          const { error } = await supabase
            .from('tracks')
            .update(updateData)
            .eq('file_path', track.file_path)

          if (error) {
            console.error(`Error updating track ${track.file_path}:`, error)
            results.push({
              file_path: track.file_path,
              status: 'error',
              error: error.message
            })
            errorCount++
          } else {
            results.push({
              file_path: track.file_path,
              status: 'success'
            })
            successCount++
          }
          
        } catch (err) {
          console.error(`Error processing track ${track.file_path}:`, err)
          results.push({
            file_path: track.file_path,
            status: 'error',
            error: err.message
          })
          errorCount++
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          total_tracks: tracks.length,
          success_count: successCount,
          error_count: errorCount,
          results: results
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // GET - Get analysis status
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const file_path = url.searchParams.get('file_path')
      
      if (file_path) {
        const { data, error } = await supabase
          .from('tracks')
          .select('id, title, key, camelot, tempo_bpm, danceability_score, analyzed_at, analysis_version, comprehensive_analysis')
          .eq('file_path', file_path)
          .single()

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Track not found' }),
            { 
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({
            success: true,
            track: data,
            analyzed: !!data.analyzed_at
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Get overall analysis statistics
      const { data, error } = await supabase
        .from('tracks')
        .select('analyzed_at, analysis_version, key, camelot, tempo_bpm')

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const totalTracks = data.length
      const analyzedTracks = data.filter(t => t.analyzed_at).length
      const withKeys = data.filter(t => t.key || t.camelot).length
      const withTempo = data.filter(t => t.tempo_bpm).length

      return new Response(
        JSON.stringify({
          success: true,
          statistics: {
            total_tracks: totalTracks,
            analyzed_tracks: analyzedTracks,
            tracks_with_keys: withKeys,
            tracks_with_tempo: withTempo,
            analysis_coverage: totalTracks > 0 ? (analyzedTracks / totalTracks * 100).toFixed(1) + '%' : '0%'
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Audio analysis error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})