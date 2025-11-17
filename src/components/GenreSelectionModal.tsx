import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';
import liquidMetalBg from '@/assets/liquid-metal-bg.gif';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[480px] mx-auto rounded-[28px] border border-white/[0.12] shadow-[0_0_40px_rgba(0,0,0,0.4),inset_0_0_80px_rgba(180,255,250,0.08)] p-8 overflow-hidden"
        style={{
          backgroundImage: `url(${liquidMetalBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[24px] backdrop-saturate-[180%]" />
        
        <div className="relative z-10">
          <DialogHeader className="flex flex-row items-center justify-between pb-6">
            <DialogTitle className="text-xl font-semibold text-white">
              Click On A Genre to Start Your Session
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-5">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-[72px] px-8 text-lg font-semibold rounded-full relative overflow-hidden group transition-all duration-200 hover:translate-y-[-3px] active:translate-y-[0px] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(175deg, #3d4d59 0%, #2f3f4b 25%, #1f2f3b 50%, #151f2b 75%, #0a141e 100%)',
                  boxShadow: `
                    0 1px 1px rgba(255, 255, 255, 0.4) inset,
                    0 -2px 1px rgba(0, 0, 0, 0.6) inset,
                    0 12px 32px rgba(0, 0, 0, 0.8),
                    0 4px 12px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(0, 0, 0, 0.3)
                  `,
                  border: '1.5px solid',
                  borderColor: 'rgba(90, 110, 130, 0.3)',
                  borderTopColor: 'rgba(130, 150, 170, 0.5)',
                  borderBottomColor: 'rgba(10, 20, 30, 0.8)',
                }}
              >
                {/* Shine overlay on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(175deg, #4d5d69 0%, #3f4f5b 25%, #2f3f4b 50%, #1f2f3b 75%, #151f2b 100%)',
                  }}
                />
                
                {/* Subtle top highlight */}
                <div 
                  className="absolute top-0 left-[10%] right-[10%] h-[30%] opacity-30 rounded-full pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                  }}
                />
                
                <span className="relative z-10 text-[#d8dce0] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {genre.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};