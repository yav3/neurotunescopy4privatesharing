import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import goalSelectionBg from '@/assets/goal-selection-bg.gif';
import metallicGlass1 from '@/assets/textures/metallic-glass-1.png';
import metallicGlass2 from '@/assets/textures/metallic-glass-2.png';
import metallicGlass3 from '@/assets/textures/metallic-glass-3.png';
import metallicGlass4 from '@/assets/textures/metallic-glass-4.png';
import metallicGlass5 from '@/assets/textures/metallic-glass-5.png';

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
  
  const textureImages = [metallicGlass1, metallicGlass2, metallicGlass3, metallicGlass4, metallicGlass5];

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
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        </>
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[540px] mx-auto rounded-[28px] border border-white/[0.08] p-12 overflow-hidden z-50"
          style={{
            background: 'rgba(10, 10, 20, 0.25)',
            boxShadow: '0 0 60px rgba(0,0,0,0.9), inset 0 0 80px rgba(255,255,255,0.03)',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[32px] backdrop-saturate-[200%]" />
        
        <div className="relative z-10">
          <DialogHeader className="pb-6">
            {showTitle && (
              <DialogTitle className="text-xl font-semibold text-white overflow-hidden whitespace-nowrap" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                <span className="inline-block animate-[zoom-in_1s_ease-out]">
                  Select A Genre to Start Your Session
                </span>
              </DialogTitle>
            )}
          </DialogHeader>
          
          <div className="space-y-6">
            {genres.map((genre, index) => (
              <Card
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[140px] rounded-[32px] relative overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-12px] hover:scale-[1.02] active:scale-[0.98] border-[3px]"
                style={{
                  backgroundImage: `url(${textureImages[index % textureImages.length]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.3) inset,
                    0 20px 60px rgba(0, 0, 0, 0.95),
                    0 10px 30px rgba(0, 0, 0, 0.8),
                    0 5px 15px rgba(0, 0, 0, 0.7),
                    0 0 100px rgba(0, 0, 0, 0.5)
                  `,
                }}
              >
                {/* Dark overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(165deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)',
                    backdropFilter: 'blur(12px) saturate(120%)',
                  }}
                />
                
                {/* Strong top highlight for 3D effect */}
                <div 
                  className="absolute inset-x-0 top-0 h-[35%]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                  }}
                />
                
                {/* Bottom shadow for depth */}
                <div 
                  className="absolute inset-x-0 bottom-0 h-[25%]"
                  style={{
                    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)',
                  }}
                />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-white font-bold text-2xl tracking-wide px-12 relative z-10" 
                    style={{ 
                      textShadow: '0 4px 20px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)',
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
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