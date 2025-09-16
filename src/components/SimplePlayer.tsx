import { useSimpleAudioStore } from "@/stores/simpleAudioStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";

export const SimplePlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    next,
    prev,
    seek,
    setVolume,
    playerMode,
    setPlayerMode,
  } = useSimpleAudioStore();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">From {currentTrack.bucket}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="h-8 w-8"
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={isPlaying ? pause : play}
              className="h-10 w-10"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="h-8 w-8"
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            
            <Slider
              value={[progress]}
              onValueChange={([value]) => {
                if (duration > 0) {
                  seek((value / 100) * duration);
                }
              }}
              max={100}
              step={0.1}
              className="flex-1"
            />
            
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-24">
            <Slider
              value={[volume * 100]}
              onValueChange={([value]) => setVolume(value / 100)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPlayerMode(playerMode === 'full' ? 'mini' : 'full')}
          >
            {playerMode === 'full' ? 'Mini' : 'Full'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const formatTime = (timeInSeconds: number): string => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};