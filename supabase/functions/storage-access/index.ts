import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ListItem = {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  metadata?: { size?: number } | null;
};

const AUDIO_EXT = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"];
const ARTWORK_EXT = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".mp4",
  ".mov",
  ".webm",
];

function hasExt(name: string, exts: string[]) {
  const lower = name.toLowerCase();
  return exts.some((ext) => lower.endsWith(ext));
}

function cleanTitle(filename: string): string {
  let title = filename.replace(/\.[^/.]+$/, "");
  title = title.replace(/[_-]/g, " ");
  title = title.replace(/\s+/g, " ");
  title = title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return title.trim();
}

async function listRecursive(params: {
  supabase: ReturnType<typeof createClient>;
  bucket: string;
  prefix: string;
  limit: number;
  maxDepth: number;
  depth?: number;
}): Promise<string[]> {
  const { supabase, bucket, prefix, limit, maxDepth } = params;
  const depth = params.depth ?? 0;

  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Supabase returns “folders” (id null) and “files” (id string)
  const files: string[] = [];
  const folders: string[] = [];

  for (const item of data as ListItem[]) {
    if (!item?.name) continue;
    if (item.name.startsWith(".") || item.name === ".emptyFolderPlaceholder") continue;

    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

    if (item.id) {
      files.push(fullPath);
    } else {
      // folder
      folders.push(fullPath);
    }
  }

  if (depth >= maxDepth || folders.length === 0) return files;

  const nested = await Promise.all(
    folders.map((folderPrefix) =>
      listRecursive({ supabase, bucket, prefix: folderPrefix, limit, maxDepth, depth: depth + 1 }),
    ),
  );

  return [...files, ...nested.flat()];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const url = new URL(req.url);

    // Support both GET query params and POST JSON body
    let body: any = null;
    if (req.method !== "GET") {
      try {
        body = await req.json();
      } catch {
        body = null;
      }
    }

    const bucket = (body?.bucket ?? url.searchParams.get("bucket") ?? "classicalfocus") as string;
    const limit = parseInt(String(body?.limit ?? url.searchParams.get("limit") ?? "100"), 10);
    const mode = (body?.mode ?? url.searchParams.get("mode") ?? "audio") as "audio" | "artwork" | "all";
    const recursive = String(body?.recursive ?? url.searchParams.get("recursive") ?? "false") === "true";

    console.log(`📂 storage-access: bucket=${bucket} mode=${mode} recursive=${recursive} limit=${limit}`);

    const maxDepth = 3;
    const names = recursive
      ? await listRecursive({ supabase, bucket, prefix: "", limit, maxDepth })
      : (await supabase.storage.from(bucket).list("", { limit, sortBy: { column: "name", order: "asc" } }))
          .data?.map((f) => f.name) ?? [];

    if (names.length === 0) {
      return new Response(JSON.stringify({ files: [], bucket, mode, recursive }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "artwork" || (mode === "all" && bucket === "albumart")) {
      const files = names.filter((n) => hasExt(n, ARTWORK_EXT));
      return new Response(JSON.stringify({
        files: files.map((name) => ({ name })),
        total: files.length,
        bucket,
        mode,
        recursive,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: audio behavior (backwards compatible)
    const audioFiles = names.filter((n) => hasExt(n, AUDIO_EXT));

    const tracks = await Promise.all(
      audioFiles.map(async (name) => {
        let streamUrl: string | undefined;

        try {
          const { data: signedUrlData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(name, 3600);

          if (!signedError && signedUrlData?.signedUrl) {
            streamUrl = signedUrlData.signedUrl;
          }
        } catch {
          // ignore
        }

        if (!streamUrl) {
          const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(name);
          streamUrl = publicUrlData.publicUrl;
        }

        return {
          id: `${bucket}-${name}`,
          title: cleanTitle(name.split("/").pop() ?? name),
          storage_bucket: bucket,
          storage_key: name,
          stream_url: streamUrl,
        };
      }),
    );

    return new Response(
      JSON.stringify({ tracks, total: tracks.length, bucket, mode: "audio", recursive }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("❌ Error in storage-access function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
