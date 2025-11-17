import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGenreOptions } from '@/config/genreConfigs';
import { GOALS_BY_ID } from '@/config/therapeuticGoals';
import { useNavigate } from 'react-router-dom';

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
      <DialogContent className="max-w-[480px] mx-auto bg-[rgba(4,18,26,0.55)] backdrop-blur-[24px] backdrop-saturate-[180%] rounded-[28px] border border-white/[0.12] shadow-[0_0_40px_rgba(0,0,0,0.4),inset_0_0_80px_rgba(180,255,250,0.08)] p-8">
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
            <Button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className="w-full h-auto py-6 px-8 text-lg font-medium rounded-full bg-gradient-to-b from-[#2a3f4f] to-[#1a2830] hover:from-[#344856] hover:to-[#1f2f38] text-[#d4d8dd] border border-[#3d5461]/50 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.08)] hover:translate-y-[-1px]"
            >
              {genre.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};