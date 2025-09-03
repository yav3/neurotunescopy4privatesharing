import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Comprehensive analysis features (legacy format)
interface AudioFeatures {
  file_size_bytes?: number
  duration_seconds?: number
  sample_rate?: number
  musical_key?: string
  musical_scale?: string
  key_strength?: number
  tempo_bpm?: number
  camelot?: string
  spectral_centroid_mean?: number
  spectral_rolloff_mean?: number
  spectral_bandwidth_mean?: number
  spectral_contrast_mean?: number
  spectral_flatness_mean?: number
  zero_crossing_rate_mean?: number
  harmonic_energy_ratio?: number
  percussive_energy_ratio?: number
  chroma_stft_mean?: number
  chroma_cqt_mean?: number
  tonnetz_mean?: number
  onset_count?: number
  onset_rate?: number
  danceability_score?: number
  mood_acoustic?: number
  mood_aggressive?: number
  mood_electronic?: number
  mood_happy?: number
  mood_party?: number
  mood_relaxed?: number
  mood_sad?: number
  rms_energy_mean?: number
  dynamic_range?: number
  comprehensive_analysis?: Record<string, any>
}

// Streamlined analysis data (new format)
interface StreamlinedAudioData {
  file_path: string
  file_name: string
  musical_key?: string
  musical_scale?: string
  key_strength?: number
  camelot?: string
  tempo_bpm?: number
  beat_confidence?: number
  beats_detected?: number
  energy_level?: number
  brightness?: number
  texture?: number
  dynamic_range?: number
  processing_time?: number
  analysis_method?: string
  error_message?: string
  
  // Optional comprehensive features
  spectral_features?: Record<string, any>
  harmonic_features?: Record<string, any>
  rhythmic_features?: Record<string, any>
  psychoacoustic_features?: Record<string, any>
  tonal_features?: Record<string, any>
  structural_features?: Record<string, any>
}

// Legacy batch request format
interface BatchUpdateRequest {
  tracks: Array<{
    file_path: string
    file_name?: string
    features: AudioFeatures
  }>
}

// New streamlined batch request format
interface StreamlinedBatchRequest {
  tracks: StreamlinedAudioData[]
  analysis_type: string
  batch_size?: number
  timestamp?: number
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
      const requestData = await req.json()
      
      // Detect request format
      const isStreamlined = requestData.analysis_type === 'streamlined_batch' || 
                           (requestData.tracks && requestData.tracks[0]?.analysis_method === 'streamlined_key_detection')
      
      if (isStreamlined) {
        return await handleStreamlinedBatch(supabase, requestData as StreamlinedBatchRequest)
      } else {
        return await handleComprehensiveBatch(supabase, requestData as BatchUpdateRequest)
      }
    }

    // GET - Get analysis status
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const file_path = url.searchParams.get('file_path')
      const action = url.searchParams.get('action')
      
      if (file_path) {
        const { data, error } = await supabase
          .from('music_tracks')
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
        .from('music_tracks')
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
      const streamlinedTracks = data.filter(t => t.analysis_version?.includes('streamlined')).length

      return new Response(
        JSON.stringify({
          success: true,
          statistics: {
            total_tracks: totalTracks,
            analyzed_tracks: analyzedTracks,
            tracks_with_keys: withKeys,
            tracks_with_tempo: withTempo,
            streamlined_analyses: streamlinedTracks,
            comprehensive_analyses: analyzedTracks - streamlinedTracks,
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

// Handle streamlined analysis batch (new format)
async function handleStreamlinedBatch(supabase: any, data: StreamlinedBatchRequest) {
  console.log(`🚀 Processing streamlined batch: ${data.tracks.length} tracks`)
  
  let updatedTracks = 0
  let errors: Array<{ track: string; error: string }> = []
  
  for (const trackData of data.tracks) {
    try {
      console.log(`Processing streamlined track: ${trackData.file_name}`)
      
      // Find matching track in database by file_path, title, or file_name
      const { data: existingTrack, error: findError } = await supabase
        .from('music_tracks')
        .select('id, file_path, title')
        .or(`file_path.eq.${trackData.file_path},title.eq.${trackData.file_name}`)
        .single()
      
      if (findError || !existingTrack) {
        console.log(`Track not found in database: ${trackData.file_name}`)
        errors.push({
          track: trackData.file_name,
          error: 'Track not found in database'
        })
        continue
      }

      // Prepare streamlined update data
      const updateData: any = {
        analyzed_at: new Date().toISOString(),
        analysis_version: 'streamlined_1.0'
      }

      // Core musical features
      if (trackData.musical_key) updateData.key = trackData.musical_key
      if (trackData.camelot) updateData.camelot = trackData.camelot
      if (trackData.tempo_bpm) updateData.tempo_bpm = trackData.tempo_bpm
      if (trackData.musical_scale) updateData.scale = trackData.musical_scale
      if (trackData.key_strength !== undefined) updateData.key_strength = trackData.key_strength

      // Map streamlined features to database columns
      if (trackData.energy_level !== undefined) {
        updateData.energy = trackData.energy_level
      }

      // Store streamlined features in JSON fields
      updateData.rhythmic_features = {
        beat_confidence: trackData.beat_confidence || 0,
        beats_detected: trackData.beats_detected || 0,
        analysis_method: 'streamlined'
      }
      
      updateData.dynamic_features = {
        energy_level: trackData.energy_level || 0,
        dynamic_range: trackData.dynamic_range || 0,
        texture: trackData.texture || 0,
        analysis_method: 'streamlined'
      }
      
      updateData.spectral_features = {
        brightness: trackData.brightness || 0,
        analysis_method: 'streamlined'
      }

      // Store complete streamlined analysis data
      updateData.comprehensive_analysis = trackData

      console.log(`Updating track ${existingTrack.id} with streamlined analysis`)
      
      // Update the track in the database
      const { error: updateError } = await supabase
        .from('music_tracks')
        .update(updateData)
        .eq('id', existingTrack.id)

      if (updateError) {
        console.error(`Failed to update track ${existingTrack.id}:`, updateError)
        errors.push({
          track: trackData.file_name,
          error: updateError.message
        })
      } else {
        updatedTracks++
        console.log(`✅ Successfully updated track: ${existingTrack.title} (streamlined)`)
      }

    } catch (error) {
      console.error(`Error processing streamlined track ${trackData.file_name}:`, error)
      errors.push({
        track: trackData.file_name,
        error: error.message
      })
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      analysis_type: 'streamlined',
      totalTracks: data.tracks.length,
      updatedTracks,
      errorCount: errors.length,
      errors: errors.slice(0, 10), // Return first 10 errors
      processing_time: Date.now() - (data.timestamp || Date.now())
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

// Handle comprehensive analysis batch (legacy format)
async function handleComprehensiveBatch(supabase: any, data: BatchUpdateRequest) {
  console.log(`📊 Processing comprehensive batch: ${data.tracks.length} tracks`)
  
  const results = []
  let successCount = 0
  let errorCount = 0

  for (const track of data.tracks) {
    try {
      const features = track.features
      
      // Prepare comprehensive update data
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
        analysis_version: 'comprehensive_v1.0',
        analyzed_at: new Date().toISOString()
      }

      // Update track by file_path
      const { error } = await supabase
        .from('music_tracks')
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
      analysis_type: 'comprehensive',
      total_tracks: data.tracks.length,
      success_count: successCount,
      error_count: errorCount,
      results: results
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}