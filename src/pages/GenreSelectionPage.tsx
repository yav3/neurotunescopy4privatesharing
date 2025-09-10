import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { cn } from '@/lib/utils';
import peacefulPianoArt from '@/assets/peaceful-piano-artwork.jpg';

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
        image: '/lovable-uploads/european-classical-terrace.png'
      },
      {
        id: 'new-age',
        name: 'New Age',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['neuralpositivemusic'],
        trackCount: '60+ tracks',
        gradient: 'from-purple-500 to-indigo-400',
        image: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/84E41822D72BB74C3DE361758D96552D357EF3D12CFB9A4B739B8539B88001A5_sk_6_cid_1%20(1).jpeg'
      },
      {
        id: 'electronic',
        name: 'Electronic',
        description: 'Focused electronic beats and ambient textures',
        buckets: ['neuralpositivemusic'],
        trackCount: '75+ tracks',
        gradient: 'from-cyan-500 to-teal-400',
        image: 'https://pbtgvcjniayedqlajjzz.supabase.co/storage/v1/object/public/albumart/BEF904AA9C4B80018215E6C082AA7FEAA1E0D5E6E2EAE4B836FE28AB6FB66243_sk_6_cid_1%20(1).jpeg'
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
        gradient: 'from-indigo-600 to-purple-400',
        image: '/lovable-uploads/theta-misty-path.png'
      },
      {
        id: 'nocturnal-classical',
        name: 'Nocturnal Classical',
        description: 'Gentle classical pieces for bedtime',
        buckets: ['classicalfocus'],
        trackCount: '30+ tracks',
        gradient: 'from-purple-600 to-indigo-400',
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
        gradient: 'from-yellow-500 to-orange-400',
        image: '/lovable-uploads/beta-waterfall.png'
      },
      {
        id: 'positive-electronic',
        name: 'Positive Electronic',
        description: 'Upbeat electronic music for motivation',
        buckets: ['neuralpositivemusic'],
        trackCount: '70+ tracks',
        gradient: 'from-orange-500 to-red-400',
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
        gradient: 'from-purple-600 to-pink-400',
        image: '/lovable-uploads/acoustic-sunset-field.png'
      },
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['classicalfocus'],
        trackCount: '35+ tracks',
        gradient: 'from-pink-500 to-rose-400',
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
        gradient: 'from-red-600 to-orange-400',
        image: '/lovable-uploads/gamma-sunbeam-forest.png'
      },
      {
        id: 'motivational-beats',
        name: 'Motivational Beats',
        description: 'Rhythmic music for energy and focus',
        buckets: ['neuralpositivemusic'],
        trackCount: '65+ tracks',
        gradient: 'from-orange-600 to-amber-400',
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Dynamic background based on goal */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--secondary)/0.1))`
          }}
        />
        
        <div className="relative z-10 px-4 py-4 md:px-8 md:py-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Goals
            </Button>
            
            <div className="text-center mb-4 md:mb-6">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">
                {goal.name}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-4">
                {goal.description}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary font-medium text-sm">
                <Music className="w-3.5 h-3.5" />
                Choose your preferred music genre
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="px-4 pb-4 md:px-8 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {genres.map((genre, index) => (
              <Card
                key={genre.id}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-500",
                  "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
                  "bg-card/90 backdrop-blur-sm border-border/50 hover:border-primary/30"
                )}
                onClick={() => handleGenreSelect(genre.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Album Art */}
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img 
                    src={genre.image}
                    alt={genre.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-500" />
                  
                  {/* Genre icon overlay */}
                  <div className={cn(
                    "absolute top-3 right-3 p-2 rounded-full transition-all duration-300 group-hover:scale-110",
                    "bg-gradient-to-br opacity-80 group-hover:opacity-100"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${genre.gradient.split(' ').join(', ')})`
                  }}>
                    <Headphones className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-foreground transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/90 transition-colors leading-relaxed">
                      {genre.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-muted-foreground">
                      {genre.trackCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ready to play
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5",
                      "transition-all duration-300"
                    )}
                  >
                    <Play className="w-3.5 h-3.5 mr-2" />
                    Start Listening
                  </Button>
                </div>

                {/* Hover shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
              </Card>
            ))}
          </div>
          
          {genres.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Genres Available</h3>
              <p className="text-muted-foreground">
                Genres for this therapeutic goal are coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}