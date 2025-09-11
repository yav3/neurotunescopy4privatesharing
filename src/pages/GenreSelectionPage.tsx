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
    'stress-anxiety': [
      {
        id: 'nature-sounds',
        name: 'Nature & Ambient',
        description: 'Calming nature sounds and ambient textures',
        buckets: ['neuralpositivemusic'],
        image: '/lovable-uploads/delta-moonlit-lake.png'
      },
      {
        id: 'meditative-strings',
        name: 'Meditative Strings',
        description: 'Soothing string arrangements for relaxation',
        buckets: ['classicalfocus'],
        image: '/lovable-uploads/classical-meadow-ensemble.png'
      }
    ],
    'sleep-support': [
      {
        id: 'delta-wave',
        name: 'Delta Wave Therapy',
        description: 'Deep sleep-inducing frequencies',
        buckets: ['neuralpositivemusic'],
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
        id: 'uplifting-orchestral',
        name: 'Uplifting Orchestral',
        description: 'Energizing orchestral compositions',
        buckets: ['classicalfocus'],
        image: '/lovable-uploads/beta-waterfall.png'
      },
      {
        id: 'positive-electronic',
        name: 'Positive Electronic',
        description: 'Upbeat electronic music for motivation',
        buckets: ['neuralpositivemusic'],
        image: '/lovable-uploads/alpha-mountain-lake.png'
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
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          {/* Simple title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              {goal.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {goal.description}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Genre Grid - All genres visible */}
      <div className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {genres.map((genre, index) => (
              <div
                key={genre.id}
                className="group relative aspect-square overflow-hidden cursor-pointer rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                onClick={() => handleGenreSelect(genre.id)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                
                {/* Clean content - no dark blocks */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-lg text-white mb-1 drop-shadow-2xl">
                    {genre.name}
                  </h3>
                  <p className="text-sm text-white/0 group-hover:text-white/90 transition-colors duration-300 drop-shadow-xl">
                    {genre.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}