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
      {/* Pure black background */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black" />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[540px] mx-auto rounded-[32px] border-0 p-12 overflow-hidden z-50"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(40px)',
            boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
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
                className="w-full h-[120px] rounded-full relative overflow-visible cursor-pointer transition-all duration-300 hover:translate-y-[-4px] active:scale-[0.98] group"
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: 'none',
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.3),
                    inset 0 2px 8px rgba(255, 255, 255, 0.1),
                    inset 0 -2px 8px rgba(0, 0, 0, 0.5),
                    0 8px 32px rgba(0, 0, 0, 0.6)
                  `,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
                  <div 
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105"
                  >
                    <div className="relative">
                      <Play 
                        size={32} 
                        fill="rgba(192, 192, 200, 1)"
                        strokeWidth={0}
                        className="text-[#C0C0C8]"
                        style={{
                          filter: `
                            drop-shadow(0 1px 2px rgba(255, 255, 255, 0.3))
                            drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))
                          `,
                        }}
                      />
                    </div>
                  </div>
                  <span 
                    className="text-[20px] tracking-wide font-medium" 
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: '#C0C0C8',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
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
