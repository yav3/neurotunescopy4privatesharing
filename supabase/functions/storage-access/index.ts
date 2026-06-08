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

// Buckets the player and landing-page demo are allowed to read anonymously.
// Anything outside this allowlist is rejected before we touch the service role.
const ALLOWED_BUCKETS = new Set<string>([
  // Landing-page / branding assets
  "landingpage",
  "landingpagemusicexcerpts",
  "albumart",
  "playlistcards",
  "therapeutic-goal-and-genre-card-images",
  "stravamusicappimages",
  "commercials",
  "sheet-music",
  // Production audio buckets
  "audio",
  "neuralpositivemusic",
  "classicalfocus",
  "sambajazznocturnes",
  "Chopin",
  "Nocturnes",
  "gentleclassicalforpain",
  "sonatasforstress",
  "NewAgeandWorldFocus",
  "newageworldstressanxietyreduction",
  "painreducingworld",
  "moodboostremixesworlddance",
  "energyboostfocus",
  "ENERGYBOOST",
  "HIIT",
  "djmodeedm",
  "tropicalhouse",
  "WorldHouseFocus",
  "jamband",
  "countryandamericana",
  "samba",
  "reggaeton",
  "pop",
  "opera",
  "meditation",
  "focus-music",
  "curated-music-collection",
  "all music",
  "neurotunescopy",
]);

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
    const prefix = (body?.prefix ?? url.searchParams.get("prefix") ?? "") as string;
    const path = (body?.path ?? url.searchParams.get("path") ?? "") as string;
    const expiresIn = parseInt(
      String(body?.expiresIn ?? url.searchParams.get("expiresIn") ?? "3600"),
      10,
    );

    // Bucket allowlist — anonymous callers can only enumerate/sign URLs for
    // buckets we have explicitly opted in. Prevents arbitrary bucket probing.
    if (!ALLOWED_BUCKETS.has(bucket)) {
      console.warn(`🚫 storage-access: bucket not allowlisted: ${bucket}`);
      return new Response(JSON.stringify({ error: "Bucket not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`📂 storage-access: bucket=${bucket} prefix=${prefix} path=${path} mode=${mode} recursive=${recursive} limit=${limit}`);


    // Single-object signing mode — used by the frontend storageUrl helper.
    if (mode === "sign") {
      if (!path) {
        return new Response(JSON.stringify({ error: "path is required for mode=sign" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: signed, error: signErr } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, Math.min(Math.max(expiresIn, 60), 3600));
      if (signErr || !signed?.signedUrl) {
        console.error(`❌ sign failed for ${bucket}/${path}:`, signErr);
        return new Response(JSON.stringify({ error: "Failed to sign URL" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({ stream_url: signed.signedUrl, bucket, path, expiresIn }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const maxDepth = 3;
    const names = recursive
      ? await listRecursive({ supabase, bucket, prefix, limit, maxDepth })
      : ((await supabase.storage.from(bucket).list(prefix, { limit, sortBy: { column: "name", order: "asc" } }))
          .data?.map((f) => (prefix ? `${prefix}/${f.name}` : f.name)) ?? []);

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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
