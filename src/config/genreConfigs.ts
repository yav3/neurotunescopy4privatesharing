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

// Import new genre backgrounds
import genreChillTropicalHouseNew from '@/assets/genre-chill-tropical-house-new.png';
import genreChillSambaNew from '@/assets/genre-chill-samba-new.png';
import genreHiitEnergyNew from '@/assets/genre-hiit-energy-new.png';

// Import wave/gradient banners for player pages
import genreBannerWaves1 from '@/assets/genre-banner-waves-1.png';
import genreBannerWaves2 from '@/assets/genre-banner-waves-2.png';
import genreBannerWaves3 from '@/assets/genre-banner-waves-3.png';
import genreBannerWaves4 from '@/assets/genre-banner-waves-4.png';
import genreBannerWaves5 from '@/assets/genre-banner-waves-5.png';
import genreBannerWaves6 from '@/assets/genre-banner-waves-6.png';
import genreBannerWaves7 from '@/assets/genre-banner-waves-7.png';
import genreBannerBlueGradient from '@/assets/genre-banner-blue-gradient.png';

// Import new Liquid Glass genre card backgrounds
// Dark cards for rest/relaxation/recovery
import genreCardDark1 from '@/assets/genre-card-dark-1.png';
import genreCardDark2 from '@/assets/genre-card-dark-2.png';
import genreCardDark3 from '@/assets/genre-card-dark-3.png';
import genreCardDark4 from '@/assets/genre-card-dark-4.png';
// Light cards for energy/boost
import genreCardLight1 from '@/assets/genre-card-light-1.png';
import genreCardLight2 from '@/assets/genre-card-light-2.png';
import genreCardLight3 from '@/assets/genre-card-light-3.png';
import genreCardLight4 from '@/assets/genre-card-light-4.png';

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
        name: 'New Age & World for Focus',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['NewAgeandWorldFocus'],
        image: genreBannerWaves7
      },
      {
        id: 'classical-crossover-focus',
        name: 'Classical Crossover for Focus',
        description: 'Refined classical crossover music for enhanced concentration',
        buckets: ['classicalfocus'],
        image: genreBannerBlueGradient
      },
      {
        id: 'tropical-house-focus',
        name: 'Tropical House for Focus',
        description: 'Uplifting tropical house rhythms for enhanced focus and concentration',
        buckets: ['WorldHouseFocus'],
        image: genreBannerWaves1
      }
    ],
    'anxiety-support': [
      {
        id: 'classical-crossover',
        name: 'Classical Crossover',
        description: 'Gentle classical crossover music for anxiety relief',
        buckets: ['gentleclassicalforpain'],
        image: genreCardDark1
      },
      {
        id: 'classical-acoustic',
        name: 'Classical & Acoustic',
        description: 'Soothing classical and acoustic pieces for deep relaxation',
        buckets: ['gentleclassicalforpain', 'Nocturnes'],
        image: genreCardDark2
      }
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['ENERGYBOOST'],
        image: genreCardLight1,
      },
      {
        id: 'pop',
        name: 'Pop Warm Up',
        description: 'Uplifting pop music for instant mood elevation',
        buckets: ['pop'],
        image: genreCardLight2,
      },
      {
        id: 'chill-country',
        name: 'Chill Country & Americana',
        description: 'Relaxing country and americana for mood enhancement',
        buckets: ['countryandamericana'],
        image: genreCardLight3,
      },
      {
        id: 'dance-party',
        name: 'Dance Party',
        description: 'High-energy dance remixes and world dance beats',
        buckets: ['ENERGYBOOST'],
        image: genreCardLight2,
      },
      {
        id: 'edm-crossover',
        name: 'EDM crossover (EDM)',
        description: 'Electronic dance music crossover tracks for high energy',
        buckets: ['ENERGYBOOST'],
        image: genreCardLight4,
      },
      {
        id: 'world',
        name: 'World',
        description: 'Uplifting world music for mood enhancement',
        buckets: ['NewAgeandWorldFocus'],
        image: genreCardLight3,
      },
      {
        id: 'samba',
        name: 'Chill Samba',
        description: 'Relaxing Brazilian samba rhythms for mood enhancement',
        buckets: ['samba'],
        image: genreCardLight2,
      },
      {
        id: 'americana-jam-band',
        name: 'Mood Boosting Americana & Jam Band',
        description: 'Uplifting americana and jam band music for mood enhancement',
        buckets: ['jamband', 'countryandamericana'],
        image: genreCardLight3,
      },
    ],
    'pain-support': [
      {
        id: 'gentle-classical',
        name: 'Relaxing Classical',
        description: 'Soft classical music for comfort',
        buckets: ['gentleclassicalforpain'],
        image: genreCardDark1,
      },
      {
        id: 'peaceful-piano',
        name: 'Relaxing Classical Crossover',
        description: 'Gentle piano melodies for comfort and relaxation',
        buckets: ['Chopin'],
        image: genreCardDark2,
      },
      {
        id: 'comorbid-pain-anxiety',
        name: 'Nocturnes',
        description: 'Specialized nocturnes for complex pain and anxiety conditions',
        buckets: ['Nocturnes'],
        image: genreCardDark3,
      }
    ],
    'energy-boost': [
      {
        id: 'pop-energy',
        name: 'Happy Pop',
        description: 'Uplifting pop music to boost your mood and energy',
        buckets: ['pop'],
        image: genreCardLight2
      },
      {
        id: 'hiit-energy',
        name: 'High Intensity EDM',
        description: 'High-intensity interval training music for peak performance',
        buckets: ['ENERGYBOOST'],
        image: genreCardLight1
      },
      {
        id: 'energetic-house',
        name: 'House for Cardio',
        description: 'Upbeat house music for energy and motivation',
        buckets: ['ENERGYBOOST', 'HIIT'],
        image: genreCardLight4
      },
      {
        id: 'reggaeton',
        name: 'Reggaeton for Cardio',
        description: 'High-energy reggaeton beats for motivation',
        buckets: ['reggaeton'],
        image: genreCardLight3
      }
    ],
    'depression-support': [
      {
        id: 'meditative-classical',
        name: 'Meditative Classical',
        description: 'Peaceful classical music for deep relaxation and meditation',
        buckets: ['meditation'],
        image: genreCardDark1
      },
      {
        id: 'new-age-stress',
        name: 'New Age & World for Agitation',
        description: 'Ethereal new age sounds for deep relaxation and emotional support',
        buckets: ['newageworldstressanxietyreduction'],
        image: genreCardDark2
      },
      {
        id: 'classical-meditation',
        name: 'Meditative Classical Crossover',
        description: 'Peaceful classical music for mindfulness and emotional healing',
        buckets: ['Chopin'],
        image: genreCardDark3
      },
      {
        id: 'mood-boosting-samba',
        name: 'Mood Boosting Samba',
        description: 'Uplifting Brazilian samba rhythms for emotional support and mood elevation',
        buckets: ['samba'],
        image: genreCardDark4
      }
    ],
    'sleep-preparation': [
      {
        id: 'sleep-nocturnes',
        name: 'Sleep Nocturnes',
        description: 'Gentle nocturnes specifically designed for sleep preparation',
        buckets: ['Nocturnes'],
        image: genreCardDark1
      },
      {
        id: 'sleep-classical',
        name: 'Peaceful Classical',
        description: 'Soothing classical pieces to prepare for deep rest',
        buckets: ['Chopin', 'gentleclassicalforpain'],
        image: genreCardDark3
      }
    ]
  };

  return genreConfigs[goalId as keyof typeof genreConfigs] || [];
};