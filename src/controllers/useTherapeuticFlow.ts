import { useCallback, useMemo, useRef, useState } from "react";
import { useAudio } from "@/context";
import { searchTracks, toStreamUrl, type SearchCriteria } from "@/services/catalog";
import type { TherapeuticGoal, Track } from "@/types/music";

type FlowState =
  | "idle"
  | "goalSelected"
  | "querying"
  | "queued"       // we have candidates
  | "loading"      // HEAD warmup + attach src
  | "playing"
  | "error";

type Flow = {
  state: FlowState;
  goal?: TherapeuticGoal;
  criteria?: SearchCriteria;
  queue: Track[];
  current?: Track;
  error?: string;

  // intents
  selectGoal: (g: TherapeuticGoal) => void;
  refineCriteria: (patch: Partial<SearchCriteria>) => void;
  start: () => Promise<void>;
  next: () => Promise<void>;
};

function buildDefaultCriteria(goal: TherapeuticGoal): SearchCriteria {
  // opinionated defaults per goal
  if (goal === "focus_up") {
    return {
      goal,
      valence_min: 0.70,
      arousal_max: 0.50,
      camelot_allow: [], // filled by backend or caller
      limit: 100
    };
  }
  if (goal === "anxiety_down" || goal === "sleep") {
    return {
      goal,
      valence_min: 0.65,
      arousal_max: 0.45,
      camelot_allow: [],
      limit: 100
    };
  }
  if (goal === "mood_up" || goal === "pain_down") {
    return {
      goal,
      valence_min: 0.80,
      arousal_max: 0.70,
      camelot_allow: [],
      limit: 100
    };
  }
  return { goal, limit: 100 };
}

export function useTherapeuticFlow(): Flow {
  const audio = useAudio();
  const [state, setState] = useState<FlowState>("idle");
  const [goal, setGoal] = useState<TherapeuticGoal | undefined>();
  const [criteria, setCriteria] = useState<SearchCriteria | undefined>();
  const [queue, setQueue] = useState<Track[]>([]);
  const [current, setCurrent] = useState<Track | undefined>();
  const [error, setError] = useState<string | undefined>();
  const inFlight = useRef<AbortController | null>(null);

  const abort = () => {
    inFlight.current?.abort();
    inFlight.current = null;
  };

  const selectGoal = useCallback((g: TherapeuticGoal) => {
    abort();
    setGoal(g);
    setCriteria(buildDefaultCriteria(g));
    setQueue([]);
    setCurrent(undefined);
    setError(undefined);
    setState("goalSelected");
  }, []);

  const refineCriteria = useCallback((patch: Partial<SearchCriteria>) => {
    setCriteria(prev => ({ ...(prev ?? { goal: goal! }), ...patch }));
  }, [goal]);

  const start = useCallback(async () => {
    if (!goal) return;
    if (!criteria) return;

    abort();
    const ac = new AbortController();
    inFlight.current = ac;
    setError(undefined);
    setState("querying");

    try {
      const tracks = await searchTracks(criteria);
      if (ac.signal.aborted) return;

      if (!tracks.length) {
        setQueue([]);
        setState("error");
        setError("No tracks matched the criteria.");
        return;
      }

      setQueue(tracks);
      setState("queued");
      // Immediately load the first
      await loadThenPlay(tracks[0], ac);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setState("error");
      setError(e?.message || "Search failed");
    }
  }, [goal, criteria]);

  const loadThenPlay = useCallback(async (track: Track, ac: AbortController) => {
    setCurrent(track);
    setState("loading");
    const url = toStreamUrl(track.file_path);

    // HEAD to validate + warm CDN
    await fetch(url, { method: "HEAD", signal: ac.signal });

    if (ac.signal.aborted) return;
    await audio.load(url);
    if (ac.signal.aborted) return;

    audio.play();
    setState("playing");
  }, [audio]);

  const next = useCallback(async () => {
    if (!queue.length) return;
    abort();
    const ac = new AbortController();
    inFlight.current = ac;

    // rotate queue
    setQueue(prev => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });

    const nextTrack = (queue.length > 1 ? queue[1] : queue[0])!;
    await loadThenPlay(nextTrack, ac);
  }, [queue, loadThenPlay]);

  return useMemo(() => ({
    state, goal, criteria, queue, current, error,
    selectGoal, refineCriteria, start, next
  }), [state, goal, criteria, queue, current, error, selectGoal, refineCriteria, start, next]);
}