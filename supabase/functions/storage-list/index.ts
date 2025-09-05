// supabase/functions/storage-list/index.ts

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type,x-admin-key',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json'
};

const json = (b: any, s = 200) => new Response(JSON.stringify(b), { status: s, headers: CORS });

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const sb = () => createClient(SUPABASE_URL, SERVICE_KEY);

async function handleList(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const bucket = url.searchParams.get('bucket') || 'neuralpositivemusic';
  const prefix = url.searchParams.get('prefix') || 'tracks';
  const limit = Math.max(1, Math.min(parseInt(url.searchParams.get('limit') || '500', 10), 2000));
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10));
  const strict = url.searchParams.get('strict') === '1';
  
  try {
    const supabase = sb();
    
    // List files from storage
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list(prefix, {
        limit,
        offset,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('Storage list error:', error);
      return json({ ok: false, error: error.message });
    }

    if (!files) {
      return json({ ok: true, results: [], has_more: false });
    }

    // Process files and generate signed URLs
    const results = [];
    let mp3Count = 0;
    let okCount = 0;
    let badCount = 0;

    for (const file of files) {
      const isMP3 = file.name.toLowerCase().endsWith('.mp3');
      if (isMP3) mp3Count++;
      
      if (strict && !isMP3) continue;

      try {
        // Generate signed URL (24 hours)
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(`${prefix}/${file.name}`, 86400);

        if (urlError || !urlData?.signedUrl) {
          console.warn(`Failed to generate URL for ${file.name}:`, urlError);
          badCount++;
          continue;
        }

        // Test if it's actually audio (basic check)
        let audioOk = true;
        let contentType = null;

        try {
          const headResponse = await fetch(urlData.signedUrl, { method: 'HEAD' });
          contentType = headResponse.headers.get('content-type');
          audioOk = headResponse.ok && (contentType?.startsWith('audio/') ?? false);
        } catch {
          audioOk = false;
        }

        if (audioOk) okCount++;
        else badCount++;

        results.push({
          name: file.name,
          storage_key: `${prefix}/${file.name}`,
          url: urlData.signedUrl,
          audio_ok: audioOk,
          content_type: contentType
        });

      } catch (error) {
        console.warn(`Error processing ${file.name}:`, error);
        badCount++;
      }
    }

    const hasMore = files.length === limit;
    const nextOffset = hasMore ? offset + limit : undefined;

    return json({
      ok: true,
      bucket,
      prefix,
      totals: {
        scanned: files.length,
        mp3: mp3Count,
        ok: okCount,
        bad: badCount
      },
      results,
      has_more: hasMore,
      next_offset: nextOffset
    });

  } catch (error) {
    console.error('Storage list handler error:', error);
    return json({ ok: false, error: 'Internal server error' }, 500);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  
  const path = new URL(req.url).pathname.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  
  try {
    if (path.endsWith('/storage-list')) {
      return handleList(req);
    }
    
    return json({ ok: false, error: 'NotFound', path }, 404);
  } catch (e: any) {
    // Return JSON 200 on error so UI never throws "non-2xx"
    return json({ ok: false, error: e?.message || String(e) });
  }
});