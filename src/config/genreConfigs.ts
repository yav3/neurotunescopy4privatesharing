// Import all the artwork files needed for genres
import moodBoostCoastalCove from '@/assets/mood-boost-coastal-cove.png';
import moodBoostSunsetFlowers from '@/assets/mood-boost-sunset-flowers.png';
import moodBoostFloralField from '@/assets/mood-boost-floral-field.png';
import moodBoostDancePartyWaves from '@/assets/mood-boost-dance-party-waves.jpg';
import moodBoostLeafDewdrop from '@/assets/mood-boost-leaf-dewdrop.png';
import cardioMountainWildflowers from '@/assets/cardio-mountain-wildflowers.png';
import cardioFloralField from '@/assets/cardio-floral-field.png';
import cardioLeafDewdrops from '@/assets/cardio-leaf-dewdrops.png';
import cardioLeafDroplet from '@/assets/cardio-leaf-droplet.png';
import cardioSunsetBeachFlowers from '@/assets/cardio-sunset-beach-flowers.png';
import focusClassicalMountainLake from '@/assets/focus-classical-mountain-lake.jpg';
import stressClassicalPeacefulStream from '@/assets/stress-classical-peaceful-stream.jpg';
import stressSambaTropicalSunset from '@/assets/stress-samba-tropical-sunset.jpg';
import painWorldHealingGarden from '@/assets/pain-world-healing-garden.jpg';
import focusPianoCherryBlossoms from '@/assets/focus-piano-cherry-blossoms.jpg';
import painGentleWaterfallPiano from '@/assets/pain-gentle-waterfall-piano.jpg';
import newAgeLeafDewdrop from '@/assets/new-age-leaf-dewdrop.png';
import energeticClassicalHibiscus from '@/assets/energetic-classical-hibiscus.png';
import maximumEnergyEdmScene from '@/assets/maximum-energy-edm-scene.jpg';
import maximumEnergyEdmDj from '@/assets/maximum-energy-edm-dj.png';
import focusZenStones from '@/assets/focus-zen-stones.png';
import focusCrossoverClassicalLandscape from '@/assets/focus-crossover-classical-landscape.jpg';
import hiitForestPath from '@/assets/hiit-forest-path.png';
import gentleClassicalMistyLake from '@/assets/gentle-classical-misty-lake.png';

export interface GenreConfig {
  id: string;
  name: string;
  description: string;
  buckets: string[];
  image: string;
}

