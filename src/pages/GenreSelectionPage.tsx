import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { GenreCard } from '@/components/ui/GenreCard';
import peacefulPianoArt from '@/assets/peaceful-piano-enhanced.jpg';

// Import new artwork
import crossoverClassicalArt from '@/assets/crossover-classical-artwork.jpg';
import newAgeArt from '@/assets/new-age-artwork.jpg';
import electronicArt from '@/assets/electronic-artwork.jpg';

// Genre definitions with enhanced styling
const getGenreOptions = (goalId: string) => {
  const genreConfigs = {
    'focus-enhancement': [
      {
        id: 'crossover-classical',
        name: 'Crossover Classical',
        description: 'Modern classical compositions for concentration',
        buckets: ['classicalfocus'],
        trackCount: '50+ tracks',
        gradient: 'from-blue-600 to-cyan-400',
        image: crossoverClassicalArt
      },
      {
        id: 'new-age',
        name: 'New Age',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['neuralpositivemusic'],
        trackCount: '60+ tracks',
        gradient: 'from-teal-500 to-indigo-400',
        image: newAgeArt
      },
      {
        id: 'electronic',
        name: 'Electronic',
        description: 'Focused electronic beats and ambient textures',
        buckets: ['neuralpositivemusic'],
        trackCount: '75+ tracks',
        gradient: 'from-cyan-500 to-teal-400',
        image: electronicArt
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for deep concentration',
        buckets: ['Chopin'],
        trackCount: '45+ tracks',
        gradient: 'from-indigo-500 to-blue-400',
        image: peacefulPianoArt
      }
    ],
    'stress-anxiety': [
      {
        id: 'nature-sounds',
        name: 'Nature & Ambient',
        description: 'Calming nature sounds and ambient textures',
        buckets: ['neuralpositivemusic'],
        trackCount: '60+ tracks',
        gradient: 'from-green-600 to-emerald-400',
        image: '/lovable-uploads/delta-moonlit-lake.png'
      },
      {
        id: 'meditative-strings',
        name: 'Meditative Strings',
        description: 'Soothing string arrangements for relaxation',
        buckets: ['classicalfocus'],
        trackCount: '45+ tracks',
        gradient: 'from-emerald-500 to-teal-400',
        image: '/lovable-uploads/classical-meadow-ensemble.png'
      }
    ],
    'sleep-support': [
      {
        id: 'delta-wave',
        name: 'Delta Wave Therapy',
        description: 'Deep sleep-inducing frequencies',
        buckets: ['neuralpositivemusic'],
        trackCount: '35+ tracks',
        gradient: 'from-indigo-600 to-teal-400',
        image: '/lovable-uploads/theta-misty-path.png'
      },
      {
        id: 'nocturnal-classical',
        name: 'Nocturnal Classical',
        description: 'Gentle classical pieces for bedtime',
        buckets: ['classicalfocus'],
        trackCount: '30+ tracks',
        gradient: 'from-gray-600 to-indigo-400',
        image: '/lovable-uploads/folk-instruments-meadow.png'
      }
    ],
    'mood-boost': [
      {
        id: 'uplifting-orchestral',
        name: 'Uplifting Orchestral',
        description: 'Energizing orchestral compositions',
        buckets: ['classicalfocus'],
        trackCount: '55+ tracks',
        gradient: 'from-teal-500 to-cyan-400',
        image: '/lovable-uploads/beta-waterfall.png'
      },
      {
        id: 'positive-electronic',
        name: 'Positive Electronic',
        description: 'Upbeat electronic music for motivation',
        buckets: ['neuralpositivemusic'],
        trackCount: '70+ tracks',
        gradient: 'from-cyan-500 to-teal-400',
        image: '/lovable-uploads/alpha-mountain-lake.png'
      }
    ],
    'pain-support': [
      {
        id: 'healing-frequencies',
        name: 'Healing Frequencies',
        description: 'Therapeutic tones for pain management',
        buckets: ['neuralpositivemusic'],
        trackCount: '40+ tracks',
        gradient: 'from-gray-600 to-indigo-400',
        image: '/lovable-uploads/acoustic-sunset-field.png'
      },
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['classicalfocus'],
        trackCount: '35+ tracks',
        gradient: 'from-gray-500 to-blue-400',
        image: '/lovable-uploads/european-classical-terrace.png'
      }
    ],
    'energy-boost': [
      {
        id: 'energetic-classical',
        name: 'Energetic Classical',
        description: 'Dynamic classical pieces for vitality',
        buckets: ['classicalfocus'],
        trackCount: '50+ tracks',
        gradient: 'from-teal-600 to-cyan-400',
        image: '/lovable-uploads/gamma-sunbeam-forest.png'
      },
      {
        id: 'motivational-beats',
        name: 'Motivational Beats',
        description: 'Rhythmic music for energy and focus',
        buckets: ['neuralpositivemusic'],
        trackCount: '65+ tracks',
        gradient: 'from-indigo-600 to-teal-400',
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
    navigate('/goals');
  };

  if (!goal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Goal Not Found</h2>
          <Button onClick={handleBack}>Back to Goals</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Sophisticated Hero Section */}
      <div className="relative overflow-hidden">
        {/* Premium gradient background with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_70%_/_0.1),transparent_50%)]" />
        
        {/* Compact Header */}
        <div className="relative z-10 px-6 py-4 md:px-12 md:py-6">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBack}
              className="mb-4 bg-background/90 hover:bg-background text-foreground hover:text-primary backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 rounded-full px-6 py-2.5 font-medium shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Goals
            </Button>
            
            {/* Compact typography hierarchy */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/30 backdrop-blur-md rounded-full text-primary font-medium text-xs mb-3 border border-primary/20">
                <Music className="w-3 h-3" />
                Therapeutic Music Selection
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                {goal.name}
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
                {goal.description}
              </p>
              
              <div className="text-xs text-muted-foreground/80 font-medium">
                Choose your preferred therapeutic sound experience
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Genre Grid */}
      <div className="relative px-6 pb-8 md:px-12 md:pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Grid with square cards like therapeutic goals */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {genres.map((genre, index) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                onSelect={handleGenreSelect}
                index={index}
              />
            ))}
          </div>
          
          {/* Enhanced empty state */}
          {genres.length === 0 && (
            <div className="text-center py-20">
              <div className="relative mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-card shadow-card flex items-center justify-center">
                <Music className="w-10 h-10 text-primary" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-transparent animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Coming Soon</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                We're carefully curating therapeutic music selections for this goal. 
                Check back soon for premium audio experiences.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}