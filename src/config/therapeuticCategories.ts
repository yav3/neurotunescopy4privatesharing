// Simple therapeutic categories with direct bucket mapping
import focusCard from '@/assets/therapeutic-card-1.png';
import stressCard from '@/assets/therapeutic-card-2.png';
import moodBoostCard from '@/assets/therapeutic-card-3.png';
import painCard from '@/assets/therapeutic-card-4.png';
import energyBoostCard from '@/assets/energy-boost-tropical.jpg';
import cardioCard from '@/assets/cardio-mountain-lake.jpg';

export interface TherapeuticCategory {
  id: string;
  name: string;
  description: string;
  buckets: string[];
  image: string;
}

// Simple category mappings - no complex logic needed
export const THERAPEUTIC_CATEGORIES: TherapeuticCategory[] = [
  {
    id: 'stress-anxiety-support',
    name: 'Stress & Anxiety Support',
    description: 'Calming music to reduce stress and anxiety',
    buckets: ['newageworldstressanxietyreduction', 'painreducingworld', 'Chopin'],
    image: stressCard
  },
  {
    id: 'focus-enhancement',
    name: 'Focus & Concentration',
    description: 'Music to enhance focus and concentration',
    buckets: ['focus-music', 'classicalfocus', 'NewAgeandWorldFocus'],
    image: focusCard
  },
  {
    id: 'energy-boost',
    name: 'Energy & Motivation',
    description: 'Uplifting music for energy and motivation',
    buckets: ['ENERGYBOOST', 'neuralpositivemusic', 'HIIT'],
    image: energyBoostCard
  },
  {
    id: 'mood-boost',
    name: 'Mood Enhancement',
    description: 'Feel-good music to boost your mood',
    buckets: ['neuralpositivemusic', 'moodboostremixesworlddance', 'pop'],
    image: moodBoostCard
  },
  {
    id: 'pain-support',
    name: 'Pain Relief',
    description: 'Gentle music for pain management and relief',
    buckets: ['gentleclassicalforpain', 'painreducingworld', 'Chopin'],
    image: painCard
  },
  {
    id: 'cardio-support',
    name: 'Cardio & Exercise',
    description: 'High-energy music for workouts and cardio',
    buckets: ['EDM', 'HIIT'],
    image: cardioCard
  }
];

// Simple helper functions
export const getCategoryById = (id: string): TherapeuticCategory | undefined => {
  return THERAPEUTIC_CATEGORIES.find(cat => cat.id === id);
};

export const getBucketsForCategory = (categoryId: string): string[] => {
  const category = getCategoryById(categoryId);
  return category?.buckets || [];
};