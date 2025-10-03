import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeBoxProps {
  onDismiss: () => void;
}

export function WelcomeBox({ onDismiss }: WelcomeBoxProps) {
  return (
    <div className="relative px-6 sm:px-8 py-4 bg-muted/50 rounded-xl border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-background/80"
        aria-label="Dismiss welcome message"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="pr-8">
        <p className="text-base sm:text-lg text-foreground leading-relaxed">
          Click on a goal to select a genre. I'll learn your preferences and improve recommendations with every session, ultimately enabling a closed loop experience. Pin a mode to the top: you'll get recommendations based on your recent favorites. Select from a therapeutic goal to listen on discovery mode.
        </p>
      </div>
    </div>
  );
}
