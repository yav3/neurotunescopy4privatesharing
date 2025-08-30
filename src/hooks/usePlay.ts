import { useRef } from "react";
import { useAudioStore } from "@/stores/audioStore";
import { buildStreamUrl, headOk } from "../lib/stream";

export function usePlay() {
  const { playTrack, pause, isPlaying, currentTrack } = useAudioStore();
  const lastClick = useRef(0);

  async function safePlay(trackId: string) {
    const now = Date.now();
    if (now - lastClick.current < 300) return; // debounce rapid taps
    lastClick.current = now;

    const url = buildStreamUrl(trackId);
    const ok = await headOk(url);
    if (!ok) {
      throw new Error(`Stream 404/blocked for ${trackId} (${url})`);
    }
    await playTrack({ id: trackId, title: "" });
  }

  return { safePlay, pause, isPlaying, currentId: currentTrack?.id };
}