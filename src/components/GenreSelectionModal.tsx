import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

  const handleGenreSelect = (genreId: string) => {
    navigate(`/genre/${goalId}/${genreId}`);
    onClose();
  };

  if (!goal) return null;

  return (
    <>
      {/* Full-page background GIF */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          style={{
            backgroundImage: `url(${goalSelectionBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[480px] mx-auto rounded-[28px] border border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(255,255,255,0.04)] p-8 overflow-hidden z-50"
          style={{
            background: 'rgba(10, 10, 20, 0.15)',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[24px] backdrop-saturate-[200%]" />
        
        <div className="relative z-10">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold text-white text-shadow-[0_3px_12px_rgba(0,0,0,0.6)]">
              Click On A Genre to Start Your Session
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="pill w-full h-[72px] px-8 text-lg font-semibold rounded-[50px] relative overflow-hidden group border-none transition-all duration-150"
                style={{
                  background: 'linear-gradient(180deg, rgba(90,100,110,0.95) 0%, rgba(60,70,80,0.95) 40%, rgba(40,50,60,0.95) 60%, rgba(20,30,40,0.98) 100%)',
                  boxShadow: `
                    0 1px 0 rgba(255, 255, 255, 0.3) inset,
                    0 -1px 0 rgba(0, 0, 0, 0.5) inset,
                    0 8px 24px rgba(0, 0, 0, 0.7),
                    0 2px 8px rgba(0, 0, 0, 0.4)
                  `,
                }}
              >
                <span className="relative z-10 text-white font-semibold text-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
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