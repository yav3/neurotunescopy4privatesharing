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
import focusZenStones from '@/assets/focus-zen-stones.png';
import focusCrossoverClassicalLandscape from '@/assets/focus-crossover-classical-landscape.jpg';
import hiitForestPath from '@/assets/hiit-forest-path.png';

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
        name: 'New Age & World Stress Relief',
        description: 'Ethereal new age sounds for deep relaxation',
        buckets: ['newageworldstressanxietyreduction'],
        image: newAgeLeafDewdrop
      },
      {
        id: 'sonatas',
        name: 'Sonatas for Stress',
        description: 'Classical sonatas for deep stress relief',
        buckets: ['sonatasforstress'],
        image: stressClassicalPeacefulStream
      },
      {
        id: 'peaceful-piano',
        name: 'Chopin',
        description: 'Gentle Chopin pieces for relaxation',
        buckets: ['Chopin'],
        image: focusPianoCherryBlossoms
      },
      {
        id: 'samba',
        name: 'Samba',
        description: 'Relaxing Brazilian samba rhythms for stress relief',
        buckets: ['samba'],
        image: stressSambaTropicalSunset
      },
      {
        id: 'neuralpositivemusic',
        name: 'Neural Positive Music',
        description: 'Specially composed music for stress reduction',
        buckets: ['neuralpositivemusic'],
        image: focusClassicalMountainLake
      },
      {
        id: 'pain-reducing-world',
        name: 'World Healing Music',
        description: 'Global healing sounds for stress and anxiety',
        buckets: ['painreducingworld'],
        image: painWorldHealingGarden
      }
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['neuralpositivemusic'],
        image: moodBoostCoastalCove
      },
      {
        id: 'pop',
        name: 'Pop',
        description: 'Uplifting pop music for instant mood elevation',
        buckets: ['audio'],
        image: moodBoostSunsetFlowers
      },
      {
        id: 'dance-party',
        name: 'Dance Party',
        description: 'High-energy dance remixes and world dance beats',
        buckets: ['neuralpositivemusic'],
        image: moodBoostDancePartyWaves
      },
      {
        id: 'edm-crossover',
        name: 'EDM crossover (EDM)',
        description: 'Electronic dance music crossover tracks for high energy',
        buckets: ['neuralpositivemusic'],
        image: moodBoostLeafDewdrop
      },
    ],
    'pain-support': [
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['gentleclassicalforpain'],
        image: stressClassicalPeacefulStream
      },
      {
        id: 'world-new-age',
        name: 'World Healing Music',
        description: 'Global healing sounds for pain relief',
        buckets: ['painreducingworld'],
        image: painWorldHealingGarden
      },
      {
        id: 'stress-reduction-classical',
        name: 'Stress Reduction Classical',
        description: 'Classical music specifically for pain and stress relief',
        buckets: ['neuralpositivemusic/stressreductionclassical'],
        image: focusClassicalMountainLake
      },
      {
        id: 'new-age-chill',
        name: 'New Age Chill',
        description: 'Calming new age sounds for pain management',
        buckets: ['neuralpositivemusic/newagechill'],
        image: newAgeLeafDewdrop
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for comfort and healing',
        buckets: ['Chopin'],
        image: painGentleWaterfallPiano
      }
    ],
    'energy-boost': [
      {
        id: 'energy-boost-max',
        name: 'Maximum Energy Boost',
        description: 'Peak energy music for maximum motivation',
        buckets: ['neuralpositivemusic/EDM'],
        image: maximumEnergyEdmScene
      },
      {
        id: 'energetic-classical',
        name: 'Energetic Classical',
        description: 'Dynamic classical pieces for vitality',
        buckets: ['neuralpositivemusic/Classical-Energy-Boost'],
        image: energeticClassicalHibiscus
      },
      {
        id: 'musical-theater-energy',
        name: 'Musical Theater Energy',
        description: 'Uplifting musical theater pieces for motivation',
        buckets: ['neuralpositivemusic/MusicalTheaterEnergyBoost'],
        image: cardioMountainWildflowers
      },
      {
        id: 'motivational-beats',
        name: 'Happy House & Dance',
        description: 'Upbeat house and dance music for energy and motivation',
        buckets: ['house'],
        image: cardioSunsetBeachFlowers
      },
      {
        id: 'hiit-energy',
        name: 'HIIT Music',
        description: 'High-intensity interval training music for energy',
        buckets: ['HIIT'],
        image: hiitForestPath
      }
    ],
    'cardio-support': [
      {
        id: 'hiit-cardio',
        name: 'HIIT Cardio',
        description: 'High-intensity interval training music',
        buckets: ['HIIT'],
        image: hiitForestPath
      },
      {
        id: 'house-cardio',
        name: 'House Cardio',
        description: 'Pumping house music for cardiovascular exercise',
        buckets: ['house'],
        image: cardioFloralField
      },
      {
        id: 'edm-cardio',
        name: 'EDM',
        description: 'Electronic dance music for high-intensity cardio',
        buckets: ['EDM'],
        image: cardioLeafDewdrops
      },
      {
        id: 'energy-boost-cardio',
        name: 'Energy Boost',
        description: 'Maximum energy tracks for intense cardio',
        buckets: ['ENERGYBOOST'],
        image: cardioLeafDroplet
      },
      {
        id: 'pop-cardio',
        name: 'Pop Cardio',
        description: 'Energetic pop hits perfect for cardio sessions',
        buckets: ['pop'],
        image: cardioSunsetBeachFlowers
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