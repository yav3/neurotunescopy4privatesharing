import { useRef } from "react";
import { useNewAudio } from "../context/NewAudioContext";
import { buildStreamUrl, headOk } from "../lib/stream";

export function usePlay() {
  const { playById, pause, isPlaying, currentId } = useNewAudio();
  const lastClick = useRef(0);

  async function safePlay(trackId: string, filePath?: string) {
    const now = Date.now();
    if (now - lastClick.current < 300) return; // debounce rapid taps
    lastClick.current = now;

    const url = buildStreamUrl(trackId, filePath);
    const ok = await headOk(url);
    if (!ok) {
      throw new Error(`Stream 404/blocked for ${trackId} (${url})`);
    }
    await playById(trackId, filePath);
  }

  return { safePlay, pause, isPlaying, currentId };
}