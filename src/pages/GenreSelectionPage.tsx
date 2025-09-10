import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Music, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { cn } from '@/lib/utils';

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
        bgPattern: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'new-age',
        name: 'New Age',
        description: 'Ethereal soundscapes for enhanced focus',
        buckets: ['neuralpositivemusic'],
        trackCount: '60+ tracks',
        gradient: 'from-purple-500 to-indigo-400',
        bgPattern: 'radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'electronic',
        name: 'Electronic',
        description: 'Focused electronic beats and ambient textures',
        buckets: ['neuralpositivemusic'],
        trackCount: '75+ tracks',
        gradient: 'from-cyan-500 to-teal-400',
        bgPattern: 'radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'peaceful-piano',
        name: 'Peaceful Piano',
        description: 'Gentle piano melodies for deep concentration',
        buckets: ['Chopin'],
        trackCount: '45+ tracks',
        gradient: 'from-indigo-500 to-blue-400',
        bgPattern: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)'
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
        bgPattern: 'radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'meditative-strings',
        name: 'Meditative Strings',
        description: 'Soothing string arrangements for relaxation',
        buckets: ['classicalfocus'],
        trackCount: '45+ tracks',
        gradient: 'from-emerald-500 to-teal-400',
        bgPattern: 'radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)'
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
        bgPattern: 'radial-gradient(circle at 40% 60%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'nocturnal-classical',
        name: 'Nocturnal Classical',
        description: 'Gentle classical pieces for bedtime',
        buckets: ['classicalfocus'],
        trackCount: '30+ tracks',
        gradient: 'from-purple-600 to-indigo-400',
        bgPattern: 'radial-gradient(circle at 60% 40%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)'
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
        bgPattern: 'radial-gradient(circle at 25% 75%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'positive-electronic',
        name: 'Positive Electronic',
        description: 'Upbeat electronic music for motivation',
        buckets: ['neuralpositivemusic'],
        trackCount: '70+ tracks',
        gradient: 'from-orange-500 to-red-400',
        bgPattern: 'radial-gradient(circle at 75% 25%, rgba(249, 115, 22, 0.2) 0%, transparent 50%)'
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
        bgPattern: 'radial-gradient(circle at 50% 30%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'gentle-classical',
        name: 'Gentle Classical',
        description: 'Soft classical music for comfort',
        buckets: ['classicalfocus'],
        trackCount: '35+ tracks',
        gradient: 'from-pink-500 to-rose-400',
        bgPattern: 'radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)'
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
        bgPattern: 'radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.2) 0%, transparent 50%)'
      },
      {
        id: 'motivational-beats',
        name: 'Motivational Beats',
        description: 'Rhythmic music for energy and focus',
        buckets: ['neuralpositivemusic'],
        trackCount: '65+ tracks',
        gradient: 'from-orange-600 to-amber-400',
        bgPattern: 'radial-gradient(circle at 80% 60%, rgba(249, 115, 22, 0.2) 0%, transparent 50%)'
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
            background: `linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--secondary)/0.1)), ${genres[0]?.bgPattern || ''}`
          }}
        />
        
        <div className="relative z-10 px-4 py-6 md:px-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Goals
            </Button>
            
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {goal.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                {goal.description}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
                <Music className="w-4 h-4" />
                Choose your preferred music genre
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="px-4 py-8 md:px-8 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
                {/* Background gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${genre.gradient.split(' ').join(', ')})`
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-foreground transition-colors">
                        {genre.name}
                      </h3>
                      <p className="text-muted-foreground group-hover:text-muted-foreground/90 transition-colors leading-relaxed mb-4">
                        {genre.description}
                      </p>
                    </div>
                    
                    <div className={cn(
                      "p-3 rounded-full transition-all duration-300 group-hover:scale-110 ml-4",
                      "bg-gradient-to-br opacity-80 group-hover:opacity-100"
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${genre.gradient.split(' ').join(', ')})`
                    }}>
                      <Headphones className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-muted-foreground">
                      {genre.trackCount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ready to play
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5",
                      "transition-all duration-300"
                    )}
                  >
                    <Play className="w-4 h-4 mr-2" />
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