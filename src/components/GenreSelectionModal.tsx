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
          
          <div className="space-y-4">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre.id)}
                className="w-full h-auto py-6 px-8 text-lg font-medium rounded-full relative overflow-hidden group transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[0px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(140, 140, 140, 0.9) 0%, rgba(90, 90, 90, 0.85) 50%, rgba(60, 60, 60, 0.9) 100%)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(180, 180, 180, 0.95) 0%, rgba(120, 120, 120, 0.9) 50%, rgba(80, 80, 80, 0.95) 100%)',
                  }}
                />
                <span className="relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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