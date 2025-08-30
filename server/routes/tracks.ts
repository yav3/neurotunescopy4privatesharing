import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

router.get("/search", async (req, res) => {
  try {
    const {
      goal,
      valence_min = 0,
      arousal_max = 1,
      dominance_min = 0,
      camelot_allow = [],
      limit = 100,
    } = req.query as any;

    // derive defaults by goal (server-side truth)
    let vmin = Number(valence_min);
    let amax = Number(arousal_max);
    if (goal === "focus_up") { 
      vmin = Math.max(vmin, 0.70); 
      amax = Math.min(amax, 0.50); 
    }
    if (goal === "anxiety_down" || goal === "sleep") { 
      vmin = Math.max(vmin, 0.65); 
      amax = Math.min(amax, 0.45); 
    }
    if (goal === "mood_up" || goal === "pain_down") { 
      vmin = Math.max(vmin, 0.80); 
    }

    const camelot = Array.isArray(camelot_allow) 
      ? camelot_allow 
      : String(camelot_allow || "").split(",").filter(Boolean);

    let query = supabase
      .from('music_tracks')
      .select(`
        id,
        title,
        file_path,
        storage_key,
        valence,
        acousticness,
        energy,
        bpm,
        key_signature
      `)
      .gte('valence', vmin)
      .lte('energy', amax)
      .eq('upload_status', 'completed')
      .limit(Number(limit));

    if (camelot.length > 0) {
      query = query.in('key_signature', camelot);
    }

    const { data: tracks, error } = await query;

    if (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }

    // Transform to expected format with defensive deduplication
    const seen = new Set<string>();
    const formatted = [];
    
    for (const track of tracks || []) {
      if (seen.has(track.id)) continue;
      seen.add(track.id);
      
      formatted.push({
        unique_id: track.id,
        title: track.title,
        file_path: track.file_path || track.storage_key,
        camelot_key: track.key_signature || "1A",
        bpm: track.bpm,
        vad: {
          valence: track.valence || 0.5,
          arousal: track.energy || 0.5,
          dominance: track.acousticness || 0.5
        },
        audio_status: "working"
      });
    }

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;