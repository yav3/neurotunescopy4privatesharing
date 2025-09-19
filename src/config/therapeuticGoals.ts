import { LucideIcon, Brain, Sparkles, Plus, Waves, Flower, Shield } from 'lucide-react';

// Import the new therapeutic goal card images
import focusCard from '@/assets/therapeutic-card-1.png';
import stressCard from '@/assets/therapeutic-card-2.png';
import moodBoostCard from '@/assets/therapeutic-card-3.png';
import painCard from '@/assets/therapeutic-card-4.png';
import energyBoostCard from '@/assets/energy-motivation-updated.png';
import cardioCard from '@/assets/cardio-mountain-lake.jpg';
import meditationCard from '@/assets/meditation-support-card.png';
import calmMoodBoostCard from '@/assets/calm-mood-boost-leaf.png';
import anxietySupportCard from '@/assets/anxiety-support-misty-lake.png';


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
    musicBuckets: ['audio', 'neuralpositivemusic', 'Chopin', 'opera'],
    synonyms: ['focus', 'concentration', 'study', 'focus_up', 'focus_enhancement', 'classical']
  },
  {
    id: 'calm-mood-boost',
    slug: 'calm-mood-boost',
    backendKey: 'calm-mood-boost',
    name: 'Calm Mood Boost',
    shortName: 'Calm',
    description: 'Gentle music to boost your mood and reduce stress',
    icon: Sparkles,
    artwork: calmMoodBoostCard,
    color: 'green',
    gradient: 'from-green-500 to-teal-500',
    bpmRange: { min: 40, max: 80, optimal: 60 },
    vadProfile: { valence: 0.6, arousal: 0.2, dominance: 0.4 },
    musicBuckets: ['newageworldstressanxietyreduction', 'painreducingworld', 'audio', 'neuralpositivemusic', 'Chopin', 'samba', 'countryandamericana'],
    synonyms: ['stress', 'calm', 'relax', 'stress_reduction', 'chill', 'mood_boost']
  },
  {
    id: 'anxiety-support',
    slug: 'anxiety-support',
    backendKey: 'anxiety-support',
    name: 'Anxiety Support',
    shortName: 'Anxiety',
    description: 'Gentle classical music to ease anxiety and promote calm',
    icon: Sparkles,
    artwork: anxietySupportCard,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    bpmRange: { min: 40, max: 70, optimal: 55 },
    vadProfile: { valence: 0.7, arousal: 0.1, dominance: 0.4 },
    musicBuckets: ['gentleclassicalforpain', 'Nocturnes'],
    synonyms: ['anxiety', 'anxiety_relief', 'anxiety-down', 'classical']
  },
  {
    id: 'meditation-support',
    slug: 'meditation-support',
    backendKey: 'meditation-support',
    name: 'Meditation Support',
    shortName: 'Meditate',
    description: 'Peaceful music to enhance mindfulness and meditation practice',
    icon: Shield,
    artwork: meditationCard,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-500',
    bpmRange: { min: 30, max: 60, optimal: 45 },
    vadProfile: { valence: 0.7, arousal: 0.1, dominance: 0.5 },
    musicBuckets: ['newageworldstressanxietyreduction', 'Chopin'],
    synonyms: ['meditation', 'mindfulness', 'zen', 'contemplation', 'spiritual', 'peace']
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
    musicBuckets: ['gentleclassicalforpain'],
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
    musicBuckets: ['ENERGYBOOST', 'HIIT', 'pop', 'countryandamericana', 'NewAgeandWorldFocus'],
    synonyms: ['energy', 'workout', 'exercise', 'cardio', 'motivation', 'pump']
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

// Legacy type for backwards compatibility - updated to remove mood-boost
export type GoalSlug = 'calm-mood-boost' | 'anxiety-support' | 'focus-enhancement' | 'meditation-support' | 'pain-support' | 'energy-boost';

// Export goal slugs array for backwards compatibility
export const GOALS: GoalSlug[] = THERAPEUTIC_GOALS.map(g => g.slug as GoalSlug);

// Helper function to get buckets for a goal
export function getBucketsForGoal(goalId: string): string[] {
  const goal = SYNONYM_TO_GOAL[goalId.toLowerCase()] || GOALS_BY_ID[goalId] || GOALS_BY_SLUG[goalId] || GOALS_BY_BACKEND_KEY[goalId];
  return goal?.musicBuckets || ['neuralpositivemusic']; // fallback to main bucket
}