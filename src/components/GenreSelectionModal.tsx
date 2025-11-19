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
      {/* Liquid pewter background with depth and motion texture */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          style={{ 
            background: 'radial-gradient(ellipse at center, #1a2628 0%, #0a1214 50%, #050a0c 100%)',
            backdropFilter: 'blur(20px)',
          }} 
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[480px] mx-auto rounded-[40px] border-0 p-10 overflow-hidden z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(45, 55, 60, 0.7) 0%, rgba(30, 40, 45, 0.8) 100%)',
            backdropFilter: 'blur(80px) saturate(150%)',
            boxShadow: `
              0 0 0 1.5px rgba(255, 255, 255, 0.08),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
              0 20px 60px -10px rgba(0, 0, 0, 0.9),
              0 0 80px -20px rgba(100, 120, 140, 0.2)
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
                  background: 'linear-gradient(135deg, rgba(60, 70, 75, 0.6) 0%, rgba(40, 50, 55, 0.7) 100%)',
                  backdropFilter: 'blur(40px) saturate(120%)',
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.12),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
                    inset 0 -1px 0 0 rgba(0, 0, 0, 0.3),
                    0 8px 24px -4px rgba(0, 0, 0, 0.6),
                    0 0 40px -10px rgba(120, 140, 160, 0.15)
                  `,
                }}
              >
                {/* Frosted glass shine effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%)',
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
                  {/* Icon with soft backlight glow */}
                  <div className="relative">
                    <div 
                      className="absolute inset-0 blur-md opacity-40"
                      style={{
                        background: 'radial-gradient(circle, rgba(180, 190, 200, 0.6) 0%, transparent 70%)',
                        transform: 'scale(1.5)',
                      }}
                    />
                    <Play 
                      size={28} 
                      fill="rgba(160, 170, 180, 0.9)"
                      strokeWidth={0}
                      className="relative transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
                        color: 'rgba(180, 190, 200, 0.95)',
                      }}
                    />
                  </div>
                  
                  <span 
                    className="text-[18px] tracking-wide font-medium" 
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: 'rgba(220, 225, 230, 0.95)',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)',
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
