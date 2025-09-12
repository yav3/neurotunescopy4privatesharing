import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { EnhancedGenreCard } from '@/components/ui/EnhancedGenreCard';
import { cn } from '@/lib/utils';

// Import blue and green toned artwork only
import crossoverClassicalArt from '@/assets/crossover-classical-fresh.jpg';
import newAgeArt from '@/assets/new-age-forest.jpg';
import electronicArt from '@/assets/electronic-nature-keyboard.jpg';
import sambaImage from '@/assets/samba-photorealistic.jpg';
import folkPeacefulMeadow from '@/assets/folk-peaceful-meadow.jpg';
import stringsCrystalPalace from '@/assets/strings-crystal-palace.jpg';
import newageRadiantGarden from '@/assets/newage-radiant-garden.jpg';
import operaLuminousHall from '@/assets/opera-luminous-hall.jpg';
import sonatasBrightConservatory from '@/assets/sonatas-bright-conservatory.jpg';
import peacefulPianoArt from '@/assets/peaceful-piano-blue.jpg';
import houseMusicArt from '@/assets/house-music-bright.jpg';
import dancePartyArt from '@/assets/dance-party-beach.jpg';
import popMusicArt from '@/assets/pop-music-joyful-nature.jpg';
import bachPaleWoodInstruments from '@/assets/bach-pale-wood-instruments.jpg';

// Simplified genre definitions
const getGenreOptions = (goalId: string) => {
  const genreConfigs = {
    'focus-enhancement': [
      {
        id: 'crossover-classical',
        name: 'Crossover Classical',
        description: 'Modern classical compositions for concentration',
        buckets: ['classicalfocus'],
        image: crossoverClassicalArt
      },
      {
        id: 'new-age',
        name: 'New Age',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['newageworldstressanxietyreduction'],
        image: newAgeArt
      },
      {
        id: 'bach-transpositions',
        name: 'Bach Transpositions',
        description: 'Modern interpretations of Bach for deep focus',
        buckets: ['focus-music'],
        image: bachPaleWoodInstruments
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
        id: 'meditative-strings',
        name: 'Meditative Strings',
        description: 'Soothing string arrangements for relaxation',
        buckets: ['classicalfocus'],
        image: stringsCrystalPalace
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
    'sleep-support': [
      {
        id: 'delta-wave',
        name: 'Delta Wave Therapy',
        description: 'Deep sleep-inducing frequencies',
        buckets: ['samba'],
        image: '/lovable-uploads/theta-misty-path.png'
      },
      {
        id: 'nocturnal-classical',
        name: 'Nocturnal Classical',
        description: 'Gentle classical pieces for bedtime',
        buckets: ['classicalfocus'],
        image: '/lovable-uploads/folk-instruments-meadow.png'
      }
    ],
    'mood-boost': [
      {
        id: 'house-music',
        name: 'House Music', 
        description: 'Energetic house beats for motivation and energy',
        buckets: ['neuralpositivemusic'],
        folder: 'House',
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
        id: 'uplifting-orchestral',
        name: 'Uplifting Orchestral',
        description: 'Energizing orchestral compositions',
        buckets: ['classicalfocus'], 
        image: '/lovable-uploads/classical-meadow-ensemble.png'
      },
      {
        id: 'dance-party',
        name: 'Dance Party',
        description: 'Upbeat electronic dance music for high energy and motivation',
        buckets: ['HIIT'],
        image: dancePartyArt
      }
    ],
    'pain-support': [
      {
        id: 'world-new-age',
        name: 'World & New Age',
        description: 'Global healing sounds for pain relief',
        buckets: ['painreducingworld'],
        image: '/lovable-uploads/acoustic-sunset-field.png'
      },
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['gentleclassicalforpain'],
        image: '/lovable-uploads/european-classical-terrace.png'
      }
    ],
    'energy-boost': [
      {
        id: 'energetic-classical',
        name: 'Energetic Classical',
        description: 'Dynamic classical pieces for vitality',
        buckets: ['classicalfocus'],
        image: '/lovable-uploads/gamma-sunbeam-forest.png'
      },
      {
        id: 'motivational-beats',
        name: 'Motivational Beats',
        description: 'Rhythmic music for energy and focus',
        buckets: ['neuralpositivemusic'],
        image: '/lovable-uploads/string-quartet-studio.png'
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
                
                {/* Clean Title Overlay without Box */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 pointer-events-none">
                  <h3 
                    className="font-bold text-sm sm:text-lg md:text-xl leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-colors duration-300"
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