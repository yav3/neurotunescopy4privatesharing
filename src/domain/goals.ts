export const GOALS = [
  "anxiety-relief",
  "focus-enhancement", 
  "sleep-preparation",
  "mood-boost",
  "stress-reduction",
  "meditation-support",
] as const;

export type GoalSlug = typeof GOALS[number];

/** turn any UI label into a canonical slug */
export function toGoalSlug(input: string): GoalSlug {
  const s = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const map: Record<string, GoalSlug> = {
    // Direct matches
    anxiety: "anxiety-relief",
    "anxiety-relief": "anxiety-relief",
    "anxiety-down": "anxiety-relief",
    focus: "focus-enhancement", 
    "focus-enhancement": "focus-enhancement",
    "focus-up": "focus-enhancement",
    "focus_up": "focus-enhancement",
    sleep: "sleep-preparation",
    "sleep-preparation": "sleep-preparation",
    mood: "mood-boost",
    "mood-boost": "mood-boost",
    stress: "stress-reduction",
    "stress-reduction": "stress-reduction",
    meditation: "meditation-support",
    "meditation-support": "meditation-support",
    // Common synonyms
    calm: "anxiety-relief",
    relax: "anxiety-relief",
    concentration: "focus-enhancement",
    study: "focus-enhancement",
    "deep-sleep": "sleep-preparation",
    delta: "sleep-preparation",
    happy: "mood-boost",
    uplift: "mood-boost",
    relaxation: "stress-reduction",
    mindfulness: "meditation-support",
    theta: "meditation-support",
  };
  
  return (map[s] ?? (GOALS.includes(s as GoalSlug) ? (s as GoalSlug) : "mood-boost"));
}

/** Get display name for a goal slug */
export function getGoalDisplayName(slug: GoalSlug): string {
  const names: Record<GoalSlug, string> = {
    "anxiety-relief": "Anxiety Relief",
    "focus-enhancement": "Focus Enhancement", 
    "sleep-preparation": "Sleep Preparation",
    "mood-boost": "Mood Boost",
    "stress-reduction": "Stress Reduction",
    "meditation-support": "Meditation Support",
  };
  return names[slug];
}

/** Get goal categories for UI display */
export const GOAL_CATEGORIES = [
  { slug: "anxiety-relief" as GoalSlug, name: "Anxiety Relief", description: "Calm your mind and reduce anxiety" },
  { slug: "focus-enhancement" as GoalSlug, name: "Focus Enhancement", description: "Improve concentration and mental clarity" },
  { slug: "sleep-preparation" as GoalSlug, name: "Sleep Preparation", description: "Prepare for restful sleep" },
  { slug: "mood-boost" as GoalSlug, name: "Mood Boost", description: "Uplift your spirits and energy" },
  { slug: "stress-reduction" as GoalSlug, name: "Stress Reduction", description: "Relieve tension and stress" },
  { slug: "meditation-support" as GoalSlug, name: "Meditation Support", description: "Enhance mindfulness and meditation" },
];