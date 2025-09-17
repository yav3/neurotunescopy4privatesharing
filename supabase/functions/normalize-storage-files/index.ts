import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RenameOperation {
  id: string
  storage_bucket: string
  old_key: string
  new_key: string
  status: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { bucket_name, dry_run = true, limit = 10 } = await req.json()

    if (!bucket_name) {
      return new Response(
        JSON.stringify({ error: 'bucket_name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`🔧 Starting file normalization for bucket: ${bucket_name}`)
    console.log(`📊 Mode: ${dry_run ? 'DRY RUN' : 'LIVE'}, Limit: ${limit}`)

    // Get pending repairs for this bucket
    const { data: repairs, error: repairError } = await supabaseClient
      .from('repair_map')
      .select('*')
      .eq('storage_bucket', bucket_name)
      .eq('status', 'pending')
      .limit(limit)

    if (repairError) {
      console.error('Error fetching repairs:', repairError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch repair map', details: repairError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!repairs || repairs.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No files found needing normalization', 
          bucket: bucket_name,
          repairs_found: 0 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📋 Found ${repairs.length} files needing normalization`)

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const repair of repairs as RenameOperation[]) {
      console.log(`🔄 Processing: ${repair.old_key} -> ${repair.new_key}`)
      
      try {
        if (!dry_run) {
          // Step 1: Download the original file
          const { data: fileData, error: downloadError } = await supabaseClient.storage
            .from(bucket_name)
            .download(repair.old_key)

          if (downloadError) {
            throw new Error(`Download failed: ${downloadError.message}`)
          }

          // Step 2: Upload with new name
          const { error: uploadError } = await supabaseClient.storage
            .from(bucket_name)
            .upload(repair.new_key, fileData, {
              contentType: 'audio/mpeg',
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`)
          }

          // Step 3: Delete original file
          const { error: deleteError } = await supabaseClient.storage
            .from(bucket_name)
            .remove([repair.old_key])

          if (deleteError) {
            console.warn(`Warning: Failed to delete original file ${repair.old_key}:`, deleteError)
            // Don't throw here - the file was successfully copied
          }

          // Step 4: Update database to mark as completed
          const { error: updateError } = await supabaseClient
            .from('repair_map')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', repair.id)

          if (updateError) {
            console.error(`Failed to update repair status for ${repair.id}:`, updateError)
          }

          // Step 5: Update any track records that reference this file
          const { error: trackUpdateError } = await supabaseClient
            .from('tracks')
            .update({ 
              storage_key: repair.new_key,
              audio_status: 'unknown', // Mark for re-verification
              last_verified_at: null
            })
            .eq('storage_bucket', bucket_name)
            .eq('storage_key', repair.old_key)

          if (trackUpdateError) {
            console.warn(`Warning: Failed to update track records:`, trackUpdateError)
          }

          console.log(`✅ Successfully renamed: ${repair.old_key} -> ${repair.new_key}`)
        }

        results.push({
          id: repair.id,
          old_name: repair.old_key,
          new_name: repair.new_key,
          status: dry_run ? 'would_rename' : 'success',
          action: dry_run ? 'simulation' : 'renamed'
        })
        
        successCount++
      } catch (error) {
        console.error(`❌ Failed to process ${repair.old_key}:`, error)
        
        // Mark as failed in database
        if (!dry_run) {
          await supabaseClient
            .from('repair_map')
            .update({ 
              status: 'failed',
              error_message: error.message,
              completed_at: new Date().toISOString()
            })
            .eq('id', repair.id)
        }

        results.push({
          id: repair.id,
          old_name: repair.old_key,
          new_name: repair.new_key,
          status: 'error',
          error: error.message,
          action: 'failed'
        })
        
        errorCount++
      }
    }

    const summary = {
      bucket: bucket_name,
      mode: dry_run ? 'dry_run' : 'live',
      total_processed: repairs.length,
      successful: successCount,
      failed: errorCount,
      results: results
    }

    console.log(`📈 Normalization summary:`, summary)

    return new Response(
      JSON.stringify(summary),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})