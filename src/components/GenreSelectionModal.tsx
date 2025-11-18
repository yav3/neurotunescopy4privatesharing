import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import goalSelectionBg from '@/assets/goal-selection-bg.gif';
import modalBgDark from '@/assets/modal-bg-dark.png';

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
  
  const getButtonStyle = (index: number) => {
    const isDark = index % 2 === 0;
    return { isDark };
  };

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
            backgroundImage: `url(${modalBgDark})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 0 60px rgba(0,0,0,0.9), inset 0 0 80px rgba(255,255,255,0.02)',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[40px] backdrop-saturate-[180%]" style={{ background: 'rgba(10, 10, 20, 0.5)' }} />
        
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
              const { isDark } = getButtonStyle(index);
              return (
              <Card
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[140px] rounded-full relative overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-10px] hover:brightness-110 active:scale-[0.98] group"
                style={{
                  background: isDark 
                    ? 'rgba(60, 60, 70, 0.5)' 
                    : 'rgba(240, 240, 245, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: isDark
                    ? '1.5px solid rgba(255, 255, 255, 0.15)'
                    : '1.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: isDark
                    ? `inset 0 1px 2px rgba(255, 255, 255, 0.1),
                       inset 0 -1px 3px rgba(0, 0, 0, 0.3),
                       0 10px 30px rgba(0, 0, 0, 0.5),
                       0 5px 15px rgba(0, 0, 0, 0.3)`
                    : `inset 0 1px 2px rgba(255, 255, 255, 0.5),
                       inset 0 -1px 3px rgba(0, 0, 0, 0.1),
                       0 10px 30px rgba(0, 0, 0, 0.3),
                       0 5px 15px rgba(0, 0, 0, 0.2)`,
                }}
              >
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <div className="transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110">
                    <Play 
                      size={36} 
                      fill={isDark ? "white" : "black"}
                      strokeWidth={0.5}
                      className={isDark ? "text-white/90" : "text-black/90"}
                      style={{
                        filter: isDark 
                          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      }}
                    />
                  </div>
                  <span 
                    className="text-2xl tracking-wide font-normal" 
                    style={{ 
                      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                      ...(isDark ? {
                        background: 'linear-gradient(180deg, #E8E9ED 0%, #B8BCC5 50%, #9CA0A8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                      } : {
                        color: '#1a1a1a',
                        textShadow: '0 1px 2px rgba(255,255,255,0.5)',
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