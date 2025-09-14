import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { EnhancedGenreCard } from '@/components/ui/EnhancedGenreCard';
import { cn } from '@/lib/utils';

// Import thematic artwork that matches genre descriptions
import crossoverClassicalArt from '@/assets/classical-instruments-crystal-hall.jpg';
import newAgeArt from '@/assets/new-age-forest-flute-natural.jpg';
import electronicArt from '@/assets/drums-aurora-energy.jpg';
import sambaImage from '@/assets/guitar-beach-sunset-samba.jpg';
import folkPeacefulMeadow from '@/assets/country-guitar-sunset-lake.jpg';
import stringsCrystalPalace from '@/assets/classical-instruments-crystal-hall.jpg';
import newageRadiantGarden from '@/assets/new-age-forest-flute-natural.jpg';
import operaLuminousHall from '@/assets/opera-violin-garden-terrace.jpg';
import sonatasBrightConservatory from '@/assets/classical-instruments-crystal-hall.jpg';
import peacefulPianoArt from '@/assets/peaceful-piano-lake-mountains.jpg';
import houseMusicArt from '@/assets/house-music-bright.jpg';
import dancePartyArt from '@/assets/dance-party-beach.jpg';
import popMusicArt from '@/assets/pop-music-joyful-nature.jpg';
import bachInstrumentsGrounded from '@/assets/bach-instruments-grounded.jpg';
import happyHouseDance from '@/assets/happy-house-dance.jpg';
import worldInstrumentsZen from '@/assets/world-instruments-zen-garden.jpg';
import energyBoostLightning from '@/assets/drums-aurora-energy.jpg';

// Simplified genre definitions
const getGenreOptions = (goalId: string) => {
  const genreConfigs = {
    'focus-enhancement': [
      {
        id: 'crossover-classical',
        name: 'Crossover Classical',
        description: 'Modern classical compositions for concentration',
        buckets: ['neuralpositivemusic/Classical'],
        image: crossoverClassicalArt
      },
      {
        id: 'bach-transpositions',
        name: 'Bach Transpositions',
        description: 'Modern interpretations of Bach for deep focus',
        buckets: ['focus-music'],
        image: bachInstrumentsGrounded
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for deep concentration',
        buckets: ['Chopin'],
        image: peacefulPianoArt
      }
    ],
    'stress-anxiety-support': [
      {
        id: 'samba',
        name: 'Samba',
        description: 'Relaxing Brazilian samba rhythms for stress relief',
        buckets: ['samba'],
        image: sambaImage
      },
      {
        id: 'folk-americana-bluegrass',
        name: 'Country, Americana, & Bluegrass',
        description: 'Calming country and americana music for relaxation',
        buckets: ['countryandamericana'],
        image: folkPeacefulMeadow
      },
      {
        id: 'calming-classical',
        name: 'Calming Classical',
        description: 'Soothing classical music for deep relaxation',
        buckets: ['sonatasforstress'],
        image: '/src/assets/calming-classical-lakeside.jpg'
      },
      {
        id: 'new-age',
        name: 'New Age',
        description: 'Ethereal new age sounds for deep relaxation',
        buckets: ['newageworldstressanxietyreduction'],
        image: newageRadiantGarden
      },
      {
        id: 'opera',
        name: 'Opera',
        description: 'Classical opera for emotional release and stress relief',
        buckets: ['opera'],
        image: operaLuminousHall
      },
      {
        id: 'sonatas',
        name: 'Sonatas',
        description: 'Classical sonatas for deep stress relief',
        buckets: ['sonatasforstress'],
        image: sonatasBrightConservatory
      }
    ],
    'cardio-support': [
      {
        id: 'edm-cardio',
        name: 'EDM',
        description: 'Electronic dance music for high-intensity cardio',
        buckets: ['neuralpositivemusic/EDM'],
        image: electronicArt
      },
      {
        id: 'house-cardio',
        name: 'House Cardio',
        description: 'Pumping house music for cardiovascular exercise',
        buckets: ['house'],
        image: houseMusicArt
      },
      {
        id: 'pop-cardio',
        name: 'Pop Cardio',
        description: 'Energetic pop hits perfect for cardio sessions',
        buckets: ['pop'],
        image: popMusicArt
      },
      {
        id: 'energy-boost-cardio',
        name: 'Energy Boost',
        description: 'Maximum energy tracks for intense cardio',
        buckets: ['ENERGYBOOST'],
        image: electronicArt
      }
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['neuralpositivemusic/House'],
        image: houseMusicArt
      },
      {
        id: 'pop',
        name: 'Pop',
        description: 'Uplifting pop music for instant mood elevation',
        buckets: ['pop'],
        image: popMusicArt
      },
      {
        id: 'dance-party',
        name: 'Dance Party',
        description: 'High-energy dance remixes and world dance beats',
        buckets: ['moodboostremixesworlddance'],
        image: dancePartyArt
      },
      {
        id: 'edm-crossover',
        name: 'EDM crossover (EDM)',
        description: 'Electronic dance music crossover tracks for high energy',
        buckets: ['neuralpositivemusic/EDM'],
        image: electronicArt
      },
      {
        id: 'hiit-mood',
        name: 'HIIT Mood',
        description: 'High-intensity music for mood and energy',
        buckets: ['HIIT'],
        image: energyBoostLightning
      }
    ],
    'pain-support': [
      {
        id: 'world-new-age',
        name: 'World',
        description: 'Global healing sounds for pain relief',
        buckets: ['painreducingworld'],
        image: worldInstrumentsZen
      },
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['gentleclassicalforpain'],
        image: stringsCrystalPalace
      },
      {
        id: 'serene-sonatas',
        name: 'Serene Sonatas',
        description: 'Peaceful classical sonatas for pain relief',
        buckets: ['sonatasforstress'],
        image: '/src/assets/calming-classical-lakeside.jpg'
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for comfort and healing',
        buckets: ['Chopin'],
        image: peacefulPianoArt
      }
    ],
    'energy-boost': [
      {
        id: 'energetic-classical',
        name: 'Energetic Classical',
        description: 'Dynamic classical pieces for vitality',
        buckets: ['neuralpositivemusic/Classical-Energy-Boost'],
        image: energyBoostLightning
      },
      {
        id: 'motivational-beats',
        name: 'Happy House & Dance',
        description: 'Upbeat house and dance music for energy and motivation',
        buckets: ['neuralpositivemusic/House'],
        image: happyHouseDance
      },
      {
        id: 'energy-boost-core',
        name: 'Energy Boost',
        description: 'High-energy tracks for maximum motivation',
        buckets: ['ENERGYBOOST'],
        image: energyBoostLightning
      },
      {
        id: 'musical-theater-energy',
        name: 'Musical Theater Energy',
        description: 'Uplifting musical theater pieces for motivation',
        buckets: ['neuralpositivemusic/MusicalTheaterEnergyBoost'],
        image: energyBoostLightning
      },
      {
        id: 'hiit-energy',
        name: 'HIIT Music',
        description: 'High-intensity interval training music for energy',
        buckets: ['HIIT'],
        image: energyBoostLightning
      }
    ]
  };

  return genreConfigs[goalId as keyof typeof genreConfigs] || [];
};

