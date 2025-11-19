import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import goalSelectionBg from '@/assets/goal-selection-bg.gif';

interface GenreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalId: string;
}

export const GenreSelectionModal: React.FC<GenreSelectionModalProps> = ({
  isOpen,
  onClose,
  goalId
}) => {
  const navigate = useNavigate();
  const goal = GOALS_BY_ID[goalId as keyof typeof GOALS_BY_ID];
  const genres = getGenreOptions(goalId);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowTitle(true);
      const timer = setTimeout(() => setShowTitle(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowTitle(false);
    }
  }, [isOpen]);

  const handleGenreSelect = (genreId: string) => {
    navigate(`/genre/${goalId}/${genreId}`);
    onClose();
  };

  if (!goal) return null;

  return (
    <>
      {/* Ultra-dark translucent background */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          style={{ 
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(40px)',
          }} 
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[480px] mx-auto rounded-[40px] border-0 p-10 overflow-hidden z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 25, 30, 0.4) 0%, rgba(10, 15, 20, 0.5) 100%)',
            backdropFilter: 'blur(100px) saturate(180%)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.06),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
              0 30px 80px -10px rgba(0, 0, 0, 0.95),
              0 0 120px -30px rgba(80, 100, 120, 0.15)
            `,
          }}
        >
        
        <div className="relative z-10">
          <DialogHeader className="pb-8">
            {showTitle && (
              <DialogTitle className="text-xl font-semibold text-center overflow-hidden whitespace-nowrap" style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'linear-gradient(180deg, #E8E9ED 0%, #B8BCC5 50%, #9CA0A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}>
                <span className="inline-block animate-[zoom-in_1s_ease-out]">
                  Select A Genre to Start Your Session
                </span>
              </DialogTitle>
            )}
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            {genres.map((genre) => (
              <Card
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[72px] rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl active:scale-[0.98] group border-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(80, 90, 100, 0.35) 0%, rgba(60, 70, 80, 0.4) 50%, rgba(50, 60, 70, 0.45) 100%)',
                  backdropFilter: 'blur(60px) saturate(200%)',
                  boxShadow: `
                    0 0 0 1.5px rgba(255, 255, 255, 0.18),
                    inset 0 2px 0 0 rgba(255, 255, 255, 0.25),
                    inset 0 -2px 0 0 rgba(0, 0, 0, 0.4),
                    0 10px 30px -5px rgba(0, 0, 0, 0.8),
                    0 0 60px -15px rgba(140, 160, 180, 0.2)
                  `,
                }}
              >
                {/* Enhanced frosted glass shine effect */}
                <div 
                  className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
                  }}
                />
                
                {/* Noise texture for frost effect */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'4\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
                  {/* Play icon with enhanced backlight */}
                  <div className="relative">
                    <div 
                      className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                      style={{
                        background: 'radial-gradient(circle, rgba(200, 210, 220, 0.5) 0%, transparent 70%)',
                        transform: 'scale(2)',
                      }}
                    />
                    <Play 
                      size={26} 
                      fill="rgba(180, 190, 200, 0.85)"
                      strokeWidth={0}
                      className="relative transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110"
                      style={{
                        filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 12px rgba(200, 210, 220, 0.3))',
                        color: 'rgba(200, 210, 220, 0.95)',
                      }}
                    />
                  </div>
                  
                  <span 
                    className="text-[18px] tracking-wide font-medium" 
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: 'rgba(230, 235, 240, 0.95)',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {genre.name}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
