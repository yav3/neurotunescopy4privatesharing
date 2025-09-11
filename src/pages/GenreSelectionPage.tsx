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
        gradient: 'from-teal-500 to-indigo-400',
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
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4 text-muted-foreground hover:text-foreground hover:bg-card/50 backdrop-blur-sm border border-border/30 rounded-full px-4 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
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
          {/* Grid with compact spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {genres.map((genre, index) => (
              <div
                key={genre.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
              >
                <Card
                  className={cn(
                    "group relative overflow-hidden cursor-pointer",
                    "bg-gradient-card shadow-card border border-border/50",
                    "transition-all duration-700 ease-out",
                    "hover:shadow-[0_32px_80px_hsl(217_91%_60%_/_0.25),_0_16px_40px_hsl(217_91%_5%_/_0.4)]",
                    "hover:border-primary/40 hover:-translate-y-3 hover:scale-[1.02]",
                    "backdrop-blur-sm"
                  )}
                  onClick={() => handleGenreSelect(genre.id)}
                >
                  {/* Compact image container */}
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img 
                      src={genre.image}
                      alt={genre.name}
                      className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:brightness-110"
                    />
                    
                    {/* Sophisticated gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                    
                    {/* Premium floating badge */}
                    <div className="absolute top-3 right-3 p-2.5 rounded-2xl bg-card/20 backdrop-blur-md border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-card/30">
                      <Headphones className="w-4 h-4 text-primary" />
                    </div>
                    
                    {/* Track count badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-card/90 backdrop-blur-md rounded-full text-xs font-medium text-foreground border border-border/30">
                      {genre.trackCount}
                    </div>
                  </div>
                  
                  {/* Compact content section */}
                  <div className="relative z-10 p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                        {genre.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {genre.description}
                      </p>
                    </div>

                    {/* Compact status indicators */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        Ready to play
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Therapeutic grade
                      </div>
                    </div>

                    {/* Compact action button */}
                    <Button
                      className={cn(
                        "w-full h-10 rounded-xl font-semibold text-sm",
                        "bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground",
                        "border-2 border-primary/20 hover:border-primary",
                        "transition-all duration-300 group-hover:shadow-lg",
                        "backdrop-blur-sm"
                      )}
                    >
                      <Play className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      Begin Session
                    </Button>
                  </div>

                  {/* Premium shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200 pointer-events-none" />
                  
                  {/* Subtle glow animation */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-glow-pulse" />
                </Card>
              </div>
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