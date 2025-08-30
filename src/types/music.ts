export type TherapeuticGoal =
  | "anxiety_down"
  | "pain_down"
  | "focus_up"
  | "sleep"
  | "mood_up";

export type VAD = { valence: number; arousal: number; dominance?: number };

export type Track = {
  unique_id: string;         // must be globally unique and stable
  title: string;
  artist?: string;
  file_path: string;         // storage path (no protocol/host)
  camelot_key: string;       // e.g. "8A", "5B"
  bpm?: number;
  vad: VAD;                  // normalized 0..1
  audio_status?: "working" | "bad" | "unknown";
};