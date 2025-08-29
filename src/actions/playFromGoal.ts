import { API } from "@/lib/api";
import { setQueue, playSingle } from "@/player/audio-core";

import type { Track } from "@/types";

type TrackLike = { id?: string; track_id?: string; title?: string; storage_key?: string; file_name?: string };

function normalize(t: TrackLike): Track {
  // player only needs { id } (stream by id); keep title for UI
  return { 
    id: (t.id ?? t.track_id) as string, 
    title: t.title ?? "" 
  };
}

export async function playFromGoal(goal: string, { limit = 50 } = {}) {
  // fetch playlist
  const r = await API.playlist(goal); // must return { tracks: [...] }
  const tracks = (r?.tracks ?? []).map(normalize).filter(x => !!x.id);

  if (!tracks.length) throw new Error(`No tracks for goal "${goal}"`);

  // select first track and start playback
  await setQueue(tracks.slice(0, limit), 0);
  return tracks.length;
}

export async function playTrackNow(track: TrackLike) {
  const t = normalize(track);
  if (!t.id) throw new Error("Track missing id");
  await playSingle(t);
}
