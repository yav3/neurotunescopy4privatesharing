import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import genreModalBg from '@/assets/genre-modal-bg.gif';
import genreButton1 from '@/assets/genre-button-1.png';
import genreButton2 from '@/assets/genre-button-2.png';
import genreButton3 from '@/assets/genre-button-3.png';
import genreButton4 from '@/assets/genre-button-4.png';

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
  
  const genreBackgrounds = [genreButton1, genreButton2, genreButton3, genreButton4];

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
      {/* Background with GIF */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          style={{ 
            backgroundImage: `url(${genreModalBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }} 
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[520px] mx-auto rounded-[40px] border-0 p-10 overflow-hidden z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 24, 28, 0.25) 0%, rgba(14, 18, 22, 0.35) 100%)',
            backdropFilter: 'blur(100px) saturate(180%)',
            boxShadow: `
              0 0 0 1px rgba(255, 255, 255, 0.04),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
              0 30px 80px -15px rgba(0, 0, 0, 0.85),
              0 0 60px -15px rgba(50, 60, 70, 0.08)
            `,
          }}
        >
        
        <div className="relative z-10">
          <DialogHeader className="pb-8">
            {showTitle && (
              <DialogTitle className="text-lg text-center overflow-hidden whitespace-nowrap" style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
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
            {genres.map((genre, index) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[56px] rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-1px] active:scale-[0.98] group border-0"
                style={{
                  backgroundImage: `url(${genreBackgrounds[index % genreBackgrounds.length]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backdropFilter: 'blur(60px) saturate(160%)',
                  boxShadow: `
                    0 0 0 0.5px rgba(255, 255, 255, 0.18),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.18),
                    inset 0 -1px 0 0 rgba(0, 0, 0, 0.25),
                    0 6px 20px -4px rgba(0, 0, 0, 0.6)
                  `,
                }}
              >
                {/* Subtle shine effect */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)',
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center gap-3 px-6">
                  {/* Small play triangle with pearl-grey outline */}
                  <div className="relative flex items-center justify-center">
                    <Play 
                      size={16} 
                      fill="rgba(70, 75, 80, 0.85)"
                      strokeWidth={1}
                      stroke="rgba(200, 205, 210, 0.4)"
                      className="relative transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{
                        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                      }}
                    />
                  </div>
                  
                  <span 
                    className="text-[16px] tracking-normal" 
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: 400,
                      color: 'rgba(220, 225, 230, 0.92)',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {genre.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
