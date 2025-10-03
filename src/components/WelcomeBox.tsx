import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeBoxProps {
  onDismiss: () => void;
}

export function WelcomeBox({ onDismiss }: WelcomeBoxProps) {
  return (
    <div className="relative px-4 sm:px-6 py-2 bg-muted/50 rounded-xl border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="absolute top-1.5 right-1.5 h-6 w-6 p-0 hover:bg-background/80"
        aria-label="Dismiss welcome message"
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="pr-6">
        <p className="text-xs sm:text-sm text-foreground leading-relaxed">
          Click on a goal to select a genre. I'll learn your preferences and improve recommendations with every session, ultimately enabling a closed loop experience. Pin a mode to the top: you'll get recommendations based on your recent favorites. Select from a therapeutic goal to listen on discovery mode.
        </p>
      </div>
    </div>
  );
}