// Shared genre definitions used by both GenreSelectionPage and GenreView
export const getGenreOptions = (goalId: string): GenreConfig[] => {
  const genreConfigs: Record<string, GenreConfig[]> = {
    'focus-enhancement': [
      {
        id: 'crossover-classical',
        name: 'Crossover Classical',
        description: 'Modern classical compositions for concentration',
        buckets: ['audio', 'classicalfocus'],
        image: focusCrossoverClassicalLandscape
      },
      {
        id: 'new-age',
        name: 'New Age & World Focus',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['audio', 'NewAgeandWorldFocus'],
        image: newAgeLeafDewdrop
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for deep concentration',
        buckets: ['Chopin'],
        image: focusZenStones
      }
    ],
    'stress-anxiety-support': [
      {
        id: 'new-age-stress',
        name: 'New Age & World Stress Relief',
        description: 'Ethereal new age sounds for deep relaxation',
        buckets: ['audio', 'NewAgeandWorldFocus'],
        image: newAgeLeafDewdrop
      },
      {
        id: 'sonatas',
        name: 'Sonatas for Stress',
        description: 'Classical sonatas for deep stress relief',
        buckets: ['audio', 'Chopin'],
        image: stressClassicalPeacefulStream
      },
      {
        id: 'peaceful-piano',
        name: 'Chopin',
        description: 'Gentle Chopin pieces for relaxation',
        buckets: ['audio', 'Chopin'],
        image: focusPianoCherryBlossoms
      },
      {
        id: 'samba',
        name: 'Samba',
        description: 'Relaxing Brazilian samba rhythms for stress relief',
        buckets: ['audio', 'samba'],
        image: stressSambaTropicalSunset
      },
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['ENERGYBOOST', 'HIIT'],
        image: moodBoostCoastalCove,
      },
      {
        id: 'pop',
        name: 'Pop',
        description: 'Uplifting pop music for instant mood elevation',
        buckets: ['audio'],
        image: moodBoostSunsetFlowers,
      },
      {
        id: 'dance-party',
        name: 'Dance Party',
        description: 'High-energy dance remixes and world dance beats',
        buckets: ['audio', 'moodboostremixesworlddance'],
        image: moodBoostDancePartyWaves,
      },
      {
        id: 'edm-crossover',
        name: 'EDM crossover (EDM)',
        description: 'Electronic dance music crossover tracks for high energy',
        buckets: ['ENERGYBOOST', 'EDM'],
        image: moodBoostLeafDewdrop,
      },
    ],
    'pain-support': [
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['audio', 'Chopin'],
        image: gentleClassicalMistyLake,
      },
      {
        id: 'stress-reduction-classical',
        name: 'Stress Reduction Classical',
        description: 'Classical music specifically for pain and stress relief',
        buckets: ['audio', 'Chopin'],
        image: focusClassicalMountainLake,
      },
      {
        id: 'new-age-chill',
        name: 'New Age Chill',
        description: 'Calming new age sounds for pain management',
        buckets: ['audio', 'NewAgeandWorldFocus'],
        image: newAgeLeafDewdrop,
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for comfort and healing',
        buckets: ['audio', 'Chopin'],
        image: painGentleWaterfallPiano,
      }
    ],
    'energy-boost': [
      {
        id: 'maximum-energy-edm',
        name: 'Maximum Energy EDM',
        description: 'Peak energy electronic dance music for maximum motivation',
        buckets: ['ENERGYBOOST'],
        image: maximumEnergyEdmDj
      },
      {
        id: 'hiit-energy',
        name: 'HIIT Energy',
        description: 'High-intensity interval training music for peak performance',
        buckets: ['HIIT'],
        image: hiitForestPath
      },
      {
        id: 'energetic-house',
        name: 'Energetic House',
        description: 'Upbeat house music for energy and motivation',
        buckets: ['ENERGYBOOST', 'HIIT'],
        image: cardioSunsetBeachFlowers
      },
      {
        id: 'pop-energy',
        name: 'Pop Energy',
        description: 'High-energy pop tracks for motivation',
        buckets: ['pop', 'audio'],
        image: cardioMountainWildflowers
      }
    ],
    'cardio-support': [
      {
        id: 'hiit-cardio',
        name: 'HIIT Cardio',
        description: 'High-intensity interval training music',
        buckets: ['HIIT'],
        image: hiitForestPath,
      },
      {
        id: 'house-cardio',
        name: 'House Cardio',
        description: 'Pumping house music for cardiovascular exercise',
        buckets: ['ENERGYBOOST', 'HIIT'],
        image: cardioFloralField,
      },
      {
        id: 'edm-cardio',
        name: 'EDM',
        description: 'Electronic dance music for high-intensity cardio',
        buckets: ['ENERGYBOOST'],
        image: cardioLeafDewdrops,
      },
      {
        id: 'energy-boost-cardio',
        name: 'Energy Boost',
        description: 'Maximum energy tracks for intense cardio',
        buckets: ['ENERGYBOOST'],
        image: cardioLeafDroplet,
      },
      {
        id: 'pop-cardio',
        name: 'Pop Cardio',
        description: 'Energetic pop hits perfect for cardio sessions',
        buckets: ['audio', 'pop'],
        image: cardioSunsetBeachFlowers,
      },
      {
        id: 'dance-cardio',
        name: 'Dance Cardio',
        description: 'Upbeat dance music for energetic cardio workouts',
        buckets: ['dance'],
        image: cardioMountainWildflowers
      }
    ]
  };

  return genreConfigs[goalId as keyof typeof genreConfigs] || [];
};