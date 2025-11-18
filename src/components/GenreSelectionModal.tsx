import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import goalSelectionBg from '@/assets/goal-selection-bg.gif';
import buttonTexture1 from '@/assets/textures/button-texture-1.png';
import buttonTexture2 from '@/assets/textures/button-texture-2.png';
import buttonTexture3 from '@/assets/textures/button-texture-3.png';
import buttonTexture4 from '@/assets/textures/button-texture-4.png';
import buttonTexture5 from '@/assets/textures/button-texture-5.png';
import buttonTexture6 from '@/assets/textures/button-texture-6.png';
import buttonTexture7 from '@/assets/textures/button-texture-7.png';
import buttonTexture8 from '@/assets/textures/button-texture-8.png';
import buttonTexture9 from '@/assets/textures/button-texture-9.png';
import buttonTexture10 from '@/assets/textures/button-texture-10.png';

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
  
  const buttonTextures = [
    { image: buttonTexture1, isDark: true },  // Black/very dark
    { image: buttonTexture2, isDark: true },  // Gold/tan dark
    { image: buttonTexture3, isDark: true },  // Grey dark
    { image: buttonTexture4, isDark: false }, // White/light
    { image: buttonTexture5, isDark: true },  // Dark grey/blue
    { image: buttonTexture6, isDark: true },  // Dark
    { image: buttonTexture7, isDark: true },  // Dark grey
    { image: buttonTexture8, isDark: false }, // Light grey/white
    { image: buttonTexture9, isDark: true },  // Dark grey
    { image: buttonTexture10, isDark: true }, // Dark green/grey
  ];

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
            background: 'rgba(10, 10, 20, 0.15)',
            boxShadow: '0 0 60px rgba(0,0,0,0.9), inset 0 0 80px rgba(255,255,255,0.02)',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[20px] backdrop-saturate-[180%]" />
        
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
          
          <div className={`grid gap-6 ${genres.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {genres.map((genre, index) => {
              const texture = buttonTextures[index % buttonTextures.length];
              return (
              <Card
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[140px] rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-10px] hover:brightness-110 active:scale-[0.98] group"
                style={{
                  backgroundImage: `url(${texture.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: `
                    inset 0 2px 4px rgba(255, 255, 255, 0.3),
                    inset 0 -6px 12px rgba(0, 0, 0, 0.4),
                    0 20px 50px rgba(0, 0, 0, 0.9),
                    0 10px 25px rgba(0, 0, 0, 0.7),
                    0 0 0 1px rgba(255, 255, 255, 0.1)
                  `,
                }}
              >
                {/* Top glossy highlight */}
                <div 
                  className="absolute inset-x-0 top-0 h-[45%] rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)',
                  }}
                />
                
                {/* Edge rim light - top */}
                <div 
                  className="absolute inset-x-0 top-0 h-[3px] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                    filter: 'blur(1px)',
                  }}
                />
                
                {/* Bottom depth shadow */}
                <div 
                  className="absolute inset-x-0 bottom-0 h-[30%] rounded-full"
                  style={{
                    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)',
                  }}
                />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <div 
                    className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.4)) drop-shadow(0 -1px 2px rgba(255,255,255,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))',
                    }}
                  >
                    <Play 
                      size={40} 
                      fill="black" 
                      strokeWidth={0.8}
                      className="text-white/70"
                      style={{
                        filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.5))',
                      }}
                    />
                  </div>
                  <span 
                    className="text-2xl tracking-wide relative z-10" 
                    style={{ 
                      textShadow: texture.isDark 
                        ? '0 1px 2px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.6)'
                        : '0 1px 2px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)',
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      ...(texture.isDark ? {
                        background: 'linear-gradient(180deg, #E8E9ED 0%, #B8BCC5 50%, #9CA0A8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      } : {
                        color: '#000000',
                      }),
                    }}
                  >
                    {genre.name}
                  </span>
                </div>
              </Card>
            );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};