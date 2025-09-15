// Simple therapeutic categories with direct bucket mapping
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
    image: '/api/placeholder/400/300'
  },
  {
    id: 'focus-enhancement',
    name: 'Focus & Concentration',
    description: 'Music to enhance focus and concentration',
    buckets: ['focus-music', 'classicalfocus', 'NewAgeandWorldFocus'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'energy-boost',
    name: 'Energy & Motivation',
    description: 'Uplifting music for energy and motivation',
    buckets: ['ENERGYBOOST', 'neuralpositivemusic', 'HIIT'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'mood-boost',
    name: 'Mood Enhancement',
    description: 'Feel-good music to boost your mood',
    buckets: ['neuralpositivemusic', 'moodboostremixesworlddance', 'pop'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'pain-support',
    name: 'Pain Relief',
    description: 'Gentle music for pain management and relief',
    buckets: ['gentleclassicalforpain', 'painreducingworld', 'Chopin'],
    image: '/api/placeholder/400/300'
  },
  {
    id: 'cardio-support',
    name: 'Cardio & Exercise',
    description: 'High-energy music for workouts and cardio',
    buckets: ['HIIT', 'ENERGYBOOST', 'neuralpositivemusic'],
    image: '/api/placeholder/400/300'
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