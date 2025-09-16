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
        id: 'crossover-classical',
        name: 'Crossover Classical',
        description: 'Modern classical compositions for concentration',
        buckets: ['classicalfocus'],
        image: focusCrossoverClassicalLandscape
      },
      {
        id: 'new-age',
        name: 'New Age & World Focus',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['NewAgeandWorldFocus'],
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
        name: 'New Age & World',
        description: 'Ethereal new age sounds for deep relaxation',
        buckets: ['newageworldstressanxietyreduction'],
        image: newAgeLeafDewdrop
      },
      {
        id: 'sonatas',
        name: 'Sonatas',
        description: 'Classical sonatas for deep stress relief',
        buckets: ['sonatasforstress'],
        image: sonatasMistyLake
      },
      {
        id: 'peaceful-piano',
        name: 'Chopin',
        description: 'Gentle Chopin pieces for relaxation',
        buckets: ['Chopin'],
        image: chopinMountainPeaks
      },
      {
        id: 'samba',
        name: 'Samba',
        description: 'Relaxing Brazilian samba rhythms for stress relief',
        buckets: ['samba'],
        image: sambaTropicalHibiscus
      },
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['neuralpositivemusic'],
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
        image: moodBoostLeafDewdrop,
      },
    ],
    'pain-support': [
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['gentleclassicalforpain'],
        image: gentleClassicalMistyLake,
      },
      {
        id: 'stress-reduction-classical',
        name: 'Stress Reduction Classical',
        description: 'Classical music specifically for pain and stress relief',
        buckets: ['gentleclassicalforpain'],
        image: focusClassicalMountainLake,
      },
      {
        id: 'new-age-chill',
        name: 'New Age Chill',
        description: 'Calming new age sounds for pain management',
        buckets: ['painreducingworld'],
        image: newAgeLeafDewdrop,
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for comfort and healing',
        buckets: ['Chopin'],
        image: painGentleWaterfallPiano,
      }
    ],
    'energy-boost': [
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
        buckets: ['neuralpositivemusic'],
        image: cardioSunsetBeachFlowers
      },
      {
        id: 'pop-energy',
        name: 'Pop Energy',
        description: 'High-energy pop tracks for motivation',
        buckets: ['pop'],
        image: cardioMountainWildflowers
      }
    ]
  };

  return genreConfigs[goalId as keyof typeof genreConfigs] || [];
};