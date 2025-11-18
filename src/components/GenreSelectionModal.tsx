import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import goalSelectionBg from '@/assets/goal-selection-bg.gif';
import pillSilver from '@/assets/pills/pill-silver-metallic.png';

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
                <span className="inline-block animate-[slide-in-right_1s_ease-out]">
                  Click On A Genre to Start Your Session
                </span>
              </DialogTitle>
            )}
          </DialogHeader>
          
          <div className="space-y-7">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[140px] rounded-full relative border-none transition-all duration-200 flex items-center justify-center hover:translate-y-[-4px] hover:brightness-[1.15] hover:drop-shadow-[0_8px_32px_rgba(255,255,255,0.2)] active:scale-[0.97] active:brightness-[0.95] active:translate-y-[-2px]"
                style={{
                  background: 'none',
                  backgroundImage: `url('${pillSilver}')`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                }}
              >
                <span className="text-white font-bold text-xl tracking-wide px-12" style={{ textShadow: '0 4px 20px rgba(0,0,0,1), 0 3px 12px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9)' }}>
                  {genre.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};