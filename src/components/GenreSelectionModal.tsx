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
      <DialogContent className="max-w-md mx-auto bg-background border border-border rounded-xl shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Click On A Genre to Start Your Session
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              onClick={() => handleGenreSelect(genre.id)}
              className="w-full h-auto py-6 px-6 text-lg font-medium rounded-full bg-slate-400/90 hover:bg-slate-300 text-slate-900 border-2 border-slate-500 hover:border-slate-400 transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.8)] hover:translate-y-[-2px]"
            >
              {genre.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};