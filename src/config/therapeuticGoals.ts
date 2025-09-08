import { LucideIcon, Brain, Heart, Zap, Waves, Flower2 } from 'lucide-react';

// Single source of truth for all therapeutic goals
export interface TherapeuticGoal {
  // Core identifiers
  id: string;                    // Unique internal ID (kebab-case)
  slug: string;                  // URL-friendly slug (matches domain/goals.ts)
  backendKey: string;           // Exact database/API identifier
  
  // Display information
  name: string;                 // Human-readable name
  shortName: string;            // Abbreviated name for UI
  description: string;          // Detailed description
  
  // Visual elements
  icon: LucideIcon;            // UI icon
  color: string;               // Tailwind color class base (e.g., 'blue')
  gradient: string;            // CSS gradient class
  
  // Therapeutic parameters
  bpmRange: {
    min: number;
    max: number;
    optimal: number;
  };
  
  // VAD (Valence-Arousal-Dominance) psychological profile
  vadProfile: {
    valence: number;    // Emotional positivity (-1 to 1)
    arousal: number;    // Energy/activation (-1 to 1)
    dominance: number;  // Control/power (-1 to 1)
  };
  
  // UI state
  isActive?: boolean;
  progress?: number;
  
  // Synonyms for flexible mapping
  synonyms: string[];
}

export const THERAPEUTIC_GOALS: TherapeuticGoal[] = [
  {
    id: 'focus-enhancement',
    slug: 'focus-enhancement', 
    backendKey: 'focus-enhancement',
    name: 'Focus Enhancement',
    shortName: 'Focus',
    description: 'Improve concentration and mental clarity',
    icon: Brain,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bpmRange: { min: 78, max: 100, optimal: 85 },
    vadProfile: { valence: 0.2, arousal: 0.6, dominance: 0.8 },
    synonyms: ['focus', 'concentration', 'study', 'focus_up', 'focus_enhancement']
  },
  {
    id: 'anxiety-relief',
    slug: 'anxiety-relief',
    backendKey: 'anxiety-relief', 
    name: 'Anxiety Relief',
    shortName: 'Calm',
    description: 'Calm your mind and reduce anxiety',
    icon: Heart,
    color: 'green',
    gradient: 'from-green-500 to-teal-500',
    bpmRange: { min: 40, max: 80, optimal: 60 },
    vadProfile: { valence: 0.6, arousal: 0.2, dominance: 0.4 },
    synonyms: ['anxiety', 'calm', 'relax', 'anxiety_relief', 'anxiety-down']
  },
  {
    id: 'stress-reduction',
    slug: 'stress-reduction',
    backendKey: 'stress-reduction',
    name: 'Stress Reduction', 
    shortName: 'Relax',
    description: 'Relieve tension and stress',
    icon: Waves,
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-500',
    bpmRange: { min: 50, max: 80, optimal: 65 },
    vadProfile: { valence: 0.6, arousal: 0.3, dominance: 0.4 },
    synonyms: ['stress', 'relaxation', 'stress_reduction', 'chill']
  },
  {
    id: 'mood-boost',
    slug: 'mood-boost',
    backendKey: 'mood-boost',
    name: 'Mood Boost',
    shortName: 'Energy',
    description: 'Uplift your spirits and energy',
    icon: Zap,
    color: 'orange',
    gradient: 'from-orange-500 to-yellow-500',
    bpmRange: { min: 90, max: 140, optimal: 120 },
    vadProfile: { valence: 0.8, arousal: 0.7, dominance: 0.5 },
    synonyms: ['mood', 'happy', 'uplift', 'mood_boost', 'energy']
  },
  {
    id: 'meditation-support',
    slug: 'meditation-support',
    backendKey: 'meditation-support',
    name: 'Meditation Support',
    shortName: 'Meditate',
    description: 'Enhance mindfulness and meditation',
    icon: Flower2,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bpmRange: { min: 50, max: 70, optimal: 60 },
    vadProfile: { valence: 0.6, arousal: 0.2, dominance: 0.3 },
    synonyms: ['meditation', 'mindfulness', 'theta', 'meditation_support']
  }
];

// Create lookup maps for fast access
export const GOALS_BY_ID = THERAPEUTIC_GOALS.reduce((acc, goal) => {
  acc[goal.id] = goal;
  return acc;
}, {} as Record<string, TherapeuticGoal>);

export const GOALS_BY_SLUG = THERAPEUTIC_GOALS.reduce((acc, goal) => {
  acc[goal.slug] = goal;
  return acc;
}, {} as Record<string, TherapeuticGoal>);

export const GOALS_BY_BACKEND_KEY = THERAPEUTIC_GOALS.reduce((acc, goal) => {
  acc[goal.backendKey] = goal;
  return acc;
}, {} as Record<string, TherapeuticGoal>);

// Create synonym mapping for flexible input
export const SYNONYM_TO_GOAL = THERAPEUTIC_GOALS.reduce((acc, goal) => {
  // Add the goal itself
  acc[goal.id] = goal;
  acc[goal.slug] = goal;
  acc[goal.backendKey] = goal;
  acc[goal.name.toLowerCase()] = goal;
  acc[goal.shortName.toLowerCase()] = goal;
  
  // Add all synonyms
  goal.synonyms.forEach(synonym => {
    acc[synonym.toLowerCase()] = goal;
  });
  
  return acc;
}, {} as Record<string, TherapeuticGoal>);

// Legacy type for backwards compatibility
export type GoalSlug = 'anxiety-relief' | 'focus-enhancement' | 'mood-boost' | 'stress-reduction' | 'meditation-support';

// Export goal slugs array for backwards compatibility
export const GOALS: GoalSlug[] = THERAPEUTIC_GOALS.map(g => g.slug as GoalSlug);