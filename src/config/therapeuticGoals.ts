import { LucideIcon, Brain, Sparkles, Plus, Waves, Flower, Shield } from 'lucide-react';

// Import the new therapeutic goal card images
import focusCard from '@/assets/therapeutic-card-1.png';
import stressCard from '@/assets/therapeutic-card-2.png';
import moodBoostCard from '@/assets/therapeutic-card-3.png';
import painCard from '@/assets/therapeutic-card-4.png';
import energyBoostCard from '@/assets/therapeutic-card-5.png';
import cardioCard from '@/assets/therapeutic-card-6.png';

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
  artwork: string;             // Album art image for the goal
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
  
  // Music bucket configuration  
  musicBuckets: string[];
  
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
    description: 'Instrumental music designed to entrain, amplifying focus to create a "flow state."',
    icon: Brain,
    artwork: focusCard,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bpmRange: { min: 78, max: 100, optimal: 85 },
    vadProfile: { valence: 0.6, arousal: 0.7, dominance: 0.6 },
    musicBuckets: ['focus-music', 'classicalfocus', 'Chopin', 'opera', 'curated-music-collection', 'neuralpositivemusic'],
    synonyms: ['focus', 'concentration', 'study', 'focus_up', 'focus_enhancement', 'classical']
  },
  {
    id: 'stress-anxiety-support',
    slug: 'stress-anxiety-support',
    backendKey: 'stress-anxiety-support',
    name: 'Stress & Anxiety Support',
    shortName: 'Calm',
    description: 'Calm your mind and reduce stress and anxiety',
    icon: Sparkles,
    artwork: stressCard,
    color: 'green',
    gradient: 'from-green-500 to-teal-500',
    bpmRange: { min: 40, max: 80, optimal: 60 },
    vadProfile: { valence: 0.6, arousal: 0.2, dominance: 0.4 },
    musicBuckets: ['newageworldstressanxietyreduction', 'sonatasforstress', 'samba', 'verified_music_collection', 'neuralpositivemusic'],
    synonyms: ['anxiety', 'stress', 'calm', 'relax', 'anxiety_relief', 'stress_reduction', 'anxiety-down', 'chill']
  },
  {
    id: 'mood-boost',
    slug: 'mood-boost',
    backendKey: 'mood-boost',
    name: 'Mood Boost',
    shortName: 'Energy',
    description: 'Uplift your spirits and energy',
    icon: Plus,
    artwork: moodBoostCard,
    color: 'cyan',
    gradient: 'from-cyan-500 to-teal-500',
    bpmRange: { min: 90, max: 140, optimal: 120 },
    vadProfile: { valence: 0.8, arousal: 0.7, dominance: 0.5 },
    musicBuckets: ['DISCOFUNKMOODBOOST', 'ROCKMOODBOOST', 'moodboostremixesworlddance', 'pop', 'house', 'neuralpositivemusic', 'HIIT'],
    synonyms: ['mood', 'happy', 'uplift', 'mood_boost', 'energy']
  },
  {
    id: 'pain-support',
    slug: 'pain-support',
    backendKey: 'pain-support',
    name: 'Pain Support',
    shortName: 'Relief',
    description: 'Provide comfort and pain relief support',
    icon: Flower,
    artwork: painCard,
    color: 'gray',
    gradient: 'from-gray-500 to-blue-500',
    bpmRange: { min: 50, max: 70, optimal: 60 },
    vadProfile: { valence: 0.6, arousal: 0.2, dominance: 0.3 },
    musicBuckets: ['gentleclassicalforpain', 'painreducingworld', 'neuralpositivemusic'],
    synonyms: ['pain', 'relief', 'comfort', 'pain_management', 'healing']
  },
  {
    id: 'energy-boost',
    slug: 'energy-boost',
    backendKey: 'energy-boost',
    name: 'Energy Boost',
    shortName: 'Energize',
    description: 'High-energy music to boost motivation and physical performance',
    icon: Waves,
    artwork: energyBoostCard,
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    bpmRange: { min: 120, max: 160, optimal: 140 },
    vadProfile: { valence: 0.8, arousal: 0.9, dominance: 0.7 },
    musicBuckets: ['ENERGYBOOST', 'neuralpositivemusic', 'HIIT', 'house', 'pop'],
    synonyms: ['energy', 'workout', 'exercise', 'cardio', 'motivation', 'pump']
  },
  {
    id: 'cardio-support',
    slug: 'cardio-support',
    backendKey: 'cardio-support',
    name: 'Cardio Support',
    shortName: 'Cardio',
    description: 'High-tempo music for cardiovascular exercise and fitness',
    icon: Shield,
    artwork: cardioCard,
    color: 'red',
    gradient: 'from-red-500 to-pink-500',
    bpmRange: { min: 130, max: 180, optimal: 150 },
    vadProfile: { valence: 0.7, arousal: 0.95, dominance: 0.8 },
    musicBuckets: ['HIIT', 'house', 'neuralpositivemusic', 'ENERGYBOOST', 'pop'],
    synonyms: ['cardio', 'running', 'cycling', 'fitness', 'exercise', 'workout']
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

// Legacy type for backwards compatibility - expanded to include new goals
export type GoalSlug = 'stress-anxiety-support' | 'focus-enhancement' | 'mood-boost' | 'pain-support' | 'energy-boost' | 'cardio-support';

// Export goal slugs array for backwards compatibility
export const GOALS: GoalSlug[] = THERAPEUTIC_GOALS.map(g => g.slug as GoalSlug);

// Helper function to get buckets for a goal
export function getBucketsForGoal(goalId: string): string[] {
  const goal = SYNONYM_TO_GOAL[goalId.toLowerCase()] || GOALS_BY_ID[goalId] || GOALS_BY_SLUG[goalId] || GOALS_BY_BACKEND_KEY[goalId];
  return goal?.musicBuckets || ['neuralpositivemusic']; // fallback to main bucket
}