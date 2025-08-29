// Singleton HTMLAudioElement with load-cancellation & queueing
type TrackSrc = { id: string; url: string };

class AudioEngine {
  private static _inst: AudioEngine;
  static get i() { return (this._inst ??= new AudioEngine()); }

  private audio = new Audio();
  private current?: TrackSrc;
  private loadToken = 0; // increments to cancel stale loads

  constructor() {
    this.audio.preload = "none";
    this.audio.crossOrigin = "anonymous";
  }

  get element() { return this.audio; }
  get isPlaying() { return !this.audio.paused; }
  get currentTrackId() { return this.current?.id; }

  async play(src: TrackSrc) {
    // Cancel any previous load/play by bumping token
    const myToken = ++this.loadToken;

    if (this.current?.id !== src.id || this.audio.src !== src.url) {
      this.current = src;
      this.audio.src = src.url;
      // Load intentionally before play to surface 404s fast
      try { await this.audio.load(); } catch {}
    }

    // If a later call happened, bail
    if (myToken !== this.loadToken) return;

    await this.audio.play().catch((e) => {
      throw new Error("Playback failed: " + (e?.message ?? e));
    });
  }

  pause() { this.audio.pause(); }
  stop() { this.audio.pause(); this.audio.src = ""; this.current = undefined; }

  async seek(seconds: number) {
    if (!isFinite(seconds)) return;
    this.audio.currentTime = Math.max(0, seconds);
  }
}

export const audioEngine = AudioEngine.i;