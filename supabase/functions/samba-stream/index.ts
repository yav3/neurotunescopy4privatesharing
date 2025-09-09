import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Track {
  id: string;
  title: string;
  artist: string;
  storage_bucket: string;
  storage_key: string;
  stream_url: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const fileName = url.searchParams.get('file');

    console.log('Samba Stream Request:', { action, fileName });

    if (action === 'list') {
      // List all music files from samba bucket
      const { data: files, error } = await supabase.storage
        .from('samba')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error listing samba files:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to list samba files', details: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Filter for audio files and convert to track format
      const tracks: Track[] = files
        .filter(file => file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.m4a'))
        .map((file, index) => ({
          id: `samba-${index}-${file.name}`,
          title: file.name
            .replace(/\.(mp3|wav|m4a)$/i, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase()),
          artist: 'Samba & Jazz Collection',
          storage_bucket: 'samba',
          storage_key: file.name,
          stream_url: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/samba/${file.name}`
        }));

      console.log(`Found ${tracks.length} samba tracks`);

      return new Response(
        JSON.stringify({ tracks, count: tracks.length }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (action === 'stream' && fileName) {
      // Stream a specific file
      const { data: fileData, error } = await supabase.storage
        .from('samba')
        .download(fileName);

      if (error || !fileData) {
        console.error('Error downloading file:', error);
        return new Response(
          JSON.stringify({ error: 'File not found', details: error?.message }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Convert blob to array buffer for streaming
      const arrayBuffer = await fileData.arrayBuffer();
      
      return new Response(arrayBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Content-Length': arrayBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=3600',
        }
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use ?action=list or ?action=stream&file=filename' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Samba stream error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});