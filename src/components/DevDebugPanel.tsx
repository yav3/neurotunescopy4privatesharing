import { useState, useEffect } from 'react';
import { useAudioStore } from '@/stores';

interface DebugInfo {
  audioElements: number;
  storeState: any;
  errors: Error[];
  warnings: string[];
  performance: any;
}

export const DevDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    audioElements: 0,
    storeState: {},
    errors: [],
    warnings: [],
    performance: {}
  });

  const audioStore = useAudioStore();

  useEffect(() => {
    if (!isOpen) return;

    const updateDebugInfo = () => {
      setDebugInfo({
        audioElements: document.querySelectorAll('audio').length,
        storeState: {
          currentTrack: audioStore.currentTrack,
          isPlaying: audioStore.isPlaying,
          queue: audioStore.queue?.length || 0,
          volume: audioStore.volume,
        },
        errors: (window as any).__DEBUG_ERRORS__ || [],
        warnings: (window as any).__DEBUG_WARNINGS__ || [],
        performance: {
          memory: (performance as any).memory ? {
            usedJSHeapSize: Math.round((performance as any).memory.usedJSHeapSize / 1048576) + 'MB',
            totalJSHeapSize: Math.round((performance as any).memory.totalJSHeapSize / 1048576) + 'MB'
          } : 'Not available'
        }
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [isOpen, audioStore]);

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-primary-foreground px-3 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        🐛 Debug
      </button>
      
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-80 bg-card text-card-foreground p-4 rounded-lg shadow-xl max-h-96 overflow-y-auto border">
          <h3 className="font-bold mb-3">Debug Panel</h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <strong>Audio Elements:</strong> {debugInfo.audioElements}
              {debugInfo.audioElements > 1 && (
                <span className="text-destructive ml-2">⚠️ Multiple audio elements detected!</span>
              )}
            </div>
            
            <div>
              <strong>Audio Store:</strong>
              <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
                {JSON.stringify(debugInfo.storeState, null, 2)}
              </pre>
            </div>
            
            <div>
              <strong>Performance:</strong>
              <pre className="bg-muted p-2 rounded mt-1 text-xs">
                {JSON.stringify(debugInfo.performance, null, 2)}
              </pre>
            </div>
            
            {debugInfo.errors.length > 0 && (
              <div>
                <strong className="text-destructive">Errors ({debugInfo.errors.length}):</strong>
                <div className="bg-destructive/10 p-2 rounded mt-1 text-xs max-h-20 overflow-y-auto">
                  {debugInfo.errors.map((error, i) => (
                    <div key={i}>{error.message}</div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={() => console.clear()}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs hover:bg-secondary/80"
              >
                Clear Console
              </button>
              <button
                onClick={() => {
                  (window as any).__DEBUG_ERRORS__ = [];
                  (window as any).__DEBUG_WARNINGS__ = [];
                }}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs hover:bg-secondary/80"
              >
                Clear Errors
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};