import React from 'react';
import { Button } from '@/components/ui/button';

// Import debug utilities
import '../utils/debugTrackSelection';

export const DebugTrackSelection: React.FC = () => {
  const handleDebugSelection = () => {
    if (typeof window !== 'undefined' && window.debugTrackSelection) {
      window.debugTrackSelection();
    }
  };

  const handleClearHistory = () => {
    if (typeof window !== 'undefined' && window.clearTrackHistory) {
      window.clearTrackHistory();
    }
  };

  const handleDebugFavorites = () => {
    if (typeof window !== 'undefined' && window.showFavoritesDebug) {
      window.showFavoritesDebug();
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-card/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-lg">
      <h3 className="text-sm font-semibold mb-2 text-foreground">Debug Tools</h3>
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDebugSelection}
          className="text-xs"
        >
          Debug Selection
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleClearHistory}
          className="text-xs"
        >
          Clear History
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDebugFavorites}
          className="text-xs"
        >
          Debug Favorites
        </Button>
      </div>
    </div>
  );
};