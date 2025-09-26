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
import oceanWaveClear from '@/assets/ocean-wave-clear.png';
import painSonatasYellowFlowers from '@/assets/pain-sonatas-yellow-flowers.jpg';
import painPeacefulPianoMountainLake from '@/assets/pain-peaceful-piano-mountain-lake.jpg';
import edmCrossoverCactus from '@/assets/edm-crossover-cactus.jpg';

// Import new Stress & Anxiety Support images
import sambaTropicalHibiscus from '@/assets/samba-tropical-hibiscus.png';
import sonatasMistyLake from '@/assets/sonatas-misty-lake.png';
import chopinMountainPeaks from '@/assets/chopin-mountain-peaks.jpg';

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
        id: 'new-age',
        name: 'Americana for Focus',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['NewAgeandWorldFocus'],
        image: newAgeLeafDewdrop
      }
    ],
    'anxiety-support': [
      {
        id: 'classical-crossover',
        name: 'Classical Crossover',
        description: 'Gentle classical crossover music for anxiety relief',
        buckets: ['gentleclassicalforpain'],
        image: oceanWaveClear
      },
      {
        id: 'classical-acoustic',
        name: 'Classical & Acoustic',
        description: 'Soothing classical and acoustic pieces for deep relaxation',
        buckets: ['gentleclassicalforpain', 'Nocturnes'],
        image: chopinMountainPeaks
      }
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['ENERGYBOOST'],
        image: moodBoostCoastalCove,
      },
      {
        id: 'pop',
        name: 'Pop',
        description: 'Uplifting pop music for instant mood elevation',
        buckets: ['pop'],
        image: moodBoostSunsetFlowers,
      },
      {
        id: 'chill-country',
        name: 'Chill Country & Americana',
        description: 'Relaxing country and americana for mood enhancement',
        buckets: ['countryandamericana'],
        image: moodBoostFloralField,
      },
      {
        id: 'dance-party',
        name: 'Dance Party',
        description: 'High-energy dance remixes and world dance beats',
        buckets: ['ENERGYBOOST'],
        image: moodBoostDancePartyWaves,
      },
      {
        id: 'edm-crossover',
        name: 'EDM crossover (EDM)',
        description: 'Electronic dance music crossover tracks for high energy',
        buckets: ['ENERGYBOOST'],
        image: edmCrossoverCactus,
      },
      {
        id: 'world',
        name: 'World',
        description: 'Uplifting world music for mood enhancement',
        buckets: ['NewAgeandWorldFocus'],
        image: newAgeLeafDewdrop,
      },
      {
        id: 'samba',
        name: 'Chill Samba',
        description: 'Relaxing Brazilian samba rhythms for mood enhancement',
        buckets: ['samba'],
        image: sambaTropicalHibiscus,
      },
    ],
    'pain-support': [
      {
        id: 'gentle-classical',
        name: 'Relaxing Clasical',
        description: 'Soft classical music for comfort',
        buckets: ['gentleclassicalforpain'],
        image: oceanWaveClear,
      },
      {
        id: 'peaceful-piano',
        name: 'Relaxing Classical Crossover',
        description: 'Gentle piano melodies for comfort and relaxation',
        buckets: ['Chopin'],
        image: painPeacefulPianoMountainLake,
      },
      {
        id: 'comorbid-pain-anxiety',
        name: 'Comorbid Pain & Anxiety',
        description: 'Specialized nocturnes for complex pain and anxiety conditions',
        buckets: ['Nocturnes'],
        image: sonatasMistyLake,
      }
    ],
    'energy-boost': [
      {
        id: 'pop-energy',
        name: 'Pop for Cardio',
        description: 'High-energy pop tracks for motivation',
        buckets: ['pop'],
        image: cardioMountainWildflowers
      },
      {
        id: 'hiit-energy',
        name: 'High Intensity EDM',
        description: 'High-intensity interval training music for peak performance',
        buckets: ['ENERGYBOOST'],
        image: hiitForestPath
      },
      {
        id: 'energetic-house',
        name: 'House for Cardio',
        description: 'Upbeat house music for energy and motivation',
        buckets: ['ENERGYBOOST', 'HIIT'],
        image: cardioSunsetBeachFlowers
      },
      {
        id: 'reggaeton',
        name: 'Reggaeton for Cardio',
        description: 'High-energy reggaeton beats for motivation',
        buckets: ['reggaeton'],
        image: cardioMountainWildflowers
      }
    ],
    'depression-support': [
      {
        id: 'meditative-classical',
        name: 'Meditative Classical',
        description: 'Peaceful classical music for deep relaxation and meditation',
        buckets: ['meditation'],
        image: focusClassicalMountainLake
      },
      {
        id: 'new-age-stress',
        name: 'New Age & World',
        description: 'Ethereal new age sounds for deep relaxation and emotional support',
        buckets: ['newageworldstressanxietyreduction'],
        image: newAgeLeafDewdrop
      },
      {
        id: 'classical-meditation',
        name: 'Classical Meditation',
        description: 'Peaceful classical music for mindfulness and emotional healing',
        buckets: ['Chopin'],
        image: focusPianoCherryBlossoms
      }
    ]
  };

  return genreConfigs[goalId as keyof typeof genreConfigs] || [];
};