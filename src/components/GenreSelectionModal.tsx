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
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(60px)',
          }} 
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[520px] mx-auto rounded-[36px] border-0 p-12 overflow-hidden z-50"
          style={{
            background: 'linear-gradient(145deg, rgba(35, 40, 45, 0.25) 0%, rgba(25, 30, 35, 0.35) 100%)',
            backdropFilter: 'blur(120px) saturate(200%)',
            boxShadow: `
              0 0 0 1.5px rgba(255, 255, 255, 0.08),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
              0 40px 100px -20px rgba(0, 0, 0, 0.9),
              0 0 80px -20px rgba(70, 80, 90, 0.1)
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
                className="w-full h-[68px] rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-1px] active:scale-[0.99] group border-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(90, 100, 110, 0.3) 0%, rgba(70, 80, 90, 0.35) 50%, rgba(60, 70, 80, 0.4) 100%)',
                  backdropFilter: 'blur(80px) saturate(180%)',
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.15),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                    inset 0 -1px 0 0 rgba(0, 0, 0, 0.3),
                    0 8px 24px -6px rgba(0, 0, 0, 0.7),
                    0 0 40px -10px rgba(120, 130, 140, 0.15)
                  `,
                }}
              >
                {/* Frosted glass shine effect */}
                <div 
                  className="absolute inset-0 opacity-25 group-hover:opacity-50 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%)',
                  }}
                />
                
                {/* Subtle noise texture */}
                <div 
                  className="absolute inset-0 opacity-8"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'3.5\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
                  {/* Play icon with soft backlight */}
                  <div className="relative">
                    <div 
                      className="absolute inset-0 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                      style={{
                        background: 'radial-gradient(circle, rgba(190, 200, 210, 0.4) 0%, transparent 65%)',
                        transform: 'scale(1.8)',
                      }}
                    />
                    <Play 
                      size={24} 
                      fill="rgba(170, 180, 190, 0.9)"
                      strokeWidth={0}
                      className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-105"
                      style={{
                        filter: 'drop-shadow(0 1px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(190, 200, 210, 0.25))',
                        color: 'rgba(190, 200, 210, 0.9)',
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
