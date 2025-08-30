import { useTherapeuticFlow } from "@/controllers/useTherapeuticFlow";
import type { TherapeuticGoal } from "@/types/music";

const GOALS: { key: TherapeuticGoal; label: string }[] = [
  { key: "focus_up", label: "Focus ↑" },
  { key: "anxiety_down", label: "Calm ↓" },
  { key: "sleep", label: "Sleep" },
  { key: "mood_up", label: "Mood ↑" },
  { key: "pain_down", label: "Pain ↓" },
];

export default function GoalPicker() {
  const flow = useTherapeuticFlow();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {GOALS.map(g => (
          <button
            key={g.key}
            onClick={() => flow.selectGoal(g.key)}
            className={`px-3 py-2 rounded-xl border transition-colors ${
              flow.goal === g.key 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-border hover:border-primary/50"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          disabled={!flow.goal || flow.state === "querying"}
          onClick={flow.start}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          Start
        </button>
        <button
          disabled={flow.state !== "playing" || flow.queue.length < 2}
          onClick={flow.next}
          className="px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors disabled:opacity-50"
        >
          Next track
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        state: {flow.state} {flow.error && <span className="text-destructive">• {flow.error}</span>}
      </div>

      {flow.current && (
        <div className="mt-2 p-3 rounded-lg bg-accent/50">
          <div className="text-lg font-medium text-foreground">{flow.current.title}</div>
          <div className="text-xs text-muted-foreground">
            {flow.current.camelot_key} • V {flow.current.vad.valence.toFixed(2)} / A {flow.current.vad.arousal.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}