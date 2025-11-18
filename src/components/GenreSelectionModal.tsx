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
      {/* Full-page background GIF with darkening overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            style={{
              backgroundImage: `url(${goalSelectionBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md" />
        </>
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[540px] mx-auto rounded-[32px] border-0 p-12 overflow-hidden z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
            backdropFilter: 'blur(60px) saturate(200%)',
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.9),
              0 0 100px rgba(0, 0, 0, 0.8),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 rgba(0, 0, 0, 0.4)
            `,
          }}
        >
        
        <div className="relative z-10">
          <DialogHeader className="pb-6">
            {showTitle && (
              <DialogTitle className="text-xl font-semibold overflow-hidden whitespace-nowrap" style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'linear-gradient(180deg, #E8E9ED 0%, #B8BCC5 50%, #9CA0A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                <span className="inline-block animate-[zoom-in_1s_ease-out]">
                  Select A Genre to Start Your Session
                </span>
              </DialogTitle>
            )}
          </DialogHeader>
          
          <div className={`grid gap-5 ${genres.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {genres.map((genre) => (
              <Card
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[120px] rounded-full relative overflow-visible cursor-pointer transition-all duration-300 hover:translate-y-[-6px] active:scale-[0.98] group"
                style={{
                  background: 'linear-gradient(180deg, rgba(35, 35, 38, 1) 0%, rgba(15, 15, 17, 1) 50%, rgba(8, 8, 10, 1) 100%)',
                  border: 'none',
                  boxShadow: `
                    inset 0 3px 6px rgba(255, 255, 255, 0.8),
                    inset 0 2px 3px rgba(255, 255, 255, 0.9),
                    inset 0 1px 1px rgba(255, 255, 255, 1),
                    inset 0 -3px 8px rgba(0, 0, 0, 0.95),
                    inset 0 -1px 2px rgba(0, 0, 0, 1),
                    0 1px 0 rgba(120, 120, 125, 0.8),
                    0 2px 0 rgba(100, 100, 105, 0.6),
                    0 20px 50px rgba(0, 0, 0, 0.9),
                    0 8px 20px rgba(0, 0, 0, 0.8),
                    0 0 0 1.5px rgba(80, 80, 85, 0.7)
                  `,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
                  <div 
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105"
                  >
                    <div className="relative">
                      <Play 
                        size={28} 
                        fill="rgba(20, 20, 22, 1)"
                        strokeWidth={0}
                        className="text-black"
                        style={{
                          filter: `
                            drop-shadow(0 2px 0 rgba(255, 255, 255, 0.7))
                            drop-shadow(0 3px 1px rgba(255, 255, 255, 0.5))
                            drop-shadow(0 1px 0 rgba(255, 255, 255, 0.9))
                            drop-shadow(0 -2px 0 rgba(0, 0, 0, 0.9))
                            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))
                          `,
                        }}
                      />
                    </div>
                  </div>
                  <span 
                    className="text-[20px] tracking-wide font-medium" 
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: '#FFFFFF',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
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
