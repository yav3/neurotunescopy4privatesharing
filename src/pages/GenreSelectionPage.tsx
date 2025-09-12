import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';

// Import blue and green toned artwork only
import crossoverClassicalArt from '@/assets/crossover-classical-blue.jpg';
import newAgeArt from '@/assets/new-age-forest.jpg';
import electronicArt from '@/assets/electronic-nature-keyboard.jpg';
import peacefulPianoArt from '@/assets/peaceful-piano-blue.jpg';
import houseMusicArt from '@/assets/house-music-bright.jpg';
import dancePartyArt from '@/assets/dance-party-beach.jpg';
import popMusicArt from '@/assets/pop-music-bright.jpg';

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
        buckets: ['neuralpositivemusic'],
        image: newAgeArt
      },
      {
        id: 'electronic',
        name: 'Electronic',
        description: 'Focused electronic beats and ambient textures',
        buckets: ['neuralpositivemusic'],
        image: electronicArt
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
        image: '/lovable-uploads/delta-moonlit-lake.png'
      },
      {
        id: 'folk-americana-bluegrass',
        name: 'Country, Americana, & Bluegrass',
        description: 'Calming country and americana music for relaxation',
        buckets: ['countryandamericana'],
        image: '/lovable-uploads/folk-instruments-meadow.png'
      },
      {
        id: 'meditative-strings',
        name: 'Meditative Strings',
        description: 'Soothing string arrangements for relaxation',
        buckets: ['classicalfocus'],
        image: '/lovable-uploads/classical-meadow-ensemble.png'
      },
      {
        id: 'new-age',
        name: 'New Age',
        description: 'Ethereal new age sounds for deep relaxation',
        buckets: ['newageworldstressanxietyreduction'],
        image: '/lovable-uploads/acoustic-sunset-field.png'
      },
      {
        id: 'opera',
        name: 'Opera',
        description: 'Classical opera for emotional release and stress relief',
        buckets: ['opera'],
        image: '/lovable-uploads/european-classical-terrace.png'
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
        buckets: ['neuralpositivemusic'],
        image: dancePartyArt
      }
    ],
    'pain-support': [
      {
        id: 'healing-frequencies',
        name: 'Healing Frequencies',
        description: 'Therapeutic tones for pain management',
        buckets: ['neuralpositivemusic'],
        image: '/lovable-uploads/acoustic-sunset-field.png'
      },
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['classicalfocus'],
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
                className="group relative aspect-[4/3] sm:aspect-square overflow-hidden cursor-pointer rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-xl border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
                onClick={() => handleGenreSelect(genre.id)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={genre.image}
                    alt={`${genre.name} cover art`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                
                {/* Position text to avoid obscuring pianos */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4">
                  <h3 
                    className="font-bold text-sm sm:text-lg md:text-xl leading-tight text-white drop-shadow-xl"
                  >
                    {genre.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}