export default function GenreSelectionPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  
  const goal = goalId ? GOALS_BY_ID[goalId] : null;
  const genres = goalId ? getGenreOptions(goalId) : [];

  const handleGenreSelect = (genreId: string) => {
    navigate(`/genre/${goalId}/${genreId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!goal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Goal Not Found</h2>
          <Button onClick={handleBack}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22hsl(var(--foreground))%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      {/* Simple Header - Mobile optimized */}
      <div className="relative z-40 px-3 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 sm:mb-6 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          {/* Simple title - Mobile responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-foreground leading-tight">
              {goal.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {goal.description}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Genre Grid - Mobile optimized */}
      <div className="relative z-30 px-3 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {genres.map((genre, index) => (
              <div
                key={genre.id}
                className={cn(
                  "group relative aspect-[4/3] sm:aspect-square overflow-hidden cursor-pointer",
                  "rounded-xl sm:rounded-2xl",
                  "backdrop-blur-xl bg-white/10 border border-white/20",
                  "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
                  "transition-all duration-700 ease-out",
                  "hover:shadow-[0_20px_60px_rgba(31,38,135,0.6)]",
                  "hover:border-white/40 hover:-translate-y-4 hover:scale-105",
                  "animate-fade-in",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
                  "before:translate-x-[-100%] before:transition-transform before:duration-1000",
                  "hover:before:translate-x-[100%]"
                )}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
                onClick={() => handleGenreSelect(genre.id)}
              >
                {/* Background Image with Luminous Effects */}
                <div className="absolute inset-0">
                  <img 
                    src={genre.image}
                    alt={`${genre.name} cover art`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:brightness-125 group-hover:saturate-125"
                  />
                  {/* Multi-layered Glass Effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 group-hover:from-black/10 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  
                  {/* Illuminated Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-radial from-white/20 via-transparent to-transparent blur-sm" />
                </div>
                
                {/* Clean Title Overlay without Box - Ensure White Text */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 pointer-events-none">
                  <h3 
                    className="font-bold text-sm sm:text-lg md:text-xl leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] transition-colors duration-300 filter drop-shadow-[0_0_8px_rgba(0,0,0,1)]"
                  >
                    {genre.name}
                  </h3>
                </div>

                {/* Animated Light Particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
                      style={{
                        left: `${20 + i * 20}%`,
                        top: `${30 + (i % 2) * 30}%`,
                        animationDelay: `${i * 300}ms`,
                        animationDuration: '2s',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}