import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  runAudioDebugSuite, 
  checkDatabaseIdFormats, 
  registerAudioSystem, 
  unregisterAudioSystem,
  logTrackId,
  debugStreamUrl
} from '@/utils/audioDebug';
import { useAudioStore } from '@/stores/audioStore';

export const AudioDebugPanel = () => {
  const { currentTrack, queue } = useAudioStore();

  const runDebug = async () => {
    await runAudioDebugSuite();
  };

  const debugCurrentTrack = () => {
    if (currentTrack) {
      logTrackId(currentTrack, 'Current Track');
      debugStreamUrl(currentTrack);
    } else {
      console.log('No current track to debug');
    }
  };

  const debugQueue = () => {
    console.group('🎵 Queue Debug');
    console.log('Queue length:', queue.length);
    queue.forEach((track, index) => {
      logTrackId(track, `Queue Track ${index + 1}`);
    });
    console.groupEnd();
  };

  React.useEffect(() => {
    registerAudioSystem('AudioDebugPanel');
    return () => unregisterAudioSystem('AudioDebugPanel');
  }, []);

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 bg-background/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">🔧 Audio Debug Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={runDebug} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            🔧 Full Debug
          </Button>
          <Button 
            onClick={() => checkDatabaseIdFormats()} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            🗃️ Check DB
          </Button>
          <Button 
            onClick={debugCurrentTrack} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            🎵 Current Track
          </Button>
          <Button 
            onClick={debugQueue} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            📝 Debug Queue
          </Button>
          <Button 
            onClick={() => console.clear()} 
            size="sm" 
            variant="outline"
            className="text-xs col-span-2"
          >
            🧹 Clear Console
          </Button>
        </div>
        
        {currentTrack && (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
            <div><strong>Current:</strong> {currentTrack.title}</div>
            <div><strong>ID:</strong> {currentTrack.id}</div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Queue: {queue.length} tracks
        </div>
      </CardContent>
    </Card>
  );
};

export const useAudioDebug = () => {
  React.useEffect(() => {
    registerAudioSystem('useAudioDebug_Hook');
    return () => unregisterAudioSystem('useAudioDebug_Hook');
  }, []);
  
  return {
    logTrackId,
    debugStreamUrl,
    checkDatabaseIdFormats
  };
};